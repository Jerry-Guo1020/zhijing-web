<template>
  <div>
    <PageHeader title="章节练习" eyebrow="智能题库" description="题目优先从后端 `/practice/questions` 获取，未连接时展示本地演示题。" />

    <section class="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div class="space-y-4">
        <article v-for="(item, index) in questions" :key="item.id" class="rounded-lg border border-[#dce4dd] bg-white p-5">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm font-semibold text-[#1f7a5a]">第 {{ index + 1 }} 题 · {{ item.difficulty || '基础' }}</p>
            <span class="rounded-full bg-[#eef4ef] px-2 py-1 text-xs text-[#66736b]">单选</span>
          </div>
          <h2 class="mt-3 text-base font-bold text-[#1f2a24]">{{ item.stem || item.title }}</h2>
          <div class="mt-4 grid gap-2">
            <button v-for="(option, optionIndex) in getOptions(item)" :key="option" class="rounded-lg border px-4 py-3 text-left text-sm transition" :class="answers[String(item.id)] === Number(optionIndex) ? 'border-[#1f7a5a] bg-[#eef4ef] text-[#1f7a5a]' : 'border-[#dce4dd] bg-white text-[#1f2a24]'" type="button" @click="answers[String(item.id)] = Number(optionIndex)">
              {{ option }}
            </button>
          </div>
        </article>
      </div>

      <aside class="h-fit rounded-lg border border-[#dce4dd] bg-white p-5">
        <h2 class="text-lg font-bold text-[#1f2a24]">练习状态</h2>
        <p class="mt-2 text-sm text-[#66736b]">已作答 {{ answeredCount }} / {{ questions.length }}</p>
        <div class="mt-4 h-2 rounded-full bg-[#eef4ef]">
          <div class="h-2 rounded-full bg-[#1f7a5a]" :style="{ width: `${progress}%` }"></div>
        </div>
        <button class="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#1f7a5a] text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="submitOpen = true">
          提交练习
        </button>
      </aside>
    </section>

    <ProModal
      :open="submitOpen"
      title="确认提交练习？"
      code="M09. 提交练习确认弹窗"
      description="提交后将生成本次练习结果、错题和复盘建议。"
      width="560px"
      @close="submitOpen = false"
    >
      <div class="space-y-4">
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-[8px] border-[3px] border-[#2d3748] bg-white p-4">
            <p class="text-xs font-black text-[#64748b]">已作答题数</p>
            <p class="mt-2 text-2xl font-black text-[#22c55e]">{{ answeredCount }}</p>
          </div>
          <div class="rounded-[8px] border-[3px] border-[#2d3748] bg-[#fff9f2] p-4">
            <p class="text-xs font-black text-[#64748b]">未作答题数</p>
            <p class="mt-2 text-2xl font-black text-[#c44b3f]">{{ unansweredCount }}</p>
          </div>
        </div>
        <div class="pro-field">
          <span class="pro-label">已标记题数</span>
          <strong class="text-[#2d3748]">0</strong>
        </div>
        <div class="pro-field">
          <span class="pro-label">当前用时</span>
          <strong class="text-[#2d3748]">18 分 26 秒</strong>
        </div>
        <div v-if="unansweredCount" class="pro-panel">
          <p class="text-sm font-black text-[#c44b3f]">存在未作答题目</p>
          <p class="mt-2 text-sm leading-6 text-[#64748b]">你仍然可以提交，但系统会在结果页突出未完成题目。</p>
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="submitOpen = false">继续作答</button>
        <RouterLink class="pro-btn pro-btn-primary" :to="`/packs/${packId}/practice/result`">确认提交</RouterLink>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import ProModal from '../../components/common/ProModal.vue'
import { mockQuestions } from '../../data/mock'

const route = useRoute()
const packId = computed(() => String(route.params.id))
const questions = ref<any[]>(mockQuestions)
const submitOpen = ref(false)
const answers = reactive<Record<string, number>>({})

const answeredCount = computed(() => Object.keys(answers).length)
const unansweredCount = computed(() => Math.max(questions.value.length - answeredCount.value, 0))
const progress = computed(() => Math.round((answeredCount.value / Math.max(questions.value.length, 1)) * 100))

onMounted(async () => {
  try {
    const data = await api.getQuestions(packId.value)
    questions.value = data.length ? data : mockQuestions
  } catch {
    questions.value = mockQuestions
  }
})

const getOptions = (item: any) => {
  if (Array.isArray(item.options)) return item.options
  if (typeof item.options === 'string') {
    try {
      const parsed = JSON.parse(item.options)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return item.options.split('\n').filter(Boolean)
    }
  }
  return []
}
</script>

<style scoped>
</style>
