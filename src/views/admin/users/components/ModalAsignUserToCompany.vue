<script setup lang="ts">
import { Modal, Input } from 'flowbite-vue'
import { ref } from 'vue'
import debounce from 'lodash.debounce'
import AppText from '@/components/AppText'
import { useGetCompanies } from '@/composables/company'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from '@/components/Table'
import Button from '@/components/Button.vue'
import type { Company, User } from '@/types'
import Pagination from '@/components/Pagination.vue'
import { useUpdateUser } from '@/composables/user'

interface Props {
  onClose: () => void
  currentUser: User
}

const props = defineProps<Props>()

const emit = defineEmits(['success'])

const page = ref(1)
const search = ref('')
const selectedCompany = ref<Company | undefined>(undefined)

const companies = useGetCompanies({
  page,
  search
})

const update = useUpdateUser()

function handleSelectCompany(company: Company) {
  selectedCompany.value = company
}

function handleChangePage(action: 'next' | 'prev') {
  if (action === 'next') {
    page.value += 1
  } else {
    page.value -= 1
  }
}

const handleSearch = debounce((event: Event) => {
  search.value = (event.target as HTMLInputElement).value
  page.value = 1
}, 500)

function handleConfirm() {
  if (selectedCompany.value) {
    update.mutate(
      {
        id: props.currentUser.id,
        profile: {
          companyId: selectedCompany.value.id
        }
      },
      {
        onSuccess: () => {
          emit('success')
        }
      }
    )
  }
}
</script>

<template>
  <Modal @close="props.onClose" size="5xl">
    <template #header>
      <AppText variant="title"> Assign {{ props.currentUser.email }} to a company </AppText>
      <div class="ml-auto flex items-center">
        <Input
          :disabled="update.isLoading.value"
          type="text"
          @input="handleSearch"
          class="ml-2"
          placeholder="Search company"
        />
      </div>
    </template>
    <template #body>
      <p v-if="props.currentUser.profile?.company" class="text-white">
        Current company: {{ props.currentUser.profile?.company?.name }}
      </p>
      <div v-if="selectedCompany" class="mt-2 text-white text-center">
        <p>Assign to company: {{ selectedCompany.name }}</p>
        <Button :disabled="update.isLoading.value" class="mt-2" @click="handleConfirm"
          >Confirm</Button
        >
      </div>
      <Table
        class="mt-4"
        v-if="companies.data.value?.data && companies.data.value?.data.length > 0"
        hoverable
      >
        <TableHead>
          <TableHeadCell>Id</TableHeadCell>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Created at</TableHeadCell>
          <TableHeadCell><span class="sr-only">Edit</span></TableHeadCell>
        </TableHead>
        <TableBody v-for="company in companies.data.value?.data" :key="company.id">
          <TableRow>
            <TableCell>{{ company.id }}</TableCell>
            <TableCell>{{ company.name }}</TableCell>
            <TableCell>{{ new Date(company.createdAt).toLocaleString() }}</TableCell>
            <TableCell>
              <button
                v-if="company.id !== props.currentUser.profile?.company?.id"
                class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                @click="handleSelectCompany(company)"
                :disabled="update.isLoading.value"
              >
                Select this company
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div class="mt-4 flex justify-end">
        <Pagination
          :page="page"
          :on-change="handleChangePage"
          :has-next-page="companies.data.value?.meta?.hasNextPage"
        />
      </div>
    </template>
  </Modal>
</template>
