import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CanvasComponent {
  id: string
  type: string
  name: string
  props: Record<string, any>
  position: {
    x: number
    y: number
  }
  workflowOutput?: string
}

export const useCanvasStore = defineStore('canvas', () => {
  const components = ref<CanvasComponent[]>([])
  const selectedId = ref<string | null>(null)
  
  const selectedComponent = computed(() => 
    components.value.find(c => c.id === selectedId.value)
  )
  
  const addComponent = (component: Omit<CanvasComponent, 'id'>) => {
    const id = `component-${Date.now()}`
    components.value.push({
      ...component,
      id,
      workflowOutput: ''
    })
    selectedId.value = id
  }
  
  const updateComponent = (id: string, updates: Partial<CanvasComponent>) => {
    const index = components.value.findIndex(c => c.id === id)
    if (index > -1) {
      components.value[index] = {
        ...components.value[index],
        ...updates
      }
    }
  }
  
  const updateWorkflowOutput = (id: string, output: string) => {
    const index = components.value.findIndex(c => c.id === id)
    if (index > -1) {
      components.value[index] = {
        ...components.value[index],
        workflowOutput: output
      }
    }
  }
  
  const removeComponent = (id: string) => {
    const index = components.value.findIndex(c => c.id === id)
    if (index > -1) {
      components.value.splice(index, 1)
      if (selectedId.value === id) {
        selectedId.value = null
      }
    }
  }

  const selectComponent = (id: string | null) => {
    selectedId.value = id
  }
  
  return {
    components,
    selectedId,
    selectedComponent,
    addComponent,
    updateComponent,
    updateWorkflowOutput,
    removeComponent,
    selectComponent
  }
}) 