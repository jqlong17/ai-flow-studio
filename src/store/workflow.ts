import { defineStore } from 'pinia'

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    output: '',
    loading: false,
    error: null as string | null,
  }),
  
  actions: {
    setOutput(output: string) {
      this.output = output
    },
    
    setLoading(loading: boolean) {
      this.loading = loading
    },
    
    setError(error: string | null) {
      this.error = error
    },
    
    async executeWorkflow(input: string) {
      this.setLoading(true)
      this.setError(null)
      
      try {
        const response = await fetch('/api/workflow', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ input })
        })
        
        const data = await response.json()
        this.setOutput(data.answer)
      } catch (error) {
        this.setError(error instanceof Error ? error.message : '未知错误')
      } finally {
        this.setLoading(false)
      }
    }
  }
}) 