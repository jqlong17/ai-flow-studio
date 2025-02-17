<script setup lang="ts">
import { Button as AButton } from 'ant-design-vue'
import type { ButtonProps } from './types'

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'middle',
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()
</script>

<template>
  <AButton
    :type="type"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :icon="icon"
    @click="emit('click', $event)"
  >
    <slot>{{ children }}</slot>
  </AButton>
</template> 