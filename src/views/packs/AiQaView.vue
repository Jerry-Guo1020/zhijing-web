<template>
  <div>
    <PageHeader title="AI 问答" eyebrow="学习包上下文" description="围绕当前学习包和章节提问，回答会标注参考知识点与风险提示。" />

    <section class="grid min-h-[calc(100svh-160px)] gap-5 lg:grid-cols-[300px_1fr]">
      <aside class="rounded-lg border border-[#dce4dd] bg-white p-5">
        <h2 class="font-bold text-[#1f2a24]">上下文</h2>
        <div class="mt-4 space-y-3 text-sm">
          <div class="rounded-lg bg-[#f6f8f5] p-3">
            <p class="text-xs text-[#66736b]">学习包</p>
            <p class="mt-1 font-semibold text-[#1f2a24]">{{ packTitle }}</p>
          </div>
          <button v-for="prompt in prompts" :key="prompt" class="w-full rounded-lg border border-[#dce4dd] px-3 py-3 text-left text-[#1f2a24] transition hover:bg-[#eef4ef]" type="button" @click="question = prompt">
            {{ prompt }}
          </button>
        </div>
      </aside>

      <section class="flex min-h-[560px] flex-col rounded-lg border border-[#dce4dd] bg-white">
        <div class="flex-1 space-y-4 overflow-auto p-4 md:p-5">
          <div v-for="message in messages" :key="message.id" class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
            <div class="max-w-[84%] rounded-lg px-4 py-3 text-sm leading-6" :class="message.role === 'user' ? 'bg-[#1f7a5a] text-white' : 'bg-[#f6f8f5] text-[#1f2a24]'">
              <p>{{ message.content }}</p>
              <p v-if="message.source" class="mt-2 text-xs opacity-70">来源：{{ message.source }}</p>
            </div>
          </div>
        </div>
        <form class="border-t border-[#dce4dd] p-3 md:p-4" @submit.prevent="ask">
          <div class="flex gap-2">
            <input v-model="question" class="h-11 flex-1 rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 text-sm outline-none focus:border-[#1f7a5a] focus:bg-white" placeholder="输入你的问题" />
            <button class="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" type="submit">
              <Send class="h-4 w-4" />
              <span class="hidden sm:inline">发送</span>
            </button>
          </div>
        </form>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Send } from '@lucide/vue'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'

const route = useRoute()
const packId = computed(() => String(route.params.id))
const packTitle = ref('')
type ChatMessage = {
  id: number
  role: 'assistant' | 'user'
  content: string
  source?: string
}

const question = ref('')
const messages = ref<ChatMessage[]>([
  { id: 1, role: 'assistant', content: '我已带入当前学习包上下文。你可以问章节概念、题目思路或复盘建议。', source: '知径学习助手' },
])
const prompts = ['把第一章核心概念总结成三点', '根据错题给我一个复盘计划', '生成一组适合今天完成的练习']

onMounted(async () => {
  try {
    const detail = await api.getPackDetail(packId.value)
    packTitle.value = detail.pack?.title ?? packId.value
  } catch {
    packTitle.value = packId.value
  }
})

const ask = async () => {
  if (!question.value.trim()) return
  const current = question.value
  messages.value.push({ id: Date.now(), role: 'user', content: current })
  question.value = ''

  try {
    const answer = await api.askAi({ packId: packId.value, question: current })
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: answer.answer ?? answer.content ?? 'AI 已返回结果，请结合资料复核。',
      source: answer.reference ?? '后端 AI 服务',
    })
  } catch (err) {
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: err instanceof Error ? err.message : '当前 AI 服务暂不可用，请稍后重试。',
      source: '后端接口',
    })
  }
}
</script>

<style scoped>
</style>
