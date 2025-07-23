<script setup lang="ts">
interface Props {
  title: string
  position: 'top' | 'bottom'
  backgroundColor?: string
  borderColor?: string
  size?: number
  shape?: 'circle' | 'square' | 'rounded'
  onClick: (event: MouseEvent) => void
}

const props = defineProps<Props>()

const handleClick = (event: MouseEvent) => {
  event.stopPropagation()
  props.onClick(event)
}

const handleStopPropagation = (event: MouseEvent) => {
  event.stopPropagation()
}
</script>

<template>
  <button
    :class="['action-button', `action-button--${position}`, `action-button--${props.shape || 'circle'}`]"
    :style="{
      backgroundColor: props.backgroundColor || '#4CAF50',
      borderColor: props.borderColor || 'white',
      width: (props.size || 30) + 'px',
      height: (props.size || 30) + 'px',
      fontSize: Math.floor((props.size || 30) * 0.6) + 'px'
    }"
    @mousedown="handleClick"
    @click="handleStopPropagation"
    :title="title"
  >
    <slot />
  </button>
</template>

<style scoped>
.action-button {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 20;
}

.action-button--circle {
  border-radius: 50%;
}

.action-button--square {
  border-radius: 0;
}

.action-button--rounded {
  border-radius: 8px;
}

.action-button--top {
  top: -15px;
}

.action-button--bottom {
  bottom: -15px;
}

.action-button:hover {
  transform: translateX(-50%) scale(1.1);
  filter: brightness(1.1);
}

.action-button:active {
  transform: translateX(-50%) scale(0.95);
}
</style>
