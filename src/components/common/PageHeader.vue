<template>
  <div class="mb-6 flex flex-col gap-4 rounded-[18px] border-[3px] border-[#2d3748] bg-white px-5 py-4 shadow-[8px_8px_0_#2d3748] sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p v-if="eyebrow" class="inline-flex rounded-full border-[2px] border-[#2d3748] bg-[#98ff98] px-3 py-1 text-xs font-black text-[#2d3748]">{{ eyebrow }}</p>
      <h1 class="mt-3 text-2xl font-black text-[#2d3748] md:text-[30px]">{{ title }}</h1>
      <p v-if="description" class="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#64748b]">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  eyebrow?: string
  description?: string
}>()
</script>

<style scoped>
</style>
