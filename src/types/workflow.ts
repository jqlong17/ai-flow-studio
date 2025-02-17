export interface Workflow {
  id: string
  name: string
  description: string
  type: 'completion' | 'qa' | 'generation'
  status: 'active' | 'inactive'
}

// 模拟的工作流数据
export const mockWorkflows: Workflow[] = [
  {
    id: 'flow-1',
    name: '智能写作助手',
    description: '基于上下文生成高质量的文章内容',
    type: 'completion',
    status: 'active'
  },
  {
    id: 'flow-2',
    name: '知识问答',
    description: '回答学生关于课程内容的问题',
    type: 'qa',
    status: 'active'
  },
  {
    id: 'flow-3',
    name: '练习题生成器',
    description: '根据知识点自动生成相关的练习题',
    type: 'generation',
    status: 'active'
  }
] 