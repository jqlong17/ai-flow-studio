<script setup lang="ts">
import { computed, ref } from 'vue'
import { Input } from 'ant-design-vue'
import type { TextDisplayProps } from './types'
import Text from './index.vue'

const { TextArea } = Input

const props = withDefaults(defineProps<TextDisplayProps>(), {
  fontSize: 14,
  align: 'left',
  fontWeight: 'normal',
  editable: true
})

const emit = defineEmits<{
  'update:content': [value: string]
  'update:fontSize': [value: number]
}>()

const isEditing = ref(false)
const tempContent = ref(props.content)

const textStyle = computed(() => ({
  fontSize: `${props.fontSize}px`,
  textAlign: props.align,
  fontWeight: props.fontWeight,
  display: 'block',
  lineHeight: '1.5',
  padding: '4px 0',
  cursor: props.editable ? 'text' : 'default'
}))

const handleDoubleClick = () => {
  if (!props.editable) return
  isEditing.value = true
  tempContent.value = props.content
}

const handleBlur = () => {
  isEditing.value = false
  emit('update:content', tempContent.value)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleBlur()
  }
  if (e.key === 'Escape') {
    isEditing.value = false
    tempContent.value = props.content
  }
}

// 快捷键调整字号
const handleKeyPress = (e: KeyboardEvent) => {
  if (!props.editable) return
  if (e.ctrlKey || e.metaKey) {
    if (e.key === '+' || e.key === '=') {
      e.preventDefault()
      emit('update:fontSize', Math.min(100, (props.fontSize || 14) + 1))
    } else if (e.key === '-') {
      e.preventDefault()
      emit('update:fontSize', Math.max(1, (props.fontSize || 14) - 1))
    }
  }
}
</script>

<template>
  <div 
    class="text-display" 
    :style="textStyle"
    @dblclick="handleDoubleClick"
    @keypress="handleKeyPress"
    tabindex="0"
  >
    <TextArea
      v-if="isEditing"
      v-model:value="tempContent"
      :style="textStyle"
      auto-size
      @blur="handleBlur"
      @keydown="handleKeyDown"
      autofocus
    />
    <Text
      v-else
      :content="content"
      :font-size="fontSize"
      :align="align"
      :font-weight="fontWeight"
    />
  </div>
</template>

<style scoped>
.text-display {
  min-height: 24px;
  word-break: break-word;
  white-space: pre-wrap;
  outline: none;
}
</style> 