<template>
  <div>
    <PageHeader title="新建学习包" eyebrow="拖入文本资料" description="把文字资料直接拖进资料区，知径会把它整理成学习包、章节、题目和复盘入口。" />

    <section class="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <form class="rounded-lg border border-[#dce4dd] bg-white p-5" @submit.prevent="submit">
        <div class="grid gap-4 md:grid-cols-2">
          <label class="block text-sm font-semibold text-[#1f2a24]">
            学习包名称
            <input v-model="form.title" class="mt-2 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 outline-none focus:border-[#1f7a5a] focus:bg-white" required />
          </label>
          <label class="block text-sm font-semibold text-[#1f2a24]">
            科目
            <input v-model="form.subjectName" class="mt-2 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 outline-none focus:border-[#1f7a5a] focus:bg-white" />
          </label>
        </div>
        <label class="mt-4 block text-sm font-semibold text-[#1f2a24]">
          学习目标
          <textarea v-model="form.studyGoal" class="mt-2 min-h-24 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 py-3 outline-none focus:border-[#1f7a5a] focus:bg-white"></textarea>
        </label>

        <div
          class="mt-5 rounded-lg border border-dashed p-6 transition"
          :class="dragging ? 'border-[#1f7a5a] bg-[#e8f3ed]' : 'border-[#b8cfc0] bg-[#f6f8f5]'"
          @dragenter.prevent="dragging = true"
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @drop.prevent="handleDrop"
        >
          <div class="flex flex-col gap-4 md:flex-row md:items-start">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-[#1f7a5a]">
              <FileText class="h-6 w-6" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-[#1f2a24]">拖入 `.txt` / `.md` 文本资料，或从桌面直接拖一段文字进来</p>
              <p class="mt-1 text-sm leading-6 text-[#66736b]">这里不提供点击上传按钮；资料会以原文形式绑定到学习包，便于后端解析章节和题目。</p>
              <textarea v-model="materialText" class="mt-4 min-h-40 w-full rounded-lg border border-[#dce4dd] bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-[#1f7a5a]" placeholder="拖入后会显示文本内容，也可以在这里补充粘贴资料。"></textarea>
              <div class="mt-3 flex items-center justify-between text-xs text-[#66736b]">
                <span>{{ materialName || '尚未拖入文本资料' }}</span>
                <span>{{ materialText.length }} 字符</span>
              </div>
              <button class="mt-4 inline-flex h-10 items-center justify-center rounded-lg border border-[#dce4dd] bg-white px-4 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="materialModalOpen = true">
                查看资料解析设置
              </button>
            </div>
          </div>
        </div>

        <p v-if="message" class="mt-3 rounded-lg px-3 py-2 text-sm" :class="messageType === 'error' ? 'bg-[#fff0ee] text-[#c44b3f]' : 'bg-[#eef4ef] text-[#1f7a5a]'">{{ message }}</p>

        <button class="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] text-sm font-semibold text-white hover:bg-[#155f46] disabled:cursor-not-allowed disabled:opacity-60" :disabled="loading" type="submit">
          <RefreshCw v-if="loading" class="h-4 w-4 animate-spin" />
          创建并解析学习包
        </button>
      </form>

      <aside class="rounded-lg border border-[#dce4dd] bg-[#eef4ef] p-5">
        <h2 class="text-lg font-bold text-[#1f2a24]">学习包生成流程</h2>
        <div class="mt-5 space-y-4">
          <div v-for="(step, index) in steps" :key="step.title" class="flex gap-3">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#1f7a5a]">{{ index + 1 }}</div>
            <div>
              <p class="font-semibold text-[#1f2a24]">{{ step.title }}</p>
              <p class="mt-1 text-sm leading-6 text-[#66736b]">{{ step.text }}</p>
            </div>
          </div>
        </div>
      </aside>
    </section>

    <ProModal
      :open="materialModalOpen"
      title="上传学习资料"
      code="M03. 上传资料弹窗"
      description="拖拽上传区域、文件列表、手动文本入口和解析选项。"
      width="720px"
      @close="materialModalOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-panel">
          <p class="text-sm font-black text-[#2d3748]">拖拽资料区</p>
          <p class="mt-2 text-sm leading-6 text-[#64748b]">当前页面保持拖入文本资料的方式；这里展示解析设置，不触发点击上传逻辑。</p>
        </div>
        <div class="pro-field">
          <span class="pro-label">文件列表</span>
          <div class="rounded-[8px] border-[3px] border-[#2d3748] bg-white p-3 text-sm font-bold text-[#2d3748]">
            {{ materialName || `${form.title}.txt` }} · {{ materialText.length || 0 }} 字符 · {{ materialText ? '待解析' : '等待拖入' }}
          </div>
        </div>
        <div class="pro-field">
          <span class="pro-label">手动粘贴文本</span>
          <textarea v-model="materialText" class="pro-textarea" placeholder="也可以把文本粘贴到这里。"></textarea>
        </div>
        <div class="pro-field">
          <span class="pro-label">解析选项</span>
          <div class="grid gap-2 sm:grid-cols-2">
            <label v-for="option in parseOptions" :key="option.key" class="flex items-center justify-between gap-3 rounded-[8px] border-[3px] border-[#2d3748] bg-white px-3 py-2 text-sm font-black text-[#2d3748]">
              {{ option.label }}
              <input v-model="option.enabled" class="h-4 w-4 accent-[#22c55e]" type="checkbox" />
            </label>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="materialModalOpen = false">取消</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="startParsePreview">开始上传并解析</button>
      </template>
    </ProModal>

    <ProModal
      :open="parseProgressOpen"
      title="AI 正在解析资料"
      code="M04. AI 解析进度弹窗"
      description="AI 正在读取资料、识别章节结构并生成练习题和记忆卡片。"
      width="640px"
      @close="parseProgressOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-field">
          <span class="pro-label">当前阶段</span>
          <strong class="text-lg font-black text-[#2d3748]">{{ parseStages[currentParseStage] }}</strong>
        </div>
        <div class="rounded-[8px] border-[3px] border-[#2d3748] bg-white p-2">
          <div class="h-4 rounded bg-[#e2e8f0]">
            <div class="h-4 rounded bg-[#22c55e]" :style="{ width: `${parseProgress}%` }"></div>
          </div>
        </div>
        <div class="grid gap-2">
          <div v-for="(stage, index) in parseStages" :key="stage" class="flex items-center justify-between rounded-[8px] border-[3px] border-[#2d3748] bg-white px-3 py-2 text-sm font-black text-[#2d3748]">
            <span>{{ index + 1 }}. {{ stage }}</span>
            <span>{{ index < currentParseStage ? '完成' : index === currentParseStage ? '处理中' : '等待' }}</span>
          </div>
        </div>
        <div class="pro-panel">
          <p class="text-sm font-black text-[#2d3748]">已识别结果预览</p>
          <p class="mt-2 text-sm leading-6 text-[#64748b]">章节 3 个、知识点 12 个、练习题 8 道、记忆卡片 6 张。</p>
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="parseProgressOpen = false">取消解析</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="parseProgressOpen = false">后台继续处理</button>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FileText, RefreshCw } from '@lucide/vue'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import ProModal from '../../components/common/ProModal.vue'

const router = useRouter()
const loading = ref(false)
const dragging = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const materialText = ref('')
const materialName = ref('')
const materialModalOpen = ref(false)
const parseProgressOpen = ref(false)
const currentParseStage = ref(1)
const parseStages = ['读取资料文本', '识别章节结构', '提取知识点', '生成章节摘要', '生成练习题', '生成记忆卡片']
const parseProgress = ref(42)
const parseOptions = ref([
  { key: 'chapters', label: '自动识别章节', enabled: true },
  { key: 'summary', label: '生成章节摘要', enabled: true },
  { key: 'keywords', label: '生成关键词', enabled: true },
  { key: 'questions', label: '生成练习题', enabled: true },
  { key: 'flashcards', label: '生成记忆卡片', enabled: false },
])
const form = reactive({
  title: '语文阅读理解学习包',
  subjectName: '语文',
  studyGoal: '整理阅读资料，生成错题复盘和练习任务',
})
const steps = [
  { title: '拖入文本资料', text: '以文字原文建立资料源，不走点击上传按钮。' },
  { title: '创建学习包', text: '保存名称、科目、目标和资料文本。' },
  { title: 'AI 解析', text: '生成章节、知识点、题目和错题本关联入口。' },
]

const handleDrop = async (event: DragEvent) => {
  dragging.value = false
  const file = event.dataTransfer?.files?.[0]
  const plainText = event.dataTransfer?.getData('text/plain')

  if (file) {
    if (!file.type.includes('text') && !file.name.match(/\.(txt|md|csv)$/i)) {
      messageType.value = 'error'
      message.value = '当前只接收文本资料，请拖入 .txt、.md 或可读取的纯文本文件。'
      return
    }
    materialName.value = file.name
    materialText.value = await file.text()
    messageType.value = 'success'
    message.value = '文本资料已读取，可以创建学习包。'
    return
  }

  if (plainText) {
    materialName.value = '拖入文本片段'
    materialText.value = plainText
    messageType.value = 'success'
    message.value = '文本片段已加入资料区。'
  }
}

const submit = async () => {
  loading.value = true
  message.value = ''
  parseProgressOpen.value = true
  try {
    const pack = await api.createPack({
      title: form.title,
      subjectName: form.subjectName || undefined,
      studyGoal: form.studyGoal || undefined,
    })
    if (materialText.value.trim()) {
      await api.addPackMaterial(pack.id, {
        fileName: materialName.value || `${form.title}.txt`,
        fileType: 'text/plain',
        fileSize: materialText.value.length,
        rawText: materialText.value,
      })
      await api.parsePack(pack.id)
    }
    messageType.value = 'success'
    message.value = '创建成功，正在进入详情页。'
    router.push(`/packs/${pack.id}`)
  } catch (err) {
    parseProgressOpen.value = false
    messageType.value = 'error'
    message.value = err instanceof Error ? err.message : '创建学习包失败，请稍后重试。'
  } finally {
    loading.value = false
  }
}

const startParsePreview = () => {
  materialModalOpen.value = false
  parseProgressOpen.value = true
}
</script>
