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
        sizeControl: [sizeCtrl: number],
        errorText: [error: string],
        labelText: [label: string]
    }>()

    const textVal = ref('')
    const lineCount = ref(1)
    const capitalized = ref('')
    const size = ref(0)
    const vertLinePos = ref(0)
    const horzLinePos = ref(0)
    const vertLineColor = ref('#FFFFFF88')
    const horzLineColor = ref('#FFFFFF88')
    const errorTxt = ref('')
    const labelTxt = ref('')
    const placeholderTxt = ref('')

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
        console.log(`Started Mounting: ${props.field}`)
        // Initialize line count
        if (props.defaultLineCount) setLineCount(props.defaultLineCount)
        if (PayloadHelper.fieldExists(props.field+'/LineCount', false))
            setLineCount(parseFloat(PayloadHelper.getFieldText(props.field+'/LineCount')) || lineCount.value)
        // Initialize size value
        if (PayloadHelper.fieldExists(props.field+'/Size', false))
            setSize(parseFloat(PayloadHelper.getFieldText(props.field+'/Size')) || size.value)
        // Initialize placeholder
        placeholderTxt.value = props.placeholder || placeholderTxt.value
        if (PayloadHelper.fieldExists(props.field+'/Placeholder', false))
            placeholderTxt.value = PayloadHelper.getFieldText(props.field+'/Placeholder') ?? placeholderTxt.value
        // Initialize other field values
        labelTxt.value = PayloadHelper.getFieldText(props.field+'/Label', false) ?? labelTxt.value
        errorTxt.value = PayloadHelper.getFieldText(props.field+'/Error', false) ?? errorTxt.value
        capitalized.value = PayloadHelper.getFieldText(props.field+'/Cap', false)?.toLowerCase() ?? capitalized.value
        vertLinePos.value = parseFloat(PayloadHelper.getFieldText(props.field+'/VLine', false)) || vertLinePos.value
        vertLineColor.value = PayloadHelper.getFieldText(props.field+'/VLine/Color', false) || vertLineColor.value
        horzLinePos.value = parseFloat(PayloadHelper.getFieldText(props.field+'/HLine', false)) || horzLinePos.value
        horzLineColor.value = PayloadHelper.getFieldText(props.field+'/HLine/Color', false) || horzLineColor.value
        // Register callbacks for field changes
        PayloadHelper.addFieldValueCallbacks({ [props.field]: onFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/Label']: onLabelFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/Placeholder']: onPlaceholderFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/LineCount']: onLineCountFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/Error']: onErrorFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/Cap']: onCapFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/Size']: onSizeFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/VLine']: onVertLineFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/VLine/Color']: onVertLineFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/HLine']: onHorzLineFieldChanged })
        PayloadHelper.addFieldValueCallbacks({ [props.field+'/HLine/Color']: onHorzLineFieldChanged })
        onCapFieldChanged()
    })

    onUnmounted(() => {
        // maybe needed
    })

    function setLineCount(count: number) {
        if (count < 1) count = 1 
        lineCount.value = count
    }
    function setSize(val: number) {
        if (val < -1) val = -1 
        if (val > 5) val = 5
        size.value = val
    }
    
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
        if (!props.field || !PayloadHelper.fieldExists(props.field+'/LineCount', false)) return
        let temp: number = parseFloat(PayloadHelper.getFieldText(props.field+'/LineCount')) || lineCount.value
        setLineCount(temp)
        onFieldChanged()
    }
    const onSizeFieldChanged = () => {
        if (!props.field || !PayloadHelper.fieldExists(props.field+'/Size', false)) return
        let tempSize:number = parseFloat(PayloadHelper.getFieldText(props.field+'/Size')) || 0
        setSize(tempSize)
    }
    const onErrorFieldChanged = () => {
        if (!props.field || !PayloadHelper.fieldExists(props.field+'/Error', false)) return
        errorTxt.value = PayloadHelper.getFieldText(props.field+'/Error') || ''
    }
    const onLabelFieldChanged = () => {
        if (!props.field || !PayloadHelper.fieldExists(props.field+'/Label', false)) return
        labelTxt.value = PayloadHelper.getFieldText(props.field+'/Label') || ''
    }
    const onPlaceholderFieldChanged = () => {
        if (!props.field || !PayloadHelper.fieldExists(props.field+'/Placeholder', false)) return
        placeholderTxt.value = PayloadHelper.getFieldText(props.field+'/Placeholder') || ''
    }
    const onCapFieldChanged = () => {
        if (!props.field || !PayloadHelper.fieldExists(props.field+'/Cap', false)) return
        const fieldVal = PayloadHelper.getFieldText(props.field)
        capitalized.value = PayloadHelper.getFieldText(props.field+'/Cap').toLowerCase() || ''
        setNewValue(fieldVal)
    }
    const onVertLineFieldChanged = () => {
        if (!props.field || !PayloadHelper.fieldExists(props.field+'/VLine', false)) return
        vertLinePos.value = parseFloat(PayloadHelper.getFieldText(props.field+'/VLine')) || 0
        if (PayloadHelper.fieldExists(props.field+'/VLine/Color', false))
            vertLineColor.value = PayloadHelper.getFieldText(props.field+'/VLine/Color') || '#FFFFFF88'
    }
    const onHorzLineFieldChanged = () => {
        if (!props.field || !PayloadHelper.fieldExists(props.field+'/HLine', false)) return
        horzLinePos.value = parseFloat(PayloadHelper.getFieldText(props.field+'/HLine')) || 0
        if (PayloadHelper.fieldExists(props.field+'/HLine/Color', false))
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
        onLabelFieldChanged()
        onSizeFieldChanged()
        //onLineCountFieldChanged()
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
            if (
                PayloadHelper.fieldExists(props.field+'/Cap', false) &&
                capitalized.value !== PayloadHelper.getFieldText(props.field+'/Cap', false).toLowerCase()
            ){
                PayloadHelper.setFieldText(props.field+'/Cap', capitalized.value)
            }
           //if(PayloadHelper.fieldExists('test2')) console.log(PayloadHelper.getFieldText('test2'))
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
    const borderColor = computed(() => errorTxt.value === ''? 'border-is-light/40': 'border-red-700 focus:outline-none focus:border-red-400')
    const sizeDisplay = computed(() => {
        switch(size.value){
            case -1:
                return "border-1 text-[0.5rem] rounded-2xs"
            case 0:
                return "border-1 text-xs rounded-xs"
            case 1:
                return "border-1 text-sm rounded-sm"
            case 2:
                return "border-2 text-base rounded-md"
            case 3:
                return "border-3 text-lg rounded-lg"
            case 4:
                return "border-4 text-xl rounded-xl"
            case 5:
                return "border-5 text-2xl rounded-2xl"
            case 6:
                return "border-6 text-3xl rounded-3xl"
        }
    })
    const mainGuides = computed(() => {
        type Styling = { style: string, align: string, pos: number}
        const outArr: Styling[] = []
        if (vertLinePos.value && vertLinePos.value !== 0) {
            let lineStyle: string = `border-left: 2px solid ${vertLineColor.value};`+
                'position: absolute; z-index: 2;' +
                'margin-left: -1px;' +
                'top: 2px;' +
                'bottom: 2px;' +
                `left:${vertLinePos.value}px;`
            outArr.push({style:lineStyle, align:'vertical', pos:vertLinePos.value})
        }
        if (horzLinePos.value &&  horzLinePos.value !== 0) {
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
    const sizeCtrl = computed(() => size.value)
    const error = computed(() => errorTxt.value)
    const label = computed(() => labelTxt.value)

    watch(numOfLines, () => {
        emit('numberOfLines', numOfLines.value)
    })
    watch(sizeCtrl, () => {
        emit('sizeControl', sizeCtrl.value)
    })
    watch(error, () => {
        emit('errorText', errorTxt.value)
    })
    watch(label, () => {
        emit('labelText', labelTxt.value)
    })

    defineExpose({ numOfLines, sizeCtrl, error, label })
</script>

<template>
    <div class="m-0 p-0">
        <div class="relative flex" v-if="lineCount < 2">
            <input class="relative w-full box-border
                    border-solid py-[0.2rem] px-[0.5rem]"
                :class="borderColor, sizeDisplay"
                :placeholder="placeholderTxt ?? ''"
                :value="props.value ?? textVal"
                type="text"
                @keydown="keydown"
                @input="(e: Event)=>{onValueChanged((e.target as HTMLInputElement).value, e)}"
            />
            <div class="" v-for="(val, idx) in mainGuides" :key="idx">
                <div :style="val.style" />
            </div>
        </div>
        <div class="relative flex" v-else>
            <textarea class="relative w-full box-border resize-none
                        border-solid py-[0.2rem] px-[0.5rem]"
                    :class="borderColor, sizeDisplay"
                    @input="(e:Event)=>{onValueChanged((e.target as HTMLInputElement).value, e)}"
                    @keydown="keydown" 
                    wrap="off"
                    :placeholder="placeholderTxt ?? ''"
                    :value="props.value ?? textVal"
                    :rows="props.heightByLines ?? lineCount"
            ></textarea>
            <div class="GuideGrp" v-for="(val, idx) in mainGuides" :key="idx">
                <div :style="val.style" />
            </div>
        </div>
    </div>
</template>
