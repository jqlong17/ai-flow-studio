<script setup lang="ts">
import { Card, Typography } from 'ant-design-vue'

const { Text } = Typography

defineProps<{
  objective: string
  category: string
  level: string
}>()
</script>

<template>
  <Card title="学习目标" size="small" style="width: 300px">
    <Text>{{ objective }}</Text>
    <br />
    <Text type="secondary">
      类型：{{ category }} | 难度：{{ level }}
    </Text>
  </Card>
</template> 