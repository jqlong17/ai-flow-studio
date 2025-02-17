export interface FormItem {
  id: string
  label: string
  value: string
  level: number
  parentId?: string
  children?: FormItem[]
}

export interface CascadeFormProps {
  items: FormItem[]
  maxLevel?: number
  canAdd?: boolean
  canDelete?: boolean
  multiple?: boolean
  variableName: string  // 变量名，用于传递给Dify
}

export interface FormRow {
  id: string
  values: string[]
}

export interface SelectionResult {
  variableName: string
  value: {
    labels: string[]    // 选中项的标签数组
    values: string[]    // 选中项的值数组
    paths: string[][]   // 选中项的完整路径
  }
} 