<script setup lang="ts">
import { toRef } from 'vue'
import { useField } from 'vee-validate'
import Select from './Select.vue'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  successMessage: {
    type: String,
    default: ''
  }
})

const name = toRef(props, 'name')

// we don't provide any rules here because we are using form-level validation
// https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta
} = useField(name, undefined, {
  initialValue: props.value
})
</script>

<template>
  <Select
    :label="label"
    :name="name"
    :id="name"
    :value="inputValue"
    @input="handleChange"
    @blur="handleBlur"
    v-bind="$attrs"
  >
    <slot></slot>
  </Select>
  <p class="mt-4 text-red-500" v-show="errorMessage || meta.valid">
    {{ errorMessage || successMessage }}
  </p>
</template>
