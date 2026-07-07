<template>
  <main class="pro-auth-shell">
    <section class="pro-auth-frame" data-mode="split">
      <div class="pro-auth-story">
        <div class="relative z-10">
          <RouterLink class="inline-flex items-center gap-3 text-[#2d3748]" to="/dashboard">
            <span class="flex h-12 w-12 items-center justify-center rounded-[14px] border-[3px] border-[#2d3748] bg-[#fdbcb4] text-[#2d3748] shadow-[4px_4px_0_#2d3748]">
              <BookOpen class="h-6 w-6" />
            </span>
            <span class="text-4xl font-black">知径</span>
          </RouterLink>
          <p class="mt-8 max-w-xl text-2xl font-black leading-10 text-[#2d3748]">把自己的资料变成可练、可问、可复盘的学习路径</p>
          <div class="mt-16 grid max-w-[520px] gap-5 sm:grid-cols-2">
            <div v-for="(item, index) in highlights" :key="item.label" class="pro-mini-card">
              <div class="flex items-center gap-3">
                <span class="flex h-9 w-9 items-center justify-center rounded-[10px] border-[3px] border-[#2d3748]" :class="index % 2 ? 'bg-[#add8e6]' : 'bg-[#98ff98]'">
                  <component :is="item.icon" class="h-4 w-4 text-[#2d3748]" />
                </span>
                <p class="text-base font-black text-[#2d3748]">{{ item.label }}</p>
              </div>
              <div class="mt-4 h-3 rounded-full border-[3px] border-[#2d3748] bg-[#e2e8f0]">
                <div class="h-full rounded-full" :class="index % 2 ? 'w-2/3 bg-[#add8e6]' : 'w-1/2 bg-[#22c55e]'"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="pro-auth-form-panel">
        <form class="pro-auth-form" @submit.prevent="submit">
          <p class="pro-kicker">
            <Sparkles class="h-4 w-4" />
            AI 驱动自助学习平台
          </p>
          <h1 class="mt-6 text-[28px] font-black text-[#2d3748]">登录页</h1>
          <p class="mt-2 text-sm font-semibold leading-6 text-[#64748b]">欢迎回来，继续今天的学习计划。</p>

        <label class="pro-field-label mt-8">
          手机号或邮箱
          <input v-model="form.account" class="pro-auth-input" placeholder="请输入手机号或邮箱" required />
        </label>
        <label class="pro-field-label mt-4">
          密码
          <input v-model="form.password" class="pro-auth-input" placeholder="至少 6 位" type="password" required />
        </label>

        <div class="mt-5 flex items-center justify-between text-sm font-black">
          <span class="text-[#64748b]">记住登录</span>
          <button class="pro-switch" data-on="true" type="button" aria-label="记住登录"></button>
        </div>

        <p v-if="error" class="mt-3 rounded-[10px] border-[3px] border-[#2d3748] bg-[#fff2b8] px-3 py-2 text-sm font-black text-[#b7791f]">{{ error }}</p>

        <button class="pro-primary-button mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60" :disabled="loading" type="submit">
          <RefreshCw v-if="loading" class="h-4 w-4 animate-spin" />
          登录
        </button>

        <div class="mt-6 flex items-center justify-between text-sm font-black">
          <button class="text-[#22c55e]" type="button" @click="forgotOpen = true">忘记密码</button>
          <RouterLink class="text-[#22c55e]" to="/auth/register">还没有账号，立即注册</RouterLink>
        </div>
      </form>
    </section>
    </section>

    <ProModal
      :open="forgotOpen"
      title="重置密码"
      code="M01. 忘记密码弹窗"
      description="输入注册邮箱或手机号，我们会发送验证码。"
      width="440px"
      @close="forgotOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-field">
          <span class="pro-label">账号</span>
          <input v-model="forgotForm.account" class="pro-input" placeholder="邮箱或手机号" />
        </div>
        <div class="pro-field">
          <span class="pro-label">验证码</span>
          <div class="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input v-model="forgotForm.code" class="pro-input" placeholder="6 位验证码" />
            <button class="pro-btn pro-btn-secondary" type="button" @click="codeSent = true">{{ codeSent ? '重新发送' : '发送验证码' }}</button>
          </div>
        </div>
        <div class="pro-field">
          <span class="pro-label">新密码</span>
          <input v-model="forgotForm.password" class="pro-input" type="password" placeholder="至少 6 位" />
        </div>
        <div class="pro-field">
          <span class="pro-label">确认密码</span>
          <input v-model="forgotForm.confirmPassword" class="pro-input" type="password" placeholder="再次输入新密码" />
        </div>
        <p v-if="forgotMessage" class="rounded-[8px] border-[3px] border-[#2d3748] bg-[#fff9f2] px-4 py-3 text-sm font-bold text-[#b7791f]">{{ forgotMessage }}</p>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="forgotOpen = false">取消</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="resetPassword">确认重置</button>
      </template>
    </ProModal>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { BookOpen, FileQuestion, Layers, RefreshCw, Sparkles, UploadCloud } from '@lucide/vue'
import { api, saveSession } from '../../api/client'
import ProModal from '../../components/common/ProModal.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const error = ref('')
const forgotOpen = ref(false)
const codeSent = ref(false)
const forgotMessage = ref('')
const form = reactive({
  account: 'student@example.com',
  password: '12345678',
})
const forgotForm = reactive({
  account: '',
  code: '',
  password: '',
  confirmPassword: '',
})

const highlights = [
  { label: '上传资料', text: '资料自动进入学习包。', icon: UploadCloud },
  { label: '智能练习', text: '围绕章节生成题目。', icon: FileQuestion },
  { label: '卡片复习', text: '把薄弱点变成记忆卡。', icon: Layers },
]

const submit = async () => {
  loading.value = true
  error.value = ''
  try {
    const payload = await api.login(form)
    saveSession(payload)
    router.push(String(route.query.redirect ?? '/dashboard'))
  } catch (err) {
    error.value = err instanceof Error ? err.message : '登录失败，请检查账号和密码。'
  } finally {
    loading.value = false
  }
}

const resetPassword = () => {
  if (!forgotForm.account || !forgotForm.code || !forgotForm.password) {
    forgotMessage.value = '请填写账号、验证码和新密码。'
    return
  }
  if (forgotForm.password !== forgotForm.confirmPassword) {
    forgotMessage.value = '两次密码不一致。'
    return
  }
  forgotMessage.value = '密码已重置，请使用新密码登录。'
}
</script>

<style scoped>
</style>
