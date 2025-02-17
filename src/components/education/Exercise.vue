<script setup lang="ts">
import { Card, Radio, Typography } from 'ant-design-vue'

const { Paragraph } = Typography

interface Option {
  label: string
  value: string
  content: string
}

defineProps<{
  question: string
  options: Option[]
  answer: string
}>()
</script>

<template>
  <Card title="练习题" size="small" style="width: 300px">
    <Paragraph>{{ question }}</Paragraph>
    <Radio.Group :value="answer">
      <Radio 
        v-for="opt in options" 
        :key="opt.value" 
        :value="opt.value"
      >
        {{ opt.label }}. {{ opt.content }}
      </Radio>
    </Radio.Group>
  </Card>
</template> 