<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Select } from 'ant-design-vue'
import { useCanvasStore } from '@/stores/canvas'

interface Props {
  modelValue?: string
  excludeId?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [value: string]
}>()

const canvasStore = useCanvasStore()
const selectedValue = ref(props.modelValue)

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue
})

// 获取所有可用变量
const variables = computed(() => {
  return canvasStore.components
    .filter(comp => comp.id !== props.excludeId && comp.props.variableName)
    .map(comp => ({
      label: `${comp.props.variableName} (${comp.name})`,
      value: `{{${comp.props.variableName}}}`,
      type: comp.type
    }))
})

const handleSelect = (value: string) => {
  selectedValue.value = value
  emit('update:modelValue', value)
  emit('select', value)
}
</script>

<template>
  <Select
    :value="selectedValue"
    :options="variables"
    placeholder="选择变量"
    style="width: 200px"
    @select="handleSelect"
  >
    <template #option="{ label, type }">
      <span>{{ label }}</span>
      <span class="variable-type">{{ type }}</span>
    </template>
  </Select>
</template>

<style lang="less" scoped>
.variable-type {
  float: right;
  color: #999;
  font-size: 12px;
}
</style> 