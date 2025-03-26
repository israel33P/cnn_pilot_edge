<script setup lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue'
    import { PayloadHelper } from '../helpers'

    const textVal = ref('')

    const props = defineProps({
        field: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: false,
        }
    })
    
    onMounted(() => {
        if (!props.field) return
        PayloadHelper.addFieldValueCallbacks({ [props.field]: onFieldChanged })
        onFieldChanged()
    })

    onUnmounted(() => {
       // May need to clear textVal 
    })

    const onFieldChanged = () => {
        if (!props.field) return
        const fieldVal = PayloadHelper.getFieldText(props.field)
        setNewValue(fieldVal)
    }

    const onValueChanged = async (val: string) => {
        setNewValue(val)
    }

    const setNewValue = (newVal: string): void => {
        if (props.field) {
            if (newVal !== PayloadHelper.getFieldText(props.field)){
                PayloadHelper.setFieldText(props.field, newVal)
            }
            textVal.value = newVal
        }
    }
</script>

<template>
    <div class="App-Testing">
        <p>{{ props.field }}</p>
        <input type="text" 
                :value="props.value ? props.value : textVal"
                @input="
                    (e: Event) => {
                        onValueChanged((e.target as HTMLInputElement).value)
                    }"
        >
    </div>
</template>