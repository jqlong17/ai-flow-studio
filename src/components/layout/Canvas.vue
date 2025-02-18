<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  Card, 
  Input, 
  Select, 
  Radio,
  Checkbox,
  message
} from 'ant-design-vue'
import { useCanvasStore, type CanvasComponent } from '@/stores/canvas'
import type { Component } from 'vue'

// 导入通用组件
import TextContent from '../common/TextDisplay/TextContent.vue'
import CascadeForm from '../common/CascadeForm/index.vue'
import AICompletion from '../common/AICompletion/index.vue'
import Button from '../common/Button/index.vue'

const { TextArea } = Input

const canvasStore = useCanvasStore()

// 拖拽状态
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragComponent = ref<CanvasComponent | null>(null)

// 添加画布引用
const canvasRef = ref<HTMLElement | null>(null)

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}

// 修改拖拽处理逻辑
const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  if (!e.dataTransfer) return
  
  try {
    const data = JSON.parse(e.dataTransfer.getData('text/plain'))
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    
    // 放置在画布上的位置
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    
    console.log('组件放置:', {
      componentType: data.type,
      position,
      totalComponents: canvasStore.components.length
    })
    
    canvasStore.addComponent({
      ...data,
      position
    })
  } catch (err) {
    console.error('添加组件失败:', err)
    message.error('添加组件失败')
  }
}

const handleComponentClick = (e: MouseEvent, component: CanvasComponent) => {
  e.stopPropagation()
  console.log('选中组件:', {
    componentId: component.id,
    componentType: component.type
  })
  canvasStore.selectComponent(component.id)
}

const handleCanvasClick = () => {
  console.log('取消选中组件')
  canvasStore.selectComponent(null)
}

// 修改移动处理逻辑
const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !dragComponent.value || !canvasRef.value) return
  
  const canvasRect = canvasRef.value.getBoundingClientRect()
  const mouseX = e.clientX - canvasRect.left
  const mouseY = e.clientY - canvasRect.top
  
  // 在画布中移动
  console.log('移动画布中的组件:', {
    componentId: dragComponent.value.id,
    newPosition: {
      x: Math.max(0, mouseX - dragStartX.value),
      y: Math.max(0, mouseY - dragStartY.value)
    },
    mousePosition: { x: mouseX, y: mouseY }
  })
  
  canvasStore.updateComponent(dragComponent.value.id, {
    position: {
      x: Math.max(0, mouseX - dragStartX.value),
      y: Math.max(0, mouseY - dragStartY.value)
    }
  })
}

