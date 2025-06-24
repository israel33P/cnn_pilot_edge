<script setup lang="ts">
    import { computed, onMounted, watch, ref, type PropType } from 'vue'
    import { PayloadHelper } from '@/helpers/PayloadHelper'
    import type { RadioButton } from '@/types'

    const props = defineProps({
        field: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: false,
        },
        radioButtons: {
            type: Array as PropType<RadioButton[]>,
            required: false,
            default: () => [],
        }
    })

    const emit = defineEmits<{
        rbSelected: [rbSel: string]
    }>()
    
    const selectedVal = ref('0')

    onMounted(() => {
        if (!props.field) return
        PayloadHelper.addFieldValueCallbacks({ [props.field]: onFieldChanged })
        onFieldChanged()
    })

    const onFieldChanged = () => {
        if (!props.field) return
        const fieldVal = PayloadHelper.getFieldText(props.field)
        setNewValue(fieldVal)
    }

    const setNewValue = (newVal: string): void => {
        if (newVal !== selectedVal.value) {
            selectedVal.value = newVal
        }

        if (props.field) {
            if (newVal !== PayloadHelper.getFieldText(props.field)){
                PayloadHelper.setFieldText(props.field, newVal)
            }
        }
    }

    const mainRBtns = computed(() => props.radioButtons.map((val)=>{
        setNewValue(selectedVal.value)
        let active:boolean = false
        if(val.color){
            active = true
        }
        const output = {
            label: val.label,
            value: val.value,
            isActive: active,
            sClass: val.color
        }
        return output
    }))

    watch(selectedVal, () => {
        emit('rbSelected', selectedVal.value)
    })

    defineExpose({ selectedVal })
</script>

<template>
    <div class="flex gap-1.5">
        <div v-for="(rb, idx) in mainRBtns" :key="idx">
            <label class="cursor-pointer flex gap-0.5 items-center" :for="'rb-'+ rb.label +'-'+ rb.value +'-'+ idx">
                <input class="hidden peer" type="radio" :id="'rb-'+ rb.label +'-'+ rb.value +'-'+ idx" :value="rb.value" v-model="selectedVal">
                <span v-if="!rb.isActive" class="inline-block size-1.5 rounded-full
                        bg-zinc-800 ring-1 ring-zinc-600 peer-checked:border-3
                        peer-checked:bg-gray-100 border-viz-blue"
                 />
                <span v-if="rb.isActive"
                    :class="'inline-block size-1.5 rounded-full bg-zinc-800 ring-1 ring-zinc-600 peer-checked:border-3 peer-checked:bg-gray-100 '+ rb.sClass"
                 />
                {{ rb.label }}
            </label>
        </div>
    </div>
</template>
