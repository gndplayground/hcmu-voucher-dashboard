<script setup lang="ts">
import { ref } from 'vue'
import { Input } from 'flowbite-vue'
import debounce from 'lodash.debounce'
import ModalAddUser from './admin/users/components/ModalAddUser.vue'
import ModalEditUser from './admin/users/components/ModalEditUser.vue'
import ModalAsignUserToCompany from './admin/users/components/ModalAsignUserToCompany.vue'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from '@/components/Table'
import { useGetListUsers } from '@/composables/user'
import AppText from '@/components/AppText'
import Button from '@/components/Button.vue'
import { useToggle } from '@/composables/toggle'
import Pagination from '@/components/Pagination.vue'
import { type User, Role } from '@/types'

const addUserToggle = useToggle()
const editUserToggle = useToggle()
const asignUserToCompanyToggle = useToggle()
const selectedUser = ref<number | undefined>(undefined)
const selectedUserToAsign = ref<User | undefined>(undefined)

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

function handleSelectEditAsign(user: User) {
  selectedUserToAsign.value = user
  asignUserToCompanyToggle.on()
  console.log('user', user)
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
    <ModalAsignUserToCompany
      :current-user="(selectedUserToAsign as any)"
      v-if="selectedUserToAsign && asignUserToCompanyToggle.v.value"
      :on-close="asignUserToCompanyToggle.off"
      @success="
        () => {
          asignUserToCompanyToggle.off()
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
        <TableHeadCell>Company</TableHeadCell>
        <TableHeadCell>Created at</TableHeadCell>
        <TableHeadCell>Is disabled</TableHeadCell>
        <TableHeadCell><span class="sr-only">Edit</span></TableHeadCell>
      </TableHead>
      <TableBody v-for="user in users.data.value?.data" :key="user.id">
        <TableRow>
          <TableCell>{{ user.id }}</TableCell>
          <TableCell>{{ user.email }}</TableCell>
          <TableCell>{{ user.role }}</TableCell>
          <TableCell>{{ user?.profile?.company?.name }}</TableCell>
          <TableCell>{{ new Date(user.createdAt).toLocaleString() }}</TableCell>
          <TableCell>{{ user.isDisabled ? 'Yes' : 'No' }}</TableCell>
          <TableCell>
            <button
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              @click="handleSelectEdit(user.id)"
            >
              Edit
            </button>
            <button
              v-if="user.role === Role.COMPANY"
              class="ml-4 font-medium text-blue-600 dark:text-blue-500 hover:underline"
              @click="handleSelectEditAsign(user)"
            >
              Asign to company
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
