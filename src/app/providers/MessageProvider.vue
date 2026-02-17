<script lang="ts">
import { message } from 'ant-design-vue'
import { defineComponent, Fragment, h, onMounted, onUnmounted } from 'vue'

import { setMessageApi } from '@/shared/lib/message'

export default defineComponent({
    name: 'MessageProvider',
    setup(_, { slots }) {
        const [messageApi, contextHolder] = message.useMessage()

        onMounted(() => {
            setMessageApi(messageApi)
        })
        onUnmounted(() => {
            setMessageApi(null)
        })

        return () => h(Fragment, null, [contextHolder(), slots.default?.()])
    }
})
</script>
