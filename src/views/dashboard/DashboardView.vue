<template>
  <div class="space-y-6">
    <PageHeader title="学习首页" eyebrow="今日路径" description="第一屏聚合学习进度、今日行动和 AI 建议，方便继续推进主线任务。">
      <RouterLink class="inline-flex h-11 items-center justify-center gap-2 rounded-[16px] border-[3px] border-[#2d3748] bg-[#22c55e] px-5 text-sm font-black text-white shadow-[5px_5px_0_#2d3748]" to="/packs/new">
        <Plus class="h-4 w-4" />
        新建学习包
      </RouterLink>
    </PageHeader>

    <section class="grid gap-5 rounded-[22px] border-[3px] border-[#2d3748] bg-white p-5 shadow-[8px_8px_0_#2d3748] xl:grid-cols-[1.1fr_0.9fr]">
      <div class="rounded-[18px] border-[3px] border-[#2d3748] bg-gradient-to-br from-[#f0fff0] to-[#eaf7ff] p-6">
        <p class="inline-flex rounded-full border-[2px] border-[#2d3748] bg-[#fff2b8] px-3 py-1 text-xs font-black text-[#2d3748]">/dashboard</p>
        <h2 class="mt-5 text-3xl font-black leading-tight text-[#2d3748] md:text-4xl">{{ heroTitle }}</h2>
        <p class="mt-4 max-w-2xl text-sm font-semibold leading-6 text-[#64748b]">{{ heroDescription }}</p>
        <div class="mt-6 flex flex-wrap gap-3">
          <RouterLink class="inline-flex h-11 items-center justify-center rounded-[16px] border-[3px] border-[#2d3748] bg-[#22c55e] px-5 text-sm font-black text-white shadow-[5px_5px_0_#2d3748]" :to="primaryPackId ? '/wrong-book' : '/packs/new'">{{ primaryPackId ? '开始复盘' : '创建第一个学习包' }}</RouterLink>
          <RouterLink class="inline-flex h-11 items-center justify-center rounded-[16px] border-[3px] border-[#2d3748] bg-[#add8e6] px-5 text-sm font-black text-[#2d3748] shadow-[5px_5px_0_#2d3748]" to="/focus">专注打卡</RouterLink>
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div v-for="metric in heroMetrics" :key="metric.label" class="rounded-[16px] border-[3px] border-[#2d3748] bg-[#fffaf4] p-4">
          <p class="text-xs font-black text-[#64748b]">{{ metric.label }}</p>
          <p class="mt-2 text-3xl font-black text-[#2d3748]">{{ metric.value }}</p>
          <p class="mt-2 text-xs font-bold text-[#64748b]">{{ metric.hint }}</p>
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="累计专注" :value="`${stats.totalFocusMinutes} 分钟`" hint="完成专注后自动累计" :icon="Timer" />
      <StatCard label="连续学习" :value="`${stats.currentStreakDays} 天`" hint="完成练习或专注后更新" :icon="Flame" />
      <StatCard label="待复盘错题" :value="String(stats.wrongQuestionCount)" hint="错题来自练习提交" :icon="NotebookPen" />
      <StatCard label="学习包" :value="String(stats.learningPackCount)" hint="上传资料后开始学习" :icon="Sparkles" />
    </section>

    <section class="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
      <div class="rounded-[18px] border-[3px] border-[#2d3748] bg-white p-5 shadow-[6px_6px_0_#2d3748]">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-[#1f2a24]">继续学习</h2>
          <RouterLink class="text-sm font-semibold text-[#1f7a5a]" to="/packs">查看全部</RouterLink>
        </div>
        <div v-if="packs.length" class="mt-4 grid gap-4 lg:grid-cols-2">
          <LearningPackCard v-for="pack in packs.slice(0, 2)" :key="pack.id" :pack="pack" />
        </div>
        <div v-else class="mt-4 rounded-[12px] border-[3px] border-dashed border-[#b8cfc0] bg-[#f6f8f5] p-8 text-center">
          <p class="font-black text-[#2d3748]">还没有学习包</p>
          <p class="mt-2 text-sm font-semibold text-[#66736b]">新用户会从空白开始，先上传一份资料来生成章节和知识点。</p>
          <RouterLink class="mt-4 inline-flex h-10 items-center justify-center rounded-[14px] border-[3px] border-[#2d3748] bg-[#22c55e] px-4 text-sm font-black text-white shadow-[4px_4px_0_#2d3748]" to="/packs/new">新建学习包</RouterLink>
        </div>
      </div>

      <div class="rounded-[18px] border-[3px] border-[#2d3748] bg-[#fffaf4] p-5 shadow-[6px_6px_0_#2d3748]">
        <div class="flex items-start gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-[12px] border-[3px] border-[#2d3748] bg-[#98ff98] text-[#2d3748]">
            <Bot class="h-5 w-5" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-[#1f2a24]">AI 今日建议</h2>
            <p class="mt-2 text-sm leading-6 text-[#66736b]">{{ aiSuggestion }}</p>
          </div>
        </div>
        <div class="mt-5 space-y-3">
          <RouterLink v-for="action in aiActions" :key="action.to" class="flex items-center justify-between rounded-[12px] border-[3px] border-[#2d3748] bg-white px-4 py-3 text-sm font-black text-[#2d3748]" :to="action.to">
            <span>{{ action.label }}</span>
            <ChevronRight class="h-4 w-4 text-[#66736b]" />
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="mt-5 grid gap-5 lg:grid-cols-3">
      <div class="rounded-[18px] border-[3px] border-[#2d3748] bg-white p-5 shadow-[6px_6px_0_#2d3748] lg:col-span-2">
        <h2 class="text-lg font-bold text-[#1f2a24]">今日学习任务</h2>
        <div v-if="tasks.length" class="mt-4 space-y-3">
          <div v-for="task in tasks" :key="task.id" class="flex items-center justify-between rounded-[12px] border-[3px] border-[#2d3748] bg-[#fffaf4] px-4 py-3">
            <div>
              <p class="text-sm font-semibold text-[#1f2a24]">{{ task.title }}</p>
              <p class="mt-1 text-xs text-[#66736b]">目标 {{ task.targetValue || 1 }} 项</p>
            </div>
            <span class="rounded-full bg-[#eef4ef] px-2 py-1 text-xs text-[#1f7a5a]">{{ taskStatusText(task.status) }}</span>
          </div>
        </div>
        <div v-else class="mt-4 rounded-[12px] border-[3px] border-dashed border-[#b8cfc0] bg-[#f6f8f5] p-8 text-center">
          <p class="font-black text-[#2d3748]">今天还没有学习任务</p>
          <p class="mt-2 text-sm font-semibold text-[#66736b]">创建任务后，这里会显示你的待办和完成状态。</p>
          <RouterLink class="mt-4 inline-flex h-10 items-center justify-center rounded-[14px] border-[3px] border-[#2d3748] bg-white px-4 text-sm font-black text-[#2d3748] shadow-[4px_4px_0_#2d3748]" to="/tasks">去创建任务</RouterLink>
        </div>
      </div>

      <div class="rounded-[18px] border-[3px] border-[#2d3748] bg-white p-5 shadow-[6px_6px_0_#2d3748]">
        <h2 class="text-lg font-bold text-[#1f2a24]">掌握度趋势</h2>
        <div class="mt-5 flex h-40 items-end gap-3">
          <div v-for="bar in bars" :key="bar" class="flex flex-1 flex-col justify-end">
            <div class="rounded-t-[10px] border-[3px] border-[#2d3748] border-b-0 bg-[#22c55e]" :style="{ height: `${bar}%` }"></div>
          </div>
        </div>
        <p class="mt-3 text-sm text-[#66736b]">{{ trendText }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Bot, ChevronRight, Flame, NotebookPen, Plus, Sparkles, Timer } from '@lucide/vue'
import { api } from '../../api/client'
import LearningPackCard from '../../components/common/LearningPackCard.vue'
import PageHeader from '../../components/common/PageHeader.vue'
import StatCard from '../../components/common/StatCard.vue'

const packs = ref<any[]>([])
const tasks = ref<any[]>([])
const stats = ref({
  learningPackCount: 0,
  wrongQuestionCount: 0,
  flashcardCount: 0,
  totalFocusMinutes: 0,
  completedTaskCount: 0,
  currentStreakDays: 0,
})
const bars = computed(() => {
  const activeValue = Math.min(100, Math.max(8, stats.value.totalFocusMinutes || stats.value.completedTaskCount * 20 || packs.value.length * 18))
  return [8, 8, 8, 8, 8, 8, activeValue]
})
const heroMetrics = computed(() => [
  { label: '学习包', value: String(stats.value.learningPackCount), hint: '你的资料库' },
  { label: '错题', value: String(stats.value.wrongQuestionCount), hint: '待沉淀复盘' },
  { label: '卡片', value: String(stats.value.flashcardCount), hint: '记忆内容' },
  { label: '已完成任务', value: String(stats.value.completedTaskCount), hint: '学习行动' },
])
const primaryPackId = computed(() => packs.value[0]?.id)
const heroTitle = computed(() => primaryPackId.value ? '从最近的学习包继续推进。' : '欢迎来到知径，先创建你的第一个学习包。')
const heroDescription = computed(() => primaryPackId.value
  ? '这里会基于你的真实学习包、任务、错题和专注记录生成首页概览。'
  : '新账号不会展示示例学习记录；上传资料后，章节、练习、错题和卡片会逐步生成。')
const aiSuggestion = computed(() => primaryPackId.value
  ? '可以进入学习包继续问答、练习或整理知识点。'
  : '先创建学习包并添加资料，AI 才能基于你的真实内容给出建议。')
const trendText = computed(() => stats.value.totalFocusMinutes || stats.value.completedTaskCount
  ? '趋势会随着真实练习、专注和任务完成情况更新。'
  : '暂无趋势数据，完成一次学习记录后这里会开始变化。')
const aiActions = computed(() => [
  { label: '打开 AI 问答', to: primaryPackId.value ? `/packs/${primaryPackId.value}/qa` : '/packs/new' },
  { label: '生成章节练习', to: primaryPackId.value ? `/packs/${primaryPackId.value}/practice` : '/packs/new' },
  { label: '复盘错题本', to: '/wrong-book' },
])
const taskStatusText = (status: string) => {
  if (status === 'completed' || status === 'done') return '已完成'
  if (status === 'in_progress' || status === 'doing') return '进行中'
  return '待开始'
}

onMounted(async () => {
  try {
    const [packData, taskData, profileData] = await Promise.all([
      api.getPacks(),
      api.getTasks(),
      api.getProfile(),
    ])
    packs.value = packData
    tasks.value = taskData
    stats.value = { ...stats.value, ...(profileData?.stats ?? {}) }
  } catch {
    packs.value = []
    tasks.value = []
  }
})
</script>

<style scoped>
</style>
