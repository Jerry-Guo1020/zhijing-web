<template>
  <div>
    <PageHeader title="院校与目标规划" eyebrow="目标驱动学习" description="展示我的目标院校、院校介绍、预估分数区间、专业方向和本周备考任务。">
      <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="openBlankTargetModal">
        <BookmarkPlus class="h-4 w-4" />
        设置目标院校
      </button>
    </PageHeader>

    <section class="mb-5 rounded-lg border border-[#dce4dd] bg-white p-5">
      <div class="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
        <div class="flex items-center gap-2 rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3">
          <Search class="h-4 w-4 text-[#66736b]" />
          <input v-model="keyword" class="h-11 w-full bg-transparent text-sm outline-none" placeholder="搜索院校、专业或地区" @keyup.enter="search" />
        </div>
        <select v-model="region" class="h-11 rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 text-sm outline-none">
          <option value="">全部地区</option>
          <option>江苏</option>
          <option>浙江</option>
        </select>
        <select v-model="schoolType" class="h-11 rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 text-sm outline-none">
          <option value="">全部类型</option>
          <option>985</option>
          <option>211</option>
          <option>双一流</option>
        </select>
        <button class="h-11 rounded-lg bg-[#1f7a5a] px-5 text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="search">搜索</button>
      </div>
    </section>

    <section class="grid gap-5 xl:grid-cols-[1fr_380px]">
      <div class="space-y-4">
        <article v-for="college in filteredColleges" :key="college.id" class="rounded-lg border border-[#dce4dd] bg-white p-5">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-[#1f7a5a]">{{ college.region }} · {{ college.type }}</p>
              <h2 class="mt-1 text-xl font-bold text-[#1f2a24]">{{ college.name }}</h2>
            </div>
            <button class="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dce4dd] px-3 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="openTargetModal(college)">
              <BookmarkPlus class="h-4 w-4" />
              收藏
            </button>
          </div>
          <p class="mt-4 text-sm leading-6 text-[#66736b]">{{ college.introduction }}</p>
          <div class="mt-4 grid gap-3 md:grid-cols-[160px_1fr]">
            <div class="rounded-lg bg-[#fff4e4] p-4">
              <p class="text-sm text-[#b7791f]">预估分数</p>
              <p class="mt-1 text-2xl font-bold text-[#1f2a24]">{{ college.scoreRange }}</p>
            </div>
            <div class="rounded-lg bg-[#f6f8f5] p-4">
              <p class="text-sm font-semibold text-[#1f2a24]">相关专业</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span v-for="major in college.majors" :key="major" class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1f7a5a]">{{ major }}</span>
              </div>
            </div>
          </div>
          <p class="mt-4 rounded-lg bg-[#eef4ef] px-4 py-3 text-sm leading-6 text-[#1f2a24]">招生资讯：{{ college.admissionSummary }}</p>
        </article>
        <div v-if="hasSearched && !filteredColleges.length" class="rounded-lg border border-dashed border-[#b8cfc0] bg-white p-10 text-center">
          <h2 class="text-lg font-bold text-[#1f2a24]">没有找到匹配院校</h2>
          <p class="mt-2 text-sm text-[#66736b]">换一个关键词或直接手动设置目标院校。</p>
        </div>
        <div v-if="!hasSearched" class="rounded-lg border border-dashed border-[#b8cfc0] bg-white p-10 text-center">
          <h2 class="text-lg font-bold text-[#1f2a24]">搜索院校后开始规划</h2>
          <p class="mt-2 text-sm text-[#66736b]">这里不会默认填充示例院校，搜索结果会来自后端接口。</p>
        </div>
      </div>

      <aside class="space-y-5">
        <div class="rounded-lg border border-[#dce4dd] bg-[#eef4ef] p-5">
          <h2 class="text-lg font-bold text-[#1f2a24]">我的目标</h2>
          <div v-if="activePlan" class="mt-4 rounded-lg bg-white p-4">
            <p class="text-sm text-[#66736b]">目标院校</p>
            <p class="mt-1 text-xl font-bold text-[#1f2a24]">{{ activePlan.collegeName }}</p>
            <p class="mt-2 text-sm text-[#66736b]">目标专业：{{ activePlan.majorName || '未设置' }}</p>
            <p class="mt-1 text-sm text-[#66736b]">目标分数：{{ activePlan.targetScore || 0 }} 分</p>
            <p v-if="activePlan.notes" class="mt-3 text-sm leading-6 text-[#66736b]">{{ activePlan.notes }}</p>
          </div>
          <div v-else class="mt-4 rounded-lg border border-dashed border-[#b8cfc0] bg-white p-5 text-center">
            <p class="text-sm font-semibold text-[#1f2a24]">暂无目标规划</p>
            <p class="mt-2 text-xs leading-5 text-[#66736b]">收藏或手动设置目标后会显示在这里。</p>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="rounded-lg bg-white p-4">
              <p class="text-2xl font-bold text-[#1f2a24]">{{ activePlan?.countdownDays ?? 0 }}</p>
              <p class="mt-1 text-xs text-[#66736b]">备考倒计时</p>
            </div>
            <div class="rounded-lg bg-white p-4">
              <p class="text-2xl font-bold text-[#1f2a24]">{{ targetPlans.length }}</p>
              <p class="mt-1 text-xs text-[#66736b]">目标数量</p>
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-[#dce4dd] bg-white p-5">
          <h2 class="text-lg font-bold text-[#1f2a24]">目标任务</h2>
          <div class="mt-4 space-y-3">
            <div v-if="!targetPlans.length" class="rounded-lg border border-dashed border-[#b8cfc0] bg-[#f6f8f5] p-5 text-center text-sm text-[#66736b]">暂无目标任务。</div>
            <div v-for="plan in targetPlans" :key="plan.id" class="rounded-lg bg-[#f6f8f5] px-3 py-3 text-sm text-[#1f2a24]">
              <p class="font-semibold">{{ plan.collegeName }}</p>
              <p class="mt-1 text-xs text-[#66736b]">{{ plan.majorName || '未设置专业' }} · {{ plan.targetYear || '未设置年份' }}</p>
            </div>
          </div>
        </div>
      </aside>
    </section>

    <ProModal
      :open="targetModalOpen"
      title="收藏目标院校"
      code="M17. 收藏目标院校弹窗"
      description="确认院校、专业方向、备考年份和目标分数，加入你的目标规划。"
      width="680px"
      @close="targetModalOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-field">
          <span class="pro-label">院校名称</span>
          <input v-model="targetForm.collegeName" class="pro-input" />
        </div>
        <div class="pro-field">
          <span class="pro-label">专业方向</span>
          <select v-if="selectedCollege?.majors?.length" v-model="targetForm.majorName" class="pro-select">
            <option v-for="major in selectedCollege.majors" :key="major">{{ major }}</option>
          </select>
          <input v-else v-model="targetForm.majorName" class="pro-input" placeholder="请输入专业方向" />
        </div>
        <div class="pro-field">
          <span class="pro-label">备考年份</span>
          <input v-model.number="targetForm.targetYear" class="pro-input" type="number" />
        </div>
        <div class="pro-field">
          <span class="pro-label">目标分数预留</span>
          <input v-model.number="targetForm.targetScore" class="pro-input" type="number" />
        </div>
        <div class="pro-field">
          <span class="pro-label">备注</span>
          <textarea v-model="targetForm.notes" class="pro-textarea"></textarea>
        </div>
        <div class="pro-panel">
          <p class="text-sm font-black text-[#2d3748]">院校介绍</p>
          <p class="mt-2 text-sm leading-6 text-[#64748b]">{{ selectedCollege?.introduction || '暂无院校介绍。' }}</p>
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="targetModalOpen = false">取消</button>
        <button class="pro-btn pro-btn-soft" type="button" @click="saveTarget(false)">仅收藏</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="saveTarget(true)">加入目标规划</button>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { BookmarkPlus, Search } from '@lucide/vue'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import ProModal from '../../components/common/ProModal.vue'

const keyword = ref('')
const region = ref('')
const schoolType = ref('')
const colleges = ref<any[]>([])
const selectedCollege = ref<any | null>(null)
const targetPlans = ref<any[]>([])
const hasSearched = ref(false)
const targetModalOpen = ref(false)
const targetForm = ref({
  collegeName: '',
  majorName: '',
  targetYear: new Date().getFullYear() + 1,
  targetScore: 0,
  notes: '',
})
const activePlan = computed(() => targetPlans.value[0] ?? null)

const filteredColleges = computed(() => {
  return colleges.value.filter((college) => {
    const majors = Array.isArray(college.majors) ? college.majors : []
    const text = `${college.name}${college.region}${college.type}${majors.join('')}`.toLowerCase()
    const matchesKeyword = text.includes(keyword.value.toLowerCase())
    const matchesRegion = !region.value || college.region.includes(region.value)
    const matchesType = !schoolType.value || college.type.includes(schoolType.value)
    return matchesKeyword && matchesRegion && matchesType
  })
})

const search = async () => {
  try {
    const data = await api.searchColleges(keyword.value)
    colleges.value = data
  } catch {
    colleges.value = []
  } finally {
    hasSearched.value = true
  }
}

const openBlankTargetModal = () => {
  selectedCollege.value = null
  targetForm.value = {
    collegeName: '',
    majorName: '',
    targetYear: new Date().getFullYear() + 1,
    targetScore: 0,
    notes: '',
  }
  targetModalOpen.value = true
}

const openTargetModal = (college: any) => {
  selectedCollege.value = college
  targetForm.value = {
    collegeName: college.name,
    majorName: college.majors?.[0] ?? '',
    targetYear: new Date().getFullYear() + 1,
    targetScore: Number(String(college.scoreRange ?? '').split('-')[1] ?? 0) || 0,
    notes: college.introduction,
  }
  targetModalOpen.value = true
}

const saveTarget = async (asPlan = true) => {
  try {
    const created = await api.createTargetPlan({
      collegeName: targetForm.value.collegeName,
      majorName: targetForm.value.majorName,
      targetYear: targetForm.value.targetYear,
      targetScore: targetForm.value.targetScore,
      countdownDays: 0,
      notes: asPlan ? targetForm.value.notes : `仅收藏：${targetForm.value.notes}`,
    })
    targetPlans.value = [created, ...targetPlans.value]
  } catch {
    return
  }
  targetModalOpen.value = false
}

onMounted(async () => {
  try {
    targetPlans.value = await api.getTargetPlans()
  } catch {
    targetPlans.value = []
  }
})
</script>
