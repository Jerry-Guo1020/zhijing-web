<template>
  <div>
    <PageHeader title="专注打卡" eyebrow="沉浸学习" description="选择 10 分钟以上的专注时长，开始后会进入全屏并检测切屏与退出全屏。">
      <span class="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dce4dd] bg-white px-3 text-sm font-semibold text-[#1f2a24]">
        <ShieldAlert class="h-4 w-4 text-[#d99a26]" />
        剩余警告 {{ Math.max(0, 3 - violationCount) }} 次
      </span>
    </PageHeader>

    <section class="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
        <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <button
            v-for="option in presets"
            :key="option.minutes"
            class="h-11 rounded-lg border text-sm font-semibold transition"
            :class="selectedMinutes === option.minutes ? 'border-[#1f7a5a] bg-[#e8f3ed] text-[#1f7a5a]' : 'border-[#dce4dd] bg-white text-[#66736b] hover:bg-[#eef4ef]'"
            :disabled="running"
            type="button"
            @click="selectPreset(option.minutes)"
          >
            {{ option.label }}
          </button>
        </div>

        <div class="mt-8 flex flex-col items-center text-center">
          <div class="relative flex h-64 w-64 items-center justify-center rounded-full bg-[#f6f8f5]">
            <svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 240 240" aria-hidden="true">
              <circle cx="120" cy="120" r="105" fill="none" stroke="#dce4dd" stroke-width="14" />
              <circle cx="120" cy="120" r="105" fill="none" stroke="#1f7a5a" stroke-linecap="round" stroke-width="14" :stroke-dasharray="circumference" :stroke-dashoffset="progressOffset" />
            </svg>
            <div>
              <p class="text-sm font-semibold text-[#66736b]">{{ statusLabel }}</p>
              <p class="mt-2 text-5xl font-bold text-[#1f2a24]">{{ minutes }}:{{ seconds }}</p>
              <p class="mt-3 text-sm text-[#66736b]">{{ selectedMinutes }} 分钟专注计划</p>
            </div>
          </div>

          <p v-if="message" class="mt-5 max-w-xl rounded-lg px-4 py-3 text-sm" :class="invalidated ? 'bg-[#fff0ee] text-[#c44b3f]' : 'bg-[#eef4ef] text-[#1f7a5a]'">{{ message }}</p>

          <div class="mt-7 flex flex-wrap justify-center gap-3">
            <button class="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1f7a5a] px-5 text-sm font-semibold text-white hover:bg-[#155f46] disabled:cursor-not-allowed disabled:opacity-60" :disabled="running || selectedMinutes < 10" type="button" @click="start">
              <Play class="h-4 w-4" />
              开始专注
            </button>
            <button class="inline-flex h-11 items-center gap-2 rounded-lg border border-[#dce4dd] bg-white px-5 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" :disabled="!running" type="button" @click="pause">
              <Pause class="h-4 w-4" />
              暂停
            </button>
            <button class="inline-flex h-11 items-center gap-2 rounded-lg border border-[#dce4dd] bg-white px-5 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="complete">
              保存本轮
            </button>
            <button class="inline-flex h-11 items-center gap-2 rounded-lg border border-[#dce4dd] bg-white px-5 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="reset">
              <RotateCcw class="h-4 w-4" />
              重置
            </button>
          </div>
        </div>
      </div>

      <aside class="space-y-5">
        <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
          <h2 class="text-lg font-bold text-[#1f2a24]">本次专注条件</h2>
          <div class="mt-4 space-y-3 text-sm text-[#66736b]">
            <p class="flex items-center gap-2"><CheckCircle2 class="h-4 w-4 text-[#2f855a]" />低于 10 分钟不计入打卡。</p>
            <p class="flex items-center gap-2"><CheckCircle2 class="h-4 w-4 text-[#2f855a]" />开始后自动请求浏览器全屏。</p>
            <p class="flex items-center gap-2"><CheckCircle2 class="h-4 w-4 text-[#2f855a]" />切屏、窗口失焦或退出全屏会触发警告。</p>
            <p class="flex items-center gap-2"><CheckCircle2 class="h-4 w-4 text-[#2f855a]" />累计三次警告后，本次专注作废。</p>
          </div>
        </div>

        <div class="rounded-lg border border-[#dce4dd] bg-[#eef4ef] p-5">
          <h2 class="text-lg font-bold text-[#1f2a24]">今日专注</h2>
          <div class="mt-5 grid grid-cols-3 gap-3">
            <div v-for="stat in stats" :key="stat.label" class="rounded-lg bg-white p-4">
              <p class="text-xl font-bold text-[#1f2a24]">{{ stat.value }}</p>
              <p class="mt-1 text-xs text-[#66736b]">{{ stat.label }}</p>
            </div>
          </div>
          <div class="mt-5 flex h-28 items-end gap-2">
            <div v-for="bar in bars" :key="bar" class="flex-1 rounded-t-md bg-[#1f7a5a]" :style="{ height: `${bar}%` }"></div>
          </div>
        </div>
      </aside>
    </section>

    <ProModal
      :open="warningOpen"
      title="检测到离开专注环境"
      code="专注警告"
      :description="`这是第 ${violationCount} 次警告。连续三次切屏、退出全屏或窗口失焦后，本次专注会被判定作废。`"
      width="560px"
      @close="warningOpen = false"
    >
      <div class="pro-panel">
        <div class="flex items-center gap-3">
          <ShieldAlert class="h-6 w-6 text-[#b7791f]" />
          <div>
            <p class="font-black text-[#2d3748]">剩余警告 {{ Math.max(0, 3 - violationCount) }} 次</p>
            <p class="mt-1 text-sm leading-6 text-[#64748b]">请回到当前页面并保持全屏，系统会继续记录本轮专注。</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-primary" type="button" @click="acknowledgeWarning">收到了</button>
      </template>
    </ProModal>

    <ProModal
      :open="finishOpen"
      title="专注完成"
      code="M15. 专注结束弹窗"
      description="确认本次专注结果，记录学习心得，并可生成今日总结。"
      width="640px"
      @close="finishOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-field">
          <span class="pro-label">实际专注时长</span>
          <div class="flex items-center justify-between gap-3">
            <strong class="text-2xl font-black text-[#2d3748]">{{ selectedMinutes }} 分钟</strong>
            <span class="pro-switch" data-on="true"></span>
          </div>
        </div>
        <div class="pro-field">
          <span class="pro-label">是否完成任务</span>
          <button class="pro-switch" :data-on="taskCompleted" type="button" @click="taskCompleted = !taskCompleted"></button>
        </div>
        <div class="pro-field">
          <span class="pro-label">关联学习包</span>
          <select v-model="focusPack" class="pro-select">
            <option>考研英语阅读精读</option>
            <option>高等数学极限与导数</option>
            <option>语文阅读理解学习包</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">心得记录</span>
          <textarea v-model="note" class="pro-textarea" placeholder="例如：完成英语阅读两篇，错在主旨题定位。"></textarea>
        </div>
        <div class="pro-field">
          <span class="pro-label">生成今日总结</span>
          <button class="pro-switch" :data-on="generateSummary" type="button" @click="generateSummary = !generateSummary"></button>
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="finishOpen = false">继续专注</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="saveFinish">保存记录</button>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { CheckCircle2, Pause, Play, RotateCcw, ShieldAlert } from '@lucide/vue'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import ProModal from '../../components/common/ProModal.vue'

