<template>
  <div>
    <PageHeader title="发布帖子" eyebrow="社区内容" description="发布学习讨论、错题求助、复盘分享或 AI 回答求证内容。">
      <RouterLink class="inline-flex h-10 items-center justify-center rounded-lg border border-[#dce4dd] bg-white px-4 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" to="/community">返回社区</RouterLink>
    </PageHeader>

    <form class="grid gap-5 xl:grid-cols-[1fr_340px]" @submit.prevent="publish">
      <section class="rounded-lg border border-[#dce4dd] bg-white p-5">
        <div class="grid gap-4 md:grid-cols-2">
          <label class="text-sm font-semibold text-[#1f2a24]">
            分类
            <select v-model="form.type" class="mt-2 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 outline-none focus:border-[#1f7a5a]">
              <option v-for="type in postTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
            </select>
          </label>
          <label class="text-sm font-semibold text-[#1f2a24]">
            关联学习包
            <select v-model="form.packId" class="mt-2 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 outline-none focus:border-[#1f7a5a]">
              <option value="">不关联</option>
              <option v-for="pack in packs" :key="pack.id" :value="pack.id">{{ pack.title }}</option>
            </select>
          </label>
        </div>
        <label class="mt-4 block text-sm font-semibold text-[#1f2a24]">
          标题
          <input v-model="form.title" class="mt-2 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 outline-none focus:border-[#1f7a5a]" maxlength="60" placeholder="例如：这道阅读主旨题错因该怎么写？" required />
        </label>
        <label class="mt-4 block text-sm font-semibold text-[#1f2a24]">
          正文
          <textarea v-model="form.content" class="mt-2 min-h-72 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 py-3 leading-7 outline-none focus:border-[#1f7a5a]" placeholder="描述你的问题、复盘过程、已尝试的方法，以及希望大家帮忙看的点。" required></textarea>
        </label>
        <label class="mt-4 block text-sm font-semibold text-[#1f2a24]">
          标签
          <input v-model="tagInput" class="mt-2 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 outline-none focus:border-[#1f7a5a]" placeholder="用逗号分隔，例如 错题本,英语阅读,AI求证" />
        </label>
        <p v-if="message" class="mt-4 rounded-lg px-3 py-2 text-sm" :class="messageType === 'error' ? 'bg-[#fff0ee] text-[#c44b3f]' : 'bg-[#e6f5ed] text-[#2f855a]'">{{ message }}</p>
        <div class="mt-5 flex flex-wrap gap-3">
          <button class="h-11 rounded-lg border border-[#dce4dd] bg-white px-5 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="saveDraft">保存草稿</button>
          <button class="h-11 rounded-lg border border-[#dce4dd] bg-white px-5 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="previewOpen = true">预览</button>
          <button class="h-11 rounded-lg bg-[#1f7a5a] px-6 text-sm font-semibold text-white hover:bg-[#155f46]" type="submit">发布</button>
        </div>
      </section>

      <aside class="space-y-5">
        <div class="rounded-lg border border-[#dce4dd] bg-[#eef4ef] p-5">
          <h2 class="text-lg font-bold text-[#1f2a24]">发布前提示</h2>
          <div class="mt-4 space-y-3 text-sm leading-6 text-[#66736b]">
            <p>如果包含 AI 回答，请标注“来自 AI，仅供讨论”。</p>
            <p>错题求助建议带上题干、错误答案和你记录的错因。</p>
            <p>经验分享尽量写清楚适用场景，方便同学复用。</p>
          </div>
        </div>
        <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
          <h2 class="text-lg font-bold text-[#1f2a24]">标签预览</h2>
          <div class="mt-4 flex flex-wrap gap-2">
            <span v-for="tag in tags" :key="tag" class="rounded-full bg-[#eef4ef] px-3 py-1 text-xs font-semibold text-[#1f7a5a]">{{ tag }}</span>
          </div>
        </div>
      </aside>
    </form>

    <div v-if="previewOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-[#1f2a24]/45 px-4">
      <div class="w-full max-w-2xl rounded-lg bg-white p-6 shadow-[0_24px_72px_rgba(31,42,36,0.22)]">
        <h2 class="text-xl font-bold text-[#1f2a24]">{{ form.title || '未填写标题' }}</h2>
        <p class="mt-2 text-sm text-[#66736b]">{{ currentTypeLabel }} · {{ currentPackName }}</p>
        <p class="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#1f2a24]">{{ form.content || '未填写正文' }}</p>
        <button class="mt-5 h-10 w-full rounded-lg bg-[#1f7a5a] text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="previewOpen = false">继续编辑</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'

const router = useRouter()
const packs = ref<any[]>([])
const postTypes = [
  { label: '提问互助', value: 'help' },
  { label: '错题求助', value: 'wrong_question' },
  { label: '学习复盘', value: 'review' },
  { label: '经验分享', value: 'experience' },
  { label: 'AI 回答求证', value: 'ai_verification' },
]
const form = reactive({ type: 'wrong_question', title: '', content: '', packId: '', wrongQuestionId: '' })
const tagInput = ref('')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const previewOpen = ref(false)
const tags = computed(() => tagInput.value.split(/[,，]/).map((item) => item.trim()).filter(Boolean))
const currentTypeLabel = computed(() => postTypes.find((item) => item.value === form.type)?.label ?? '提问互助')
const currentPackName = computed(() => packs.value.find((pack) => pack.id === form.packId)?.title ?? '未关联学习包')

onMounted(async () => {
  try {
    packs.value = await api.getPacks()
  } catch {
    packs.value = []
  }
})

const saveDraft = () => {
  localStorage.setItem('zhijing_community_draft', JSON.stringify({ ...form, tags: tags.value }))
  messageType.value = 'success'
  message.value = '草稿已保存。'
}

const publish = async () => {
  if (form.title.length > 60) {
    messageType.value = 'error'
    message.value = '标题不能超过 60 个字。'
    return
  }
  try {
    await api.createCommunityPost(form)
  } catch (err) {
    console.error(err)
    messageType.value = 'error'
    message.value = '发布失败，请稍后重试。'
    return
  }
  messageType.value = 'success'
  message.value = '发布成功。'
  window.setTimeout(() => router.push('/community'), 400)
}
</script>