const handleMouseUp = () => {
  if (dragComponent.value) {
    console.log('完成组件拖动:', {
      componentId: dragComponent.value.id,
      finalPosition: dragComponent.value.position
    })
  }
  
  isDragging.value = false
  dragComponent.value = null
  
  // 移除全局鼠标事件监听
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

// 修改组件拖拽移动相关方法
const handleComponentMouseDown = (e: MouseEvent, component: CanvasComponent) => {
  e.stopPropagation()
  
  if (!canvasRef.value) return
  
  isDragging.value = true
  dragComponent.value = component
  
  const canvasRect = canvasRef.value.getBoundingClientRect()
  dragStartX.value = e.clientX - canvasRect.left - component.position.x
  dragStartY.value = e.clientY - canvasRect.top - component.position.y
  
  console.log('开始拖动组件:', {
    componentId: component.id,
    componentType: component.type,
    startPosition: {
      x: component.position.x,
      y: component.position.y
    },
    mouseOffset: {
      x: dragStartX.value,
      y: dragStartY.value
    }
  })
  
  // 选中当前组件
  canvasStore.selectComponent(component.id)
  
  // 添加全局鼠标事件监听
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// 处理组件属性更新
const handlePropUpdate = (componentId: string, propName: string, value: any) => {
  const component = canvasStore.components.find(c => c.id === componentId)
  if (!component) return
  
  console.log('更新组件属性:', {
    componentId,
    propName,
    value,
    componentType: component.type
  })
  
  // 处理树形数据的特殊情况
  if (propName === 'items' && Array.isArray(value)) {
    canvasStore.updateComponent(componentId, {
      props: {
        ...component.props,
        items: value
      }
    })
    return
  }
  
  canvasStore.updateComponent(componentId, {
    props: {
      ...component.props,
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
  'ai-completion': AICompletion,
  'ai-qa': Input,
  'ai-generator': TextArea,
  'text-display': TextContent,
  'cascade-form': CascadeForm
}

// 添加新的键盘事件处理
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (canvasStore.selectedId) {
      e.preventDefault() // 阻止默认行为
      console.log('删除组件:', {
        componentId: canvasStore.selectedId,
        componentType: canvasStore.selectedComponent?.type
      })
      canvasStore.removeComponent(canvasStore.selectedId)
      message.success('组件已删除')
    }
  }
}
</script>

<template>
  <div 
    class="canvas-container"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @click="handleCanvasClick"
    @keydown="handleKeyDown"
    tabindex="-1"
    ref="canvasRef"
  >
    <Card class="canvas-card">
      <div class="canvas-content">
        <template v-for="component in canvasStore.components" :key="component.id">
          <div
            :data-component-id="component.id"
            :data-component-type="component.type"
            class="canvas-component"
            :class="{ 
              'is-selected': component.id === canvasStore.selectedId,
              'is-dragging': isDragging && dragComponent?.id === component.id
            }"
            :style="{
              left: `${component.position.x}px`,
              top: `${component.position.y}px`,
              position: 'absolute'
            }"
            @click="(e) => handleComponentClick(e, component)"
            @mousedown="(e) => handleComponentMouseDown(e, component)"
          >
            <component
              :is="componentMap[component.type]"
              v-bind="component.props"
              :id="component.id"
              :content="component.type === 'text-display' && component.workflowOutput ? 
                component.props.content.replace(/\{\{output\}\}/g, component.workflowOutput) : 
                component.props.content"
              @update:content="(value: string) => handlePropUpdate(component.id, 'content', value)"
              @update:fontSize="(value: number) => handlePropUpdate(component.id, 'fontSize', value)"
              @update:width="(value: number) => handlePropUpdate(component.id, 'width', value)"
              @update:align="(value: string) => handlePropUpdate(component.id, 'align', value)"
              @update:fontWeight="(value: string) => handlePropUpdate(component.id, 'fontWeight', value)"
            />
          </div>
        </template>
      </div>
    </Card>
  </div>
</template>

<style lang="less" scoped>
.canvas-container {
  height: 100%;
  outline: none;
  position: relative;
  padding: 16px 24px;
  background: #fafafa;
  
  &:focus {
    outline: none;
  }
  
  .canvas-card {
    height: 100%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    
    :deep(.ant-card-body) {
      height: calc(100% - 48px);
      padding: 24px;
    }
    
    .canvas-content {
      height: 100%;
      min-height: 500px;
      position: relative;
      background: #fff;
      border: 1px dashed #d9d9d9;
      border-radius: 8px;
      transition: border-color 0.3s;
      padding: 16px;
      
      &:hover {
        border-color: #40a9ff;
      }
      
      &::after {
        content: '将组件拖拽到此处';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #bfbfbf;
        font-size: 14px;
        padding: 32px;
        border: 2px dashed #e8e8e8;
        border-radius: 8px;
        background: #fafafa;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
      }
      
      &:not(:has(.canvas-component))::after {
        opacity: 0.8;
      }
      
      .canvas-component {
        min-width: 120px;
        padding: 8px;
        border: 2px solid transparent;
        border-radius: 4px;
        cursor: move;
        user-select: none;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        position: absolute;
        
        &.is-selected {
          border-color: #1890ff;
          z-index: 1;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        
        &.is-dragging {
          opacity: 0.8;
          z-index: 2;
        }
      }
    }
  }
}
</style> 