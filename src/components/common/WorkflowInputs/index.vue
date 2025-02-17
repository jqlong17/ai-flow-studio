<template>
  <div class="workflow-inputs">
    <div v-for="(input, index) in inputs" :key="index" class="input-item">
      <div class="input-header">
        <span class="index-badge">{{ index + 1 }}</span>
        <a-button
          type="link"
          danger
          class="delete-btn"
          @click="removeInput(index)"
        >
          <template #icon>
            <DeleteOutlined />
          </template>
        </a-button>
      </div>
      <div class="input-content">
        <div class="form-item">
          <span class="label">变量名</span>
          <a-input
            v-model:value="input.key"
            placeholder="输入变量名"
            class="key-input"
          />
        </div>
        <div class="form-item">
          <span class="label">绑定组件变量</span>
          <VariableSelect
            v-model:value="input.value"
            :exclude-id="excludeId"
            class="value-select"
            placeholder="选择要绑定的组件变量"
          />
        </div>
      </div>
    </div>
    
    <div class="add-input">
      <a-button
        type="dashed"
        block
        @click="addInput"
      >
        <template #icon>
          <PlusOutlined />
        </template>
        添加工作流变量
      </a-button>
    </div>

    <div v-if="inputs.length === 0" class="empty-tip">
      <a-empty description="点击上方按钮添加工作流变量" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import VariableSelect from '../VariableSelect/index.vue'

interface WorkflowInput {
  key: string
  value: string
}

const props = defineProps<{
  value?: WorkflowInput[]
  excludeId?: string
}>()

const emit = defineEmits<{
  (e: 'update:value', value: WorkflowInput[]): void
}>()

const inputs = ref<WorkflowInput[]>(props.value || [])

// 监听外部值变化
watch(() => props.value, (newValue) => {
  if (newValue) {
    inputs.value = newValue
  }
}, { deep: true })

// 监听内部值变化
watch(() => inputs.value, (newValue) => {
  emit('update:value', newValue)
}, { deep: true })

const addInput = () => {
  inputs.value.push({ key: '', value: '' })
}

const removeInput = (index: number) => {
  inputs.value.splice(index, 1)
}
</script>

<style scoped lang="less">
.workflow-inputs {
  .input-item {
    margin-bottom: 16px;
    background: #fafafa;
    border-radius: 4px;
    border: 1px solid #f0f0f0;
    
    &:last-child {
      margin-bottom: 12px;
    }

    .input-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      border-bottom: 1px solid #f0f0f0;
      background: #fff;
      border-radius: 4px 4px 0 0;

      .index-badge {
        height: 20px;
        min-width: 20px;
        line-height: 20px;
        text-align: center;
        background: #e6f4ff;
        color: #1890ff;
        border-radius: 10px;
        font-size: 12px;
        padding: 0 6px;
      }

      .delete-btn {
        padding: 0;
        height: 20px;
        line-height: 20px;
      }
    }
    
    .input-content {
      padding: 12px;

      .form-item {
        margin-bottom: 12px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .label {
          display: block;
          margin-bottom: 4px;
          font-size: 13px;
          color: #666;
        }
        
        .key-input, .value-select {
          width: 100%;
        }
      }
    }
  }
  
  .add-input {
    margin-bottom: 16px;
  }
  
  .empty-tip {
    padding: 24px 0;
    
    :deep(.ant-empty) {
      margin: 0;
      
      .ant-empty-description {
        color: #999;
      }
    }
  }
}
</style> 