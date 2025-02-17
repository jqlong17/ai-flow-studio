<template>
  <div class="button-container">
    <button
      :class="['button', type, size]"
      :style="buttonStyle"
      @click="handleClick"
    >
      <slot>{{ text }}</slot>
    </button>
    <TextContent
      v-if="showOutput"
      :content="content"
      :workflowOutput="workflowOutput"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TextContent from '../TextDisplay/TextContent.vue'

const workflowOutput = ref('')
const showOutput = ref(false)

const handleClick = async () => {
  try {
    const response = await fetch('/api/workflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: content })
    })
    const data = await response.json()
    workflowOutput.value = data.answer
    showOutput.value = true
  } catch (error) {
    console.error('Error:', error)
  }
}
</script> 