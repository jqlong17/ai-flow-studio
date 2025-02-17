<script setup lang="ts">
import { Card, Typography } from 'ant-design-vue'

const { Paragraph, Text } = Typography

defineProps<{
  content: string
  tips?: string
}>()
</script>

<template>
  <Card title="解析" size="small" style="width: 300px">
    <Paragraph>{{ content }}</Paragraph>
    <Text v-if="tips" type="secondary">提示：{{ tips }}</Text>
  </Card>
</template> 