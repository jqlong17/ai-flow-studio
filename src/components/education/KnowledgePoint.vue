<script setup lang="ts">
import { Card, Typography } from 'ant-design-vue'

const { Text } = Typography

defineProps<{
  title: string
  content: string
  difficulty: 'easy' | 'medium' | 'hard'
}>()
</script>

<template>
  <Card :title="title" size="small" style="width: 300px">
    <Text :type="difficulty === 'hard' ? 'danger' : undefined">
      {{ content }}
    </Text>
  </Card>
</template> 