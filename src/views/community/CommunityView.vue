<template>
  <div>
    <PageHeader title="社区圈子" eyebrow="互助分享" description="围绕学习方法、错题求助、AI 回答求证和复盘经验进行讨论。">
      <div class="flex gap-2">
        <button class="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dce4dd] bg-white px-4 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="quickPostOpen = true">
          <MessageSquarePlus class="h-4 w-4" />
          快速发布
        </button>
        <RouterLink class="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" to="/community/new">
          <PenLine class="h-4 w-4" />
          发布帖子
        </RouterLink>
      </div>
    </PageHeader>

    <div class="mb-5 flex flex-wrap gap-2">
      <button v-for="tab in tabs" :key="tab" class="h-9 rounded-lg px-3 text-sm font-semibold transition" :class="activeTab === tab ? 'bg-[#1f7a5a] text-white' : 'border border-[#dce4dd] bg-white text-[#66736b] hover:bg-[#eef4ef]'" type="button" @click="activeTab = tab">{{ tab }}</button>
    </div>

    <section class="grid gap-5 xl:grid-cols-[1fr_340px]">
      <div class="space-y-4">
        <RouterLink v-for="post in filteredPosts" :key="post.id" class="block rounded-lg border border-[#dce4dd] bg-white p-5 transition hover:border-[#b8cfc0]" :to="`/community/${post.id}`">
          <div class="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span class="rounded-full bg-[#eef4ef] px-2 py-1 text-[#1f7a5a]">{{ post.type }}</span>
            <span class="rounded-full bg-[#f6f8f5] px-2 py-1 text-[#66736b]">{{ post.pack }}</span>
            <span class="text-[#66736b]">{{ post.createdAt }}</span>
          </div>
          <h2 class="mt-3 text-lg font-bold text-[#1f2a24]">{{ post.title }}</h2>
          <p class="mt-2 text-sm leading-6 text-[#66736b]">{{ post.excerpt }}</p>
          <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2 text-sm text-[#66736b]">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#d99a26] font-bold text-white">{{ post.author.slice(0, 1) }}</span>
              {{ post.author }}
            </div>
            <div class="flex items-center gap-4 text-sm text-[#66736b]">
              <span class="inline-flex items-center gap-1"><ThumbsUp class="h-4 w-4" />{{ post.likes }}</span>
              <span class="inline-flex items-center gap-1"><MessageCircle class="h-4 w-4" />{{ post.replies }}</span>
            </div>
          </div>
        </RouterLink>
      </div>

      <aside class="space-y-5">
        <div class="rounded-lg border border-[#dce4dd] bg-[#eef4ef] p-5">
          <h2 class="text-lg font-bold text-[#1f2a24]">热门话题</h2>
          <div class="mt-4 flex flex-wrap gap-2">
            <span v-for="topic in topics" :key="topic" class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1f7a5a]"># {{ topic }}</span>
          </div>
        </div>
        <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
          <h2 class="text-lg font-bold text-[#1f2a24]">我的动态</h2>
          <div class="mt-4 grid gap-3 text-sm text-[#66736b]">
            <p>本周发帖 2 篇</p>
            <p>收到回复 15 条</p>
            <p>收藏复盘模板 4 个</p>
          </div>
        </div>
      </aside>
    </section>

    <ProModal
      :open="quickPostOpen"
      title="分享到社区"
      code="M16. 分享到社区弹窗"
      description="把学习内容自然转成社区帖子草稿。"
      width="760px"
      @close="quickPostOpen = false"
    >
      <form class="space-y-4" @submit.prevent="publishQuickPost">
        <div class="pro-field">
          <span class="pro-label">分享类型</span>
          <select v-model="quickPost.type" class="pro-select">
            <option v-for="type in postTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">自动生成标题</span>
          <input v-model="quickPost.title" class="pro-input" required placeholder="例如：英语阅读主旨题错因求助" />
        </div>
        <div class="pro-field">
          <span class="pro-label">正文草稿</span>
          <textarea v-model="quickPost.content" class="pro-textarea" required placeholder="描述你的问题、资料来源、希望大家帮忙看的点。"></textarea>
        </div>
        <div class="pro-field">
          <span class="pro-label">隐私检查</span>
          <button class="pro-switch" :data-on="privacyChecked" type="button" @click="privacyChecked = !privacyChecked"></button>
        </div>
        <div class="pro-field">
          <span class="pro-label">发布到社区</span>
          <button class="pro-switch" :data-on="publishToCommunity" type="button" @click="publishToCommunity = !publishToCommunity"></button>
        </div>
        <div class="pro-panel">
          <p class="text-sm font-black text-[#2d3748]">关联内容预览</p>
          <p class="mt-2 text-sm leading-6 text-[#64748b]">AI 生成内容仅供讨论。发布前建议检查是否包含个人隐私、完整题库答案或未授权资料。</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <span class="pro-chip">错题求助</span>
            <span class="pro-chip">学习包</span>
            <span class="pro-chip">复盘</span>
          </div>
        </div>
      </form>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="quickPostOpen = false">取消</button>
        <RouterLink class="pro-btn pro-btn-soft" to="/community/new" @click="quickPostOpen = false">去编辑完整帖子</RouterLink>
        <button class="pro-btn pro-btn-primary" type="button" @click="publishQuickPost">发布</button>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { MessageCircle, MessageSquarePlus, PenLine, ThumbsUp } from '@lucide/vue'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import ProModal from '../../components/common/ProModal.vue'
import { mockPosts } from '../../data/mock'

const tabs = ['全部', '提问互助', '错题求助', '学习复盘', '经验分享', 'AI 回答求证']
const postTypes = [
  { label: '提问互助', value: 'help' },
  { label: '错题求助', value: 'wrong_question' },
  { label: '学习复盘', value: 'review' },
  { label: '经验分享', value: 'experience' },
  { label: 'AI 回答求证', value: 'ai_verification' },
]
const topics = ['错题复练', '资料整理', '英语阅读', '目标院校', 'AI 回答求证']
const activeTab = ref('全部')
const quickPostOpen = ref(false)
const privacyChecked = ref(true)
const publishToCommunity = ref(true)
const posts = ref<any[]>(mockPosts)
const quickPost = reactive({ type: 'help', title: '', content: '' })

const normalizeType = (type: string) => postTypes.find((item) => item.value === type)?.label ?? type
const filteredPosts = computed(() => posts.value.filter((post) => activeTab.value === '全部' || normalizeType(post.type) === activeTab.value || post.type === activeTab.value))

const publishQuickPost = async () => {
  try {
    await api.createCommunityPost(quickPost)
  } catch {
    posts.value = [
      {
        id: `post-local-${Date.now()}`,
        type: normalizeType(quickPost.type),
        title: quickPost.title,
        excerpt: quickPost.content,
        author: '郭同学',
        replies: 0,
        likes: 0,
        createdAt: '刚刚',
        tags: [],
        pack: '未关联学习包',
      },
      ...posts.value,
    ]
  }
  quickPostOpen.value = false
  quickPost.title = ''
  quickPost.content = ''
}

onMounted(async () => {
  try {
    const data = await api.getCommunityPosts()
    posts.value = data.length ? data : mockPosts
  } catch {
    posts.value = mockPosts
  }
})
</script>
