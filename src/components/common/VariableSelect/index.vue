<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useCanvasStore } from '@/stores/canvas'

const props = defineProps<{
  value?: string
  excludeId?: string
  showAddButton?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:value', value: string): void
  (e: 'add'): void
}>()

const canvasStore = useCanvasStore()

const selectedVariable = ref(props.value)

// 获取画布中所有组件的输出变量
const variableOptions = computed(() => {
  return canvasStore.components
    .filter(comp => comp.id !== props.excludeId && comp.props.variableName)
    .map(comp => ({
      label: `${comp.name} (${comp.props.variableName})`,
      value: comp.props.variableName
    }))
})

const handleVariableChange = (value: string) => {
  selectedVariable.value = value
  emit('update:value', value)
}

const handleAddVariable = (e: Event) => {
  e.stopPropagation()
  emit('add')
}
</script>

<template>
  <div class="variable-select">
    <a-select
      v-model:value="selectedVariable"
      :options="variableOptions"
      style="width: 200px"
      placeholder="选择变量"
      @change="handleVariableChange"
    >
      <template #suffixIcon>
        <PlusOutlined v-if="showAddButton" @click.stop="handleAddVariable" />
      </template>
    </a-select>
  </div>
</template>

<style scoped lang="less">
.variable-select {
  :deep(.anticon-plus) {
    cursor: pointer;
    color: #1890ff;
    
    &:hover {
      color: #40a9ff;
    }
  }
}
</style> 