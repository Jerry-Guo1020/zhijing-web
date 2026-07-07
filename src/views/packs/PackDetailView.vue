<template>
  <div>
    <PageHeader :title="pack.title" :eyebrow="pack.subjectName || '学习包'" :description="pack.studyGoal">
      <div class="flex flex-wrap gap-2">
      <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#dce4dd] bg-white px-4 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="renameOpen = true">
        重命名
      </button>
      <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#dce4dd] bg-white px-4 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="sourceOpen = true">
        引用来源
      </button>
      <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#dce4dd] bg-white px-4 text-sm font-semibold text-[#c44b3f] hover:bg-[#fff0ee]" type="button" @click="deleteOpen = true">
        删除
      </button>
      <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="parse">
        <Sparkles class="h-4 w-4" />
        AI 解析
      </button>
      </div>
    </PageHeader>

    <section class="grid gap-5 xl:grid-cols-[1fr_340px]">
      <div class="space-y-5">
        <div class="grid gap-4 md:grid-cols-3">
          <StatCard label="章节" :value="chapters.length" hint="已生成结构" :icon="BookOpen" />
          <StatCard label="知识点" :value="knowledgePoints.length" hint="解析后自动生成" :icon="Layers" />
          <StatCard label="掌握度" :value="`${pack.masteryRate || 0}%`" hint="来自练习与复盘" :icon="TrendingUp" />
        </div>

        <section class="rounded-lg border border-[#dce4dd] bg-white p-5">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-[#1f2a24]">章节结构</h2>
            <RouterLink class="text-sm font-semibold text-[#1f7a5a]" :to="`/packs/${packId}/chapters`">完整查看</RouterLink>
          </div>
          <div v-if="chapters.length" class="mt-4 space-y-3">
            <div v-for="chapter in chapters" :key="chapter.id" class="rounded-lg border border-[#dce4dd] p-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="font-semibold text-[#1f2a24]">{{ chapter.title }}</p>
                  <p class="mt-1 text-sm text-[#66736b]">{{ chapter.summary }}</p>
                </div>
                <span class="text-sm font-bold text-[#1f7a5a]">{{ chapter.masteryRate || 0 }}%</span>
              </div>
            </div>
          </div>
          <div v-else class="mt-4 rounded-lg border border-dashed border-[#b8cfc0] bg-[#f6f8f5] p-8 text-center">
            <p class="font-semibold text-[#1f2a24]">暂无章节结构</p>
            <p class="mt-1 text-sm text-[#66736b]">添加资料并完成 AI 解析后，章节会显示在这里。</p>
          </div>
        </section>

        <section class="rounded-lg border border-[#dce4dd] bg-white p-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-bold text-[#1f2a24]">知识点预览</h2>
              <p class="mt-1 text-sm font-semibold text-[#66736b]">这里只展示当前学习包解析出的真实知识点。</p>
            </div>
            <RouterLink class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" :to="`/packs/${packId}/flashcards`">
              <Layers class="h-4 w-4" />
              查看记忆卡片
            </RouterLink>
          </div>
          <div v-if="knowledgePoints.length" class="mt-4 grid gap-3 md:grid-cols-3">
            <div v-for="point in knowledgePoints.slice(0, 3)" :key="point.id" class="rounded-lg border border-[#dce4dd] bg-[#fffaf4] p-4">
              <p class="text-lg font-black text-[#2d3748]">{{ point.title }}</p>
              <p class="mt-1 text-xs font-bold text-[#64748b]">{{ point.tags || '知识点' }}</p>
              <p class="mt-3 text-sm font-semibold leading-6 text-[#2d3748]">{{ point.description || '暂无说明' }}</p>
            </div>
          </div>
          <div v-else class="mt-4 rounded-lg border border-dashed border-[#b8cfc0] bg-[#f6f8f5] p-6 text-center text-sm text-[#66736b]">
            暂无知识点，完成解析后会展示真实内容。
          </div>
        </section>
      </div>

      <aside class="space-y-4">
        <template v-for="action in actions" :key="action.label">
          <button v-if="action.modal" class="flex w-full items-center gap-3 rounded-lg border border-[#dce4dd] bg-white p-4 text-left transition hover:border-[#b8cfc0]" type="button" @click="questionSettingsOpen = true">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef4ef] text-[#1f7a5a]">
              <component :is="action.icon" class="h-5 w-5" />
            </div>
            <div>
              <p class="font-semibold text-[#1f2a24]">{{ action.label }}</p>
              <p class="mt-1 text-xs text-[#66736b]">{{ action.text }}</p>
            </div>
          </button>
          <RouterLink v-else class="flex items-center gap-3 rounded-lg border border-[#dce4dd] bg-white p-4 transition hover:border-[#b8cfc0]" :to="action.to">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef4ef] text-[#1f7a5a]">
              <component :is="action.icon" class="h-5 w-5" />
            </div>
            <div>
              <p class="font-semibold text-[#1f2a24]">{{ action.label }}</p>
              <p class="mt-1 text-xs text-[#66736b]">{{ action.text }}</p>
            </div>
          </RouterLink>
        </template>
      </aside>
    </section>

    <ProModal :open="renameOpen" title="重命名学习包" code="M05. 重命名学习包弹窗" description="更新学习包名称与学习目标。" width="560px" @close="renameOpen = false">
      <div class="space-y-4">
        <div class="pro-field">
          <span class="pro-label">学习包名称</span>
          <input v-model="renameForm.title" class="pro-input" />
        </div>
        <div class="pro-field">
          <span class="pro-label">学习目标</span>
          <textarea v-model="renameForm.studyGoal" class="pro-textarea"></textarea>
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="renameOpen = false">取消</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="saveRename">保存</button>
      </template>
    </ProModal>

    <ProModal :open="deleteOpen" title="确认删除？" code="M06. 删除确认弹窗" description="删除后，该学习包下的资料、章节、题目、卡片和相关学习记录可能无法恢复。" width="560px" @close="deleteOpen = false">
      <div class="space-y-4">
        <div class="pro-panel">
          <p class="text-sm font-black text-[#2d3748]">删除对象名称</p>
          <p class="mt-2 text-lg font-black text-[#c44b3f]">{{ pack.title }}</p>
        </div>
        <div class="pro-field">
          <span class="pro-label">二次确认</span>
          <input v-model="deleteConfirm" class="pro-input" placeholder="输入 DELETE 确认" />
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="deleteOpen = false">取消</button>
        <button class="pro-btn pro-btn-primary !bg-[#c44b3f]" type="button" @click="deleteOpen = false">确认删除</button>
      </template>
    </ProModal>

    <ProModal :open="sourceOpen" title="引用来源" code="M07. AI 引用来源预览弹窗" description="展示 AI 回答或题目生成所依据的资料片段。" width="720px" @close="sourceOpen = false">
      <div class="space-y-4">
        <div class="pro-field"><span class="pro-label">学习包名称</span><strong class="text-[#2d3748]">{{ pack.title }}</strong></div>
        <div class="pro-field"><span class="pro-label">文件名</span><span class="text-sm text-[#64748b]">{{ firstMaterial?.fileName || '暂无资料文件' }}</span></div>
        <div class="pro-field"><span class="pro-label">章节名称</span><span class="text-sm text-[#64748b]">{{ chapters[0]?.title || '暂无章节' }}</span></div>
        <div class="pro-field">
          <span class="pro-label">片段内容</span>
          <textarea class="pro-textarea" readonly :value="firstMaterial?.rawText || '暂无来源片段'"></textarea>
        </div>
        <div class="pro-panel">
          <p class="text-sm font-black text-[#2d3748]">相关上下文</p>
          <p class="mt-2 text-sm leading-6 text-[#64748b]">来源完整、可回到所在章节核对。若来源缺失，系统会明确提示资料不足。</p>
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="sourceOpen = false">关闭</button>
        <button class="pro-btn pro-btn-soft" type="button">复制片段</button>
        <RouterLink class="pro-btn pro-btn-primary" :to="`/packs/${packId}/chapters`">查看所在章节</RouterLink>
      </template>
    </ProModal>

    <ProModal :open="questionSettingsOpen" title="生成练习题" code="M08. 生成题目设置弹窗" description="控制 AI 出题范围、题型、难度和数量。" width="680px" @close="questionSettingsOpen = false">
      <div class="space-y-4">
        <div class="pro-field"><span class="pro-label">学习包选择</span><input class="pro-input" :value="pack.title" readonly /></div>
        <div class="pro-field"><span class="pro-label">章节选择</span><select v-model="questionForm.chapter" class="pro-select"><option v-for="chapter in chapters" :key="chapter.id">{{ chapter.title }}</option></select></div>
        <div class="pro-field"><span class="pro-label">题型选择</span><select v-model="questionForm.type" class="pro-select"><option>单选题</option><option>多选题</option><option>判断题</option><option>填空题</option><option>简答题</option></select></div>
        <div class="pro-field"><span class="pro-label">难度选择</span><select v-model="questionForm.difficulty" class="pro-select"><option>简单</option><option>中等</option><option>困难</option><option>混合</option></select></div>
        <div class="pro-field"><span class="pro-label">题目数量</span><input v-model.number="questionForm.count" class="pro-input" type="number" min="1" max="30" /></div>
        <div class="pro-field"><span class="pro-label">生成解析</span><button class="pro-switch" :data-on="questionForm.withExplanation" type="button" @click="questionForm.withExplanation = !questionForm.withExplanation"></button></div>
        <div class="pro-field"><span class="pro-label">直接开始练习</span><button class="pro-switch" :data-on="questionForm.startNow" type="button" @click="questionForm.startNow = !questionForm.startNow"></button></div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="questionSettingsOpen = false">取消</button>
        <RouterLink class="pro-btn pro-btn-primary" :to="`/packs/${packId}/practice`">开始生成</RouterLink>
      </template>
    </ProModal>

    <ProModal :open="parseProgressOpen" title="AI 正在解析资料" code="M04. AI 解析进度弹窗" description="当前正在重新解析学习包资料。" width="640px" @close="parseProgressOpen = false">
      <div class="space-y-4">
        <div class="pro-field"><span class="pro-label">当前阶段</span><strong class="text-[#2d3748]">提取知识点</strong></div>
        <div class="rounded-[8px] border-[3px] border-[#2d3748] bg-white p-2"><div class="h-4 rounded bg-[#e2e8f0]"><div class="h-4 w-[68%] rounded bg-[#22c55e]"></div></div></div>
        <div class="pro-panel"><p class="text-sm font-black text-[#2d3748]">已识别结果预览</p><p class="mt-2 text-sm leading-6 text-[#64748b]">章节 {{ chapters.length }} 个、知识点 {{ knowledgePoints.length }} 个。</p></div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="parseProgressOpen = false">取消解析</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="parseProgressOpen = false">后台继续处理</button>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { BookOpen, Bot, FileQuestion, Layers, NotebookPen, Sparkles, TrendingUp } from '@lucide/vue'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import ProModal from '../../components/common/ProModal.vue'
import StatCard from '../../components/common/StatCard.vue'

const route = useRoute()
const packId = computed(() => String(route.params.id))
const pack = ref<any>({ title: '学习包', subjectName: '学习包', studyGoal: '' })
const chapters = ref<any[]>([])
const knowledgePoints = ref<any[]>([])
const materials = ref<any[]>([])
const renameOpen = ref(false)
const deleteOpen = ref(false)
const sourceOpen = ref(false)
const questionSettingsOpen = ref(false)
const parseProgressOpen = ref(false)
const deleteConfirm = ref('')
const renameForm = ref({ title: '', studyGoal: '' })
const questionForm = ref({ chapter: '', type: '单选题', difficulty: '中等', count: 8, withExplanation: true, startNow: true })
const firstMaterial = computed(() => materials.value[0])

const actions = computed(() => [
  { label: 'AI 问答', text: '带学习包上下文提问', to: `/packs/${packId.value}/qa`, icon: Bot },
  { label: '生成练习题', text: '设置范围、题型和难度', to: '', icon: FileQuestion, modal: true },
  { label: '记忆卡片', text: '复习单词、概念和错因卡', to: `/packs/${packId.value}/flashcards`, icon: Layers },
  { label: '错题复盘', text: '查看相关错题', to: '/wrong-book', icon: NotebookPen },
])

const load = async () => {
  try {
    const detail = await api.getPackDetail(packId.value)
    pack.value = detail.pack ?? { title: '学习包不存在', subjectName: '学习包', studyGoal: '' }
    chapters.value = detail.chapters ?? []
    knowledgePoints.value = detail.knowledgePoints ?? []
    materials.value = detail.materials ?? []
    renameForm.value = { title: pack.value.title ?? '', studyGoal: pack.value.studyGoal ?? '' }
    questionForm.value.chapter = chapters.value[0]?.title ?? ''
  } catch {
    pack.value = { title: '学习包不存在', subjectName: '学习包', studyGoal: '' }
    chapters.value = []
    knowledgePoints.value = []
    materials.value = []
  }
}

const parse = async () => {
  parseProgressOpen.value = true
  try {
    const detail = await api.parsePack(packId.value)
    chapters.value = detail.chapters ?? chapters.value
    knowledgePoints.value = detail.knowledgePoints ?? knowledgePoints.value
  } catch (err) {
    console.error(err)
  } finally {
    parseProgressOpen.value = false
  }
}

const saveRename = () => {
  pack.value = { ...pack.value, title: renameForm.value.title, studyGoal: renameForm.value.studyGoal }
  renameOpen.value = false
}

onMounted(load)
</script>

<style scoped>
</style>