const presets = [
  { label: '10 分钟', minutes: 10 },
  { label: '25 分钟', minutes: 25 },
  { label: '30 分钟', minutes: 30 },
  { label: '1 小时', minutes: 60 },
  { label: '1.5 小时', minutes: 90 },
  { label: '2 小时', minutes: 120 },
]
const bars = [38, 52, 44, 74, 63, 86, 70]
const stats = [
  { label: '今日累计', value: '86m' },
  { label: '连续天数', value: '12' },
  { label: '有效次数', value: '3' },
]

const selectedMinutes = ref(25)
const totalSeconds = ref(25 * 60)
const running = ref(false)
const warningOpen = ref(false)
const finishOpen = ref(false)
const invalidated = ref(false)
const message = ref('')
const note = ref('')
const focusPack = ref('考研英语阅读精读')
const taskCompleted = ref(false)
const generateSummary = ref(true)
const violationCount = ref(0)
const focusRecordId = ref('')
const restoringFullscreen = ref(false)
let timer: number | undefined

const circumference = 2 * Math.PI * 105
const minutes = computed(() => String(Math.floor(totalSeconds.value / 60)).padStart(2, '0'))
const seconds = computed(() => String(totalSeconds.value % 60).padStart(2, '0'))
const progressOffset = computed(() => {
  const planned = selectedMinutes.value * 60
  const ratio = planned > 0 ? totalSeconds.value / planned : 1
  return circumference * (1 - ratio)
})
const statusLabel = computed(() => {
  if (invalidated.value) return '本次已作废'
  if (running.value) return '专注中'
  if (totalSeconds.value === 0) return '已完成'
  return '准备开始'
})

