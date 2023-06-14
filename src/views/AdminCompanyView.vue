<script setup lang="ts">
import { ref } from 'vue'
import { Input } from 'flowbite-vue'
import debounce from 'lodash.debounce'
import ModalAddCompany from './admin/companies/components/ModalAddCompany.vue'
import ModalEditCompany from './admin/companies/components/ModalEditCompany.vue'
import { useGetCompanies } from '@/composables/company'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from '@/components/Table'
import AppText from '@/components/AppText'
import Button from '@/components/Button.vue'
import Checkbox from '@/components/Checkbox.vue'
import { useToggle } from '@/composables/toggle'
import Pagination from '@/components/Pagination.vue'

const page = ref(1)
const search = ref('')
const findDeleted = ref(false)

const companies = useGetCompanies({
  page,
  search,
  isDeleted: findDeleted
})

const addCompanyToggle = useToggle()
const editCompanyToggle = useToggle()
const selectedCompany = ref<number | undefined>(undefined)

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

function handleSelectEdit(id: number) {
  selectedCompany.value = id
  editCompanyToggle.on()
}

function handleCheckChange() {
  findDeleted.value = !findDeleted.value
  page.value = 1
}
</script>

<template>
  <ModalAddCompany
    v-if="addCompanyToggle.v.value"
    :on-close="addCompanyToggle.off"
    @success="
      () => {
        addCompanyToggle.off()
        companies.refetch()
      }
    "
  />
  <ModalEditCompany
    v-if="editCompanyToggle.v.value"
    :on-close="editCompanyToggle.off"
    :company-id="selectedCompany"
    @success="
      () => {
        editCompanyToggle.off()
        companies.refetch()
      }
    "
  />
  <section class="py-4 px-8">
    <div class="flex items-center">
      <AppText as="h1" variant="title">Companies</AppText>
      <div class="ml-auto flex items-center">
        <Checkbox name="findDeleted" :checked="findDeleted" @change="handleCheckChange">
          <template #label> Is Deleted</template>
        </Checkbox>
        <Input type="text" @input="handleSearch" class="ml-2" placeholder="Search company" />
        <Button class="ml-2" @click="addCompanyToggle.on">Add new company</Button>
      </div>
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
        <TableHeadCell>Is Deleted</TableHeadCell>
        <TableHeadCell><span class="sr-only">Edit</span></TableHeadCell>
      </TableHead>
      <TableBody v-for="company in companies.data.value?.data" :key="company.id">
        <TableRow>
          <TableCell>{{ company.id }}</TableCell>
          <TableCell>{{ company.name }}</TableCell>

          <TableCell>{{ new Date(company.createdAt).toLocaleString() }}</TableCell>
          <TableCell>{{ company.isDeleted ? 'Yes' : 'No' }}</TableCell>
          <TableCell>
            <button
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              @click="handleSelectEdit(company.id)"
            >
              Edit
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
  </section>
</template>
