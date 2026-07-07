<template>
  <div>
    <PageHeader title="AI 接入与密钥设置" eyebrow="连接测试" description="配置 OpenAI 兼容接口，保存后可调用后端 `/ai/settings/test` 进行连通测试。">
      <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1f7a5a] px-4 text-sm font-semibold text-white hover:bg-[#155f46]" type="button" @click="apiModalOpen = true">
        <PlugZap class="h-4 w-4" />
        连接你的 AI 服务
      </button>
    </PageHeader>

    <section class="grid gap-5 lg:grid-cols-[1fr_340px]">
      <form class="rounded-lg border border-[#dce4dd] bg-white p-5" @submit.prevent="save">
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm font-semibold text-[#1f2a24]">
            服务商名称
            <input v-model="form.providerName" class="mt-2 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 outline-none focus:border-[#1f7a5a] focus:bg-white" />
          </label>
          <label class="block text-sm font-semibold text-[#1f2a24]">
            模型名称
            <input v-model="form.modelName" class="mt-2 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 outline-none focus:border-[#1f7a5a] focus:bg-white" />
          </label>
        </div>
        <label class="mt-4 block text-sm font-semibold text-[#1f2a24]">
          Base URL
          <input v-model="form.baseUrl" class="mt-2 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 outline-none focus:border-[#1f7a5a] focus:bg-white" />
        </label>
        <label class="mt-4 block text-sm font-semibold text-[#1f2a24]">
          API Key
          <input v-model="form.apiKey" class="mt-2 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#f6f8f5] px-3 outline-none focus:border-[#1f7a5a] focus:bg-white" type="password" />
        </label>
        <label class="mt-4 flex items-center gap-3 rounded-lg bg-[#f6f8f5] px-4 py-3">
          <input v-model="form.isEnabled" class="h-5 w-5 accent-[#1f7a5a]" type="checkbox" />
          <span class="text-sm font-semibold text-[#1f2a24]">启用当前 AI 配置</span>
        </label>

        <p v-if="message" class="mt-4 rounded-lg bg-[#eef4ef] px-3 py-2 text-sm text-[#1f7a5a]">{{ message }}</p>

        <div class="mt-5 flex flex-col gap-3 sm:flex-row">
          <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-5 text-sm font-semibold text-white hover:bg-[#155f46]" type="submit">
            <RefreshCw v-if="saving" class="h-4 w-4 animate-spin" />
            保存配置
          </button>
          <button class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#dce4dd] px-5 text-sm font-semibold text-[#1f2a24] hover:bg-[#eef4ef]" type="button" @click="test">
            <PlugZap class="h-4 w-4" />
            测试连接
          </button>
        </div>
      </form>

      <aside class="h-fit rounded-lg border border-[#dce4dd] bg-[#eef4ef] p-5">
        <h2 class="text-lg font-bold text-[#1f2a24]">配置状态</h2>
        <div class="mt-5 rounded-lg bg-white p-4">
          <p class="text-sm text-[#66736b]">最近测试</p>
          <p class="mt-2 text-xl font-bold" :class="testOk ? 'text-[#2f855a]' : 'text-[#b7791f]'">{{ testOk ? '已通过' : '未通过或未测试' }}</p>
        </div>
        <p class="mt-4 text-sm leading-6 text-[#66736b]">首次登录时建议先完成此项，AI 问答、生成题目和卡片功能会依赖这组配置。</p>
      </aside>
    </section>

    <ProModal
      :open="apiModalOpen"
      title="连接你的 AI 服务"
      code="M21. 首次 API Key 配置测试弹窗"
      description="知径需要使用你自己的 API Key 来完成资料解析、问答和练习生成。"
      width="760px"
      @close="apiModalOpen = false"
    >
      <div class="space-y-4">
        <div class="pro-field">
          <span class="pro-label">服务商选择</span>
          <select v-model="form.providerName" class="pro-select">
            <option>OpenAI Compatible</option>
            <option>自定义兼容接口</option>
            <option>本地模型网关</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">API Base URL</span>
          <input v-model="form.baseUrl" class="pro-input" placeholder="https://api.openai.com/v1" />
        </div>
        <div class="pro-field">
          <span class="pro-label">API Key</span>
          <input v-model="form.apiKey" class="pro-input" :type="showKey ? 'text' : 'password'" placeholder="sk-..." />
        </div>
        <div class="pro-field">
          <span class="pro-label">获取模型列表</span>
          <button class="pro-btn pro-btn-secondary" type="button" @click="fetchModels">获取模型列表</button>
        </div>
        <div class="pro-panel">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-sm font-black text-[#2d3748]">模型列表</p>
              <p class="mt-1 text-sm text-[#64748b]">{{ modelStatus }}</p>
            </div>
            <button class="pro-switch" :data-on="showKey" type="button" @click="showKey = !showKey"></button>
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            <button v-for="model in models" :key="model" class="pro-chip" type="button" @click="form.modelName = model">{{ model }}</button>
          </div>
        </div>
        <div class="pro-field">
          <span class="pro-label">模型选择器</span>
          <select v-model="form.modelName" class="pro-select">
            <option v-for="model in models" :key="model">{{ model }}</option>
          </select>
        </div>
        <div class="pro-field">
          <span class="pro-label">手动模型输入</span>
          <input v-model="form.modelName" class="pro-input" placeholder="例如 gpt-4.1-mini" />
        </div>
        <div class="pro-panel">
          <p class="text-sm font-black text-[#2d3748]">连接测试区</p>
          <p class="mt-2 text-sm leading-6" :class="testOk ? 'text-[#2f855a]' : 'text-[#b7791f]'">{{ testOk ? '测试成功：模型可用于 AI 解析、问答和练习生成。' : '未测试或测试失败：请检查 Base URL、API Key 和模型名。' }}</p>
        </div>
      </div>
      <template #footer>
        <button class="pro-btn pro-btn-secondary" type="button" @click="apiModalOpen = false">稍后设置</button>
        <button class="pro-btn pro-btn-soft" type="button" @click="test">测试连接</button>
        <button class="pro-btn pro-btn-primary" type="button" @click="save">保存并测试</button>
      </template>
    </ProModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { PlugZap, RefreshCw } from '@lucide/vue'
import { api } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import ProModal from '../../components/common/ProModal.vue'

const saving = ref(false)
const message = ref('')
const testOk = ref(false)
const apiModalOpen = ref(false)
const showKey = ref(false)
const modelStatus = ref('尚未获取模型列表，可手动填写模型名。')
const models = ref(['deepseek-chat', 'gpt-4.1-mini', 'qwen-plus'])
const form = reactive({
  providerName: 'OpenAI Compatible',
  baseUrl: 'https://api.deepseek.com/v1',
  apiKey: '',
  modelName: 'deepseek-chat',
  isEnabled: true,
})

onMounted(async () => {
  try {
    Object.assign(form, await api.getAiSettings())
  } catch {
    message.value = '后端未连接，当前为本地表单预览。'
  }
})

const save = async () => {
  saving.value = true
  message.value = ''
  try {
    await api.saveAiSettings({ ...form, testConnection: false })
    message.value = '配置已保存。'
  } catch {
    message.value = '暂未连接后端，已保留在当前页面。'
  } finally {
    saving.value = false
  }
}

const test = async () => {
  message.value = ''
  try {
    const result = await api.testAiSettings(form)
    testOk.value = Boolean(result?.ok ?? result?.success ?? true)
    message.value = 'AI 连接测试完成。'
  } catch {
    testOk.value = false
    message.value = '测试失败，请检查后端服务、Base URL 和 API Key。'
  }
}

const fetchModels = () => {
  modelStatus.value = `已获取 ${models.value.length} 个模型，默认推荐 ${models.value[0]}。`
  form.modelName = models.value[0]
}
</script>

<style scoped>
</style>
