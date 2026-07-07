<template>
  <div class="min-h-svh bg-[#fff9f2] pb-20 md:pb-0">
    <aside class="fixed bottom-6 left-6 top-28 z-30 hidden w-[218px] rounded-[24px] border-[3px] border-[#2d3748] bg-white px-4 py-5 shadow-[6px_6px_0_#2d3748] md:flex md:flex-col">
      <RouterLink class="flex items-center gap-3 rounded-[16px] border-[3px] border-[#2d3748] bg-[#98ff98] px-2 py-2" to="/dashboard">
        <div class="flex h-10 w-10 items-center justify-center rounded-[12px] border-[3px] border-[#2d3748] bg-[#fdbcb4] text-[#2d3748]">
          <BookOpen class="h-5 w-5" />
        </div>
        <div>
          <p class="text-lg font-black text-[#2d3748]">知径</p>
          <p class="text-xs font-bold text-[#64748b]">学习永无止境</p>
        </div>
      </RouterLink>

      <nav class="mt-7 flex flex-1 flex-col gap-1">
        <RouterLink
          v-for="item in primaryNav"
          :key="item.to"
          class="flex h-10 items-center gap-3 rounded-[14px] px-3 text-sm font-black text-[#64748b] transition hover:bg-[#fffaf4] hover:text-[#2d3748]"
          :class="isActive(item) ? 'border-[3px] border-[#2d3748] bg-[#98ff98] text-[#2d3748]' : ''"
          :to="item.to"
        >
          <component :is="item.icon" class="h-4 w-4" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="space-y-1 border-t-[3px] border-[#2d3748] pt-4">
        <RouterLink
          v-for="item in secondaryNav"
          :key="item.to"
          class="flex h-10 items-center gap-3 rounded-[14px] px-3 text-sm font-black text-[#64748b] transition hover:bg-[#fffaf4] hover:text-[#2d3748]"
          :to="item.to"
        >
          <component :is="item.icon" class="h-4 w-4" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </div>
    </aside>

    <header class="sticky top-0 z-20 px-4 py-4 md:px-6">
      <div class="mx-auto flex h-[70px] max-w-[1040px] items-center gap-3 rounded-[28px] border-[3px] border-[#2d3748] bg-white px-4 shadow-[8px_8px_0_#2d3748]">
        <div class="flex flex-1 items-center gap-2 rounded-[18px] border-[3px] border-[#2d3748] bg-[#fffaf4] px-3 py-2 text-sm font-bold text-[#64748b]">
          <Search class="h-4 w-4" />
          <span class="hidden sm:inline">搜索学习包、章节、错题、卡片</span>
          <span class="sm:hidden">搜索</span>
        </div>

        <button
          class="hidden h-9 items-center gap-2 rounded-[15px] border-[3px] border-[#2d3748] bg-white px-3 text-sm font-black text-[#2d3748] transition hover:bg-[#fffaf4] sm:inline-flex"
          type="button"
          @click="$emit('check-backend')"
        >
          <Wifi v-if="backendStatus === 'connected'" class="h-4 w-4 text-[#2f855a]" />
          <RefreshCw v-else-if="backendStatus === 'checking'" class="h-4 w-4 animate-spin text-[#2f6f9f]" />
          <WifiOff v-else class="h-4 w-4 text-[#b7791f]" />
          {{ backendLabel }}
        </button>

        <button class="hidden h-9 items-center gap-2 rounded-[15px] border-[3px] border-[#2d3748] bg-[#22c55e] px-3 text-sm font-black text-white shadow-[4px_4px_0_#2d3748] transition sm:inline-flex" type="button" @click="globalAiOpen = true">
          <Sparkles class="h-4 w-4" />
          AI 提问
        </button>

        <button class="flex h-9 w-9 items-center justify-center rounded-[14px] border-[3px] border-[#2d3748] bg-white text-[#64748b] shadow-[4px_4px_0_#2d3748] transition hover:bg-[#fffaf4]" type="button" aria-label="通知">
          <Bell class="h-4 w-4" />
        </button>
        <div class="relative">
          <button class="flex h-10 items-center gap-2 rounded-[18px] border-[3px] border-[#2d3748] bg-white py-1 pl-1 pr-3 text-sm font-black text-[#2d3748] shadow-[4px_4px_0_#2d3748] transition hover:bg-[#fffaf4]" type="button" @click="profileMenuOpen = !profileMenuOpen">
            <span class="flex h-8 w-8 items-center justify-center rounded-[12px] border-[3px] border-[#2d3748] bg-[#fff2b8] text-sm font-black text-[#2d3748]">{{ avatarText }}</span>
            <span class="hidden max-w-20 truncate lg:inline">{{ nickname }}</span>
            <ChevronDown class="h-4 w-4 text-[#66736b]" />
          </button>
          <div v-if="profileMenuOpen" class="absolute right-0 mt-3 w-56 rounded-[14px] border-[3px] border-[#2d3748] bg-white p-2 shadow-[6px_6px_0_#2d3748]">
            <RouterLink v-for="item in profileMenu" :key="item.to" class="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#1f2a24] transition hover:bg-[#eef4ef]" :to="item.to" @click="profileMenuOpen = false">
              <component :is="item.icon" class="h-4 w-4 text-[#66736b]" />
              {{ item.label }}
            </RouterLink>
            <button class="mt-1 flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold text-[#c44b3f] transition hover:bg-[#fff0ee]" type="button" @click="logout">
              <LogOut class="h-4 w-4" />
              退出登录
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="px-4 py-5 md:pl-[266px] md:pr-6 md:py-6">
      <div class="mx-auto w-full max-w-[1440px]">
        <slot />
      </div>
    </main>

    <nav class="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[#dce4dd] bg-white px-2 py-2 md:hidden">
      <RouterLink
        v-for="item in mobileNav"
        :key="item.to"
        class="flex flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium text-[#66736b]"
        :class="isActive(item) ? 'bg-[#e8f3ed] text-[#1f7a5a]' : ''"
        :to="item.to"
      >
        <component :is="item.icon" class="h-4 w-4" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <button class="fixed bottom-24 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#2d3748] bg-[#22c55e] text-white shadow-[6px_6px_0_#2d3748] md:bottom-6" type="button" aria-label="问问知径" @click="globalAiOpen = true">
      <Sparkles class="h-5 w-5" />
    </button>

    <ProModal
      :open="globalAiOpen"
      title="问问知径"
      code="M20. 全局 AI 快捷提问弹窗"
      description="在任何页面快速唤起 AI 学习助手，并自动识别当前页面上下文。"
      width="720px"
      @close="globalAiOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-panel">
          <p class="text-sm font-black text-[#2d3748]">当前上下文提示</p>
          <p class="mt-2 text-sm leading-6 text-[#64748b]">{{ currentContext }}</p>
        </div>
        <div class="pro-field">
          <span class="pro-label">学习包选择器</span>
          <select v-model="aiPack" class="pro-select">
            <option v-if="packs.length === 0" value="">暂无学习包</option>
            <option v-for="pack in packs" :key="pack.id" :value="pack.id">{{ pack.title }}</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">章节选择器</span>
          <select v-model="aiChapter" class="pro-select">
            <option>第一章 基础概念</option>
            <option>第二章 重点训练</option>
            <option>第三章 综合复盘</option>
          </select>
        </div>
        <div class="rounded-[8px] border-[3px] border-[#2d3748] bg-white p-4">
          <div class="space-y-3">
            <div class="max-w-[85%] rounded-[8px] border-[3px] border-[#2d3748] bg-[#f0fff0] p-3 text-sm leading-6 text-[#2d3748]">我可以基于当前页面，帮你解释章节、生成练习题、做错题分析或总结今天学习。</div>
            <div v-if="aiReply" class="ml-auto max-w-[85%] rounded-[8px] border-[3px] border-[#2d3748] bg-[#add8e6] p-3 text-sm leading-6 text-[#2d3748]">{{ aiReply }}</div>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button v-for="action in aiQuickActions" :key="action" class="pro-chip" type="button" @click="aiQuestion = action">{{ action }}</button>
        </div>
        <div class="pro-field">
          <span class="pro-label">输入框</span>
          <textarea v-model="aiQuestion" class="pro-textarea" placeholder="输入你的问题，例如：帮我分析今天的错题。"></textarea>
        </div>
      </div>
      <template #footer>
        <RouterLink class="pro-btn pro-btn-secondary" :to="aiPack ? `/packs/${aiPack}/qa` : '/packs/new'" @click="globalAiOpen = false">打开完整问答页</RouterLink>
        <button class="pro-btn pro-btn-primary" :disabled="!aiPack" type="button" @click="sendGlobalAi">发送</button>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type Component } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  Bell,
  BookOpen,
  Bot,
  ChevronDown,
  ClipboardList,
  Layers,
  LayoutDashboard,
  ListTodo,
  LogOut,
  MapPinned,
  MessagesSquare,
  NotebookPen,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Timer,
  Trophy,
  UserRound,
  Wifi,
  WifiOff,
} from '@lucide/vue'
import { api, clearSession, getCurrentUser, type BackendStatus, type LearningPack } from '../../api/client'
import ProModal from '../common/ProModal.vue'

