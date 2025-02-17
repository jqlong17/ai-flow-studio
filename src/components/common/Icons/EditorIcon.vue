<script setup lang="ts">
import Icon from './index.vue'

interface Props {
  type: 'edit' | 'copy' | 'delete' | 'save' | 'undo' | 'redo' | 'preview'
  size?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 16,
  color: 'inherit'
})

const iconMap = {
  edit: 'EditOutlined',
  copy: 'CopyOutlined',
  delete: 'DeleteOutlined',
  save: 'SaveOutlined',
  undo: 'UndoOutlined',
  redo: 'RedoOutlined',
  preview: 'EyeOutlined'
}
</script>

<template>
  <Icon 
    :name="iconMap[type]"
    :size="size"
    :color="color"
  />
</template> 