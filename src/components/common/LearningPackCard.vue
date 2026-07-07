<template>
  <RouterLink class="block rounded-[14px] border-[3px] border-[#2d3748] bg-white p-5 shadow-[6px_6px_0_#2d3748] transition hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#2d3748]" :to="`/packs/${pack.id}`">
    <div class="flex items-start justify-between gap-3">
      <div>
        <span class="inline-flex rounded-full border-[2px] border-[#2d3748] bg-[#98ff98] px-3 py-1 text-xs font-black text-[#2d3748]">{{ pack.subjectName || '综合' }}</span>
        <h3 class="mt-3 text-lg font-black text-[#2d3748]">{{ pack.title }}</h3>
      </div>
      <span class="rounded-full border-[2px] border-[#2d3748] px-3 py-1 text-xs font-black" :class="pack.status === 'draft' ? 'bg-[#fff2b8] text-[#2d3748]' : 'bg-[#f0fff0] text-[#2d3748]'">
        {{ pack.status === 'draft' ? '草稿' : '学习中' }}
      </span>
    </div>
    <p class="mt-3 min-h-10 text-sm font-semibold leading-5 text-[#64748b]">{{ pack.studyGoal || '继续按章节推进学习计划。' }}</p>
    <div class="mt-5">
      <div class="flex items-center justify-between text-xs font-black text-[#64748b]">
        <span>掌握度</span>
        <span>{{ mastery }}%</span>
      </div>
      <div class="mt-2 h-3 rounded-full border-[2px] border-[#2d3748] bg-[#fffaf4]">
        <div class="h-full rounded-full bg-[#22c55e]" :style="{ width: `${mastery}%` }"></div>
      </div>
    </div>
    <div class="mt-5 flex items-center justify-between text-xs font-bold text-[#64748b]">
      <span>更新于 {{ pack.updatedAt || '今天' }}</span>
      <span class="inline-flex items-center gap-1 font-black text-[#2d3748]">进入 <ChevronRight class="h-3.5 w-3.5" /></span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronRight } from '@lucide/vue'

const props = defineProps<{
  pack: any
}>()

const mastery = computed(() => Number(props.pack.masteryRate ?? props.pack.progress ?? 36))
</script>

<style scoped>
</style>
