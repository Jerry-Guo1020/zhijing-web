<template>
  <RouterView v-if="isAuthPage" />
  <AppShell v-else :backend-status="backendStatus" @check-backend="checkBackend">
    <RouterView />
  </AppShell>

  <BackendStatusModal
    :open="statusModalOpen"
    :status="backendStatus"
    :api-base-url="apiBaseUrl"
    @close="statusModalOpen = false"
    @retry="checkBackend"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { API_BASE_URL, checkApiHealth, type BackendStatus } from './api/client'
import BackendStatusModal from './components/common/BackendStatusModal.vue'
import AppShell from './components/layout/AppShell.vue'

const route = useRoute()
const backendStatus = ref<BackendStatus>('checking')
const statusModalOpen = ref(false)
const apiBaseUrl = API_BASE_URL

const isAuthPage = computed(() => route.meta.layout === 'auth')

const checkBackend = async () => {
  backendStatus.value = 'checking'
  backendStatus.value = await checkApiHealth()
  statusModalOpen.value = true
}

onMounted(checkBackend)
</script>

<style scoped>
</style>
