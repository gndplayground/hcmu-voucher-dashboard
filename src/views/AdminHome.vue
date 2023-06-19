<script setup lang="ts">
import { useGetStats } from '@/composables/stats'

const stats = useGetStats()
</script>

<template>
  <section class="py-4 px-8 text-white">
    <div class="flex">
      <div class="text-base mt-8">
        Companies
        <div class="text-2xl font-bold">
          {{ stats.data?.value?.company }}
        </div>
      </div>
      <div class="text-base mt-8 ml-8">
        Active campaigns
        <div class="text-2xl font-bold">
          {{ stats.data?.value?.campaigns.active }}
        </div>
      </div>
      <div class="text-base mt-8 ml-8">
        Upcoming campaigns
        <div class="text-2xl font-bold">
          {{ stats.data?.value?.campaigns.upcoming }}
        </div>
      </div>
      <div class="text-base mt-8 ml-8">
        Tickets
        <div class="text-2xl font-bold">
          {{ stats.data?.value?.tickets }}
        </div>
      </div>
    </div>
    <div class="flex mt-8">
      <div class="text-base mt-8">
        User
        <div class="text-2xl font-bold">
          {{ stats.data?.value?.users.user }}
        </div>
      </div>
      <div class="text-base mt-8 ml-8">
        Company account
        <div class="text-2xl font-bold">
          {{ stats.data?.value?.users.company }}
        </div>
      </div>
    </div>
  </section>
</template>