watch(running, (value) => {
  window.clearInterval(timer)
  if (value) {
    timer = window.setInterval(() => {
      totalSeconds.value = Math.max(totalSeconds.value - 1, 0)
      if (totalSeconds.value === 0) complete()
    }, 1000)
  }
})

const selectPreset = (minutes: number) => {
  selectedMinutes.value = minutes
  totalSeconds.value = minutes * 60
  message.value = ''
}

const start = async () => {
  if (selectedMinutes.value < 10) {
    message.value = '低于 10 分钟的专注不计入打卡，请选择 10 分钟及以上。'
    return
  }
  invalidated.value = false
  violationCount.value = 0
  message.value = '已进入专注模式，请保持全屏并留在当前页面。'
  running.value = true
  try {
    await document.documentElement.requestFullscreen?.()
  } catch {
    registerViolation('浏览器未允许全屏，已计入一次警告。')
  }
  try {
    const record = await api.startFocus({ plannedMinutes: selectedMinutes.value })
    focusRecordId.value = record.id
  } catch {
    focusRecordId.value = 'demo-focus'
  }
}

const pause = () => {
  running.value = false
  message.value = '计时已暂停。再次开始会继续检测切屏。'
}

const reset = () => {
  running.value = false
  totalSeconds.value = selectedMinutes.value * 60
  violationCount.value = 0
  invalidated.value = false
  warningOpen.value = false
  finishOpen.value = false
  message.value = '已重置本次专注。'
}

const complete = () => {
  running.value = false
  if (!invalidated.value) {
    finishOpen.value = true
  }
}

const invalidate = () => {
  running.value = false
  invalidated.value = true
  warningOpen.value = false
  message.value = '连续三次离开专注环境，本次专注已作废。'
}

const registerViolation = (customMessage?: string) => {
  if (!running.value || invalidated.value || warningOpen.value || restoringFullscreen.value) return
  violationCount.value += 1
  message.value = customMessage ?? `检测到第 ${violationCount.value} 次切屏或退出全屏。`
  if (violationCount.value >= 3) {
    invalidate()
  } else {
    warningOpen.value = true
  }
}

const acknowledgeWarning = async () => {
  warningOpen.value = false
  if (!running.value || invalidated.value || document.fullscreenElement) return

  restoringFullscreen.value = true
  try {
    await document.documentElement.requestFullscreen?.()
    message.value = '已回到全屏专注模式，请继续保持当前页面。'
  } catch {
    message.value = '浏览器未允许自动回到全屏，请再次点击“收到了”或使用浏览器全屏。'
    warningOpen.value = true
  } finally {
    window.setTimeout(() => {
      restoringFullscreen.value = false
    }, 300)
  }
}

const handleVisibility = () => {
  if (document.hidden) registerViolation()
}

const handleFullscreen = () => {
  if (running.value && !document.fullscreenElement) registerViolation('检测到退出全屏，已计入一次警告。')
}

const handleWindowBlur = () => registerViolation()

const saveFinish = async () => {
  try {
    await api.finishFocus(focusRecordId.value, { actualMinutes: selectedMinutes.value, note: note.value })
  } catch {
    // Offline demo mode keeps the completion in the UI.
  }
  finishOpen.value = false
  reset()
  message.value = '专注记录已保存，建议继续复盘一个错题。'
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibility)
  document.addEventListener('fullscreenchange', handleFullscreen)
  window.addEventListener('blur', handleWindowBlur)
})

onBeforeUnmount(() => {
  window.clearInterval(timer)
  document.removeEventListener('visibilitychange', handleVisibility)
  document.removeEventListener('fullscreenchange', handleFullscreen)
  window.removeEventListener('blur', handleWindowBlur)
})
</script>
