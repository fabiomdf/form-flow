<script setup lang="ts">
import ActionButton from './ActionButton.vue'

const props = defineProps<{
  parentId: string
  backgroundColor?: string
  borderColor?: string
  content?: string
  size?: number
  shape?: 'circle' | 'square' | 'rounded'
}>()

const emit = defineEmits<{
  addChild: [parentId: string]
}>()

const handleAddChild = () => {
  emit('addChild', props.parentId)
}
</script>

<template>
  <ActionButton
    title="Add Child Box"
    position="bottom"
    :backgroundColor="props.backgroundColor || '#4CAF50'"
    :borderColor="props.borderColor || 'white'"
    :size="props.size || 30"
    :shape="props.shape || 'circle'"
    :onClick="handleAddChild"
  >
    {{ props.content || '+' }}
  </ActionButton>
</template>
