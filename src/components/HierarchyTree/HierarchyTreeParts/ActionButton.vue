<script setup lang="ts">
interface Props {
  title: string
  position: 'top' | 'bottom'
  color: 'green' | 'red'
  onClick: (event: MouseEvent) => void
}

const props = defineProps<Props>()

const handleClick = (event: MouseEvent) => {
  event.stopPropagation()
  props.onClick(event)
}
</script>

<template>
  <button
    :class="['action-button', `action-button--${position}`, `action-button--${color}`]"
    @mousedown="handleClick"
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
  border-radius: 50%;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 20;
}

.action-button--top {
  top: -15px;
}

.action-button--bottom {
  bottom: -15px;
}

.action-button--green {
  background-color: #4CAF50;
}

.action-button--green:hover {
  background-color: #45a049;
  transform: translateX(-50%) scale(1.1);
}

.action-button--red {
  background-color: #f44336;
}

.action-button--red:hover {
  background-color: #d32f2f;
  transform: translateX(-50%) scale(1.1);
}

.action-button:active {
  transform: translateX(-50%) scale(0.95);
}
</style>
