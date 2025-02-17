<script setup lang="ts">
import { Modal } from 'ant-design-vue'

interface Props {
  visible: boolean
  title: string
  width?: number | string
  centered?: boolean
  closable?: boolean
  maskClosable?: boolean
  confirmLoading?: boolean
  destroyOnClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 520,
  centered: true,
  closable: true,
  maskClosable: true,
  confirmLoading: false,
  destroyOnClose: false
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  ok: []
  cancel: []
}>()

const handleOk = () => {
  emit('ok')
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
    :width="width"
    :centered="centered"
    :closable="closable"
    :mask-closable="maskClosable"
    :confirm-loading="confirmLoading"
    :destroy-on-close="destroyOnClose"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <slot />
    <template #footer>
      <slot name="footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" :loading="confirmLoading" @click="handleOk">
          确定
        </a-button>
      </slot>
    </template>
  </Modal>
</template> 