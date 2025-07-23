<script setup lang="ts">
import ActionButton from './ActionButton.vue'

const props = defineProps<{
  boxId: string
  backgroundColor?: string
  borderColor?: string
  content?: string
  size?: number
  shape?: 'circle' | 'square' | 'rounded'
}>()

const emit = defineEmits<{
  removeBox: [boxId: string]
}>()

const handleRemoveBox = () => {
  emit('removeBox', props.boxId)
}
</script>

<template>
  <ActionButton
    title="Remove Box"
    position="top"
    :backgroundColor="props.backgroundColor || '#f44336'"
    :borderColor="props.borderColor || 'white'"
    :size="props.size || 30"
    :shape="props.shape || 'circle'"
    :onClick="handleRemoveBox"
  >
    {{ props.content || '×' }}
  </ActionButton>
</template>
