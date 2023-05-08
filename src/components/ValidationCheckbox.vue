<script setup lang="ts">
import { toRef } from 'vue'
import { useField } from 'vee-validate'
import Checkbox from './Checkbox.vue'

const props = defineProps({
  checked: {
    type: Boolean
  },
  name: {
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
  initialValue: props.checked
})

function handleCheckChange(e: Event) {
  handleChange((e.target as HTMLInputElement).checked)
}
</script>

<template>
  <Checkbox
    :name="name"
    :id="name"
    :checked="inputValue"
    @change="handleCheckChange"
    @blur="handleBlur"
    v-bind="$attrs"
  >
    <template v-slot:label>
      <slot name="label"></slot>
    </template>
  </Checkbox>
  <p class="mt-4 text-red-500" v-show="errorMessage || meta.valid">
    {{ errorMessage || successMessage }}
  </p>
</template>
