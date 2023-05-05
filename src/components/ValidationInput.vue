<script setup lang="ts">
import { toRef, type PropType } from 'vue'
import { Input } from 'flowbite-vue'
import { useField } from 'vee-validate'

type InputProps = InstanceType<typeof Input>['$props']

const props = defineProps({
  type: {
    type: String as PropType<InputProps['type']>,
    default: 'text'
  },
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
  },
  placeholder: {
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
  <Input
    :label="label"
    :name="name"
    :id="name"
    :type="type"
    :value="inputValue"
    :placeholder="placeholder"
    @input="handleChange"
    @blur="handleBlur"
    v-bind="$attrs"
  />
  <p class="mt-4 text-red-500" v-show="errorMessage || meta.valid">
    {{ errorMessage || successMessage }}
  </p>
</template>
