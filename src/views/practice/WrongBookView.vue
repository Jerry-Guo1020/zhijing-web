<template>
  <div>
    <PageHeader title="错题本" eyebrow="复盘中心" description="错题本按学习包自动生成，不需要手动新建；每个学习包都有自己的错题沉淀和复练入口。">
      <RouterLink class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" :to="redoLink">
        <RefreshCcw class="h-4 w-4" />
        重新做错题
      </RouterLink>
    </PageHeader>

    <section class="grid gap-5 xl:grid-cols-[360px_1fr]">
      <aside v-if="wrongBooks.length" class="space-y-4">
        <button
          v-for="book in wrongBooks"
          :key="book.packId"
          class="w-full rounded-lg border bg-white p-5 text-left transition"
          :class="selectedPackId === book.packId ? 'border-[#1f7a5a] shadow-[0_16px_36px_rgba(31,122,90,0.12)]' : 'border-[#dce4dd] hover:border-[#b8cfc0]'"
          type="button"
          @click="selectedPackId = book.packId"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-[#66736b]">{{ book.subjectName }}</p>
              <h2 class="mt-1 font-bold text-[#1f2a24]">{{ book.packTitle }}错题本</h2>
            </div>
            <span class="rounded-full bg-[#fff4e4] px-2 py-1 text-xs font-semibold text-[#b7791f]">{{ book.pending }} 待复盘</span>
          </div>
          <div class="mt-4 grid grid-cols-3 gap-2 text-center">
            <div class="rounded-lg bg-[#f6f8f5] p-3">
              <p class="font-bold text-[#1f2a24]">{{ book.total }}</p>
              <p class="mt-1 text-xs text-[#66736b]">总错题</p>
            </div>
            <div class="rounded-lg bg-[#f6f8f5] p-3">
              <p class="font-bold text-[#1f2a24]">{{ book.mastered }}</p>
              <p class="mt-1 text-xs text-[#66736b]">已掌握</p>
            </div>
            <div class="rounded-lg bg-[#f6f8f5] p-3">
              <p class="font-bold text-[#1f2a24]">{{ book.reviewCount }}</p>
              <p class="mt-1 text-xs text-[#66736b]">复练</p>
            </div>
          </div>
        </button>
      </aside>
      <aside v-else class="rounded-lg border border-dashed border-[#b8cfc0] bg-[#f6f8f5] p-8 text-center">
        <NotebookPen class="mx-auto h-8 w-8 text-[#1f7a5a]" />
        <p class="mt-3 font-semibold text-[#1f2a24]">暂无错题本</p>
        <p class="mt-1 text-sm text-[#66736b]">创建学习包并完成练习后，错题会自动沉淀到这里。</p>
        <RouterLink class="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-[#1f7a5a]" to="/packs/new">新建学习包</RouterLink>
      </aside>

      <section class="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-lg font-bold text-[#1f2a24]">{{ selectedBook ? `${selectedBook.packTitle}错题详情` : '错题详情' }}</h2>
              <p class="mt-1 text-sm text-[#66736b]">先看错因，再进入重做或相似题训练。</p>
            </div>
            <div class="flex rounded-lg border border-[#dce4dd] bg-[#f6f8f5] p-1 text-sm">
              <button v-for="tab in tabs" :key="tab" class="rounded-md px-3 py-2" :class="activeTab === tab ? 'bg-white text-[#1f7a5a] shadow-sm' : 'text-[#66736b]'" type="button" @click="activeTab = tab">{{ tab }}</button>
            </div>
          </div>

          <div v-if="filteredQuestions.length" class="mt-5 space-y-3">
            <article
              v-for="question in filteredQuestions"
              :key="question.id"
              class="rounded-lg border border-[#dce4dd] p-4 transition hover:border-[#b8cfc0]"
              :class="selectedWrong?.id === question.id ? 'bg-[#f6f8f5]' : 'bg-white'"
              @click="selectedWrongId = question.id"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-[#1f2a24]">{{ questionTitle(question) }}</p>
                  <p class="mt-1 text-sm text-[#66736b]">{{ question.chapter || question.chapterId || '未关联章节' }} · 最近错误 {{ formatDate(question.lastWrongAt || question.updatedAt) }}</p>
                </div>
                <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="isMastered(question.status) ? 'bg-[#e6f5ed] text-[#2f855a]' : 'bg-[#fff4e4] text-[#b7791f]'">{{ statusText(question.status) }}</span>
              </div>
              <p class="mt-3 rounded-lg bg-[#f6f8f5] px-3 py-3 text-sm leading-6 text-[#1f2a24]">错因：{{ question.reason || question.wrongReason || '暂无错因记录' }}</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <RouterLink class="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dce4dd] px-3 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" :to="`/wrong-book/${question.id}`">
                  <Eye class="h-4 w-4" />
                  查看详情
                </RouterLink>
                <RouterLink class="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1f7a5a] px-3 text-sm font-semibold text-white hover:bg-[#155f46]" :to="`/packs/${question.packId}/practice?source=wrong-book&wrongId=${question.id}`">
                  <RefreshCcw class="h-4 w-4" />
                  重做
                </RouterLink>
              </div>
            </article>
          </div>

          <div v-else class="mt-5 rounded-lg border border-dashed border-[#b8cfc0] bg-[#f6f8f5] p-8 text-center">
            <NotebookPen class="mx-auto h-8 w-8 text-[#1f7a5a]" />
            <p class="mt-3 font-semibold text-[#1f2a24]">暂无错题</p>
            <p class="mt-1 text-sm text-[#66736b]">完成章节练习后，错题会自动收录到这里。</p>
          </div>
        </div>

        <aside class="rounded-lg border border-[#dce4dd] bg-[#eef4ef] p-5">
          <h2 class="text-lg font-bold text-[#1f2a24]">AI 复盘建议</h2>
          <p class="mt-3 text-sm leading-6 text-[#66736b]">{{ selectedWrong?.aiReview || '选择一道错题后，这里会展示错因分析和复练建议。' }}</p>
          <div v-if="selectedWrong" class="mt-5 space-y-2">
            <span v-for="point in selectedWrong.knowledgePoints || []" :key="point" class="mr-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1f7a5a]">{{ point }}</span>
          </div>
          <RouterLink v-if="selectedWrong" class="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-[#1f7a5a]" :to="`/packs/${selectedWrong.packId}/practice?source=wrong-book&wrongId=${selectedWrong.id}`">
            <RefreshCcw class="h-4 w-4" />
            重新做这道题
          </RouterLink>
        </aside>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { Eye, NotebookPen, RefreshCcw } from '@lucide/vue'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'

const wrongs = ref<any[]>([])
const packs = ref<any[]>([])
const selectedPackId = ref('')
const selectedWrongId = ref('')
const activeTab = ref('全部')
const tabs = ['全部', '待复盘', '已掌握']

const statusText = (status: string) => {
  if (status === 'mastered' || status === '已掌握') return '已掌握'
  if (status === 'reviewing') return '复盘中'
  return '待复盘'
}
const isMastered = (status: string) => statusText(status) === '已掌握'
const questionTitle = (question: any) => question.title || question.stem || `错题 ${String(question.id ?? '').slice(0, 8)}`
const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString() : '暂无记录'

const wrongBooks = computed(() => {
  const packSource = packs.value.length
    ? packs.value
    : wrongs.value.map((item) => ({
        id: item.packId,
        title: item.pack || item.packTitle || '未命名学习包',
        subjectName: item.subjectName || '学习包',
      })).filter((item, index, arr) => item.id && arr.findIndex((next) => next.id === item.id) === index)

  return packSource.map((pack) => {
    const questions = wrongs.value.filter((item) => (item.packId ?? item.pack_id) === pack.id || item.pack === pack.title)
    return {
      packId: pack.id,
      packTitle: pack.title,
      subjectName: pack.subjectName,
      total: questions.length,
      pending: questions.filter((item) => !isMastered(item.status)).length,
      mastered: questions.filter((item) => isMastered(item.status)).length,
      reviewCount: questions.reduce((sum, item) => sum + (item.reviewCount ?? 0), 0),
    }
  })
})

const selectedBook = computed(() => wrongBooks.value.find((book) => book.packId === selectedPackId.value) ?? wrongBooks.value[0])
const selectedQuestions = computed(() => wrongs.value.filter((item) => item.packId === selectedBook.value?.packId || item.pack === selectedBook.value?.packTitle))
const filteredQuestions = computed(() => selectedQuestions.value.filter((item) => activeTab.value === '全部' || statusText(item.status) === activeTab.value))
const selectedWrong = computed(() => wrongs.value.find((item) => item.id === selectedWrongId.value) ?? filteredQuestions.value[0])
const redoLink = computed(() => selectedWrong.value ? `/packs/${selectedWrong.value.packId}/practice?source=wrong-book&wrongId=${selectedWrong.value.id}` : (packs.value[0]?.id ? `/packs/${packs.value[0].id}/practice` : '/packs/new'))

watch(selectedPackId, () => {
  selectedWrongId.value = selectedQuestions.value[0]?.id ?? ''
})

onMounted(async () => {
  try {
    const [packData, wrongData] = await Promise.all([api.getPacks(), api.getWrongBook()])
    packs.value = packData
    wrongs.value = wrongData
    selectedPackId.value = wrongs.value[0]?.packId ?? packs.value[0]?.id ?? ''
    selectedWrongId.value = wrongs.value[0]?.id ?? ''
  } catch {
    packs.value = []
    wrongs.value = []
  }
})
</script>
