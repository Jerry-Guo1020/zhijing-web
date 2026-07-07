<template>
  <div>
    <PageHeader title="学习报告" eyebrow="成长复盘" description="汇总学习时长、任务完成、错题趋势、薄弱知识点和 AI 下一步建议。">
      <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="generateReport">
        <Sparkles class="h-4 w-4" />
        生成周报
      </button>
    </PageHeader>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="累计学习" :value="`${stats.totalFocusMinutes}m`" hint="来自专注记录" :icon="Clock" />
      <StatCard label="完成任务" :value="String(stats.completedTaskCount)" hint="来自真实任务" :icon="CheckCircle2" />
      <StatCard label="错题数量" :value="String(stats.wrongQuestionCount)" hint="来自错题本" :icon="FileQuestion" />
      <StatCard label="卡片数量" :value="String(stats.flashcardCount)" hint="来自记忆卡片" :icon="Layers" />
    </section>

    <section class="mt-5 grid gap-5 xl:grid-cols-[1fr_380px]">
      <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
        <h2 class="text-lg font-bold text-[#1f2a24]">掌握度趋势</h2>
        <div class="mt-5 flex h-56 items-end gap-3">
          <div v-for="bar in bars" :key="bar.label" class="flex flex-1 flex-col items-center gap-2">
            <div class="w-full rounded-t-md bg-[#1f7a5a]" :style="{ height: `${bar.value}%` }"></div>
            <span class="text-xs text-[#66736b]">{{ bar.label }}</span>
          </div>
        </div>
      </div>

      <aside class="rounded-lg border border-[#dce4dd] bg-[#eef4ef] p-5">
        <Sparkles class="h-6 w-6 text-[#1f7a5a]" />
        <h2 class="mt-4 text-lg font-bold text-[#1f2a24]">AI 周报建议</h2>
        <p class="mt-3 text-sm leading-6 text-[#66736b]">{{ aiSummary }}</p>
        <div class="mt-5 space-y-3">
          <RouterLink v-for="action in actions" :key="action.to" class="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm font-semibold text-[#1f2a24]" :to="action.to">
            {{ action.label }}
            <ChevronRight class="h-4 w-4 text-[#66736b]" />
          </RouterLink>
        </div>
      </aside>
    </section>

    <section class="mt-5 grid gap-5 lg:grid-cols-2">
      <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
        <h2 class="text-lg font-bold text-[#1f2a24]">薄弱知识点</h2>
        <div v-if="weakPoints.length" class="mt-4 space-y-3">
          <div v-for="item in weakPoints" :key="item.title" class="rounded-lg bg-[#f6f8f5] p-4">
            <div class="flex items-center justify-between gap-3">
              <p class="font-semibold text-[#1f2a24]">{{ item.title }}</p>
              <span class="text-sm font-bold text-[#c44b3f]">{{ item.risk }}</span>
            </div>
            <p class="mt-2 text-sm leading-6 text-[#66736b]">{{ item.suggestion }}</p>
          </div>
        </div>
        <div v-else class="mt-4 rounded-lg border border-dashed border-[#b8cfc0] bg-[#f6f8f5] p-8 text-center text-sm text-[#66736b]">暂无薄弱知识点，完成练习后会逐步生成。</div>
      </div>

      <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
        <h2 class="text-lg font-bold text-[#1f2a24]">历史报告</h2>
        <div v-if="reports.length" class="mt-4 space-y-3">
          <article v-for="report in reports" :key="report.id" class="rounded-lg border border-[#dce4dd] p-4">
            <p class="font-semibold text-[#1f2a24]">{{ report.title || '周学习报告' }}</p>
            <p class="mt-1 text-sm text-[#66736b]">{{ report.periodStart || '2026-06-29' }} 至 {{ report.periodEnd || '2026-07-05' }}</p>
            <p class="mt-3 text-sm leading-6 text-[#66736b]">{{ report.aiSummary || aiSummary }}</p>
          </article>
        </div>
        <div v-else class="mt-4 rounded-lg border border-dashed border-[#b8cfc0] bg-[#f6f8f5] p-8 text-center text-sm text-[#66736b]">暂无历史报告。</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { CheckCircle2, ChevronRight, Clock, FileQuestion, Layers, Sparkles } from '@lucide/vue'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import StatCard from '../../components/common/StatCard.vue'

const stats = ref({
  totalFocusMinutes: 0,
  completedTaskCount: 0,
  wrongQuestionCount: 0,
  flashcardCount: 0,
})
const bars = computed(() => {
  const value = Math.min(100, Math.max(6, stats.value.totalFocusMinutes || stats.value.completedTaskCount * 18))
  return ['一', '二', '三', '四', '五', '六', '日'].map((label, index) => ({ label, value: index === 6 ? value : 6 }))
})
const aiSummary = ref('暂无 AI 周报建议。生成报告后，这里会展示基于真实学习记录的总结。')
const weakPoints = ref<any[]>([])
const actions = [
  { label: '复练错题本', to: '/wrong-book' },
  { label: '开始专注打卡', to: '/focus' },
  { label: '查看目标规划', to: '/target' },
]
const reports = ref<any[]>([])

const generateReport = async () => {
  try {
    const report = await api.generateWeeklyReport()
    reports.value = [report, ...reports.value]
    aiSummary.value = report.aiSummary || aiSummary.value
  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
  try {
    const [profile, data] = await Promise.all([api.getProfile(), api.getLearningReports()])
    stats.value = { ...stats.value, ...(profile?.stats ?? {}) }
    reports.value = data
    aiSummary.value = data[0]?.aiSummary || aiSummary.value
  } catch {
    reports.value = []
  }
})
</script>
