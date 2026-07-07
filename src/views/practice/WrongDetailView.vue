<template>
  <div>
    <PageHeader title="错题详情" eyebrow="错因复盘" :description="wrong.pack ? `${wrong.pack} · ${wrong.chapter}` : '围绕一道错题完成查看、重做、标记掌握和社区求助。'">
      <div class="flex flex-wrap gap-2">
        <button class="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dce4dd] bg-white px-4 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="markMastered">
          <CheckCircle2 class="h-4 w-4" />
          标记已掌握
        </button>
        <RouterLink class="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" :to="redoLink">
          <RefreshCcw class="h-4 w-4" />
          重做本题
        </RouterLink>
      </div>
    </PageHeader>

    <section class="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <div class="space-y-5">
        <article class="rounded-lg border border-[#dce4dd] bg-white p-5">
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full bg-[#eef4ef] px-3 py-1 text-xs font-semibold text-[#1f7a5a]">{{ wrong.pack }}</span>
            <span class="rounded-full bg-[#f6f8f5] px-3 py-1 text-xs font-semibold text-[#66736b]">{{ wrong.chapter }}</span>
            <span class="rounded-full bg-[#fff4e4] px-3 py-1 text-xs font-semibold text-[#b7791f]">错 {{ wrong.wrongCount }} 次</span>
          </div>
          <h2 class="mt-4 text-xl font-bold text-[#1f2a24]">{{ wrong.title }}</h2>
          <p class="mt-3 text-base leading-7 text-[#1f2a24]">{{ wrong.stem }}</p>
          <div class="mt-4 grid gap-3">
            <button
              v-for="(option, index) in wrong.options"
              :key="option"
              class="rounded-lg border px-4 py-3 text-left text-sm transition"
              :class="answer === optionLetter(index) ? 'border-[#1f7a5a] bg-[#e8f3ed] text-[#1f7a5a]' : 'border-[#dce4dd] bg-white text-[#1f2a24] hover:bg-[#f6f8f5]'"
              type="button"
              @click="answer = optionLetter(index)"
            >
              {{ optionLetter(index) }}. {{ option }}
            </button>
          </div>
          <button class="mt-5 h-10 rounded-lg bg-[#1f7a5a] px-5 text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="submitRedo">提交重做</button>
          <p v-if="result" class="mt-3 rounded-lg px-3 py-2 text-sm" :class="resultType === 'success' ? 'bg-[#e6f5ed] text-[#2f855a]' : 'bg-[#fff0ee] text-[#c44b3f]'">{{ result }}</p>
        </article>

        <article class="rounded-lg border border-[#dce4dd] bg-white p-5">
          <h2 class="text-lg font-bold text-[#1f2a24]">作答记录</h2>
          <div class="mt-4 grid gap-3 md:grid-cols-3">
            <div class="rounded-lg bg-[#f6f8f5] p-4">
              <p class="text-sm text-[#66736b]">你的错误答案</p>
              <p class="mt-2 text-xl font-bold text-[#c44b3f]">{{ wrong.userAnswer }}</p>
            </div>
            <div class="rounded-lg bg-[#f6f8f5] p-4">
              <p class="text-sm text-[#66736b]">正确答案</p>
              <p class="mt-2 text-xl font-bold text-[#2f855a]">{{ wrong.correctAnswer }}</p>
            </div>
            <div class="rounded-lg bg-[#f6f8f5] p-4">
              <p class="text-sm text-[#66736b]">最近错误</p>
              <p class="mt-2 font-bold text-[#1f2a24]">{{ wrong.lastWrongAt }}</p>
            </div>
          </div>
        </article>
      </div>

      <aside class="space-y-5">
        <div class="rounded-lg border border-[#dce4dd] bg-[#eef4ef] p-5">
          <Sparkles class="h-6 w-6 text-[#1f7a5a]" />
          <h2 class="mt-4 text-lg font-bold text-[#1f2a24]">AI 错因分析</h2>
          <p class="mt-3 text-sm leading-6 text-[#66736b]">{{ wrong.aiReview }}</p>
          <div class="mt-5 flex flex-wrap gap-2">
            <span v-for="point in wrong.knowledgePoints" :key="point" class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1f7a5a]">{{ point }}</span>
          </div>
        </div>

        <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
          <h2 class="text-lg font-bold text-[#1f2a24]">复练操作</h2>
          <div class="mt-4 grid gap-3">
            <RouterLink class="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] text-sm font-semibold text-white hover:bg-[#155f46]" :to="redoLink">
              <RefreshCcw class="h-4 w-4" />
              重新做错题
            </RouterLink>
            <button class="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#dce4dd] text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="aiExplainOpen = true">
              <Sparkles class="h-4 w-4" />
              AI 讲解错因
            </button>
            <button class="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#dce4dd] text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="similarOpen = true">
              <Layers class="h-4 w-4" />
              生成相似题
            </button>
            <button class="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#dce4dd] text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="shareOpen = true">
              <MessagesSquare class="h-4 w-4" />
              分享到社区求助
            </button>
          </div>
        </div>
      </aside>
    </section>

    <ProModal
      :open="aiExplainOpen"
      title="AI 错题讲解"
      code="M10. AI 错题讲解弹窗"
      description="先讲答案，再讲错因，最后给下一步复习动作。"
      width="760px"
      @close="aiExplainOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-panel">
          <p class="text-sm font-black text-[#2d3748]">题干摘要</p>
          <p class="mt-2 text-sm leading-6 text-[#64748b]">{{ wrong.stem }}</p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-[8px] border-[3px] border-[#2d3748] bg-[#fff9f2] p-4">
            <p class="text-xs font-black text-[#64748b]">用户答案</p>
            <p class="mt-2 text-2xl font-black text-[#c44b3f]">{{ wrong.userAnswer }}</p>
          </div>
          <div class="rounded-[8px] border-[3px] border-[#2d3748] bg-[#f0fff0] p-4">
            <p class="text-xs font-black text-[#64748b]">正确答案</p>
            <p class="mt-2 text-2xl font-black text-[#22c55e]">{{ wrong.correctAnswer }}</p>
          </div>
        </div>
        <div class="pro-field">
          <span class="pro-label">错因分析</span>
          <p class="text-sm leading-6 text-[#64748b]">{{ wrong.aiReview }}</p>
        </div>
        <div class="pro-field">
          <span class="pro-label">关联知识点</span>
          <div class="flex flex-wrap gap-2">
            <span v-for="point in wrong.knowledgePoints" :key="point" class="pro-chip">{{ point }}</span>
          </div>
        </div>
        <div class="pro-field">
          <span class="pro-label">推荐复习动作</span>
          <p class="text-sm leading-6 text-[#64748b]">先重做本题，再生成 3 道同知识点变式题；若仍错，把错因加入今日任务。</p>
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="aiExplainOpen = false">取消</button>
        <button class="pro-btn pro-btn-soft" type="button" @click="markMastered">标记已掌握</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="similarOpen = true">生成相似题</button>
      </template>
    </ProModal>

    <ProModal
      :open="similarOpen"
      title="生成相似题"
      code="M11. 生成相似题弹窗"
      description="基于错题和关联知识点生成二次训练题。"
      width="680px"
      @close="similarOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-panel">
          <p class="text-sm font-black text-[#2d3748]">原错题摘要</p>
          <p class="mt-2 text-sm leading-6 text-[#64748b]">{{ wrong.title }}：{{ wrong.reason }}</p>
        </div>
        <div class="pro-field">
          <span class="pro-label">关联知识点</span>
          <div class="flex flex-wrap gap-2">
            <span v-for="point in wrong.knowledgePoints" :key="point" class="pro-chip">{{ point }}</span>
          </div>
        </div>
        <div class="pro-field">
          <span class="pro-label">题目数量</span>
          <input v-model.number="similarForm.count" class="pro-input" min="1" max="10" type="number" />
        </div>
        <div class="pro-field">
          <span class="pro-label">难度</span>
          <select v-model="similarForm.difficulty" class="pro-select">
            <option>基础巩固</option>
            <option>同等难度</option>
            <option>提高难度</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">变化方式</span>
          <select v-model="similarForm.variant" class="pro-select">
            <option>同知识点换场景</option>
            <option>同题型变式</option>
            <option>混合训练</option>
          </select>
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="similarOpen = false">取消</button>
        <RouterLink class="pro-btn pro-btn-primary" :to="redoLink" @click="similarOpen = false">生成并开始练习</RouterLink>
      </template>
    </ProModal>

    <ProModal
      :open="shareOpen"
      title="分享到社区"
      code="M16. 分享到社区弹窗"
      description="把这道错题转成社区求助草稿。"
      width="760px"
      @close="shareOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-field">
          <span class="pro-label">分享类型</span>
          <select v-model="shareForm.type" class="pro-select">
            <option>错题求助</option>
            <option>AI 回答求证</option>
            <option>学习复盘</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">自动生成标题</span>
          <input v-model="shareForm.title" class="pro-input" />
        </div>
        <div class="pro-field">
          <span class="pro-label">正文草稿</span>
          <textarea v-model="shareForm.content" class="pro-textarea"></textarea>
        </div>
        <div class="pro-field">
          <span class="pro-label">隐私检查</span>
          <button class="pro-switch" data-on="true" type="button"></button>
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="shareOpen = false">取消</button>
        <RouterLink class="pro-btn pro-btn-soft" :to="`/community/new?wrongId=${wrong.id}`">去编辑完整帖子</RouterLink>
        <button class="pro-btn pro-btn-primary" type="button" @click="shareOpen = false">发布</button>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { CheckCircle2, Layers, MessagesSquare, RefreshCcw, Sparkles } from '@lucide/vue'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import ProModal from '../../components/common/ProModal.vue'
import { mockWrongQuestions } from '../../data/mock'

const route = useRoute()
const letters = ['A', 'B', 'C', 'D']
const wrong = ref<any>(mockWrongQuestions.find((item) => item.id === route.params.id) ?? mockWrongQuestions[0])
const answer = ref('')
const result = ref('')
const resultType = ref<'success' | 'error'>('success')
const aiExplainOpen = ref(false)
const similarOpen = ref(false)
const shareOpen = ref(false)
const similarForm = ref({ count: 3, difficulty: '同等难度', variant: '同知识点换场景' })
const shareForm = ref({
  type: '错题求助',
  title: `求助：${wrong.value.title}`,
  content: `我在「${wrong.value.pack}」里反复做错这题，错因是：${wrong.value.reason}。想请大家帮我看看复盘思路是否准确。`,
})
const redoLink = computed(() => `/packs/${wrong.value.packId}/practice?source=wrong-book&wrongId=${wrong.value.id}`)
const optionLetter = (index: number | string) => letters[Number(index)] ?? ''

const submitRedo = () => {
  if (!answer.value) {
    resultType.value = 'error'
    result.value = '请先选择一个答案。'
    return
  }
  resultType.value = answer.value === wrong.value.correctAnswer ? 'success' : 'error'
  result.value = resultType.value === 'success' ? '这次答对了，可以标记掌握或继续做相似题。' : `仍然答错，正确答案是 ${wrong.value.correctAnswer}，建议再看 AI 错因分析。`
}

const markMastered = async () => {
  try {
    await api.updateWrongQuestionStatus(wrong.value.id, 'mastered')
  } catch {
    // Offline demo mode updates the local card only.
  }
  wrong.value.status = '已掌握'
  resultType.value = 'success'
  result.value = '已标记掌握。'
}

onMounted(async () => {
  try {
    wrong.value = await api.getWrongQuestion(String(route.params.id))
  } catch {
    wrong.value = mockWrongQuestions.find((item) => item.id === route.params.id) ?? mockWrongQuestions[0]
  }
  shareForm.value.title = `求助：${wrong.value.title}`
  shareForm.value.content = `我在「${wrong.value.pack}」里反复做错这题，错因是：${wrong.value.reason}。想请大家帮我看看复盘思路是否准确。`
})
</script>
