<template>
  <div class="text-display" :style="style">
    <a-card :bordered="false" :loading="loading">
      <template #title>
        <div class="card-title">
          <span>{{ title }}</span>
          <a-select
            v-if="showWorkflowSelect"
            v-model:value="selectedWorkflow"
            :options="workflowOptions"
            :loading="workflowsLoading"
            style="width: 200px"
            placeholder="选择工作流"
            @change="handleWorkflowChange"
          />
        </div>
      </template>
      
      <div class="content-area">
        <a-spin :spinning="loading">
          <div v-if="error" class="error-message">
            <a-alert type="error" :message="error" show-icon />
          </div>
          <div v-else-if="content" class="content-text" :style="contentStyle">
            {{ content }}
          </div>
          <div v-else class="placeholder">
            {{ placeholder }}
          </div>
        </a-spin>
      </div>

      <template #extra>
        <a-space>
          <a-button 
            type="primary" 
            :disabled="!selectedWorkflow"
            @click="refreshContent"
          >
            刷新
          </a-button>
          <a-button 
            :disabled="!content" 
            @click="copyContent"
          >
            复制
          </a-button>
        </a-space>
      </template>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import type { SelectProps } from 'ant-design-vue'

// Props 定义
interface Props {
  id?: string
  title?: string
  defaultWorkflow?: string
  prompt?: string
  placeholder?: string
  showWorkflowSelect?: boolean
  width?: number | string
  height?: number | string
  fontSize?: number
  align?: 'left' | 'center' | 'right'
  fontWeight?: 'normal' | 'bold' | 'lighter'
  content?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  title: '文本显示',
  defaultWorkflow: 'app-hdrNjAynLMRX93aP7ykyAUT0',
  prompt: '请生成内容',
  placeholder: '请选择工作流以显示内容',
  showWorkflowSelect: true,
  width: '100%',
  height: 'auto',
  fontSize: 14,
  align: 'left',
  fontWeight: 'normal',
  content: ''
})

// 计算样式
const style = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}))

const contentStyle = computed(() => ({
  fontSize: `${props.fontSize}px`,
  textAlign: props.align,
  fontWeight: props.fontWeight
}))

// 状态定义
const loading = ref(false)
const workflowsLoading = ref(false)
const error = ref('')
const content = ref('')
const selectedWorkflow = ref(props.defaultWorkflow)
const workflowOptions = ref<SelectProps['options']>([
  {
    label: '测试工作流',
    value: 'app-hdrNjAynLMRX93aP7ykyAUT0'
  }
])

// 获取工作流列表
const fetchWorkflows = async () => {
  if (!props.showWorkflowSelect) return
  
  workflowsLoading.value = true
  error.value = ''
  
  try {
    // 使用默认工作流选项
    workflowOptions.value = [
      {
        label: '测试工作流',
        value: 'app-hdrNjAynLMRX93aP7ykyAUT0'
      }
    ]
    workflowsLoading.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取工作流列表失败'
    message.error(error.value)
  } finally {
    workflowsLoading.value = false
  }
}

// 获取工作流内容
const fetchWorkflowContent = async (customInputs?: Record<string, string>) => {
  if (!selectedWorkflow.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetch(`${import.meta.env.VITE_DIFY_BASE_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: customInputs || {},
        query: props.prompt,
        response_mode: "blocking",
        user: "system"
      })
    })
    
    if (!response.ok) {
      throw new Error('获取内容失败')
    }
    
    const data = await response.json()
    content.value = data.answer
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取内容失败'
    message.error(error.value)
  } finally {
    loading.value = false
  }
}

// 事件处理
const handleWorkflowChange = () => {
  content.value = ''
  fetchWorkflowContent()
}

const refreshContent = () => {
  fetchWorkflowContent()
}

const copyContent = async () => {
  try {
    await navigator.clipboard.writeText(content.value)
    message.success('内容已复制到剪贴板')
  } catch (err) {
    message.error('复制失败')
  }
}

// 生命周期
onMounted(() => {
  fetchWorkflows()
  if (props.defaultWorkflow) {
    fetchWorkflowContent()
  }
})

// 暴露组件接口
defineExpose({
  refresh: refreshContent,
  getContent: () => content.value,
  setWorkflow: (workflowId: string) => {
    selectedWorkflow.value = workflowId
    fetchWorkflowContent()
  },
  refreshWithInputs: (inputs: Record<string, string>) => {
    fetchWorkflowContent(inputs)
  }
})
</script>

<style scoped lang="less">
.text-display {
  .card-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .content-area {
    min-height: 200px;
    margin: 16px 0;
    
    .error-message {
      margin: 16px 0;
    }
    
    .content-text {
      white-space: pre-wrap;
      word-break: break-all;
      line-height: 1.6;
    }
    
    .placeholder {
      color: #999;
      text-align: center;
      padding: 80px 0;
    }
  }
}
</style> 