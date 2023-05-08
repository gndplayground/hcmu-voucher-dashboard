import { ref } from 'vue'

export function useToggle(defaultValue = false) {
  const v = ref(defaultValue)

  function on() {
    v.value = true
  }

  function off() {
    v.value = false
  }

  function toggle() {
    v.value = !v.value
  }

  return {
    on,
    off,
    toggle,
    v
  }
}
