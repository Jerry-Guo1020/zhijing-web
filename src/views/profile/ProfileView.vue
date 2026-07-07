<template>
  <div>
    <PageHeader title="个人中心" eyebrow="学习画像" description="汇总账号信息、目标院校、学习报告、最近活动和关键学习指标。">
      <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="editOpen = true">
        <Pencil class="h-4 w-4" />
        编辑资料
      </button>
    </PageHeader>

    <section class="grid gap-5 xl:grid-cols-[360px_1fr]">
      <aside class="space-y-5">
        <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
          <div class="flex items-center gap-4">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-[#d99a26] text-xl font-bold text-white">{{ avatarText }}</div>
            <div class="min-w-0">
              <h2 class="truncate text-lg font-bold text-[#1f2a24]">{{ profile.nickname || '小郭同学' }}</h2>
              <p class="mt-1 truncate text-sm text-[#66736b]">{{ profile.email || 'student@example.com' }}</p>
            </div>
          </div>
          <div class="mt-5 grid grid-cols-2 gap-3">
            <div class="rounded-lg bg-[#f6f8f5] p-4">
              <p class="text-xl font-bold text-[#1f2a24]">12</p>
              <p class="mt-1 text-xs text-[#66736b]">连续学习天</p>
            </div>
            <div class="rounded-lg bg-[#f6f8f5] p-4">
              <p class="text-xl font-bold text-[#1f2a24]">126h</p>
              <p class="mt-1 text-xs text-[#66736b]">累计学习</p>
            </div>
          </div>
          <div class="mt-5 space-y-3">
            <RouterLink v-for="link in quickLinks" :key="link.to" class="flex items-center justify-between rounded-lg bg-[#f6f8f5] px-4 py-3 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" :to="link.to">
              <span class="inline-flex items-center gap-2">
                <component :is="link.icon" class="h-4 w-4 text-[#1f7a5a]" />
                {{ link.label }}
              </span>
              <ChevronRight class="h-4 w-4" />
            </RouterLink>
          </div>
        </div>

        <div class="rounded-lg border border-[#dce4dd] bg-[#eef4ef] p-5">
          <h2 class="text-lg font-bold text-[#1f2a24]">目标院校</h2>
          <p class="mt-3 text-2xl font-bold text-[#1f2a24]">南京大学</p>
          <p class="mt-2 text-sm text-[#66736b]">计算机科学与技术 · 目标 395 分</p>
          <RouterLink class="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-white text-sm font-semibold text-[#1f7a5a]" to="/target">查看目标规划</RouterLink>
        </div>
      </aside>

      <div class="space-y-5">
        <div class="grid gap-4 md:grid-cols-3">
          <StatCard label="完成任务" value="48" hint="本周完成 9 项" :icon="CheckCircle2" />
          <StatCard label="错题复练" value="31" hint="已掌握 12 道" :icon="NotebookPen" />
          <StatCard label="社区回复" value="15" hint="收到 6 条帮助" :icon="MessagesSquare" />
        </div>

        <section class="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
            <h2 class="text-lg font-bold text-[#1f2a24]">最近学习活动</h2>
            <div class="mt-4 space-y-3">
              <article v-for="activity in activities" :key="activity.title" class="flex gap-3 rounded-lg bg-[#f6f8f5] p-4">
                <div class="mt-1 h-2.5 w-2.5 rounded-full bg-[#1f7a5a]"></div>
                <div>
                  <p class="font-semibold text-[#1f2a24]">{{ activity.title }}</p>
                  <p class="mt-1 text-sm text-[#66736b]">{{ activity.text }}</p>
                </div>
              </article>
            </div>
          </div>

          <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
            <h2 class="text-lg font-bold text-[#1f2a24]">本周节奏</h2>
            <div class="mt-5 flex h-40 items-end gap-2">
              <div v-for="bar in bars" :key="bar" class="flex-1 rounded-t-md bg-[#1f7a5a]" :style="{ height: `${bar}%` }"></div>
            </div>
            <p class="mt-4 text-sm leading-6 text-[#66736b]">周五学习峰值最高，周日建议安排错题复盘和下周任务拆解。</p>
          </div>
        </section>
      </div>
    </section>

    <ProModal
      :open="editOpen"
      title="编辑个人资料"
      code="M18. 编辑个人资料弹窗"
      description="更新头像、昵称、个人简介、学习目标和所在地区。"
      width="680px"
      @close="editOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-field">
          <span class="pro-label">头像上传</span>
          <div class="flex items-center gap-4">
            <div class="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#2d3748] bg-[#d99a26] text-xl font-black text-white">{{ editForm.nickname.slice(0, 1) || '郭' }}</div>
            <button class="pro-btn pro-btn-secondary" type="button">选择头像</button>
          </div>
        </div>
        <div class="pro-field">
          <span class="pro-label">昵称</span>
          <input v-model="editForm.nickname" class="pro-input" maxlength="18" />
        </div>
        <div class="pro-field">
          <span class="pro-label">个人简介</span>
          <textarea v-model="editForm.bio" class="pro-textarea" maxlength="120"></textarea>
        </div>
        <div class="pro-field">
          <span class="pro-label">学习目标</span>
          <textarea v-model="editForm.studyGoal" class="pro-textarea" maxlength="160"></textarea>
        </div>
        <div class="pro-field">
          <span class="pro-label">所在地区</span>
          <input v-model="editForm.region" class="pro-input" />
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="editOpen = false">取消</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="saveProfile">保存</button>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Bot, CheckCircle2, ChevronRight, ClipboardList, Layers, MessagesSquare, NotebookPen, Pencil, Settings } from '@lucide/vue'
import { api, getCurrentUser } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import ProModal from '../../components/common/ProModal.vue'
import StatCard from '../../components/common/StatCard.vue'

const profile = ref<any>(getCurrentUser() ?? {})
const editOpen = ref(false)
const editForm = ref({
  nickname: String(profile.value.nickname ?? '小郭同学'),
  bio: '喜欢把错题拆成可复练的小步骤。',
  studyGoal: '稳定完成考研英语、高数与专业课复盘。',
  region: '江苏 南京',
})
const avatarText = computed(() => String(profile.value.nickname ?? '郭').slice(0, 1))
const bars = [38, 52, 48, 65, 82, 74, 68]
const quickLinks = [
  { label: '学习报告', to: '/profile/reports', icon: ClipboardList },
  { label: '记忆卡片', to: '/packs/pack-english/flashcards', icon: Layers },
  { label: 'AI 密钥设置', to: '/settings/ai-provider', icon: Bot },
  { label: '学习偏好', to: '/settings', icon: Settings },
]
const activities = [
  { title: '完成英语阅读错题复练', text: '重做 6 道错题，主旨题正确率提升到 78%。' },
  { title: '创建语文阅读理解学习包', text: '已拖入文本资料，等待 AI 解析章节。' },
  { title: '发布错题求助帖', text: '社区收到 3 条回复，建议补充题干定位过程。' },
]

onMounted(async () => {
  try {
    profile.value = await api.getProfile()
  } catch {
    profile.value = getCurrentUser() ?? { nickname: '小郭同学', email: 'student@example.com' }
  }
})

const saveProfile = () => {
  profile.value = { ...profile.value, nickname: editForm.value.nickname, bio: editForm.value.bio, studyGoal: editForm.value.studyGoal, region: editForm.value.region }
  editOpen.value = false
}
</script>
