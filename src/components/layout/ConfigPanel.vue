<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, Empty, Form, Input, Select, Button, Space, InputNumber, Switch, Tooltip, message } from 'ant-design-vue'
import type { TextArea } from 'ant-design-vue/es/input'
import { useCanvasStore } from '@/stores/canvas'
import TreeDataEditor from '../common/TreeDataEditor/index.vue'
import VariableSelect from '../common/VariableSelect/index.vue'
import { mockWorkflows } from '@/types/workflow'
import WorkflowInputs from '../common/WorkflowInputs/index.vue'

const canvasStore = useCanvasStore()
const promptInputRef = ref<{
  resizableTextArea?: {
    textArea: HTMLTextAreaElement
  }
} | null>(null)

interface ConfigItem {
  key: string
  label: string
  type: 'input' | 'select' | 'switch' | 'textarea' | 'options' | 'number' | 'tree-data' | 'input-group' | 'prompt-input' | 'workflow-inputs'
  options?: { label: string; value: string | number }[]
  min?: number
  max?: number
  step?: number
  treeConfig?: {
    titleField: string
    valueField: string
    childrenField: string
  }
  suffix?: string
  description?: string
}

// 组件变量类型定义
const componentVariableTypes = {
  'cascade-form': {
    type: '{ labels: string[], values: string[], paths: string[][] }',
    description: '级联选择的结果对象，包含标签数组、值数组和完整路径'
  },
  'text-display': {
    type: 'string',
    description: '文本内容'
  },
  'input': {
    type: 'string',
    description: '输入值'
  },
  'textarea': {
    type: 'string',
    description: '多行文本输入值'
  },
  'select': {
    type: 'string | string[]',
    description: '选中项的值（多选时为数组）'
  },
  'radio-group': {
    type: 'string',
    description: '选中项的值'
  },
  'checkbox-group': {
    type: 'string[]',
    description: '选中项的值数组'
  },
  'ai-completion': {
    type: 'string',
    description: 'AI补全的结果文本'
  },
  'ai-qa': {
    type: 'string',
    description: 'AI问答的回答文本'
  },
  'ai-generator': {
    type: 'string',
    description: 'AI生成的内容'
  }
} as const

// 工作流选项
const workflowOptions = ref([
  { label: '测试工作流', value: 'app-hdrNjAynLMRX93aP7ykyAUT0' }
])

// 获取工作流列表
const fetchWorkflows = async () => {
  try {
    // 这里可以调用 Dify API 获取工作流列表
    // 或者从环境变量中读取预配置的工作流
    const workflows = [
      { label: '测试工作流', value: 'app-hdrNjAynLMRX93aP7ykyAUT0' },
      { label: '教学设计工作流', value: 'app-teaching-design' },
      { label: '知识点生成工作流', value: 'app-knowledge-points' },
      { label: '练习题生成工作流', value: 'app-exercise-generator' }
    ]
    workflowOptions.value = workflows
  } catch (err) {
    console.error('获取工作流列表失败:', err)
    message.error('获取工作流列表失败')
  }
}

