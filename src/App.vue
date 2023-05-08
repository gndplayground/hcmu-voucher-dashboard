<script setup lang="ts">
import { useRouter, RouterView } from 'vue-router'
import { ToastProvider } from 'flowbite-vue'
import { useAuthWatcher } from './composables/auth'

useAuthWatcher()

const router = useRouter()
const route = router.currentRoute
</script>

<template>
  <ToastProvider :transition="'fade'">
    <RouterView name="Navbar" />
    <div class="flex overflow-hidden">
      <RouterView name="Sidebar" />
      <div
        id="main-content"
        :class="[
          'pt-[86px] relative w-full h-full overflow-y-auto',
          { 'lg:ml-64': !route.meta.noLayout }
        ]"
      >
        <main>
          <RouterView />
        </main>
      </div>
    </div>
  </ToastProvider>
</template>
