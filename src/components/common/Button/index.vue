<script setup lang="ts">
import { ref } from 'vue'
import { Button as AButton } from 'ant-design-vue'
import type { ButtonProps } from './types'

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'middle',
  loading: false,
  disabled: false,
  width: 120
})

const emit = defineEmits<{
  click: [e: MouseEvent]
  'update:width': [width: number]
}>()

const buttonRef = ref<HTMLElement | null>(null)
let startX = 0
let startWidth = 0
let isResizing = false

const handleResizeStart = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  
  if (!buttonRef.value) return
  
  isResizing = true
  startX = e.clientX
  startWidth = buttonRef.value.offsetWidth
  
  document.addEventListener('mousemove', handleResizeMove)
  document.addEventListener('mouseup', handleResizeEnd)
}

const handleResizeMove = (e: MouseEvent) => {
  if (!isResizing || !buttonRef.value) return
  
  const deltaX = e.clientX - startX
  const newWidth = Math.max(80, startWidth + deltaX)
  buttonRef.value.style.width = `${newWidth}px`
}

const handleResizeEnd = () => {
  isResizing = false
  if (buttonRef.value) {
    emit('update:width', buttonRef.value.offsetWidth)
  }
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', handleResizeEnd)
}
</script>

<template>
  <div 
    ref="buttonRef"
    class="resizable-button"
    :style="{ width: `${width}px` }"
  >
    <AButton
      class="button"
      :type="type"
      :size="size"
      :loading="loading"
      :disabled="disabled"
      :icon="icon"
      @click="emit('click', $event)"
    >
      <slot>{{ children }}</slot>
    </AButton>
    <div 
      class="resize-handle"
      @mousedown="handleResizeStart"
    >
      <div class="resize-indicator" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.resizable-button {
  position: relative;
  display: inline-block;
  background: #fff;
  border-radius: 2px;
  
  .button {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .resize-handle {
    position: absolute;
    top: 0;
    right: -4px;
    width: 8px;
    height: 100%;
    cursor: ew-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .resize-indicator {
      width: 2px;
      height: 16px;
      background-color: #d9d9d9;
      border-radius: 1px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    
    &:hover .resize-indicator {
      opacity: 1;
    }
  }
  
  &:hover .resize-handle .resize-indicator {
    opacity: 0.5;
  }
}
</style> 