const props = defineProps<{
  backendStatus: BackendStatus
}>()

defineEmits<{
  'check-backend': []
}>()

const route = useRoute()
const router = useRouter()
const profileMenuOpen = ref(false)
const globalAiOpen = ref(false)
const packs = ref<LearningPack[]>([])
const aiPack = ref('')
const aiChapter = ref('第一章 基础概念')
const aiQuestion = ref('')
const aiReply = ref('')
const currentUser = getCurrentUser() ?? { nickname: '用户' }
const nickname = computed(() => String(currentUser.nickname ?? '用户'))
const avatarText = computed(() => nickname.value.slice(0, 1))

type NavItem = {
  label: string
  to: string
  icon: Component
  active?: (path: string) => boolean
}

const primaryNav: NavItem[] = [
  { label: '学习首页', to: '/dashboard', icon: LayoutDashboard },
  {
    label: '学习包',
    to: '/packs',
    icon: BookOpen,
    active: (path) =>
      path === '/packs' ||
      path === '/packs/new' ||
      /^\/packs\/[^/]+$/.test(path) ||
      /^\/packs\/[^/]+\/(chapters|question-bank)$/.test(path),
  },
  { label: 'AI 问答', to: '/packs', icon: Bot, active: (path) => /^\/packs\/[^/]+\/qa$/.test(path) },
  { label: '错题本', to: '/wrong-book', icon: NotebookPen },
  { label: '记忆卡片', to: '/packs', icon: Layers, active: (path) => /^\/packs\/[^/]+\/flashcards$/.test(path) },
  { label: '学习任务', to: '/tasks', icon: ListTodo },
  { label: '专注打卡', to: '/focus', icon: Timer },
  { label: '排行榜', to: '/ranking', icon: Trophy },
  { label: '社区圈子', to: '/community', icon: MessagesSquare },
  { label: '院校目标', to: '/target', icon: MapPinned },
  { label: '个人中心', to: '/profile', icon: UserRound },
]

