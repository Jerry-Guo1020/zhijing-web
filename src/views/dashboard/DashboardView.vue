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
        <h2 class="mt-5 text-3xl font-black leading-tight text-[#2d3748] md:text-4xl">今天从错题复盘开始，把学习路径继续往前推。</h2>
        <p class="mt-4 max-w-2xl text-sm font-semibold leading-6 text-[#64748b]">系统建议先完成英语阅读精读的主旨题错因复练，再进入高数导数定义式训练。首页现在使用 Pro Max 页面稿的粗描边、硬阴影和网格背景。</p>
        <div class="mt-6 flex flex-wrap gap-3">
          <RouterLink class="inline-flex h-11 items-center justify-center rounded-[16px] border-[3px] border-[#2d3748] bg-[#22c55e] px-5 text-sm font-black text-white shadow-[5px_5px_0_#2d3748]" to="/wrong-book">开始复盘</RouterLink>
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
      <StatCard label="今日专注" value="86 分钟" hint="比昨日多 18 分钟" :icon="Timer" />
      <StatCard label="连续学习" value="12 天" hint="保持节奏很漂亮" :icon="Flame" />
      <StatCard label="待复盘错题" value="18" hint="建议先处理 5 道" :icon="NotebookPen" />
      <StatCard label="AI 建议" value="3 条" hint="来自最近练习表现" :icon="Sparkles" />
    </section>

    <section class="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
      <div class="rounded-[18px] border-[3px] border-[#2d3748] bg-white p-5 shadow-[6px_6px_0_#2d3748]">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-[#1f2a24]">继续学习</h2>
          <RouterLink class="text-sm font-semibold text-[#1f7a5a]" to="/packs">查看全部</RouterLink>
        </div>
        <div class="mt-4 grid gap-4 lg:grid-cols-2">
          <LearningPackCard v-for="pack in packs.slice(0, 2)" :key="pack.id" :pack="pack" />
        </div>
      </div>

      <div class="rounded-[18px] border-[3px] border-[#2d3748] bg-[#fffaf4] p-5 shadow-[6px_6px_0_#2d3748]">
        <div class="flex items-start gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-[12px] border-[3px] border-[#2d3748] bg-[#98ff98] text-[#2d3748]">
            <Bot class="h-5 w-5" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-[#1f2a24]">AI 今日建议</h2>
            <p class="mt-2 text-sm leading-6 text-[#66736b]">先完成英语阅读精读的错题复盘，再把高数导数定义式相关错因生成 6 张记忆卡片。</p>
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
        <div class="mt-4 space-y-3">
          <div v-for="task in tasks" :key="task.id" class="flex items-center justify-between rounded-[12px] border-[3px] border-[#2d3748] bg-[#fffaf4] px-4 py-3">
            <div>
              <p class="text-sm font-semibold text-[#1f2a24]">{{ task.title }}</p>
              <p class="mt-1 text-xs text-[#66736b]">目标 {{ task.targetValue || 1 }} 项</p>
            </div>
            <span class="rounded-full bg-[#eef4ef] px-2 py-1 text-xs text-[#1f7a5a]">{{ task.status === 'done' ? '已完成' : '进行中' }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-[18px] border-[3px] border-[#2d3748] bg-white p-5 shadow-[6px_6px_0_#2d3748]">
        <h2 class="text-lg font-bold text-[#1f2a24]">掌握度趋势</h2>
        <div class="mt-5 flex h-40 items-end gap-3">
          <div v-for="bar in bars" :key="bar" class="flex flex-1 flex-col justify-end">
            <div class="rounded-t-[10px] border-[3px] border-[#2d3748] border-b-0 bg-[#22c55e]" :style="{ height: `${bar}%` }"></div>
          </div>
        </div>
        <p class="mt-3 text-sm text-[#66736b]">本周复盘稳定，薄弱点主要集中在阅读推断题。</p>
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
import { mockPacks, mockTasks } from '../../data/mock'

const packs = ref<any[]>(mockPacks)
const tasks = ref<any[]>(mockTasks)
const bars = [38, 52, 48, 65, 74, 68, 82]
const heroMetrics = [
  { label: '今日路径', value: '4 步', hint: '错题、练习、专注、报告' },
  { label: '薄弱点', value: '3 个', hint: '英语主旨题优先' },
  { label: 'AI 建议', value: '已生成', hint: '可进入完整问答' },
  { label: '目标院校', value: '286 天', hint: '备考倒计时' },
]
const primaryPackId = computed(() => packs.value[0]?.id)
const aiActions = computed(() => [
  { label: '打开 AI 问答', to: primaryPackId.value ? `/packs/${primaryPackId.value}/qa` : '/packs/new' },
  { label: '生成章节练习', to: primaryPackId.value ? `/packs/${primaryPackId.value}/practice` : '/packs/new' },
  { label: '复盘错题本', to: '/wrong-book' },
])

onMounted(async () => {
  try {
    const data = await api.getPacks()
    packs.value = data.length ? data : []
  } catch {
    packs.value = mockPacks
  }

  try {
    tasks.value = await api.getTasks()
  } catch {
    tasks.value = mockTasks
  }
})
</script>

<style scoped>
</style>
