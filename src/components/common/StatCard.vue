<template>
  <section class="rounded-[14px] border-[3px] border-[#2d3748] bg-white p-5 shadow-[6px_6px_0_#2d3748]">
    <div class="flex items-center justify-between">
      <p class="text-sm font-black text-[#64748b]">{{ label }}</p>
      <div class="flex h-10 w-10 items-center justify-center rounded-[12px] border-[3px] border-[#2d3748] bg-[#98ff98] text-[#2d3748]">
        <component :is="icon" class="h-4 w-4" />
      </div>
    </div>
    <p class="mt-4 text-3xl font-black text-[#2d3748]">{{ value }}</p>
    <p class="mt-2 text-xs font-bold text-[#64748b]">{{ hint }}</p>
  </section>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  label: string
  value: string | number
  hint: string
  icon: Component
}>()
</script>

<style scoped>
</style>