// 不同类型组件的配置项
const configMap: Record<string, ConfigItem[]> = {
  'cascade-form': [
    {
      key: 'variableName',
      label: '变量名',
      type: 'input-group',
      suffix: componentVariableTypes['cascade-form'].type
    },
    {
      key: 'items',
      label: '级联数据',
      type: 'tree-data',
      treeConfig: {
        titleField: 'label',
        valueField: 'value',
        childrenField: 'children'
      }
    },
    {
      key: 'maxLevel',
      label: '最大层级',
      type: 'number',
      min: 1,
      max: 5,
      step: 1
    },
    {
      key: 'multiple',
      label: '允许多选',
      type: 'switch'
    },
    {
      key: 'canAdd',
      label: '允许添加',
      type: 'switch'
    },
    {
      key: 'canDelete',
      label: '允许删除',
      type: 'switch'
    }
  ],
  'text-display': [
    {
      key: 'variableName',
      label: '变量名',
      type: 'input-group',
      suffix: componentVariableTypes['text-display'].type
    },
    { 
      key: 'content', 
      label: '显示模板', 
      type: 'textarea',
      description: '支持 Markdown 格式和变量插值 {{output}}，编辑后将显示在画布中'
    },
    {
      key: 'defaultWorkflow',
      label: '绑定工作流',
      type: 'select',
      options: workflowOptions
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
    },
    {
      key: 'width',
      label: '宽度',
      type: 'number',
      min: 200,
      max: 1200,
      step: 10
    },
    {
      key: 'height',
      label: '高度',
      type: 'number',
      min: 100,
      max: 800,
      step: 10
    }
  ],
  'input': [
    {
      key: 'variableName',
      label: '变量名',
      type: 'input-group',
      suffix: componentVariableTypes['input'].type
    },
    { key: 'placeholder', label: '占位提示', type: 'input' },
    { key: 'allowClear', label: '允许清除', type: 'switch' }
  ],
  'textarea': [
    {
      key: 'variableName',
      label: '变量名',
      type: 'input-group',
      suffix: componentVariableTypes['textarea'].type
    },
    { key: 'placeholder', label: '占位提示', type: 'input' },
    { key: 'rows', label: '行数', type: 'number', min: 2, max: 10, step: 1 }
  ],
  'select': [
    {
      key: 'variableName',
      label: '变量名',
      type: 'input-group',
      suffix: componentVariableTypes['select'].type
    },
    { key: 'placeholder', label: '占位提示', type: 'input' },
    { key: 'options', label: '选项', type: 'options' }
  ],
  'radio-group': [
    {
      key: 'variableName',
      label: '变量名',
      type: 'input-group',
      suffix: componentVariableTypes['radio-group'].type
    },
    { key: 'options', label: '选项', type: 'options' }
  ],
  'checkbox-group': [
    {
      key: 'variableName',
      label: '变量名',
      type: 'input-group',
      suffix: componentVariableTypes['checkbox-group'].type
    },
    { key: 'options', label: '选项', type: 'options' }
  ],
  'ai-completion': [
    {
      key: 'variableName',
      label: '变量名',
      type: 'input-group',
      suffix: componentVariableTypes['ai-completion'].type
    },
    { 
      key: 'defaultContent', 
      label: '默认内容', 
      type: 'textarea' 
    },
    { 
      key: 'prompt', 
      label: '提示词', 
      type: 'prompt-input',
      description: '可以使用 {{变量名}} 引用其他组件的值'
    }
  ],
  'ai-qa': [
    {
      key: 'variableName',
      label: '变量名',
      type: 'input-group',
      suffix: componentVariableTypes['ai-qa'].type
    },
    { key: 'placeholder', label: '占位提示', type: 'input' },
    { key: 'context', label: '上下文', type: 'textarea' }
  ],
  'ai-generator': [
    {
      key: 'variableName',
      label: '变量名',
      type: 'input-group',
      suffix: componentVariableTypes['ai-generator'].type
    },
    { key: 'type', label: '生成类型', type: 'input' },
    { key: 'prompt', label: '提示词', type: 'textarea' }
  ],
  'button': [
    { 
      key: 'children', 
      label: '按钮文字', 
      type: 'input' 
    },
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
    },
    { 
      key: 'size', 
      label: '按钮大小', 
      type: 'select',
      options: [
        { label: '大', value: 'large' },
        { label: '中', value: 'middle' },
        { label: '小', value: 'small' }
      ]
    },
    {
      key: 'width',
      label: '按钮宽度',
      type: 'number',
      min: 80,
      max: 500,
      step: 10
    },
    {
      key: 'workflowId',
      label: '触发工作流',
      type: 'select',
      options: workflowOptions
    },
    {
      key: 'workflowInputs',
      label: '工作流输入',
      type: 'workflow-inputs',
      description: '配置要传递给工作流的输入变量'
    }
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

onMounted(() => {
  fetchWorkflows()
})
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
            <template v-if="config.type === 'input-group'">
              <div class="variable-input-group">
                <Input 
                  v-model:value="canvasStore.selectedComponent.props[config.key]"
                  @change="(e) => handleConfigChange(config.key, e.target.value)"
                />
                <Tooltip :title="componentVariableTypes[canvasStore.selectedComponent.type]?.description">
                  <div class="type-suffix">{{ config.suffix }}</div>
                </Tooltip>
              </div>
            </template>
            <Input 
              v-else-if="config.type === 'input'"
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
            <Switch
              v-else-if="config.type === 'switch'"
              v-model:checked="canvasStore.selectedComponent.props[config.key]"
              @change="(value) => handleConfigChange(config.key, value)"
            />
            <TreeDataEditor
              v-else-if="config.type === 'tree-data'"
              v-model:value="canvasStore.selectedComponent.props[config.key]"
              v-bind="config.treeConfig"
              @update:value="(value) => handleConfigChange(config.key, value)"
            />
            <WorkflowInputs
              v-else-if="config.type === 'workflow-inputs'"
              v-model:value="canvasStore.selectedComponent.props[config.key]"
              :exclude-id="canvasStore.selectedComponent.id"
              @update:value="(value) => handleConfigChange(config.key, value)"
            />
            <template v-else-if="config.type === 'prompt-input'">
              <div class="prompt-input">
                <Input.TextArea
                  v-model:value="canvasStore.selectedComponent.props[config.key]"
                  :placeholder="'请输入提示词，可以使用变量'"
                  :rows="3"
                  @change="(e) => handleConfigChange(config.key, e.target.value)"
                />
                <div class="prompt-tools">
                  <VariableSelect
                    :exclude-id="canvasStore.selectedComponent.id"
                    @select="(value) => {
                      const currentValue = canvasStore.selectedComponent.props[config.key] || ''
                      handleConfigChange(config.key, currentValue + value)
                    }"
                  />
                </div>
              </div>
            </template>
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

  .variable-input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .ant-input {
      width: 100%;
    }

    .type-suffix {
      align-self: flex-start;
      padding: 2px 8px;
      background: #f5f5f5;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      color: #666;
      font-family: monospace;
      font-size: 12px;
      cursor: help;
    }
  }

  .prompt-input {
    .prompt-tools {
      margin-top: 8px;
      display: flex;
      gap: 8px;
    }
  }
}
</style> 