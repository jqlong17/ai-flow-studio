<template>
  <div class="workflow-inputs">
    <div v-for="(input, index) in inputs" :key="index" class="input-item">
      <div class="input-row">
        <a-input
          v-model:value="input.key"
          placeholder="输入名称"
          style="width: 120px"
        />
        <span class="separator">:</span>
        <VariableSelect
          v-model:value="input.value"
          :exclude-id="excludeId"
          style="flex: 1"
        />
        <a-button
          type="text"
          danger
          @click="removeInput(index)"
        >
          <template #icon>
            <DeleteOutlined />
          </template>
        </a-button>
      </div>
    </div>
    
    <a-button
      type="dashed"
      block
      @click="addInput"
    >
      <template #icon>
        <PlusOutlined />
      </template>
      添加输入变量
    </a-button>
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
    margin-bottom: 8px;
    
    .input-row {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .separator {
        color: #999;
      }
    }
  }
}
</style> 