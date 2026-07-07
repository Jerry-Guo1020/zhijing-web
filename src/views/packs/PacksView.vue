<template>
  <div>
    <PageHeader title="学习包" eyebrow="资料到路径" description="学习包是知径的主入口，用来承载资料、章节、AI 问答、练习和复盘记录。">
      <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="createOpen = true">
        <Plus class="h-4 w-4" />
        新建学习包
      </button>
    </PageHeader>

    <div class="mb-5 grid gap-3 md:grid-cols-[1fr_auto]">
      <div class="flex items-center gap-2 rounded-lg border border-[#dce4dd] bg-white px-3 py-2 text-sm text-[#66736b]">
        <Search class="h-4 w-4" />
        <input v-model="keyword" class="w-full bg-transparent outline-none" placeholder="搜索学习包名称、科目或目标" />
      </div>
      <div class="grid grid-cols-3 rounded-lg border border-[#dce4dd] bg-white p-1 text-sm">
        <button v-for="tab in tabs" :key="tab" class="rounded-md px-3 py-2" :class="activeTab === tab ? 'bg-[#1f7a5a] text-white' : 'text-[#66736b]'" type="button" @click="activeTab = tab">{{ tab }}</button>
      </div>
    </div>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <LearningPackCard v-for="pack in filteredPacks" :key="pack.id" :pack="pack" />
    </section>
    <div v-if="!loading && filteredPacks.length === 0" class="rounded-lg border border-[#dce4dd] bg-white p-8 text-center text-sm font-semibold text-[#66736b]">
      暂无学习包，先新建一个并添加资料。
    </div>
    <p v-if="error" class="mt-4 rounded-lg bg-[#fff0ee] px-4 py-3 text-sm font-semibold text-[#c44b3f]">{{ error }}</p>

    <ProModal
      :open="createOpen"
      title="新建学习包"
      code="M02. 新建学习包弹窗"
      description="选择学习包名称、目标、学科分类和创建方式。"
      width="560px"
      @close="createOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-field">
          <span class="pro-label">学习包名称</span>
          <input v-model="createForm.title" class="pro-input" placeholder="请输入学习包名称" />
        </div>
        <div class="pro-field">
          <span class="pro-label">学习目标</span>
          <textarea v-model="createForm.studyGoal" class="pro-textarea"></textarea>
        </div>
        <div class="pro-field">
          <span class="pro-label">学科分类</span>
          <select v-model="createForm.subjectName" class="pro-select">
            <option>语文</option>
            <option>英语</option>
            <option>数学</option>
            <option>政治</option>
            <option>综合</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">预计完成时间</span>
          <input v-model="createForm.deadline" class="pro-input" type="date" />
        </div>
        <div class="pro-field">
          <span class="pro-label">创建方式</span>
          <select v-model="createForm.mode" class="pro-select">
            <option>上传资料生成</option>
            <option>手动创建空学习包</option>
            <option>粘贴文本生成</option>
          </select>
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="createOpen = false">取消</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="continueCreate">继续上传资料</button>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search } from '@lucide/vue'
import { api } from '../../api/client'
import LearningPackCard from '../../components/common/LearningPackCard.vue'
import PageHeader from '../../components/common/PageHeader.vue'
import ProModal from '../../components/common/ProModal.vue'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const packs = ref<any[]>([])
const keyword = ref('')
const activeTab = ref('全部')
const createOpen = ref(false)
const createForm = ref({
  title: '',
  studyGoal: '',
  subjectName: '综合',
  deadline: '',
  mode: '粘贴文本生成',
})
const tabs = ['全部', '学习中', '草稿']

const filteredPacks = computed(() => {
  return packs.value.filter((pack) => {
    const text = `${pack.title}${pack.subjectName}${pack.studyGoal}`.toLowerCase()
    const matchKeyword = text.includes(keyword.value.toLowerCase())
    const matchTab = activeTab.value === '全部' || (activeTab.value === '草稿' ? pack.status === 'draft' : pack.status !== 'draft')
    return matchKeyword && matchTab
  })
})

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    packs.value = await api.getPacks()
  } catch (err) {
    packs.value = []
    error.value = err instanceof Error ? err.message : '学习包加载失败。'
  } finally {
    loading.value = false
  }
})

const continueCreate = async () => {
  createOpen.value = false
  if (!createForm.value.title.trim()) {
    router.push('/packs/new')
    return
  }
  try {
    const pack = await api.createPack({
      title: createForm.value.title,
      subjectName: createForm.value.subjectName,
      studyGoal: createForm.value.studyGoal,
    })
    router.push(`/packs/${pack.id}`)
  } catch {
    router.push('/packs/new')
  }
}
</script>

<style scoped>
</style>
