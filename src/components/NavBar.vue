<script setup lang="ts">
import { Avatar, Dropdown, ListGroup, ListGroupItem } from 'flowbite-vue'
import { RouterLink } from 'vue-router'
import { useLogout } from '../composables/auth'

const logout = useLogout()
</script>

<template>
  <nav
    class="fixed z-50 w-full bg-white border-b border-gray-200 sm:py-2 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="py-3 px-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start">
          <RouterLink class="flex-mr-4" to="/">
            <!-- <img src="/images/logo.svg" class="h-8 mr-3" alt="Flowbite Logo" /> -->
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
              >Voucher</span
            >
          </RouterLink>
        </div>

        <div class="flex items-center ml-3">
          <div>
            <dropdown text="Bottom" placement="left">
              <template #trigger>
                <Avatar rounded size="sm" class="cursor-pointer" />
              </template>
              <list-group>
                <list-group-item @click="logout.mutate"> Logout </list-group-item>
              </list-group>
            </dropdown>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
