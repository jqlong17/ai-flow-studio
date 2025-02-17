<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Select, Space } from 'ant-design-vue'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue'
import type { FormItem, CascadeFormProps, FormRow } from './types'

const props = withDefaults(defineProps<CascadeFormProps>(), {
  maxLevel: 2,
  canAdd: true,
  canDelete: true,
  multiple: false
})

const emit = defineEmits<{
  'update:items': [items: FormItem[]]
  change: [rows: FormRow[]]
}>()

// 表单行数据
const rows = ref<FormRow[]>([{ id: '1', values: [] }])

// 根据层级获取可选项
const getOptions = (level: number, parentValue?: string) => {
  const formatOptions = (items: FormItem[]) => {
    return items.map(item => ({
      label: item.label,
      value: item.value
    }))
  }

  if (level === 0) {
    return formatOptions(props.items)
  }
  
  const findParent = (items: FormItem[], value: string): FormItem | null => {
    for (const item of items) {
      if (item.value === value) return item
      if (item.children) {
        const found = findParent(item.children, value)
        if (found) return found
      }
    }
    return null
  }
  
  const parent = parentValue ? findParent(props.items, parentValue) : null
  return formatOptions(parent?.children || [])
}

// 处理选择变化
const handleSelect = (rowIndex: number, level: number, value: string) => {
  const row = rows.value[rowIndex]
  // 清空后续级联值
  row.values = row.values.slice(0, level).concat(value)
  emit('change', rows.value)
}

// 添加新行
const handleAdd = () => {
  const newId = String(Date.now())
  rows.value.push({ id: newId, values: [] })
}

// 删除行
const handleDelete = (index: number) => {
  rows.value.splice(index, 1)
  emit('change', rows.value)
}
</script>

<template>
  <div class="cascade-form">
    <div 
      v-for="(row, rowIndex) in rows" 
      :key="row.id"
      class="form-row"
    >
      <Space>
        <Select
          v-for="level in maxLevel"
          :key="level"
          :value="row.values[level - 1]"
          :options="getOptions(level - 1, row.values[level - 2])"
          :placeholder="'请选择'"
          :mode="props.multiple ? 'multiple' : undefined"
          style="width: 200px"
          @select="value => handleSelect(rowIndex, level - 1, value)"
        />
        
        <Button
          v-if="canDelete && rows.length > 1"
          type="link"
          danger
          @click="() => handleDelete(rowIndex)"
        >
          <template #icon>
            <MinusOutlined />
          </template>
        </Button>
      </Space>
    </div>
    
    <div v-if="canAdd" class="form-actions">
      <Button type="dashed" block @click="handleAdd">
        <template #icon>
          <PlusOutlined />
        </template>
        添加
      </Button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.cascade-form {
  .form-row {
    margin-bottom: 16px;
    
    .ant-space {
      width: 100%;
      
      :deep(.ant-select) {
        text-align: left;
      }
    }
  }
  
  .form-actions {
    margin-top: 8px;
  }
}
</style> 