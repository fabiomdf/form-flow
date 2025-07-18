<template>
  <DraggableBox ref="parentBox" :initialPosition="{ x: 200, y: 100 }">Parent</DraggableBox>
  <DraggableBox ref="childBox1" :initialPosition="{ x: 100, y: 250 }">Child 1</DraggableBox>
  <DraggableBox ref="childBox2" :initialPosition="{ x: 300, y: 250 }">Child 2</DraggableBox>

  <ConnectionLine :start="parentBox" :end="childBox1" />
  <ConnectionLine :start="parentBox" :end="childBox2" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DraggableBox from '@/components/DraggableBox.vue'
import ConnectionLine from '@/components/ConnectionLine.vue'

const parentBox = ref()
const childBox1 = ref()
const childBox2 = ref()
</script>
