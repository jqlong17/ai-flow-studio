<script setup lang="ts">
import { ref } from 'vue'
import { Card, Tabs } from 'ant-design-vue'

const activeKey = ref('1')

interface ComponentItem {
  name: string
  type: string
  icon: string
  defaultProps: Record<string, any>
}

const components = [
  {
    title: '基础组件',
    items: [
      { 
        name: '级联表单', 
        type: 'cascade-form',
        icon: 'form',
        defaultProps: {
          items: [],
          maxLevel: 3,
          canAdd: true,
          canDelete: true,
          multiple: false
        }
      },
      { 
        name: '工作流显示', 
        type: 'text-display',
        icon: 'FileTextOutlined',
        defaultProps: {
          content: '显示内容: {{output}}',
          width: 400,
          height: 300,
          fontSize: 14,
          align: 'left',
          fontWeight: 'normal',
          defaultWorkflow: '',
          placeholder: '请配置工作流并输入显示模板'
        }
      },
      { 
        name: '文本框', 
        type: 'input',
        icon: 'form',
        defaultProps: {
          placeholder: '请输入',
          allowClear: true
        }
      },
      { 
        name: '按钮', 
        type: 'button',
        icon: 'button',
        defaultProps: {
          type: 'primary',
          children: '按钮',
          size: 'middle',
          width: 120,
          workflowId: '',
          workflowInputs: []
        }
      },
      { 
        name: '选择器', 
        type: 'select',
        icon: 'select',
        defaultProps: {
          placeholder: '请选择',
          options: []
        }
      },
      {
        name: '文本区域',
        type: 'textarea',
        icon: 'text',
        defaultProps: {
          placeholder: '请输入多行文本',
          rows: 4
        }
      },
      {
        name: '单选组',
        type: 'radio-group',
        icon: 'radio',
        defaultProps: {
          options: [
            { label: '选项1', value: '1' },
            { label: '选项2', value: '2' }
          ]
        }
      },
      {
        name: '多选组',
        type: 'checkbox-group',
        icon: 'check',
        defaultProps: {
          options: [
            { label: '选项1', value: '1' },
            { label: '选项2', value: '2' }
          ]
        }
      }
    ]
  },
  {
    title: 'AI组件',
    items: [
      { 
        name: 'AI补全', 
        type: 'ai-completion',
        icon: 'robot',
        defaultProps: {
          placeholder: '输入提示词',
          model: 'gpt-3.5-turbo',
          maxTokens: 100
        }
      },
      { 
        name: '智能问答', 
        type: 'ai-qa',
        icon: 'question',
        defaultProps: {
          placeholder: '请输入问题',
          context: '',
          temperature: 0.7
        }
      },
      { 
        name: '内容生成', 
        type: 'ai-generator',
        icon: 'bulb',
        defaultProps: {
          type: 'text',
          prompt: '',
          maxLength: 500
        }
      }
    ]
  }
] as { title: string, items: ComponentItem[] }[]

const handleDragStart = (e: DragEvent, item: ComponentItem) => {
  if (e.dataTransfer) {
    const componentData = {
      type: item.type,
      name: item.name,
      props: item.defaultProps
    }
    e.dataTransfer.setData('text/plain', JSON.stringify(componentData))
  }
}
</script>

<template>
  <div class="component-panel">
    <Tabs v-model:activeKey="activeKey">
      <Tabs.TabPane key="1" tab="组件">
        <div class="components-container">
          <Card 
            v-for="group in components" 
            :key="group.title"
            :title="group.title"
            size="small"
            class="component-group"
          >
            <div class="component-list">
              <div 
                v-for="item in group.items" 
                :key="item.name"
                class="component-item"
                draggable="true"
                @dragstart="(e) => handleDragStart(e, item)"
              >
                {{ item.name }}
              </div>
            </div>
          </Card>
        </div>
      </Tabs.TabPane>
    </Tabs>
  </div>
</template>

<style lang="less" scoped>
.component-panel {
  height: 100%;
  
  :deep(.ant-tabs) {
    height: 100%;
    
    .ant-tabs-content {
      height: 100%;
      overflow-y: auto;
    }
  }
  
  .components-container {
    padding: 12px;
    
    .component-group {
      margin-bottom: 16px;
      
      .component-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        
        .component-item {
          padding: 8px;
          border: 1px dashed #d9d9d9;
          border-radius: 4px;
          text-align: center;
          cursor: move;
          
          &:hover {
            border-color: #1890ff;
            color: #1890ff;
          }
        }
      }
    }
  }
}
</style> 