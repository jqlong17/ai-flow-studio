<script setup lang="ts">
import { computed } from 'vue'
import { Typography } from 'ant-design-vue'
import type { TextProps } from './types'

const { Text: AText } = Typography

const props = withDefaults(defineProps<TextProps>(), {
  fontSize: 14,
  align: 'left',
  fontWeight: 'normal'
})

const textStyle = computed(() => ({
  fontSize: `${props.fontSize}px`,
  textAlign: props.align,
  fontWeight: props.fontWeight,
  display: 'block',
  lineHeight: '1.5',
  padding: '4px 0'
}))
</script>

<template>
  <div class="text-wrapper" :style="textStyle">
    <AText>{{ content }}</AText>
  </div>
</template>

<style scoped>
.text-wrapper {
  min-height: 24px;
  word-break: break-word;
  white-space: pre-wrap;
}
</style> 