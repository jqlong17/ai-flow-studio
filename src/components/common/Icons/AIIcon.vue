<script setup lang="ts">
import Icon from './index.vue'

interface Props {
  type: 'robot' | 'brain' | 'api' | 'completion' | 'chat'
  size?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 16,
  color: 'inherit'
})

const iconMap = {
  robot: 'RobotOutlined',
  brain: 'BulbOutlined',
  api: 'ApiOutlined',
  completion: 'CodeOutlined',
  chat: 'MessageOutlined'
}
</script>

<template>
  <Icon 
    :name="iconMap[type]"
    :size="size"
    :color="color"
  />
</template> 