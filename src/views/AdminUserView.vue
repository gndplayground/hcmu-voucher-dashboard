<script setup lang="ts">
import { ref } from 'vue'
import { Input } from 'flowbite-vue'
import debounce from 'lodash.debounce'
import ModalAddUser from './admin/users/components/ModalAddUser.vue'
import ModalEditUser from './admin/users/components/ModalEditUser.vue'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from '@/components/Table'
import { useGetListUsers } from '@/composables/user'
import AppText from '@/components/AppText'
import Button from '@/components/Button.vue'
import { useToggle } from '@/composables/toggle'
import Pagination from '@/components/Pagination.vue'

const addUserToggle = useToggle()
const editUserToggle = useToggle()
const selectedUser = ref<number | undefined>(undefined)

const page = ref(1)
const search = ref('')

const users = useGetListUsers({
  page: page,
  search
})

function handleSelectEdit(id: number) {
  selectedUser.value = id
  editUserToggle.on()
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
</script>

<template>
  <section class="py-4 px-8">
    <ModalAddUser
      v-if="addUserToggle.v.value"
      :on-close="addUserToggle.off"
      @success="
        () => {
          addUserToggle.off()
          users.refetch()
        }
      "
    />
    <ModalEditUser
      v-if="editUserToggle.v.value"
      :on-close="editUserToggle.off"
      :user-id="selectedUser"
      @success="
        () => {
          editUserToggle.off()
          users.refetch()
        }
      "
    />
    <div class="flex items-center">
      <AppText as="h1" variant="title">Users</AppText>
      <div class="ml-auto flex">
        <Input type="text" @input="handleSearch" class="mr-2" placeholder="Search user by email" />
        <Button @click="addUserToggle.on">Add new user</Button>
      </div>
    </div>
    <Table
      class="mt-4"
      v-if="users.data.value?.data && users.data.value?.data.length > 0"
      hoverable
    >
      <TableHead>
        <TableHeadCell>Id</TableHeadCell>
        <TableHeadCell>Email</TableHeadCell>
        <TableHeadCell>Role</TableHeadCell>
        <TableHeadCell>Created at</TableHeadCell>
        <TableHeadCell>Is disabled</TableHeadCell>
        <TableHeadCell><span class="sr-only">Edit</span></TableHeadCell>
      </TableHead>
      <TableBody v-for="user in users.data.value?.data" :key="user.id">
        <TableRow>
          <TableCell>{{ user.id }}</TableCell>
          <TableCell>{{ user.email }}</TableCell>
          <TableCell>{{ user.role }}</TableCell>
          <TableCell>{{ new Date(user.createdAt).toLocaleString() }}</TableCell>
          <TableCell>{{ user.isDisabled ? 'Yes' : 'No' }}</TableCell>
          <TableCell>
            <button
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              @click="handleSelectEdit(user.id)"
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
        :has-next-page="users.data.value?.meta?.hasNextPage"
      />
    </div>
  </section>
</template>
