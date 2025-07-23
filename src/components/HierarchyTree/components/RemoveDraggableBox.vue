<script setup lang="ts">
import ActionButton from './ActionButton.vue'

const props = defineProps<{
  boxId: string
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
    color="red"
    :onClick="handleRemoveBox"
  >
    ×
  </ActionButton>
</template>
