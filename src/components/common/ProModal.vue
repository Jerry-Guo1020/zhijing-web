<template>
  <Teleport to="body">
    <div v-if="open" class="pro-modal-overlay" @click.self="$emit('close')">
      <section class="pro-modal" :style="{ maxWidth: width }" role="dialog" aria-modal="true" :aria-label="title">
        <header class="pro-modal-header">
          <div>
            <p v-if="code" class="pro-modal-code">{{ code }}</p>
            <h2>{{ title }}</h2>
            <p v-if="description">{{ description }}</p>
          </div>
          <button class="pro-modal-close" type="button" aria-label="关闭" @click="$emit('close')">
            <X class="h-5 w-5" />
          </button>
        </header>

        <div class="pro-modal-body">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="pro-modal-footer">
          <span class="pro-modal-footnote">Pro Max 弹窗效果图</span>
          <div class="pro-modal-actions">
            <slot name="footer" />
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue'

withDefaults(
  defineProps<{
    open: boolean
    title: string
    description?: string
    code?: string
    width?: string
  }>(),
  {
    width: '720px',
  },
)

defineEmits<{
  close: []
}>()
</script>

<style scoped>
.pro-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    linear-gradient(rgba(31, 42, 36, 0.36), rgba(31, 42, 36, 0.36)),
    linear-gradient(135deg, #fff9f2, #ffe8df);
}

.pro-modal-overlay::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.24;
  background-image:
    linear-gradient(#f2dfd1 1px, transparent 1px),
    linear-gradient(90deg, #f2dfd1 1px, transparent 1px);
  background-size: 36px 36px;
}

.pro-modal {
  position: relative;
  z-index: 1;
  width: min(100%, 720px);
  max-height: min(90vh, 720px);
  overflow: hidden;
  border: 3px solid #2d3748;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 8px 8px 0 #2d3748;
  color: #2d3748;
}

.pro-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 28px 34px 24px;
  border-bottom: 3px solid #2d3748;
}

.pro-modal-code {
  margin: 0 0 8px;
  color: #1f7a5a;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0;
}

.pro-modal-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 24px;
  font-weight: 900;
  line-height: 1.25;
}

.pro-modal-header p:not(.pro-modal-code) {
  margin: 10px 0 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.pro-modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border: 3px solid #2d3748;
  border-radius: 12px;
  background: #add8e6;
  color: #2d3748;
  box-shadow: 4px 4px 0 #2d3748;
}

.pro-modal-body {
  max-height: calc(min(90vh, 720px) - 185px);
  overflow: auto;
  padding: 26px 34px;
}

.pro-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 34px;
  border-top: 3px solid #2d3748;
  background: #ffffff;
}

.pro-modal-footnote {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.pro-modal-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.pro-field) {
  display: grid;
  grid-template-columns: minmax(110px, 190px) minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  min-height: 58px;
}

:deep(.pro-label) {
  color: #2d3748;
  font-size: 13px;
  font-weight: 900;
}

:deep(.pro-input),
:deep(.pro-select),
:deep(.pro-textarea) {
  width: 100%;
  border: 3px solid #2d3748;
  border-radius: 8px;
  background: #ffffff;
  color: #2d3748;
  font-size: 13px;
  outline: none;
}

:deep(.pro-input),
:deep(.pro-select) {
  height: 38px;
  padding: 0 14px;
}

:deep(.pro-textarea) {
  min-height: 112px;
  padding: 12px 14px;
  line-height: 1.7;
}

:deep(.pro-panel) {
  border: 3px solid #2d3748;
  border-radius: 8px;
  background: linear-gradient(135deg, #f0fff0, #eaf7ff);
  padding: 16px;
}

:deep(.pro-chip) {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  border: 2px solid #2d3748;
  border-radius: 999px;
  background: #ffffff;
  padding: 3px 10px;
  color: #2d3748;
  font-size: 12px;
  font-weight: 800;
}

:deep(.pro-switch) {
  position: relative;
  width: 50px;
  height: 28px;
  border: 3px solid #2d3748;
  border-radius: 999px;
  background: #e2e8f0;
}

:deep(.pro-switch[data-on="true"]) {
  background: #22c55e;
}

:deep(.pro-switch)::after {
  content: "";
  position: absolute;
  top: 6px;
  left: 7px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #ffffff;
}

:deep(.pro-switch[data-on="true"])::after {
  left: 31px;
}

:deep(.pro-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 108px;
  height: 44px;
  border: 3px solid #2d3748;
  border-radius: 16px;
  padding: 0 18px;
  color: #2d3748;
  font-size: 14px;
  font-weight: 900;
  box-shadow: 6px 6px 0 #2d3748;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

:deep(.pro-btn:hover) {
  transform: translate(2px, 2px);
  box-shadow: 4px 4px 0 #2d3748;
}

:deep(.pro-btn-primary) {
  background: #22c55e;
  color: #ffffff;
}

:deep(.pro-btn-secondary) {
  background: #add8e6;
}

:deep(.pro-btn-soft) {
  background: #ffffff;
}

@media (max-width: 640px) {
  .pro-modal-overlay {
    align-items: flex-end;
    padding: 0;
  }

  .pro-modal {
    width: 100%;
    max-height: 96vh;
    border-right: 0;
    border-bottom: 0;
    border-left: 0;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -6px 0 #2d3748;
  }

  .pro-modal-header,
  .pro-modal-body,
  .pro-modal-footer {
    padding-right: 20px;
    padding-left: 20px;
  }

  .pro-modal-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .pro-modal-actions {
    justify-content: stretch;
  }

  :deep(.pro-btn) {
    flex: 1 1 auto;
  }

  :deep(.pro-field) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
