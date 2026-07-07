<template>
  <main class="pro-auth-shell">
    <section class="pro-auth-frame" data-mode="split">
      <div class="pro-auth-story">
        <div class="relative z-10">
          <RouterLink class="inline-flex items-center gap-3 text-[#2d3748]" to="/auth/login">
            <span class="flex h-12 w-12 items-center justify-center rounded-[14px] border-[3px] border-[#2d3748] bg-[#fdbcb4] text-[#2d3748] shadow-[4px_4px_0_#2d3748]">
              <BookOpen class="h-6 w-6" />
            </span>
            <span class="text-4xl font-black">知径</span>
          </RouterLink>
          <p class="mt-8 max-w-xl text-2xl font-black leading-10 text-[#2d3748]">创建账号后，建立你的第一条 AI 学习路径</p>
          <div class="mt-16 grid max-w-[520px] gap-5 sm:grid-cols-2">
            <div v-for="(step, index) in registerSteps" :key="step" class="pro-mini-card">
              <div class="flex items-center gap-3">
                <span class="flex h-9 w-9 items-center justify-center rounded-[10px] border-[3px] border-[#2d3748] text-sm font-black text-[#2d3748]" :class="index % 2 ? 'bg-[#add8e6]' : 'bg-[#98ff98]'">{{ index + 1 }}</span>
                <p class="text-base font-black text-[#2d3748]">{{ step }}</p>
              </div>
              <div class="mt-4 h-3 rounded-full border-[3px] border-[#2d3748] bg-[#e2e8f0]">
                <div class="h-full rounded-full bg-[#22c55e]" :style="{ width: `${50 + index * 12}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="pro-auth-form-panel">
        <form class="pro-auth-form" @submit.prevent="submit">
          <p class="pro-kicker">AI-Powered Learning</p>
          <h1 class="mt-6 text-[28px] font-black text-[#2d3748]">注册页</h1>
          <p class="mt-2 text-sm font-semibold leading-6 text-[#64748b]">创建账号后，建立你的第一条 AI 学习路径。</p>

          <label class="pro-field-label mt-8">
            昵称
            <input v-model="form.nickname" class="pro-auth-input" placeholder="请输入昵称" required />
          </label>
          <label class="pro-field-label mt-4">
            邮箱
            <input v-model="form.email" class="pro-auth-input" placeholder="请输入邮箱" type="email" />
          </label>
          <label class="pro-field-label mt-4">
            手机号
            <input v-model="form.phone" class="pro-auth-input" placeholder="13800138000" />
          </label>
          <label class="pro-field-label mt-4">
            密码
            <input v-model="form.password" class="pro-auth-input" placeholder="至少 6 位" type="password" required />
          </label>

          <label class="mt-5 flex items-center gap-3 rounded-[10px] border-[3px] border-[#2d3748] bg-[#fffaf4] px-4 py-3 text-xs font-black leading-5 text-[#64748b]">
            <input class="h-4 w-4 accent-[#22c55e]" type="checkbox" checked />
            我同意学习数据仅用于个人复盘与 AI 建议
          </label>

          <label class="pro-field-label mt-4">
            学习目标
            <textarea v-model="form.studyGoal" class="pro-auth-input min-h-24 py-3" placeholder="例如：考研英语强化、期末高数冲刺"></textarea>
          </label>

          <p v-if="error" class="mt-3 rounded-[10px] border-[3px] border-[#2d3748] bg-[#fff2b8] px-3 py-2 text-sm font-black text-[#b7791f]">{{ error }}</p>

          <button class="pro-primary-button mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60" :disabled="loading" type="submit">
            <RefreshCw v-if="loading" class="h-4 w-4 animate-spin" />
            创建账号
          </button>
          <RouterLink class="mt-6 block text-center text-sm font-black text-[#22c55e]" to="/auth/login">已有账号，去登录</RouterLink>
        </form>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { BookOpen, RefreshCw } from '@lucide/vue'
import { api, saveSession } from '../../api/client'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = reactive({
  nickname: '',
  email: '',
  phone: '',
  password: '',
  studyGoal: '',
})
const registerSteps = ['上传资料', '生成章节', '智能练习', '错题复盘']

const submit = async () => {
  loading.value = true
  error.value = ''
  try {
    const payload = await api.register({
      nickname: form.nickname,
      email: form.email || undefined,
      phone: form.phone || undefined,
      password: form.password,
      studyGoal: form.studyGoal || undefined,
    })
    saveSession(payload)
    router.push('/settings/ai-provider')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '注册失败，请检查填写内容。'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