const secondaryNav = [
  { label: '学习偏好设置', to: '/settings', icon: Settings },
  { label: 'AI 密钥设置', to: '/settings/ai-provider', icon: Bot },
]

const profileMenu = [
  { label: '个人中心', to: '/profile', icon: UserRound },
  { label: '学习报告', to: '/profile/reports', icon: ClipboardList },
  { label: '学习偏好', to: '/settings', icon: Settings },
]

const aiQuickActions = ['解释当前章节', '生成练习题', '生成记忆卡片', '总结今天学习', '分析错题']
const currentContext = computed(() => `当前页面：${String(route.meta.title ?? '学习工作台')}。系统会把页面上下文带入 AI 学习助手。`)

const mobileNav = primaryNav.slice(0, 5)

watch(packs, (items) => {
  if (!aiPack.value && items[0]) {
    aiPack.value = items[0].id
  }
})

onMounted(async () => {
  try {
    packs.value = await api.getPacks()
  } catch {
    packs.value = []
  }
})

const backendLabel = computed(() => {
  if (props.backendStatus === 'connected') return '后端已连接'
  if (props.backendStatus === 'checking') return '检测中'
  return '后端未连接'
})

const isActive = (item: NavItem) => item.active?.(route.path) ?? (route.path === item.to || (item.to !== '/dashboard' && route.path.startsWith(`${item.to}/`)))

const logout = () => {
  clearSession()
  profileMenuOpen.value = false
  router.push('/auth/login')
}

const sendGlobalAi = async () => {
  if (!aiPack.value) {
    aiReply.value = '请先创建学习包，再使用 AI 问答。'
    return
  }
  if (!aiQuestion.value.trim()) {
    aiReply.value = '请选择一个快捷动作或输入问题后再发送。'
    return
  }
  try {
    const answer = await api.askAi({ packId: aiPack.value, question: aiQuestion.value })
    aiReply.value = answer.answer ?? answer.content ?? 'AI 已返回结果，请结合资料复核。'
  } catch (err) {
    aiReply.value = err instanceof Error ? err.message : 'AI 问答失败，请稍后重试。'
  }
}
</script>

<style scoped>
</style>
