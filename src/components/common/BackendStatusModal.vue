<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-end justify-center bg-[#1f2a24]/35 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0">
    <section class="w-full max-w-md rounded-t-2xl border border-[#dce4dd] bg-white p-5 shadow-2xl sm:rounded-lg">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-start gap-3">
          <div
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
            :class="status === 'connected' ? 'bg-[#e6f5ed] text-[#2f855a]' : status === 'checking' ? 'bg-[#edf4f8] text-[#2f6f9f]' : 'bg-[#fff4e4] text-[#b7791f]'"
          >
            <CheckCircle2 v-if="status === 'connected'" class="h-5 w-5" />
            <RefreshCw v-else-if="status === 'checking'" class="h-5 w-5 animate-spin" />
            <AlertTriangle v-else class="h-5 w-5" />
          </div>
          <div>
            <p class="text-base font-semibold text-[#1f2a24]">{{ title }}</p>
            <p class="mt-1 text-sm leading-6 text-[#66736b]">{{ description }}</p>
          </div>
        </div>
        <button class="rounded-md p-2 text-[#66736b] transition hover:bg-[#eef4ef] hover:text-[#1f2a24]" type="button" @click="$emit('close')" aria-label="关闭">
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="mt-4 rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 py-2 text-xs text-[#66736b]">
        当前接口地址：<span class="font-medium text-[#1f2a24]">{{ apiBaseUrl }}</span>
      </div>

      <div class="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button class="h-10 rounded-lg border border-[#dce4dd] px-4 text-sm font-medium text-[#1f2a24] transition hover:bg-[#eef4ef]" type="button" @click="$emit('close')">
          稍后处理
        </button>
        <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white transition hover:bg-[#155f46]" type="button" @click="$emit('retry')">
          <RefreshCw class="h-4 w-4" />
          重新检测
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, CheckCircle2, RefreshCw, X } from '@lucide/vue'
import type { BackendStatus } from '../../api/client'

const props = defineProps<{
  open: boolean
  status: BackendStatus
  apiBaseUrl: string
}>()

defineEmits<{
  close: []
  retry: []
}>()

const title = computed(() => {
  if (props.status === 'connected') return '后端连接成功'
  if (props.status === 'checking') return '正在检测后端连接'
  return '暂未连接到后端'
})

const description = computed(() => {
  if (props.status === 'connected') return '前端已经可以访问后端健康检查接口，登录、学习包和 AI 设置会优先使用真实接口数据。'
  if (props.status === 'checking') return '正在尝试访问健康检查接口，请稍候。'
  return '页面会继续展示演示数据，你可以启动 zhijing-api 后点击重新检测。'
})
</script>

<style scoped>
</style>
