<script setup lang="ts">
import { ref, computed } from 'vue'
import { Tree, Button, Modal, Form, Input, Space, Upload, message } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons-vue'

interface TreeNode {
  id: string
  label: string
  value: string
  level: number
  parentId?: string
  children?: TreeNode[]
}

interface Props {
  value: TreeNode[]
  titleField?: string
  valueField?: string
  childrenField?: string
}

const props = withDefaults(defineProps<Props>(), {
  titleField: 'label',
  valueField: 'value',
  childrenField: 'children',
  value: () => []
})

const emit = defineEmits<{
  'update:value': [value: TreeNode[]]
}>()

const treeData = ref<TreeNode[]>(props.value || [])

// 转换数据为Tree组件需要的格式
const formattedTreeData = computed(() => {
  const formatNode = (node: TreeNode) => ({
    key: node.id,
    title: node[props.titleField],
    value: node[props.valueField],
    children: node[props.childrenField]?.map(formatNode)
  })
  return treeData.value.map(formatNode)
})

// 处理CSV导入
const handleImportCSV = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target?.result as string
      const rows = text.split('\n').map(row => row.trim()).filter(Boolean)
      
      // 跳过表头
      const nodes: TreeNode[] = []
      const nodeMap = new Map<string, TreeNode>()
      
      // 从第二行开始处理数据
      for (let i = 1; i < rows.length; i++) {
        const [label, parentLabel = ''] = rows[i].split(',').map(col => col.trim())
        if (!label) continue
        
        const node: TreeNode = {
          id: String(Date.now() + i),
          label,
          value: String(Date.now() + i), // 使用id作为value
          level: 0
        }
        
        // 如果有父节点
        if (parentLabel) {
          const parent = nodes.find(n => n.label === parentLabel)
          if (parent) {
            node.parentId = parent.id
            node.level = parent.level + 1
            parent.children = parent.children || []
            parent.children.push(node)
          }
        } else {
          // 没有父节点，作为顶层节点
          nodes.push(node)
        }
        
        nodeMap.set(node.label, node)
      }
      
      // 更新树形数据
      treeData.value = nodes
      emit('update:value', nodes)
      message.success('导入成功')
    } catch (err) {
      message.error('格式错误，请确保CSV格式为: 标题,父节点标题')
    }
  }
  reader.readAsText(file)
  return false
}
</script>

<template>
  <div class="tree-data-editor">
    <div class="tree-actions">
      <Upload
        accept=".csv"
        :showUploadList="false"
        :beforeUpload="handleImportCSV"
      >
        <Button type="primary">
          <template #icon><UploadOutlined /></template>
          导入CSV
        </Button>
      </Upload>
    </div>
    
    <Tree
      class="data-tree"
      :treeData="formattedTreeData"
      :replaceFields="{
        children: childrenField,
        title: titleField,
        key: 'id',
        value: valueField
      }"
    >
      <template #title="{ node }">
        {{ node.title }}
      </template>
    </Tree>
  </div>
</template>

<style lang="less" scoped>
.tree-data-editor {
  .tree-actions {
    margin-bottom: 16px;
  }
  
  .data-tree {
    background: #fff;
    padding: 8px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
  }
}
</style> 