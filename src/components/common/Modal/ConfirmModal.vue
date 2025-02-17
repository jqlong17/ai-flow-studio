<script setup lang="ts">
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

interface Props {
  visible: boolean
  title: string
  content: string
  okText?: string
  cancelText?: string
  type?: 'info' | 'success' | 'warning' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  okText: '确定',
  cancelText: '取消',
  type: 'warning'
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  ok: []
  cancel: []
}>()

const handleOk = () => {
  emit('ok')
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<template>
  <Modal
    :open="visible"
    :title="title"
    :ok-text="okText"
    :cancel-text="cancelText"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="confirm-content">
      <ExclamationCircleOutlined :class="type" />
      <div class="text">{{ content }}</div>
    </div>
  </Modal>
</template>

<style scoped>
.confirm-content {
  display: flex;
  align-items: flex-start;
  padding: 8px 0;
  
  .anticon {
    font-size: 22px;
    margin-right: 16px;
    
    &.info {
      color: #1890ff;
    }
    
    &.success {
      color: #52c41a;
    }
    
    &.warning {
      color: #faad14;
    }
    
    &.error {
      color: #ff4d4f;
    }
  }
  
  .text {
    flex: 1;
    font-size: 14px;
    line-height: 1.5;
  }
}
</style> 