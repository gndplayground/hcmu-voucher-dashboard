import { defineComponent, h, type PropType } from 'vue'

export default defineComponent({
  name: 'AppText',
  props: {
    variant: {
      type: String as PropType<'title' | 'text'>,
      default: 'text'
    },
    as: {
      type: [Object, String],
      default: 'p'
    }
  },
  setup(props, ctx) {
    let classStyle = 'text-gray-500 dark:text-gray-400'

    switch (props.variant) {
      case 'title': {
        classStyle = 'text-2xl font-bold text-gray-900 dark:text-white'
        break
      }
    }

    return () =>
      h(
        props.as as any,
        {
          ...ctx.attrs,
          class: classStyle
        },
        ctx.slots.default?.()
      )
  }
})
