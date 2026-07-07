<template>
  <div>
    <PageHeader title="学习偏好设置" eyebrow="个性化" description="控制 AI 回复风格、复盘节奏和每日学习提醒。">
      <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="preferenceOpen = true">
        打开偏好弹窗
      </button>
    </PageHeader>

    <section class="max-w-3xl rounded-lg border border-[#dce4dd] bg-white p-5">
      <div class="space-y-5">
        <label class="block text-sm font-semibold text-[#1f2a24]">
          AI 回复风格
          <select v-model="form.replyStyle" class="mt-2 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 outline-none focus:border-[#1f7a5a] focus:bg-white">
            <option value="concise">简洁直接</option>
            <option value="guided">启发引导</option>
            <option value="detailed">详细讲解</option>
          </select>
        </label>
        <label class="flex items-center justify-between rounded-lg bg-[#f6f8f5] px-4 py-3">
          <span class="text-sm font-semibold text-[#1f2a24]">每日复习提醒</span>
          <input v-model="form.reminder" class="h-5 w-5 accent-[#1f7a5a]" type="checkbox" />
        </label>
        <label class="block text-sm font-semibold text-[#1f2a24]">
          每日目标分钟
          <input v-model.number="form.dailyMinutes" class="mt-2 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 outline-none focus:border-[#1f7a5a] focus:bg-white" type="number" />
        </label>
      </div>
      <button class="mt-6 h-10 rounded-lg bg-[#1f7a5a] px-5 text-sm font-semibold text-white hover:bg-[#155f46]" type="button">保存设置</button>
    </section>

    <ProModal
      :open="preferenceOpen"
      title="设置学习偏好"
      code="M19. 学习偏好弹窗"
      description="快速建立学习偏好，让首页建议和默认参数更贴近个人习惯。"
      width="680px"
      @close="preferenceOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-field">
          <span class="pro-label">学习目标</span>
          <textarea v-model="form.studyGoal" class="pro-textarea"></textarea>
        </div>
        <div class="pro-field">
          <span class="pro-label">每日学习时长</span>
          <input v-model.number="form.dailyMinutes" class="pro-input" type="number" />
        </div>
        <div class="pro-field">
          <span class="pro-label">默认专注时长</span>
          <select v-model.number="form.focusMinutes" class="pro-select">
            <option :value="10">10 分钟</option>
            <option :value="25">25 分钟</option>
            <option :value="30">30 分钟</option>
            <option :value="60">1 小时</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">默认题目难度</span>
          <select v-model="form.difficulty" class="pro-select">
            <option>基础巩固</option>
            <option>中等综合</option>
            <option>提高挑战</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">AI 回复风格</span>
          <select v-model="form.replyStyle" class="pro-select">
            <option value="concise">简洁直接</option>
            <option value="detailed">详细讲解</option>
            <option value="encouraging">鼓励陪伴</option>
            <option value="exam_oriented">考试导向</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">复习提醒时间</span>
          <input v-model="form.reminderTime" class="pro-input" type="time" />
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="preferenceOpen = false">稍后再说</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="preferenceOpen = false">保存偏好</button>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import PageHeader from '../../components/common/PageHeader.vue'
import ProModal from '../../components/common/ProModal.vue'

const preferenceOpen = ref(false)
const form = reactive({
  replyStyle: 'guided',
  reminder: true,
  dailyMinutes: 90,
  focusMinutes: 25,
  difficulty: '中等综合',
  reminderTime: '20:30',
  studyGoal: '考研备考：每天推进学习包、错题复盘和专注打卡。',
})
</script>

<style scoped>
</style>
