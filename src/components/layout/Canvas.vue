<script setup lang="ts">
import { ref } from 'vue'
import { 
  Card, 
  Input, 
  Button, 
  Select, 
  Radio,
  Checkbox,
  message
} from 'ant-design-vue'
import { useCanvasStore, type CanvasComponent } from '@/stores/canvas'
import type { Component } from 'vue'

// 导入教育组件
import KnowledgePoint from '../education/KnowledgePoint.vue'
import Exercise from '../education/Exercise.vue'
import Explanation from '../education/Explanation.vue'
import LearningObjective from '../education/LearningObjective.vue'
import FeedbackForm from '../education/FeedbackForm.vue'
// 导入通用组件
import TextDisplay from '../common/Text/TextDisplay.vue'

const { TextArea } = Input

const canvasStore = useCanvasStore()

// 拖拽状态
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragComponent = ref<CanvasComponent | null>(null)

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  if (!e.dataTransfer) return
  
  try {
    const data = JSON.parse(e.dataTransfer.getData('application/json'))
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    
    canvasStore.addComponent({
      ...data,
      position: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    })
  } catch (err) {
    console.error('Failed to parse component data:', err)
    message.error('添加组件失败')
  }
}

const handleComponentClick = (e: MouseEvent, component: CanvasComponent) => {
  e.stopPropagation()
  canvasStore.selectComponent(component.id)
}

const handleCanvasClick = () => {
  canvasStore.selectComponent(null)
}

// 组件拖拽移动相关方法
const handleComponentMouseDown = (e: MouseEvent, component: CanvasComponent) => {
  e.stopPropagation()
  
  isDragging.value = true
  dragComponent.value = component
  dragStartX.value = e.clientX - component.position.x
  dragStartY.value = e.clientY - component.position.y
  
  // 选中当前组件
  canvasStore.selectComponent(component.id)
  
  // 添加全局鼠标事件监听
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !dragComponent.value) return
  
  const newX = e.clientX - dragStartX.value
  const newY = e.clientY - dragStartY.value
  
  canvasStore.updateComponent(dragComponent.value.id, {
    position: {
      x: Math.max(0, newX),
      y: Math.max(0, newY)
    }
  })
}

const handleMouseUp = () => {
  isDragging.value = false
  dragComponent.value = null
  
  // 移除全局鼠标事件监听
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

// 处理组件属性更新
const handlePropUpdate = (componentId: string, propName: string, value: any) => {
  canvasStore.updateComponent(componentId, {
    props: {
      ...canvasStore.components.find(c => c.id === componentId)?.props,
      [propName]: value
    }
  })
}

// 组件映射表
const componentMap: Record<string, Component> = {
  input: Input,
  textarea: TextArea,
  button: Button,
  select: Select,
  'radio-group': Radio.Group,
  'checkbox-group': Checkbox.Group,
  'ai-completion': Input,
  'ai-qa': Input,
  'ai-generator': TextArea,
  'knowledge-point': KnowledgePoint,
  'exercise': Exercise,
  'explanation': Explanation,
  'learning-objective': LearningObjective,
  'feedback-form': FeedbackForm,
  'text-display': TextDisplay
}
</script>

<template>
  <div 
    class="canvas-container"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @click="handleCanvasClick"
  >
    <Card class="canvas-card">
      <div class="canvas-content">
        <template v-if="canvasStore.components.length > 0">
          <div
            v-for="component in canvasStore.components"
            :key="component.id"
            class="canvas-component"
            :class="{ 
              'is-selected': component.id === canvasStore.selectedId,
              'is-dragging': isDragging && dragComponent?.id === component.id
            }"
            :style="{
              left: `${component.position.x}px`,
              top: `${component.position.y}px`
            }"
            @click="(e) => handleComponentClick(e, component)"
            @mousedown="(e) => handleComponentMouseDown(e, component)"
          >
            <component
              :is="componentMap[component.type]"
              v-bind="component.props"
              @update:content="(value) => handlePropUpdate(component.id, 'content', value)"
              @update:fontSize="(value) => handlePropUpdate(component.id, 'fontSize', value)"
            />
          </div>
        </template>
        <div v-else class="placeholder">
          将组件拖拽到此处
        </div>
      </div>
    </Card>
  </div>
</template>

<style lang="less" scoped>
.canvas-container {
  height: 100%;
  
  .canvas-card {
    height: 100%;
    
    .canvas-content {
      min-height: 500px;
      position: relative;
      
      .canvas-component {
        position: absolute;
        min-width: 120px;
        padding: 4px;
        border: 2px solid transparent;
        border-radius: 4px;
        cursor: move;
        user-select: none;
        background: #fff;
        
        &.is-selected {
          border-color: #1890ff;
          z-index: 1;
        }
        
        &.is-dragging {
          opacity: 0.8;
          z-index: 2;
        }
        
        &:hover {
          border-color: #40a9ff;
        }
      }
      
      .placeholder {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #999;
        font-size: 16px;
      }
    }
  }
}
</style> 