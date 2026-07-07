<template>
  <div>
    <PageHeader :title="title" :eyebrow="eyebrow" :description="description">
      <RouterLink v-if="primaryAction.to" class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" :to="primaryAction.to">
        <Plus class="h-4 w-4" />
        {{ primaryAction.label }}
      </RouterLink>
    </PageHeader>

    <section class="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div class="pro-page-card">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="pro-kicker">{{ modeLabel }}</p>
            <h2 class="mt-3 text-xl font-black text-[#2d3748]">{{ contentTitle }}</h2>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="metric in metrics" :key="metric.label" class="rounded-full border-[2px] border-[#2d3748] bg-[#fffaf4] px-3 py-1 text-xs font-black text-[#2d3748]">{{ metric.label }} {{ metric.value }}</span>
          </div>
        </div>

        <div v-if="mode === 'practice-result'" class="mt-5 grid gap-3 sm:grid-cols-3">
          <div v-for="result in resultCards" :key="result.label" class="rounded-[10px] border-[3px] border-[#2d3748] p-4" :class="result.bg">
            <p class="text-xs font-black text-[#64748b]">{{ result.label }}</p>
            <p class="mt-2 text-2xl font-black text-[#2d3748]">{{ result.value }}</p>
          </div>
        </div>

        <div v-if="items.length" class="mt-5 grid gap-3">
          <article v-for="(item, index) in items" :key="item.title" class="rounded-[10px] border-[3px] border-[#2d3748] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#2d3748]">
            <div class="flex items-start justify-between gap-3">
              <div class="flex min-w-0 gap-3">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border-[3px] border-[#2d3748] text-sm font-black text-[#2d3748]" :class="index % 2 ? 'bg-[#add8e6]' : 'bg-[#98ff98]'">{{ index + 1 }}</span>
                <div>
                  <p class="font-black text-[#2d3748]">{{ item.title }}</p>
                  <p class="mt-1 text-sm font-semibold leading-6 text-[#64748b]">{{ item.text }}</p>
                </div>
              </div>
              <span class="rounded-full border-[2px] border-[#2d3748] bg-[#98ff98] px-2 py-1 text-xs font-black text-[#2d3748]">{{ item.tag }}</span>
            </div>
          </article>
        </div>
        <div v-else class="mt-5 rounded-[10px] border-[3px] border-dashed border-[#b8cfc0] bg-[#f6f8f5] p-8 text-center">
          <p class="font-black text-[#2d3748]">{{ emptyTitle }}</p>
          <p class="mt-2 text-sm font-semibold text-[#64748b]">{{ emptyText }}</p>
        </div>
      </div>

      <aside class="pro-page-card-soft">
        <div class="flex h-12 w-12 items-center justify-center rounded-[14px] border-[3px] border-[#2d3748] bg-[#add8e6] text-[#2d3748]">
          <Sparkles class="h-6 w-6" />
        </div>
        <h2 class="mt-4 text-lg font-black text-[#2d3748]">AI 辅助</h2>
        <p class="mt-2 text-sm font-semibold leading-6 text-[#64748b]">{{ aiTip }}</p>
        <div class="mt-5 space-y-3">
          <RouterLink class="pro-secondary-button w-full" :to="firstPackId ? `/packs/${firstPackId}/qa` : '/packs/new'">打开 AI 问答</RouterLink>
          <RouterLink v-if="mode === 'ranking'" class="pro-primary-button w-full" to="/focus">开始专注</RouterLink>
          <RouterLink v-else class="pro-primary-button w-full" :to="firstPackId ? `/packs/${firstPackId}/practice` : '/packs/new'">开始练习</RouterLink>
        </div>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Plus, Sparkles } from '@lucide/vue'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'

