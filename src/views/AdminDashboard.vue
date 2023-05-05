<script setup lang="ts">
import Text from '@/components/AppText.js'

function hello() {
  console.log('hello')
}
</script>

<template>
  <Text id="1100" class="mt-4" title="submit" @click="hello">Hello</Text>
</template>
