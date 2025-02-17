<script setup lang="ts">
import { Drawer } from 'ant-design-vue'

interface Props {
  visible: boolean
  title: string
  width?: number | string
  placement?: 'left' | 'right' | 'top' | 'bottom'
  closable?: boolean
  maskClosable?: boolean
  destroyOnClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 378,
  placement: 'right',
  closable: true,
  maskClosable: true,
  destroyOnClose: false
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

const handleClose = () => {
  emit('close')
  emit('update:visible', false)
}
</script>

<template>
  <Drawer
    :open="visible"
    :title="title"
    :width="width"
    :placement="placement"
    :closable="closable"
    :mask-closable="maskClosable"
    :destroy-on-close="destroyOnClose"
    @close="handleClose"
  >
    <slot />
    <template #extra>
      <slot name="extra" />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </Drawer>
</template> 