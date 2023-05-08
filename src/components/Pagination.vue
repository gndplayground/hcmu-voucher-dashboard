<script setup lang="ts">
import Button from './Button.vue'

const props = defineProps({
  onChange: {
    type: Function
  },
  page: {
    type: Number,
    required: true
  },
  hasNextPage: {
    type: Boolean
  }
})
</script>

<template>
  <div class="flex items-center">
    <Button pill square class="mr-2" v-if="page > 1" @click="props.onChange?.('prev')">
      <svg
        aria-hidden="true"
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </Button>
    <Button pill square outline disabled>
      <div class="w-5 h-5">{{ props.page }}</div>
    </Button>
    <Button class="ml-2" pill square v-if="props.hasNextPage" @click="props.onChange?.('next')">
      <svg
        aria-hidden="true"
        class="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </Button>
  </div>
</template>