const route = useRoute()
const mode = computed(() => String(route.meta.mode ?? 'default'))
const rankingUsers = ref<any[]>([])
const chapters = ref<any[]>([])
const packs = ref<any[]>([])
const title = computed(() => String(route.meta.title ?? '工作台'))
const eyebrow = computed(() => mode.value.includes('community') ? '互助分享' : '学习工作台')
const description = computed(() => descriptions[mode.value] ?? '该页面已接入统一工作台布局，后续可继续扩展真实接口和细分组件。')
const contentTitle = computed(() => contentTitles[mode.value] ?? '核心内容')
const aiTip = computed(() => tips[mode.value] ?? '你可以把当前页面内容带入 AI 问答，生成下一步学习建议。')
const primaryAction = computed(() => actions[mode.value] ?? { label: '新建内容', to: '' })
const modeLabel = computed(() => modeLabels[mode.value] ?? 'AI-Powered Learning')
const firstPackId = computed(() => packs.value[0]?.id)
const metrics = computed(() => {
  if (mode.value === 'ranking') {
    const first = rankingUsers.value[0]
    return [
      { label: '用户', value: String(rankingUsers.value.length) },
      { label: '我的排名', value: first ? `第${first.rank}` : '-' },
      { label: '总积分', value: String(first?.score ?? 0) },
    ]
  }
  if (mode.value === 'chapters') {
    return [
      { label: '章节', value: String(chapters.value.length) },
      { label: '知识点', value: '见详情' },
      { label: '状态', value: chapters.value.length ? '已解析' : '空' },
    ]
  }
  return metricMap[mode.value] ?? metricMap.default
})
const items = computed(() => {
  if (mode.value === 'ranking') {
    return rankingUsers.value.map((user) => ({
      title: user.nickname || '未命名用户',
      text: `累计专注 ${user.totalFocusMinutes ?? 0} 分钟，连续学习 ${user.currentStreakDays ?? 0} 天，完成任务 ${user.completedTaskCount ?? 0} 个。`,
      tag: `第 ${user.rank}`,
    }))
  }
  if (mode.value === 'chapters') {
    return chapters.value.map((chapter) => ({ title: chapter.title, text: chapter.summary || '暂无章节说明', tag: `${chapter.masteryRate ?? 0}%` }))
  }
  return defaultItems[mode.value] ?? defaultItems.default
})
const emptyTitle = computed(() => mode.value === 'ranking' ? '暂无排行榜用户' : mode.value === 'chapters' ? '暂无章节' : '暂无内容')
const emptyText = computed(() => mode.value === 'ranking'
  ? '注册用户会显示在排行榜里；当前没有可展示用户。'
  : mode.value === 'chapters'
    ? '完成学习包解析后，章节会显示在这里。'
    : '这里不会填充示例数据。')

const loadModeData = async () => {
  try {
    packs.value = await api.getPacks()
  } catch {
    packs.value = []
  }

  if (mode.value === 'ranking') {
    try {
      const ranking = await api.getRanking()
      rankingUsers.value = ranking?.users ?? []
    } catch {
      rankingUsers.value = []
    }
  }

  if (mode.value === 'chapters') {
    try {
      const detail = await api.getPackDetail(String(route.params.id))
      chapters.value = detail.chapters ?? []
    } catch {
      chapters.value = []
    }
  }
}

onMounted(loadModeData)
watch(() => route.fullPath, loadModeData)

const descriptions: Record<string, string> = {
  chapters: '按章节组织资料与知识点，适合从结构进入学习。',
  'question-bank': '查看 AI 生成和手动整理的题目，支持后续进入练习。',
  'practice-result': '展示本次练习结果、错因和下一步复盘建议。',
  ranking: '展示学习时长、连续天数和任务完成情况。',
  community: '围绕学习方法、资料整理和错题复盘进行互助。',
  'community-new': '发布学习经验、问题或资料整理方法。',
  target: '记录目标院校与阶段计划，让任务和报告更聚焦。',
  reports: '沉淀学习时长、掌握度趋势、薄弱点和 AI 建议。',
}

const contentTitles: Record<string, string> = {
  chapters: '章节列表',
  'question-bank': '题目分组',
  'practice-result': '结果摘要',
  ranking: '榜单',
  community: '帖子列表',
  target: '目标规划',
  reports: '报告摘要',
}

const modeLabels: Record<string, string> = {
  chapters: 'P07. 章节结构',
  'question-bank': 'P09. 智能题库',
  'practice-result': 'P11. 练习结果',
  ranking: 'P17. 学习排行榜',
}

const metricMap: Record<string, Array<{ label: string; value: string }>> = {
  default: [
    { label: '内容', value: '0' },
    { label: '状态', value: '空' },
  ],
  chapters: [
    { label: '章节', value: '0' },
    { label: '知识点', value: '0' },
    { label: '掌握', value: '0%' },
  ],
  'question-bank': [
    { label: '题组', value: '0' },
    { label: '题目', value: '0' },
    { label: 'AI', value: '-' },
  ],
  'practice-result': [
    { label: '正确率', value: '0%' },
    { label: '错题', value: '0' },
    { label: '建议', value: '-' },
  ],
  ranking: [
    { label: '用户', value: '0' },
    { label: '连续', value: '0天' },
    { label: '排名', value: '-' },
  ],
}

const resultCards = [
  { label: '正确率', value: '0%', bg: 'bg-[#f0fff0]' },
  { label: '错题数', value: '0', bg: 'bg-[#fff2b8]' },
  { label: '用时', value: '0m', bg: 'bg-[#add8e6]' },
]

const tips: Record<string, string> = {
  'practice-result': '建议把错题一键加入错题本，并生成相似题巩固。',
  reports: '报告可结合后端学习记录与 AI 生成建议输出。',
  target: '目标院校会影响学习任务优先级和报告建议。',
}

const actions: Record<string, { label: string; to: string }> = {
  'question-bank': { label: '开始练习', to: '' },
  community: { label: '发布帖子', to: '/community/new' },
}

const defaultItems: Record<string, Array<{ title: string; text: string; tag: string }>> = {
  default: [],
  'question-bank': [],
  'practice-result': [],
  ranking: [],
  target: [],
  reports: [],
}
</script>

<style scoped>
</style>
