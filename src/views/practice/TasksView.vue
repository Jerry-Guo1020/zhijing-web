<template>
  <div>
    <PageHeader title="学习任务" eyebrow="今日行动" description="用小任务维持学习节奏，后端 `/tasks` 可完成创建与完成状态同步。">
      <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="taskModalOpen = true">
        <Plus class="h-4 w-4" />
        新建任务
      </button>
    </PageHeader>

    <section class="grid gap-5 lg:grid-cols-[360px_1fr]">
      <aside class="h-fit rounded-lg border border-[#dce4dd] bg-[#eef4ef] p-5">
        <h2 class="text-lg font-bold text-[#1f2a24]">今日任务计划</h2>
        <p class="mt-3 text-sm leading-6 text-[#66736b]">任务可以关联学习包、章节、错题、卡片或专注时长。点击右上角新建任务打开设计稿弹窗。</p>
        <div class="mt-5 grid grid-cols-2 gap-3">
          <div class="rounded-lg bg-white p-4">
            <p class="text-xl font-bold text-[#1f2a24]">{{ tasks.length }}</p>
            <p class="mt-1 text-xs text-[#66736b]">任务总数</p>
          </div>
          <div class="rounded-lg bg-white p-4">
            <p class="text-xl font-bold text-[#1f2a24]">{{ doneCount }}</p>
            <p class="mt-1 text-xs text-[#66736b]">已完成</p>
          </div>
        </div>
      </aside>

      <div v-if="tasks.length" class="space-y-3">
        <article v-for="task in tasks" :key="task.id" class="flex items-center justify-between gap-4 rounded-lg border border-[#dce4dd] bg-white p-4">
          <div>
            <p class="font-semibold text-[#1f2a24]">{{ task.title }}</p>
            <p class="mt-1 text-sm text-[#66736b]">目标 {{ task.targetValue || 1 }} 项</p>
          </div>
          <button class="rounded-lg border border-[#dce4dd] px-3 py-2 text-sm font-medium text-[#1f7a5a] hover:bg-[#eef4ef]" type="button" @click="complete(task)">
            {{ isDone(task.status) ? '已完成' : '完成' }}
          </button>
        </article>
      </div>
      <div v-else class="rounded-lg border border-dashed border-[#b8cfc0] bg-[#f6f8f5] p-10 text-center">
        <p class="font-semibold text-[#1f2a24]">暂无学习任务</p>
        <p class="mt-1 text-sm text-[#66736b]">新建任务后，这里会显示你的真实学习待办。</p>
        <button class="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-[#1f7a5a]" type="button" @click="taskModalOpen = true">
          <Plus class="h-4 w-4" />
          新建任务
        </button>
      </div>
    </section>

    <ProModal
      :open="taskModalOpen"
      title="新建学习任务"
      code="M14. 新建任务弹窗"
      description="创建任务并加入今日或未来任务列表。"
      width="680px"
      @close="taskModalOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-field">
          <span class="pro-label">任务标题</span>
          <input v-model="form.title" class="pro-input" placeholder="输入一个真实学习任务" />
        </div>
        <div class="pro-field">
          <span class="pro-label">任务类型</span>
          <select v-model="taskType" class="pro-select">
            <option>学习章节</option>
            <option>完成练习</option>
            <option>复习错题</option>
            <option>复习卡片</option>
            <option>专注时长</option>
            <option>自定义</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">关联学习包</span>
          <select v-model="taskPack" class="pro-select">
            <option value="">不关联学习包</option>
            <option v-for="pack in packs" :key="pack.id" :value="pack.id">{{ pack.title }}</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">关联章节</span>
          <select v-model="taskChapter" class="pro-select">
            <option value="">不关联章节</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">目标值</span>
          <input v-model.number="form.targetValue" class="pro-input" min="1" type="number" />
        </div>
        <div class="pro-field">
          <span class="pro-label">截止时间</span>
          <input v-model="deadlineAt" class="pro-input" type="datetime-local" />
        </div>
        <div class="pro-field">
          <span class="pro-label">是否重复</span>
          <button class="pro-switch" :data-on="repeatTask" type="button" @click="repeatTask = !repeatTask"></button>
        </div>
        <div class="pro-field">
          <span class="pro-label">提醒时间</span>
          <input v-model="remindAt" class="pro-input" type="time" />
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="taskModalOpen = false">取消</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="create">创建任务</button>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Plus } from '@lucide/vue'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import ProModal from '../../components/common/ProModal.vue'

const tasks = ref<any[]>([])
const packs = ref<any[]>([])
const form = reactive({ title: '', targetValue: 1 })
const taskModalOpen = ref(false)
const taskType = ref('自定义')
const taskPack = ref('')
const taskChapter = ref('')
const deadlineAt = ref('')
const remindAt = ref('')
const repeatTask = ref(false)
const isDone = (status: string) => status === 'completed' || status === 'done'
const doneCount = computed(() => tasks.value.filter((task) => isDone(task.status)).length)

const load = async () => {
  try {
    const [taskData, packData] = await Promise.all([api.getTasks(), api.getPacks()])
    tasks.value = taskData
    packs.value = packData
  } catch {
    tasks.value = []
    packs.value = []
  }
}

const create = async () => {
  if (!form.title.trim()) return
  try {
    const task = await api.createTask({
      ...form,
      packId: taskPack.value || undefined,
      chapterId: taskChapter.value || undefined,
      deadlineAt: deadlineAt.value || undefined,
    } as any)
    tasks.value = [task, ...tasks.value]
  } catch (err) {
    console.error(err)
  }
  form.title = ''
  form.targetValue = 1
  taskModalOpen.value = false
}

const complete = async (task: any) => {
  const oldStatus = task.status
  task.status = 'completed'
  try {
    const updated = await api.completeTask(task.id)
    Object.assign(task, updated ?? { status: 'completed' })
  } catch {
    task.status = oldStatus
  }
}

onMounted(load)
</script>

<style scoped>
</style>
