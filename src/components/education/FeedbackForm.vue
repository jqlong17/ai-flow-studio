<script setup lang="ts">
import { Card, Form, Rate, Input } from 'ant-design-vue'

const { TextArea } = Input

interface Question {
  type: 'rating' | 'text'
  title: string
}

defineProps<{
  questions: Question[]
}>()
</script>

<template>
  <Card title="课程反馈" size="small" style="width: 300px">
    <Form layout="vertical">
      <Form.Item
        v-for="(q, index) in questions"
        :key="index"
        :label="q.title"
      >
        <Rate v-if="q.type === 'rating'" />
        <TextArea
          v-else
          :rows="2"
          placeholder="请输入您的反馈"
        />
      </Form.Item>
    </Form>
  </Card>
</template> 