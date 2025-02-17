<template>
  <div 
    ref="containerRef"
    class="text-content" 
    :style="style"
  >
    <div class="content-area">
      <div v-if="error" class="error-message">
        <a-alert type="error" :message="error" show-icon />
      </div>
      <div v-else class="content-text" :style="contentStyle">
        <div class="markdown-content">
          {{ displayContent }}
        </div>
      </div>
    </div>
    
    <!-- 调整大小的手柄 -->
    <div class="resize-handle resize-right" @mousedown="handleResizeStart('right')" />
    <div class="resize-handle resize-bottom" @mousedown="handleResizeStart('bottom')" />
    <div class="resize-handle resize-corner" @mousedown="handleResizeStart('corner')" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'

// Props 定义
interface Props {
  id?: string
  title?: string
  defaultWorkflow?: string
  placeholder?: string
  width?: number | string
  height?: number | string
  fontSize?: number
  align?: 'left' | 'center' | 'right'
  fontWeight?: 'normal' | 'bold' | 'lighter'
  content?: string
  workflowOutput?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  title: '文本显示',
  defaultWorkflow: '',  // 默认不绑定工作流
  placeholder: '请输入文本内容',
  width: 400,
  height: 300,
  fontSize: 14,
  align: 'left',
  fontWeight: 'normal',
  content: '',
  workflowOutput: ''
})

const emit = defineEmits<{
  (e: 'update:width', value: number): void
  (e: 'update:height', value: number): void
}>()

// 计算样式
const style = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  padding: '12px',
  background: '#fff',
  borderRadius: '4px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  position: 'relative' as const
}))

const contentStyle = computed(() => ({
  fontSize: `${props.fontSize}px`,
  textAlign: props.align,
  fontWeight: props.fontWeight
}))

// 状态定义
const error = ref('')
const containerRef = ref<HTMLElement | null>(null)
let startX = 0
let startY = 0
let startWidth = 0
let startHeight = 0
let resizeType: 'right' | 'bottom' | 'corner' | null = null

// 处理大小调整
const handleResizeStart = (type: 'right' | 'bottom' | 'corner') => (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  
  if (!containerRef.value) return
  
  resizeType = type
  startX = e.clientX
  startY = e.clientY
  startWidth = containerRef.value.offsetWidth
  startHeight = containerRef.value.offsetHeight
  
  document.addEventListener('mousemove', handleResizeMove)
  document.addEventListener('mouseup', handleResizeEnd)
}

const handleResizeMove = (e: MouseEvent) => {
  if (!containerRef.value || !resizeType) return
  
  const deltaX = e.clientX - startX
  const deltaY = e.clientY - startY
  
  if (resizeType === 'right' || resizeType === 'corner') {
    const newWidth = Math.max(200, startWidth + deltaX)
    emit('update:width', newWidth)
  }
  
  if (resizeType === 'bottom' || resizeType === 'corner') {
    const newHeight = Math.max(100, startHeight + deltaY)
    emit('update:height', newHeight)
  }
}

const handleResizeEnd = () => {
  resizeType = null
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', handleResizeEnd)
}

// 计算属性
const displayContent = computed(() => {
  let content = props.content || props.placeholder || ''
  if (props.workflowOutput) {
    content = content.replace(/\{\{output\}\}/g, props.workflowOutput)
  }
  return content
})

// 暴露组件接口
defineExpose({
  setContent: (newContent: string) => {
    props.content = newContent
  },
  getContent: () => props.content
})
</script>

<style scoped lang="less">
.text-content {
  position: relative;
  overflow: hidden;
  
  .content-area {
    height: 100%;
    overflow-y: auto;
    
    .error-message {
      margin: 8px 0;
    }
    
    .content-text {
      line-height: 1.6;
      
      :deep(.md-editor-preview) {
        background: none;
        padding: 0;
        border: none;
        
        // 移除默认的 markdown 编辑器样式
        .md-editor-preview-wrapper {
          padding: 0;
          margin: 0;
        }
      }
    }
  }
  
  .resize-handle {
    position: absolute;
    background: transparent;
    
    &.resize-right {
      top: 0;
      right: 0;
      width: 6px;
      height: 100%;
      cursor: ew-resize;
    }
    
    &.resize-bottom {
      bottom: 0;
      left: 0;
      width: 100%;
      height: 6px;
      cursor: ns-resize;
    }
    
    &.resize-corner {
      right: 0;
      bottom: 0;
      width: 12px;
      height: 12px;
      cursor: nwse-resize;
      
      &::after {
        content: '';
        position: absolute;
        right: 4px;
        bottom: 4px;
        width: 4px;
        height: 4px;
        background: #d9d9d9;
        border-radius: 50%;
      }
    }
    
    &:hover {
      &.resize-right, &.resize-bottom {
        background: rgba(24, 144, 255, 0.1);
      }
      
      &.resize-corner::after {
        background: #1890ff;
      }
    }
  }
}
</style> 