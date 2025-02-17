<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, Empty, Form, Input, Select, Button, Space, InputNumber } from 'ant-design-vue'
import { useCanvasStore } from '@/stores/canvas'

const canvasStore = useCanvasStore()

interface ConfigItem {
  key: string
  label: string
  type: 'input' | 'select' | 'switch' | 'textarea' | 'options' | 'number'
  options?: { label: string; value: string | number }[]
  min?: number
  max?: number
  step?: number
}

// 不同类型组件的配置项
const configMap: Record<string, ConfigItem[]> = {
  'text-display': [
    { 
      key: 'content', 
      label: '文本内容', 
      type: 'textarea' 
    },
    { 
      key: 'fontSize', 
      label: '字体大小', 
      type: 'number',
      min: 12,
      max: 100,
      step: 1
    },
    { 
      key: 'align', 
      label: '对齐方式', 
      type: 'select',
      options: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' }
      ]
    },
    {
      key: 'fontWeight',
      label: '字体粗细',
      type: 'select',
      options: [
        { label: '正常', value: 'normal' },
        { label: '加粗', value: 'bold' },
        { label: '细体', value: 'lighter' }
      ]
    }
  ],
  input: [
    { key: 'placeholder', label: '占位提示', type: 'input' },
    { key: 'allowClear', label: '允许清除', type: 'switch' }
  ],
  button: [
    { key: 'children', label: '按钮文本', type: 'input' },
    { 
      key: 'type', 
      label: '按钮类型', 
      type: 'select',
      options: [
        { label: '主按钮', value: 'primary' },
        { label: '次按钮', value: 'default' },
        { label: '虚线按钮', value: 'dashed' },
        { label: '文本按钮', value: 'text' },
        { label: '链接按钮', value: 'link' }
      ]
    }
  ],
  select: [
    { key: 'placeholder', label: '占位提示', type: 'input' },
    { key: 'options', label: '选项', type: 'options' }
  ],
  'ai-completion': [
    { key: 'placeholder', label: '占位提示', type: 'input' },
    { key: 'model', label: '模型', type: 'input' }
  ],
  'ai-qa': [
    { key: 'placeholder', label: '占位提示', type: 'input' },
    { key: 'context', label: '上下文', type: 'textarea' }
  ],
  'ai-generator': [
    { key: 'type', label: '生成类型', type: 'input' },
    { key: 'prompt', label: '提示词', type: 'textarea' }
  ]
}

const currentConfigs = computed(() => {
  if (!canvasStore.selectedComponent) return []
  return configMap[canvasStore.selectedComponent.type] || []
})

const handleConfigChange = (key: string, value: any) => {
  if (!canvasStore.selectedComponent) return
  
  canvasStore.updateComponent(canvasStore.selectedComponent.id, {
    props: {
      ...canvasStore.selectedComponent.props,
      [key]: value
    }
  })
}

const handleDeleteComponent = () => {
  if (!canvasStore.selectedComponent) return
  canvasStore.removeComponent(canvasStore.selectedComponent.id)
}
</script>

<template>
  <div class="config-panel">
    <Card title="组件配置" :bordered="false">
      <template v-if="canvasStore.selectedComponent">
        <Form layout="vertical">
          <Form.Item
            v-for="config in currentConfigs"
            :key="config.key"
            :label="config.label"
          >
            <Input 
              v-if="config.type === 'input'"
              v-model:value="canvasStore.selectedComponent.props[config.key]"
              @change="(e) => handleConfigChange(config.key, e.target.value)"
            />
            <Select
              v-else-if="config.type === 'select'"
              v-model:value="canvasStore.selectedComponent.props[config.key]"
              :options="config.options"
              @change="(value) => handleConfigChange(config.key, value)"
            />
            <Input.TextArea
              v-else-if="config.type === 'textarea'"
              v-model:value="canvasStore.selectedComponent.props[config.key]"
              :rows="4"
              :placeholder="'请输入文本内容'"
              @change="(e) => handleConfigChange(config.key, e.target.value)"
            />
            <InputNumber
              v-else-if="config.type === 'number'"
              v-model:value="canvasStore.selectedComponent.props[config.key]"
              :min="config.min"
              :max="config.max"
              :step="config.step"
              :addonAfter="config.key === 'fontSize' ? 'px' : undefined"
              style="width: 120px"
              @change="(value) => handleConfigChange(config.key, value)"
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" danger @click="handleDeleteComponent">
                删除组件
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </template>
      <Empty v-else description="请选择要配置的组件" />
    </Card>
  </div>
</template>

<style lang="less" scoped>
.config-panel {
  height: 100%;
  padding: 12px;
  
  :deep(.ant-card) {
    height: 100%;
    overflow-y: auto;
  }
}
</style> 