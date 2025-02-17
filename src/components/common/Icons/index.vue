<script setup lang="ts">
import { computed } from 'vue'
import * as Icons from '@ant-design/icons-vue'

interface Props {
  name: string
  size?: number
  color?: string
  spin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 16,
  color: 'inherit',
  spin: false
})

const Icon = computed(() => {
  return (Icons as any)[props.name]
})

const style = computed(() => ({
  fontSize: `${props.size}px`,
  color: props.color
}))
</script>

<template>
  <component 
    :is="Icon" 
    :style="style"
    :spin="spin"
  />
</template> 