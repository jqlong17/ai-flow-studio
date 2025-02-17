<script setup lang="ts">
import { ref } from 'vue'
import CascadeForm from './index.vue'
import type { FormItem } from './types'

// 示例数据
const items = ref<FormItem[]>([
  {
    id: '1',
    label: '第五章 相交线与平行线',
    value: 'chapter-5',
    level: 0,
    children: [
      {
        id: '1-1',
        label: '5.1 相交线',
        value: 'section-5-1',
        level: 1,
        parentId: '1'
      },
      {
        id: '1-2',
        label: '5.2 平行线',
        value: 'section-5-2',
        level: 1,
        parentId: '1'
      }
    ]
  },
  {
    id: '2',
    label: '第六章 三角形',
    value: 'chapter-6',
    level: 0,
    children: [
      {
        id: '2-1',
        label: '6.1 三角形的概念',
        value: 'section-6-1',
        level: 1,
        parentId: '2'
      },
      {
        id: '2-2',
        label: '6.2 三角形的特性',
        value: 'section-6-2',
        level: 1,
        parentId: '2'
      }
    ]
  }
])

const handleChange = (rows: any[]) => {
  console.log('表单数据变化：', rows)
}
</script>

<template>
  <div class="cascade-form-demo">
    <h3>教材内容选择</h3>
    <CascadeForm
      :items="items"
      :max-level="2"
      @change="handleChange"
    />
  </div>
</template>

<style lang="less" scoped>
.cascade-form-demo {
  padding: 24px;
  
  h3 {
    margin-bottom: 16px;
  }
}
</style> 