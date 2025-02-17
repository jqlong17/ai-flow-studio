<script setup lang="ts">
import { ref } from 'vue'
import { Input, Button, message } from 'ant-design-vue'
import { RobotOutlined } from '@ant-design/icons-vue'

interface Props {
  placeholder?: string
  defaultContent?: string
  prompt?: string
  variableName?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入内容',
  defaultContent: '',
  prompt: ''
})

const emit = defineEmits<{
  'update:defaultContent': [value: string]
}>()

const content = ref(props.defaultContent)
const isLoading = ref(false)

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  content.value = value
  emit('update:defaultContent', value)
}

const handleComplete = async () => {
  if (isLoading.value) return
  if (!props.prompt) {
    message.warning('请先配置提示词')
    return
  }
  
  isLoading.value = true
  try {
    // TODO: 调用AI补全接口
    await new Promise(resolve => setTimeout(resolve, 1000))
    const completedText = '这是AI补全的内容'
    content.value = completedText
    emit('update:defaultContent', completedText)
  } catch (error) {
    message.error('AI补全失败')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="ai-completion">
    <div class="input-wrapper">
      <Input.TextArea
        v-model:value="content"
        :placeholder="placeholder"
        :rows="4"
        @input="handleInput"
      />
      <Button
        class="complete-btn"
        type="primary"
        size="small"
        :loading="isLoading"
        @click="handleComplete"
      >
        <template #icon>
          <RobotOutlined />
        </template>
        AI补全
      </Button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.ai-completion {
  .input-wrapper {
    position: relative;
    
    :deep(.ant-input) {
      padding-right: 90px;  // 为按钮预留空间
    }
    
    .complete-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 1;
      border-radius: 4px;
      font-size: 12px;
      padding: 0 8px;
      height: 24px;
      line-height: 24px;
    }
  }
}
</style> 