<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button as AButton, message } from 'ant-design-vue'
import type { ButtonProps } from './types'
import { useCanvasStore } from '@/stores/canvas'

interface WorkflowInput {
  key: string
  value: string
}

interface Props {
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
  size?: 'large' | 'middle' | 'small'
  children?: string
  width?: number
  workflowId?: string
  workflowInputs?: WorkflowInput[]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'middle',
  children: '按钮',
  width: 120,
  workflowId: '',
  workflowInputs: () => []
})

const canvasStore = useCanvasStore()

const buttonStyle = computed(() => ({
  width: `${props.width}px`
}))

const handleClick = async () => {
  if (!props.workflowId) {
    message.warning('请先配置工作流')
    return
  }

  try {
    // 收集工作流输入变量
    const inputs: Record<string, string> = {}
    for (const input of props.workflowInputs || []) {
      if (!input.key || !input.value) continue
      
      // 从画布中查找变量值
      const sourceComponent = canvasStore.components.find(
        comp => comp.props.variableName === input.value
      )
      
      if (sourceComponent) {
        // 获取组件的值（根据组件类型获取不同的属性）
        let value = ''
        switch (sourceComponent.type) {
          case 'input':
          case 'textarea':
            value = sourceComponent.props.value || ''
            break
          case 'text-display':
            value = sourceComponent.props.content || ''
            break
          case 'select':
          case 'radio-group':
          case 'checkbox-group':
            value = sourceComponent.props.value || ''
            break
          default:
            value = sourceComponent.props.value || sourceComponent.props.content || ''
        }
        
        // 如果值是数组，转换为字符串
        if (Array.isArray(value)) {
          value = value.join(', ')
        }
        
        inputs[input.key] = value
      }
    }

    console.log('工作流输入:', inputs)

    // 从输入框获取查询文本
    const queryInput = canvasStore.components.find(
      comp => comp.type === 'input' && comp.props.variableName === 'query'
    )
    const query = queryInput?.props.value || "请根据输入生成内容"

    // 调用 Dify API
    const baseUrl = import.meta.env.DIFY_BASE_URL || 'https://api.dify.ai/v1'
    const apiKey = props.workflowId

    const response = await fetch(`${baseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs,
        query,
        response_mode: "blocking",
        user: "system"
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || '工作流执行失败')
    }
    
    const result = await response.json()
    console.log('API 响应:', result) // 添加调试日志
    
    // 查找目标文本显示组件
    const textDisplayComponents = canvasStore.components.filter(
      comp => comp.type === 'text-display' && comp.props.defaultWorkflow === props.workflowId
    )

    // 更新文本显示组件的内容
    if (textDisplayComponents.length > 0) {
      const textDisplay = textDisplayComponents[0]
      canvasStore.updateWorkflowOutput(textDisplay.id, result.answer)
      message.success('内容已更新')
    } else {
      throw new Error('未找到匹配的文本显示组件')
    }
  } catch (err) {
    console.error('执行错误:', err)
    message.error(err instanceof Error ? err.message : '执行失败')
  }
}

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
    :style="buttonStyle"
  >
    <AButton
      class="button"
      :type="type"
      :size="size"
      :loading="loading"
      :disabled="disabled"
      :icon="icon"
      @click="handleClick"
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