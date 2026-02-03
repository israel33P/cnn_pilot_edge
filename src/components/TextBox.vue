<script setup lang="ts">
    import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
    import { PayloadHelper } from '@/helpers/PayloadHelper'
    import type { CapsType } from '@/types'

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
        defaultLineCount: {
            type: Number,
            required: false,
        },
        heightByLines: Number,
    })
    
    const emit = defineEmits<{
        numberOfLines: [numOfLines: number],
        errorText: [error: string],
        titleText: [title: string]
    }>()

    const textVal = ref('')
    const lineCount = ref(1)
    const capitalized = ref('')
    const vertLinePos = ref(0)
    const horzLinePos = ref(0)
    const vertLineColor = ref('#FFFFFF88')
    const horzLineColor = ref('#FFFFFF88')
    const errorTxt = ref('')
    const titleTxt = ref('')

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
        if(props.defaultLineCount) lineCount.value = props.defaultLineCount
        PayloadHelper.addFieldValueCallbacks({ [props.field]: onFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/Title']: onTitleFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/LineCount']: onLineCountFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/Error']: onErrorFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/Cap']: onCapFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/VLine']: onVertLineFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/VLine/Color']: onVertLineFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/HLine']: onHorzLineFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/HLine/Color']: onHorzLineFieldChanged })
        onCapFieldChanged()
    })

    onUnmounted(() => {
        // maybe needed
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
    const onLineCountFieldChanged = () => {
        if (!props.field) return
        let tempCount: number = parseFloat(PayloadHelper.getFieldText(props.field+'/LineCount')) || lineCount.value
        if (tempCount < 1) tempCount = 1
        lineCount.value = tempCount
    }
    const onErrorFieldChanged = () => {
        if (!props.field) return
        errorTxt.value = PayloadHelper.getFieldText(props.field+'/Error') || ''
    }
    const onTitleFieldChanged = () => {
        if (!props.field) return
        titleTxt.value = PayloadHelper.getFieldText(props.field+'/Title') || ''
    }
    const onCapFieldChanged = () => {
        if (!props.field) return
        const fieldVal = PayloadHelper.getFieldText(props.field)
        capitalized.value = PayloadHelper.getFieldText(props.field+'/Cap').toLowerCase() || ''
        setNewValue(fieldVal)
    }
    const onVertLineFieldChanged = () => {
        if (!props.field) return
        vertLinePos.value = parseFloat(PayloadHelper.getFieldText(props.field+'/VLine')) || 0
        vertLineColor.value = PayloadHelper.getFieldText(props.field+'/VLine/Color') || '#FFFFFF88'
    }
    const onHorzLineFieldChanged = () => {
        if (!props.field) return
        horzLinePos.value = parseFloat(PayloadHelper.getFieldText(props.field+'/HLine')) || 0
        horzLineColor.value = PayloadHelper.getFieldText(props.field+'/HLine/Color') || '#FFFFFF88'
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
        onTitleFieldChanged()
        onLineCountFieldChanged()
        onHorzLineFieldChanged()
        onVertLineFieldChanged()
        onErrorFieldChanged()
        
        const updatedVal: string = capUpdate(newVal, capitalized.value as CapsType || '')
        if (updatedVal !== textVal.value) {
            textVal.value = updatedVal
            numOfLines 
        }

        if (props.field) {
            if (updatedVal !== PayloadHelper.getFieldText(props.field)){
                PayloadHelper.setFieldText(props.field, linesLimit(updatedVal))
            }
            if (capitalized.value !== PayloadHelper.getFieldText(props.field+'/Cap').toLowerCase()){
                PayloadHelper.setFieldText(props.field+'/Cap', capitalized.value)
            }
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

    function linesLimit(text:string):string {
        const lines = text.split('\n')
        if(lines.length > lineCount.value){
            errorTxt.value = `ERROR: Only ${lineCount.value} lines will be displayed.`
        } else {
            errorTxt.value = ''
        }
        return lines.slice(0, lineCount.value).join('\n')
    }

    const textLen = computed(() => textVal.value?.length || 0)
    const borderColor = computed(() => errorTxt.value === ''? 'border-is-light': 'border-red-700 focus:outline-none focus:border-red-400')
    const mainGuides = computed(() => {
        type Styling = { style: string, align: string, pos: number}
        const outArr: Styling[] = []
        if (vertLinePos.value !== 0) {
            let lineStyle: string = `border-left: 2px solid ${vertLineColor.value};`+
                'position: absolute; z-index: 2;' +
                'margin-left: -1px;' +
                'top: 2px;' +
                'bottom: 2px;' +
                `left:${vertLinePos.value}px;`
            outArr.push({style:lineStyle, align:'vertical', pos:vertLinePos.value})
        }
        if (horzLinePos.value !== 0) {
            let lineStyle: string = `border-top: 2px solid ${horzLineColor.value};`+
                'position: absolute; z-index: 2;' +
                'margin-top: -1px;' +
                'left: 2px;' +
                'right: 2px;' +
                `top:${horzLinePos.value}px;`
            outArr.push({style:lineStyle, align:'horizontal', pos:horzLinePos.value})
        }
        return outArr
    })

    const numOfLines = computed(() => (textVal.value?.match(/\n/g) || []).length + 1)
    const error = computed(() => errorTxt.value)
    const title = computed(() => titleTxt.value)

    watch(numOfLines, () => {
        emit('numberOfLines', numOfLines.value)
    })
    watch(error, () => {
        emit('errorText', errorTxt.value)
    })
    watch(title, () => {
        emit('errorText', titleTxt.value)
    })

    defineExpose({ numOfLines, error, title })
</script>

<template>
    <div class="m-0 p-0">
        <div class="relative flex" v-if="lineCount < 2">
            <input class="relative w-full box-border
                    border-solid border-2 rounded-md px-1"
                type="text"
                :class="borderColor"
                :placeholder="props.placeholder ? props.placeholder : ''"
                :value="props.value ? props.value : textVal"
                @keydown="keydown"
                @input="(e: Event)=>{onValueChanged((e.target as HTMLInputElement).value, e)}"
            />
            <div class="" v-for="(val, idx) in mainGuides" :key="idx">
                <div :style="val.style" />
            </div>
        </div>
        <div class="relative flex" v-else>
            <textarea class="relative w-full box-border resize-none
                        border-solid border-2 rounded-md px-1"
                    :class="borderColor"
                    @input="(e:Event)=>{onValueChanged((e.target as HTMLInputElement).value, e)}"
                    @keydown="keydown" 
                    wrap="off"
                    :placeholder="props.placeholder ? props.placeholder : ''"
                    :value="props.value ? props.value : textVal"
                    :rows="props.heightByLines ? props.heightByLines : lineCount"
            ></textarea>
            <div class="GuideGrp" v-for="(val, idx) in mainGuides" :key="idx">
                <div :style="val.style" />
            </div>
        </div>
    </div>
</template>
