<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>

<template>
  <input
    :id="props.name"
    :name="props.name"
    type="checkbox"
    v-bind="$attrs"
    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
  />
  <label :id="props.name" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
    <slot name="label"></slot>
  </label>
</template>
