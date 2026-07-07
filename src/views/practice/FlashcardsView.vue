<template>
  <div>
    <PageHeader title="记忆卡片" eyebrow="间隔复习" description="把章节知识点、错因和 AI 总结沉淀为可翻看的卡片。">
      <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="createOpen = true">
        <Plus class="h-4 w-4" />
        新建卡片
      </button>
    </PageHeader>

    <section class="mb-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="inline-flex rounded-full border-[2px] border-[#2d3748] bg-[#add8e6] px-3 py-1 text-xs font-black text-[#2d3748]">单词记忆卡</p>
            <h2 class="mt-3 text-xl font-black text-[#2d3748]">{{ activeWord.word }}</h2>
            <p class="mt-1 text-sm font-semibold text-[#64748b]">{{ activeWord.pronunciation }} · {{ activeWord.partOfSpeech }}</p>
          </div>
          <button class="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dce4dd] bg-white px-4 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="wordRevealed = !wordRevealed">
            <Eye class="h-4 w-4" />
            {{ wordRevealed ? '隐藏释义' : '显示释义' }}
          </button>
        </div>

        <div class="mt-5 rounded-lg border border-[#dce4dd] bg-[#fffaf4] p-5">
          <p class="text-sm font-black text-[#64748b]">释义</p>
          <p class="mt-2 min-h-8 text-lg font-black text-[#2d3748]">{{ wordRevealed ? activeWord.meaning : '点击显示释义后开始自测' }}</p>
          <div v-if="wordRevealed" class="mt-4 rounded-lg border border-[#dce4dd] bg-white p-4">
            <p class="text-xs font-black text-[#64748b]">例句</p>
            <p class="mt-2 text-sm font-semibold leading-6 text-[#2d3748]">{{ activeWord.example }}</p>
            <p class="mt-2 text-sm font-semibold leading-6 text-[#64748b]">{{ activeWord.translation }}</p>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-3">
          <button class="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dce4dd] bg-white px-4 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="nextWord('again')">
            <RotateCcw class="h-4 w-4" />
            再背一次
          </button>
          <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="nextWord('known')">
            <CheckCircle2 class="h-4 w-4" />
            已认识
          </button>
        </div>
      </div>

      <aside class="rounded-lg border border-[#dce4dd] bg-[#eef4ef] p-5">
        <h2 class="text-lg font-bold text-[#1f2a24]">今日单词</h2>
        <div class="mt-4 space-y-3">
          <button
            v-for="(word, index) in wordCards"
            :key="word.id"
            class="flex w-full items-center justify-between rounded-lg border border-[#dce4dd] bg-white px-4 py-3 text-left text-sm font-semibold"
            :class="activeWordIndex === index ? 'text-[#1f7a5a]' : 'text-[#66736b]'"
            type="button"
            @click="selectWord(index)"
          >
            <span>{{ word.word }}</span>
            <span class="text-xs">{{ word.status }}</span>
          </button>
        </div>
      </aside>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="card in cards" :key="card.id" class="rounded-lg border border-[#dce4dd] bg-white p-5">
        <div class="flex items-center justify-between">
          <span class="rounded-full bg-[#eef4ef] px-2 py-1 text-xs text-[#1f7a5a]">{{ card.level }}</span>
          <Layers class="h-5 w-5 text-[#66736b]" />
        </div>
        <h2 class="mt-5 text-lg font-bold text-[#1f2a24]">{{ card.front }}</h2>
        <p class="mt-4 rounded-lg bg-[#f6f8f5] p-4 text-sm leading-6 text-[#66736b]">{{ card.back }}</p>
        <div class="mt-5 grid grid-cols-3 gap-2">
          <button v-for="level in levels" :key="level" class="rounded-lg border border-[#dce4dd] py-2 text-xs font-medium text-[#66736b] hover:bg-[#eef4ef]" type="button" @click="reviewedCount += 1">{{ level }}</button>
        </div>
      </article>
    </section>

    <div class="mt-5 flex justify-center">
      <button class="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dce4dd] bg-white px-4 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="reviewResultOpen = true">
        查看复习结果
      </button>
    </div>

    <ProModal
      :open="createOpen"
      title="新建记忆卡片"
      code="M12. 新建记忆卡片弹窗"
      description="支持手动创建卡片，也支持把 AI 回答或章节知识点转成卡片。"
      width="680px"
      @close="createOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-field">
          <span class="pro-label">卡片类型</span>
          <select v-model="cardForm.type" class="pro-select">
            <option>单词</option>
            <option>术语</option>
            <option>概念</option>
            <option>定义</option>
            <option>自定义</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">正面内容</span>
          <textarea v-model="cardForm.front" class="pro-textarea"></textarea>
        </div>
        <div class="pro-field">
          <span class="pro-label">反面内容</span>
          <textarea v-model="cardForm.back" class="pro-textarea"></textarea>
        </div>
        <template v-if="cardForm.type === '单词'">
          <div class="pro-field">
            <span class="pro-label">音标</span>
            <input v-model="cardForm.pronunciation" class="pro-input" placeholder="/ˈkɒntekst/" />
          </div>
          <div class="pro-field">
            <span class="pro-label">词性</span>
            <select v-model="cardForm.partOfSpeech" class="pro-select">
              <option>n.</option>
              <option>v.</option>
              <option>adj.</option>
              <option>adv.</option>
              <option>短语</option>
            </select>
          </div>
          <div class="pro-field">
            <span class="pro-label">例句</span>
            <textarea v-model="cardForm.example" class="pro-textarea" placeholder="AI can answer better when it has enough context."></textarea>
          </div>
        </template>
        <div class="pro-field">
          <span class="pro-label">所属学习包</span>
          <input class="pro-input" value="考研英语阅读精读" readonly />
        </div>
        <div class="pro-field">
          <span class="pro-label">所属章节</span>
          <select v-model="cardForm.chapter" class="pro-select">
            <option>第一章 基础概念</option>
            <option>第二章 重点训练</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">标签</span>
          <input v-model="cardForm.tags" class="pro-input" placeholder="错因,阅读,概念" />
        </div>
        <div class="pro-field">
          <span class="pro-label">来源片段</span>
          <textarea v-model="cardForm.source" class="pro-textarea"></textarea>
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="createOpen = false">取消</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="saveCard">保存卡片</button>
      </template>
    </ProModal>

    <ProModal
      :open="reviewResultOpen"
      title="本次复习完成"
      code="M13. 卡片复习结果弹窗"
      description="本次掌握度选择会进入复习计划，影响下次卡片排序。"
      width="560px"
      @close="reviewResultOpen = false"
    >
      <div class="grid gap-3 sm:grid-cols-2">
        <div class="rounded-[8px] border-[3px] border-[#2d3748] bg-white p-4">
          <p class="text-xs font-black text-[#64748b]">复习卡片数</p>
          <p class="mt-2 text-2xl font-black text-[#2d3748]">{{ Math.max(reviewedCount, cards.length) }}</p>
        </div>
        <div class="rounded-[8px] border-[3px] border-[#2d3748] bg-[#f0fff0] p-4">
          <p class="text-xs font-black text-[#64748b]">已掌握数</p>
          <p class="mt-2 text-2xl font-black text-[#22c55e]">8</p>
        </div>
        <div class="rounded-[8px] border-[3px] border-[#2d3748] bg-[#fff9f2] p-4">
          <p class="text-xs font-black text-[#64748b]">模糊数</p>
          <p class="mt-2 text-2xl font-black text-[#b7791f]">3</p>
        </div>
        <div class="rounded-[8px] border-[3px] border-[#2d3748] bg-[#fff0ee] p-4">
          <p class="text-xs font-black text-[#64748b]">不认识数</p>
          <p class="mt-2 text-2xl font-black text-[#c44b3f]">1</p>
        </div>
      </div>
      <div class="pro-panel mt-4">
        <p class="text-sm font-black text-[#2d3748]">下次复习建议</p>
        <p class="mt-2 text-sm leading-6 text-[#64748b]">优先复习模糊和不认识卡片，并把高频错因转成新的概念卡。</p>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="reviewResultOpen = false">返回卡片列表</button>
        <button class="pro-btn pro-btn-soft" type="button" @click="createOpen = true">生成更多卡片</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="reviewResultOpen = false">继续复习</button>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { CheckCircle2, Eye, Layers, Plus, RotateCcw } from '@lucide/vue'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import ProModal from '../../components/common/ProModal.vue'
import { mockFlashcards } from '../../data/mock'

const route = useRoute()
const packId = computed(() => String(route.params.id))
const cards = ref<any[]>(mockFlashcards)
const levels = ['忘记', '模糊', '熟悉']
const createOpen = ref(false)
const reviewResultOpen = ref(false)
const reviewedCount = ref(0)
const activeWordIndex = ref(0)
const wordRevealed = ref(false)
const wordCards = ref([
  {
    id: 'word-1',
    word: 'context',
    pronunciation: '/ˈkɒntekst/',
    partOfSpeech: 'n.',
    meaning: '语境；背景；上下文',
    example: 'AI can answer better when it has enough context.',
    translation: '当 AI 拥有足够上下文时，回答会更准确。',
    status: '待复习',
  },
  {
    id: 'word-2',
    word: 'derive',
    pronunciation: '/dɪˈraɪv/',
    partOfSpeech: 'v.',
    meaning: '获得；源于；推导出',
    example: 'The formula is derived from the definition of a derivative.',
    translation: '这个公式由导数定义推导而来。',
    status: '新词',
  },
  {
    id: 'word-3',
    word: 'contrast',
    pronunciation: '/ˈkɒntrɑːst/',
    partOfSpeech: 'n./v.',
    meaning: '对比；形成对照',
    example: 'The author uses contrast to make the main idea clearer.',
    translation: '作者使用对比让主旨更清楚。',
    status: '熟悉',
  },
])
const cardForm = ref({
  type: '单词',
  front: 'context',
  back: '语境；背景；上下文',
  pronunciation: '/ˈkɒntekst/',
  partOfSpeech: 'n.',
  example: 'AI can answer better when it has enough context.',
  chapter: '第一章 基础概念',
  tags: '英语,单词,阅读',
  source: '阅读材料中出现 context 时，通常指作者观点所在的上下文语境。',
})
const activeWord = computed(() => wordCards.value[activeWordIndex.value])

onMounted(async () => {
  try {
    const data = await api.getFlashcards(packId.value)
    cards.value = data.length ? data : mockFlashcards
  } catch {
    cards.value = mockFlashcards
  }
})

const saveCard = () => {
  cards.value = [{ id: `card-${Date.now()}`, front: cardForm.value.front, back: cardForm.value.back, level: '新卡' }, ...cards.value]
  if (cardForm.value.type === '单词') {
    wordCards.value = [
      {
        id: `word-${Date.now()}`,
        word: cardForm.value.front,
        pronunciation: cardForm.value.pronunciation,
        partOfSpeech: cardForm.value.partOfSpeech,
        meaning: cardForm.value.back,
        example: cardForm.value.example || 'Add this word to your daily reading review.',
        translation: cardForm.value.back,
        status: '新词',
      },
      ...wordCards.value,
    ]
    activeWordIndex.value = 0
    wordRevealed.value = false
  }
  createOpen.value = false
}

const selectWord = (index: number) => {
  activeWordIndex.value = index
  wordRevealed.value = false
}

const nextWord = (status: 'again' | 'known') => {
  wordCards.value[activeWordIndex.value].status = status === 'known' ? '已认识' : '再复习'
  activeWordIndex.value = (activeWordIndex.value + 1) % wordCards.value.length
  wordRevealed.value = false
  reviewedCount.value += 1
}
</script>

<style scoped>
</style>
