<template>
  <div>
    <PageHeader title="帖子详情" eyebrow="社区讨论" :description="post.title">
      <RouterLink class="inline-flex h-10 items-center justify-center rounded-lg border border-[#dce4dd] bg-white px-4 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" to="/community">返回社区</RouterLink>
    </PageHeader>

    <section class="grid gap-5 xl:grid-cols-[1fr_340px]">
      <article class="rounded-lg border border-[#dce4dd] bg-white p-5">
        <div class="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span class="rounded-full bg-[#eef4ef] px-2 py-1 text-[#1f7a5a]">{{ post.type }}</span>
          <span class="rounded-full bg-[#f6f8f5] px-2 py-1 text-[#66736b]">{{ post.pack }}</span>
          <span class="text-[#66736b]">{{ post.createdAt }}</span>
        </div>
        <h2 class="mt-4 text-2xl font-bold text-[#1f2a24]">{{ post.title }}</h2>
        <div class="mt-4 flex items-center gap-2 text-sm text-[#66736b]">
          <span class="flex h-9 w-9 items-center justify-center rounded-full bg-[#d99a26] font-bold text-white">{{ post.author?.slice(0, 1) }}</span>
          {{ post.author }}
        </div>
        <p class="mt-6 whitespace-pre-wrap text-sm leading-7 text-[#1f2a24]">{{ post.excerpt || post.content }}</p>
        <div class="mt-5 flex flex-wrap gap-2">
          <span v-for="tag in post.tags || []" :key="tag" class="rounded-full bg-[#eef4ef] px-3 py-1 text-xs font-semibold text-[#1f7a5a]">{{ tag }}</span>
        </div>

        <div class="mt-8 border-t border-[#dce4dd] pt-5">
          <h3 class="text-lg font-bold text-[#1f2a24]">回复</h3>
          <div class="mt-4 space-y-3">
            <div v-for="comment in comments" :key="comment.id" class="rounded-lg bg-[#f6f8f5] p-4">
              <p class="text-sm font-semibold text-[#1f2a24]">{{ comment.author }}</p>
              <p class="mt-2 text-sm leading-6 text-[#66736b]">{{ comment.content }}</p>
            </div>
          </div>
          <textarea v-model="reply" class="mt-4 min-h-24 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 py-3 text-sm outline-none focus:border-[#1f7a5a]" placeholder="写下你的建议或追问。"></textarea>
          <button class="mt-3 h-10 rounded-lg bg-[#1f7a5a] px-5 text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="addReply">回复</button>
        </div>
      </article>

      <aside class="space-y-5">
        <div class="rounded-lg border border-[#dce4dd] bg-[#eef4ef] p-5">
          <h2 class="text-lg font-bold text-[#1f2a24]">讨论数据</h2>
          <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="rounded-lg bg-white p-4">
              <p class="text-xl font-bold text-[#1f2a24]">{{ post.likes }}</p>
              <p class="mt-1 text-xs text-[#66736b]">点赞</p>
            </div>
            <div class="rounded-lg bg-white p-4">
              <p class="text-xl font-bold text-[#1f2a24]">{{ comments.length }}</p>
              <p class="mt-1 text-xs text-[#66736b]">回复</p>
            </div>
          </div>
        </div>
        <RouterLink class="flex h-11 items-center justify-center rounded-lg bg-[#1f7a5a] text-sm font-semibold text-white hover:bg-[#155f46]" to="/community/new">发布相关讨论</RouterLink>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import { mockPosts } from '../../data/mock'

const route = useRoute()
const post = ref<any>(mockPosts.find((item) => item.id === route.params.id) ?? mockPosts[0])
const comments = ref([
  { id: 'c-1', author: '林同学', content: '建议把错因拆成“定位错误”和“选项误判”两类，后面复练会更清楚。' },
  { id: 'c-2', author: '小周', content: '如果是 AI 回答求证，可以把原提示词也贴出来，方便大家判断上下文。' },
])
const reply = ref('')

const addReply = () => {
  if (!reply.value.trim()) return
  comments.value.push({ id: `c-${Date.now()}`, author: '郭同学', content: reply.value })
  reply.value = ''
}

onMounted(async () => {
  try {
    const detail = await api.getCommunityPost(String(route.params.id))
    post.value = detail.post ?? detail
    comments.value = detail.comments ?? comments.value
  } catch {
    post.value = mockPosts.find((item) => item.id === route.params.id) ?? mockPosts[0]
  }
})
</script>
