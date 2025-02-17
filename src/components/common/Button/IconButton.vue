<script setup lang="ts">
import { Button as AButton, Tooltip } from 'ant-design-vue'
import type { IconButtonProps } from './types'

const props = withDefaults(defineProps<IconButtonProps>(), {
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
  <Tooltip v-if="tooltip" :title="tooltip">
    <AButton
      :type="type"
      :size="size"
      :loading="loading"
      :disabled="disabled"
      :icon="icon"
      @click="emit('click', $event)"
    >
      <slot />
    </AButton>
  </Tooltip>
  <AButton
    v-else
    :type="type"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :icon="icon"
    @click="emit('click', $event)"
  >
    <slot />
  </AButton>
</template> 