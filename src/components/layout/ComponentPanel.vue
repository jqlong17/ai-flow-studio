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
        name: '文本显示', 
        type: 'text-display',
        icon: 'font-size',
        defaultProps: {
          content: '示例文本',
          fontSize: 14,
          align: 'left',
          fontWeight: 'normal',
          editable: true
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
          children: '按钮'
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
  },
  {
    title: '教育组件',
    items: [
      {
        name: '知识点',
        type: 'knowledge-point',
        icon: 'book',
        defaultProps: {
          title: '知识点标题',
          content: '知识点内容',
          difficulty: 'medium'
        }
      },
      {
        name: '练习题',
        type: 'exercise',
        icon: 'edit',
        defaultProps: {
          question: '题目内容',
          type: 'single',
          options: [
            { label: 'A', value: 'A', content: '选项A' },
            { label: 'B', value: 'B', content: '选项B' }
          ],
          answer: 'A'
        }
      },
      {
        name: '解析',
        type: 'explanation',
        icon: 'solution',
        defaultProps: {
          content: '解析内容',
          tips: '',
          relatedPoints: []
        }
      },
      {
        name: '评分表',
        type: 'rubric',
        icon: 'table',
        defaultProps: {
          criteria: [
            { name: '标准1', score: 10, description: '评分标准1的描述' }
          ],
          totalScore: 100
        }
      },
      {
        name: '课程目标',
        type: 'learning-objective',
        icon: 'flag',
        defaultProps: {
          objective: '学习目标内容',
          category: 'knowledge',
          level: 'basic'
        }
      },
      {
        name: '反馈表单',
        type: 'feedback-form',
        icon: 'form',
        defaultProps: {
          questions: [
            { type: 'rating', title: '本节课程的总体评价' },
            { type: 'text', title: '您的建议' }
          ]
        }
      }
    ]
  }
] as { title: string, items: ComponentItem[] }[]

const handleDragStart = (e: DragEvent, item: ComponentItem) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: item.type,
      name: item.name,
      props: item.defaultProps
    }))
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