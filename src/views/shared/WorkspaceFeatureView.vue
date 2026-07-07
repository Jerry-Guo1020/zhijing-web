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

        <div class="mt-5 grid gap-3">
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
      </div>

      <aside class="pro-page-card-soft">
        <div class="flex h-12 w-12 items-center justify-center rounded-[14px] border-[3px] border-[#2d3748] bg-[#add8e6] text-[#2d3748]">
          <Sparkles class="h-6 w-6" />
        </div>
        <h2 class="mt-4 text-lg font-black text-[#2d3748]">AI 辅助</h2>
        <p class="mt-2 text-sm font-semibold leading-6 text-[#64748b]">{{ aiTip }}</p>
        <div class="mt-5 space-y-3">
          <RouterLink class="pro-secondary-button w-full" to="/packs/pack-english/qa">打开 AI 问答</RouterLink>
          <RouterLink v-if="mode === 'ranking'" class="pro-primary-button w-full" to="/focus">开始专注</RouterLink>
          <RouterLink v-else class="pro-primary-button w-full" to="/packs/pack-english/practice">开始练习</RouterLink>
        </div>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Plus, Sparkles } from '@lucide/vue'
import PageHeader from '../../components/common/PageHeader.vue'
import { mockChapters, mockPosts } from '../../data/mock'

const route = useRoute()
const mode = computed(() => String(route.meta.mode ?? 'default'))
const title = computed(() => String(route.meta.title ?? '工作台'))
const eyebrow = computed(() => mode.value.includes('community') ? '互助分享' : '学习工作台')
const description = computed(() => descriptions[mode.value] ?? '该页面已接入统一工作台布局，后续可继续扩展真实接口和细分组件。')
const contentTitle = computed(() => contentTitles[mode.value] ?? '核心内容')
const aiTip = computed(() => tips[mode.value] ?? '你可以把当前页面内容带入 AI 问答，生成下一步学习建议。')
const primaryAction = computed(() => actions[mode.value] ?? { label: '新建内容', to: '' })
const modeLabel = computed(() => modeLabels[mode.value] ?? 'AI-Powered Learning')
const metrics = computed(() => metricMap[mode.value] ?? metricMap.default)
const items = computed(() => {
  if (mode.value === 'community') {
    return mockPosts.map((post) => ({ title: post.title, text: `${post.author} · ${post.replies} 条回复`, tag: '社区' }))
  }
  if (mode.value === 'chapters') {
    return mockChapters.map((chapter) => ({ title: chapter.title, text: chapter.summary, tag: `${chapter.masteryRate}%` }))
  }
  return defaultItems[mode.value] ?? defaultItems.default
})

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
    { label: '内容', value: '2' },
    { label: '状态', value: '就绪' },
  ],
  chapters: [
    { label: '章节', value: '3' },
    { label: '知识点', value: '12' },
    { label: '掌握', value: '68%' },
  ],
  'question-bank': [
    { label: '题组', value: '2' },
    { label: '题目', value: '20' },
    { label: 'AI', value: '可生成' },
  ],
  'practice-result': [
    { label: '正确率', value: '76%' },
    { label: '错题', value: '3' },
    { label: '建议', value: '已生成' },
  ],
  ranking: [
    { label: '今日', value: '86m' },
    { label: '连续', value: '12天' },
    { label: '排名', value: '第1' },
  ],
}

const resultCards = [
  { label: '正确率', value: '76%', bg: 'bg-[#f0fff0]' },
  { label: '错题数', value: '3', bg: 'bg-[#fff2b8]' },
  { label: '用时', value: '18m', bg: 'bg-[#add8e6]' },
]

const tips: Record<string, string> = {
  'practice-result': '建议把错题一键加入错题本，并生成相似题巩固。',
  reports: '报告可结合后端学习记录与 AI 生成建议输出。',
  target: '目标院校会影响学习任务优先级和报告建议。',
}

const actions: Record<string, { label: string; to: string }> = {
  'question-bank': { label: '开始练习', to: '/packs/pack-english/practice' },
  community: { label: '发布帖子', to: '/community/new' },
}

const defaultItems: Record<string, Array<{ title: string; text: string; tag: string }>> = {
  default: [
    { title: '核心流程已打通', text: '该页面保持设计稿的信息架构，可继续接入真实列表接口。', tag: '已就绪' },
    { title: '响应式布局', text: '桌面端左右分栏，移动端自动单列展示。', tag: 'H5' },
  ],
  'question-bank': [
    { title: '基础概念题', text: '适合第一轮自测，覆盖章节定义与关键术语。', tag: '12 题' },
    { title: '高频易错题', text: '来自错题本和 AI 生成的相似题。', tag: '8 题' },
  ],
  'practice-result': [
    { title: '正确率 76%', text: '错题集中在推断题与概念变形题，建议立即复盘。', tag: '良好' },
    { title: '下一步建议', text: '生成 5 道相似题，并把错因转成记忆卡片。', tag: 'AI' },
  ],
  ranking: [
    { title: '小郭同学', text: '今日专注 86 分钟，连续学习 12 天。', tag: '第 1' },
    { title: '林同学', text: '今日专注 72 分钟，完成 3 个任务。', tag: '第 2' },
  ],
  target: [
    { title: '目标：南京大学', text: '当前阶段重点：英语阅读与高等数学基础。', tag: '进行中' },
    { title: '本周计划', text: '完成 6 次练习、2 次错题复盘、1 份周报告。', tag: '本周' },
  ],
  reports: [
    { title: '本周学习摘要', text: '总学习时长 9.6 小时，任务完成率 82%。', tag: '周报' },
    { title: '薄弱知识点', text: '阅读推断题、导数定义式、政治选择题混淆项。', tag: 'AI' },
  ],
}
</script>

<style scoped>
</style>
