<script setup lang="ts">
import ActionButton from './ActionButton.vue'

const props = defineProps<{
  parentId: string
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
    color="green"
    :onClick="handleAddChild"
  >
    +
  </ActionButton>
</template>
