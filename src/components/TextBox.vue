<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref, watch, nextTick, type PropType } from 'vue'
    import { PayloadHelper } from '@/helpers/PayloadHelper'
    import type { CapsType, GuideLine } from '@/types'

    const props = defineProps({
        field: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: false,
        },
        placeholder: {
            type: String,
            required: false,
        },
        maxLines: {
            type: Number,
            required: false,
            default: 1,
        },
        guides: {
            type: Array as PropType<GuideLine[]>,
            required: false,
            default: () => [],
        },
        heightByLines: Number,
    })
    
    const emit = defineEmits<{
        numberOfLines: [numOfLines: number]
    }>()

    const textVal = ref('')
    const capitalized = ref('')
    const vertLinePos = ref(0)
    const horzLinePos = ref(0)
    const keydownProps: {
        cursorPosition: {
            start: number
            end: number
        }
        textLength: number
        key: string
    } = {
        cursorPosition: {
            start: 0,
            end: 0
        },
        textLength: 0,
        key: ''
    }

    onMounted(() => {
        if (!props.field) return
        PayloadHelper.addFieldValueCallbacks({ [props.field]: onFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/Cap']: onCapFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/VLine']: onVertLineFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/HLine']: onHorzLineFieldChanged })
        onCapFieldChanged()
    })

    onUnmounted(() => {
       // May need to clear textVal 
    })

    const keydown = ({ target, key }: KeyboardEvent) => {
        keydownProps.key = key
        keydownProps.cursorPosition.start = (target as HTMLInputElement).selectionStart || 0
        keydownProps.cursorPosition.end = (target as HTMLInputElement).selectionEnd || 0
        keydownProps.textLength = textLen.value
    }

    const onFieldChanged = () => {
        if (!props.field) return
        const fieldVal = PayloadHelper.getFieldText(props.field)
        setNewValue(fieldVal)
    }
    const onCapFieldChanged = () => {
        if (!props.field) return
        const fieldVal = PayloadHelper.getFieldText(props.field)
        capitalized.value = PayloadHelper.getFieldText(props.field+'/Cap').toLowerCase() || ''
        setNewValue(fieldVal)
    }
    const onVertLineFieldChanged = () => {
        if (!props.field) return
        vertLinePos.value = parseFloat(PayloadHelper.getFieldText(props.field+'/VLine'))
    }
    const onHorzLineFieldChanged = () => {
        if (!props.field) return
        horzLinePos.value = parseFloat(PayloadHelper.getFieldText(props.field+'/HLine'))
    }

    const onValueChanged = async (val: string, {target}: Event) => {
        const inputField = target as HTMLInputElement
        setNewValue(val)

        await nextTick()

        const lenDiff = textLen.value - keydownProps.textLength
        let newCursorPos = keydownProps.cursorPosition.start

        if (keydownProps.key === 'Delete') {
            newCursorPos = keydownProps.cursorPosition.start
        } else if (keydownProps.key === 'Backspace') {
            newCursorPos = keydownProps.cursorPosition.start - (lenDiff === -1 ? 1 : 0)
        } else {
            newCursorPos = keydownProps.cursorPosition.end + lenDiff
        }

        inputField.setSelectionRange(newCursorPos, newCursorPos)
    }

    const setNewValue = (newVal: string): void => {
        const updatedVal: string = capUpdate(newVal, capitalized.value as CapsType || '')
        if (updatedVal !== textVal.value) {
            textVal.value = updatedVal
            numOfLines 
        }

        if (props.field) {
            if (updatedVal !== PayloadHelper.getFieldText(props.field)){
                PayloadHelper.setFieldText(props.field, updatedVal)
            }
            if (capitalized.value !== PayloadHelper.getFieldText(props.field+'/Cap').toLowerCase()){
                PayloadHelper.setFieldText(props.field+'/Cap', capitalized.value)
            }
            vertLinePos.value = parseFloat(PayloadHelper.getFieldText(props.field+'/VLine'))
            horzLinePos.value = parseFloat(PayloadHelper.getFieldText(props.field+'/HLine'))
        }
    }

    const capUpdate = (text: string, type: CapsType): string => {
        let updatedText = ""
        if (text) {
           switch (type) {
                case 'upper':
                    updatedText = text.toUpperCase()
                    break
                case 'lower':
                    updatedText = text.toLowerCase()
                    break
                case 'words':
                    updatedText = text.replace(/(^\w|\s\w)/g, (t) => t.toUpperCase())
                    break
                case 'sentences':
                    updatedText = text.replace(/(^\w|[.]\s\w)/g, (t) => t.toUpperCase())
                    break
                default:
                    updatedText = text
                    break
           }
        }
        return updatedText
    }

    const textLen = computed(() => textVal.value?.length || 0)
    /*const mainGuides = computed(() => props.guides
    .filter(val => val.position != 0)
    .map((val)=>{
        if(!val.color) val.color = '#FFFFFF88'
        if(!val.alignment) val.alignment = 'vertical'
        let lineStyle: string = 'border-left: 2px solid '+val.color+';'+
                'margin-left: -1px;' +
                'top: 2px;' +
                'bottom: 2px;' +
                'left:' + val.position +'px;'
        if(val.alignment === 'horizontal'){
            lineStyle = 'border-top: 2px solid '+val.color+';'+
                'margin-top: -1px;' +
                'left: 2px;' +
                'right: 2px;' +
                'top:' + val.position +'px;'
        }
        const output = {
            style: 'position: absolute;' + 
                'z-index: 2;' + lineStyle,
            align: val.alignment,
            pos: val.position
        }
        return output
    }))*/
    const mainGuides = computed(() => {
        type Styling = { style: string, align: string, pos: number}
        const outArr: Styling[] = []
        if (vertLinePos.value !== 0) {
            let lineStyle: string = 'border-left: 2px solid #FFFFFF88;'+
                'position: absolute; z-index: 2;' +
                'margin-left: -1px;' +
                'top: 2px;' +
                'bottom: 2px;' +
                'left:' + vertLinePos.value +'px;'
            outArr.push({style:lineStyle, align:'vertical', pos:vertLinePos.value})
        }
        if (horzLinePos.value !== 0) {
            let lineStyle: string = 'border-top: 2px solid #FFFFFF88;'+
                'position: absolute; z-index: 2;' +
                'margin-top: -1px;' +
                'left: 2px;' +
                'right: 2px;' +
                'top:' + horzLinePos.value +'px;'
            outArr.push({style:lineStyle, align:'horizontal', pos:horzLinePos.value})
        }
        return outArr
    })
    const numOfLines = computed(() => (textVal.value?.match(/\n/g) || []).length + 1)

    watch(numOfLines, () => {
        emit('numberOfLines', numOfLines.value)
    })

    defineExpose({ numOfLines })
</script>

<template>
    <div class="m-0 p-0">
        <div class="relative flex" v-if="maxLines < 2">
            <input class="relative w-full box-border border-is-light
                    border-solid border-2 rounded-md px-1"
                type="text"
                :placeholder="props.placeholder ? props.placeholder : ''"
                :value="props.value ? props.value : textVal"
                @keydown="keydown"
                @input="(e: Event)=>{onValueChanged((e.target as HTMLInputElement).value, e)}"
            />
            <div class="" v-for="(val, idx) in mainGuides" :key="idx">
                <div :style="val.style" />
            </div>
        </div>
        <div class="relative flex" v-if="maxLines >= 2">
            <textarea class="relative w-full box-border resize-none border-is-light
                        border-solid border-2 rounded-md px-1"
                    @input="(e:Event)=>{onValueChanged((e.target as HTMLInputElement).value, e)}"
                    @keydown="keydown" 
                    wrap="off"
                    :placeholder="props.placeholder ? props.placeholder : ''"
                    :value="props.value ? props.value : textVal"
                    :rows="props.heightByLines ? props.heightByLines : props.maxLines"
            ></textarea>
            <div class="GuideGrp" v-for="(val, idx) in mainGuides" :key="idx">
                <div :style="val.style" />
            </div>
        </div>
    </div>
</template>
