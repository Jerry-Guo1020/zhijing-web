<template>
  <div>
    <PageHeader title="学习报告" eyebrow="成长复盘" description="汇总学习时长、任务完成、错题趋势、薄弱知识点和 AI 下一步建议。">
      <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="generateReport">
        <Sparkles class="h-4 w-4" />
        生成周报
      </button>
    </PageHeader>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="本周学习" value="9.6h" hint="较上周 +18%" :icon="Clock" />
      <StatCard label="任务完成率" value="82%" hint="9 / 11 项完成" :icon="CheckCircle2" />
      <StatCard label="练习正确率" value="76%" hint="错题新增 7 道" :icon="FileQuestion" />
      <StatCard label="卡片复习" value="42" hint="待复习 24 张" :icon="Layers" />
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
        <div class="mt-4 space-y-3">
          <div v-for="item in weakPoints" :key="item.title" class="rounded-lg bg-[#f6f8f5] p-4">
            <div class="flex items-center justify-between gap-3">
              <p class="font-semibold text-[#1f2a24]">{{ item.title }}</p>
              <span class="text-sm font-bold text-[#c44b3f]">{{ item.risk }}</span>
            </div>
            <p class="mt-2 text-sm leading-6 text-[#66736b]">{{ item.suggestion }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
        <h2 class="text-lg font-bold text-[#1f2a24]">历史报告</h2>
        <div class="mt-4 space-y-3">
          <article v-for="report in reports" :key="report.id" class="rounded-lg border border-[#dce4dd] p-4">
            <p class="font-semibold text-[#1f2a24]">{{ report.title || '周学习报告' }}</p>
            <p class="mt-1 text-sm text-[#66736b]">{{ report.periodStart || '2026-06-29' }} 至 {{ report.periodEnd || '2026-07-05' }}</p>
            <p class="mt-3 text-sm leading-6 text-[#66736b]">{{ report.aiSummary || aiSummary }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { CheckCircle2, ChevronRight, Clock, FileQuestion, Layers, Sparkles } from '@lucide/vue'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import StatCard from '../../components/common/StatCard.vue'

const bars = [
  { label: '一', value: 42 },
  { label: '二', value: 58 },
  { label: '三', value: 51 },
  { label: '四', value: 66 },
  { label: '五', value: 72 },
  { label: '六', value: 63 },
  { label: '日', value: 81 },
]
const aiSummary = ref('本周学习投入较稳定，建议优先复习阅读主旨题和导数定义式错题，把高频错因转成记忆卡片，并用 25 分钟专注块推进目标院校专业课。')
const weakPoints = [
  { title: '英语阅读主旨题', risk: '高风险', suggestion: '继续按转折词、作者态度和段落功能三类复练。' },
  { title: '导数定义式', risk: '中风险', suggestion: '每次先写完整定义式，再做代入和化简。' },
  { title: '政治混淆选项', risk: '中风险', suggestion: '把绝对化表述整理成卡片，每天快速复习一轮。' },
]
const actions = [
  { label: '复练错题本', to: '/wrong-book' },
  { label: '开始专注打卡', to: '/focus' },
  { label: '查看目标规划', to: '/target' },
]
const reports = ref<any[]>([
  { id: 'report-1', title: '第 27 周学习报告', periodStart: '2026-06-29', periodEnd: '2026-07-05', aiSummary: aiSummary.value },
])

const generateReport = async () => {
  try {
    const report = await api.generateWeeklyReport()
    reports.value = [report, ...reports.value]
  } catch {
    reports.value = [{ id: `report-${Date.now()}`, title: '刚生成的周学习报告', periodStart: '2026-06-29', periodEnd: '2026-07-05', aiSummary: aiSummary.value }, ...reports.value]
  }
}

onMounted(async () => {
  try {
    const data = await api.getLearningReports()
    reports.value = data.length ? data : reports.value
  } catch {
    // Keep demo report.
  }
})
</script>
