<script lang="ts">
  export const metadata: ITemplate = {
    name: 'header',
    description: 'This is the Header template',
    concept: 'Z Startup',
    author: 'Israel Sanchez',
    updated: '06/24/2025',
  };
</script>
<script setup lang="ts">
  import type { ITemplate  } from '@/models';
  import TextBox from '@/components/TextBox.vue'
  import RadioButtons from '@/components/RadioButtons.vue'
  import { onMounted, ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { PayloadHelper } from '@/helpers/PayloadHelper'

  const busy = ref(true)
  const guidePositions = ref<number[]>([25,150,120])
  const showHeaderTxt = ref('2')
  const titleLinesAmt = ref(3)

  const route = useRoute()

  onMounted(async () => {
    PayloadHelper.initialise().then(() => (busy.value = false))
    if (!busy.value) {
      showHeaderTxt.value = PayloadHelper.getFieldText('rbHeader');
    }
  })

  const onGuideControlChanged = async (val: string, idx: number) => {
    if (val){
      guidePositions.value[idx] = Number(val)
    }
  }

  const onTitleLineAmtChanged = (num: Number) => {
    console.log(num.toString())
    console.log("Testing")
  }

  const onHeaderRadioChange = (val: string) => {
    showHeaderTxt.value = val
  }

  const queryDev = computed(() => route.query.dev?.toString().toLowerCase() === 'true')
  const showHeader = computed(() => {
    let isHeader: boolean = showHeaderTxt.value !== '0'
    if (isHeader && !busy.value) {
      PayloadHelper.setFieldText('-vizlayer-FG2', 'fg2_title_sub')
      PayloadHelper.setFieldText('bg2_FrameOmo', '1')
      PayloadHelper.setFieldText('fg2_TitleOmo', '0')
    } else if (!busy.value) {
      PayloadHelper.setFieldText('-vizlayer-FG2', 'fg2_out')
      PayloadHelper.setFieldText('bg2_FrameOmo', '0')
      PayloadHelper.setFieldText('fg2_TitleOmo', '2')
    }

    if (showHeaderTxt.value === '2' && !busy.value) {
      PayloadHelper.setFieldText('bg2_SubOmo', '1')
      PayloadHelper.setFieldText('fg2_TitleOmo', '1')
      titleLinesAmt.value = 2
    } else if (!busy.value) {
      PayloadHelper.setFieldText('bg2_SubOmo', '0')
      titleLinesAmt.value = 3
    }

    return isHeader
  })
</script>

<template>
  <div>
    <h4 class="mb-0.5">Header</h4>
    <RadioButtons v-if="!busy || queryDev"
          field="rbHeader"
          @rb-selected="onHeaderRadioChange"
          :radio-buttons="[
            {label: 'OFF', value: '0'},
            {label: 'ON', value: '1', color: 'border-cnn'},
            {label: 'W/SUBTITLES', value: '2'}
          ]"
     />
    <div v-if="showHeader">
      <p class="text-lg ml-1 mt-1 mb-0">TITLE</p>
      <TextBox field="Title" v-if="!busy || queryDev"
          class="mb-1 w-full"
          capitalize="true"
          @number-of-lines="onTitleLineAmtChanged"
          placeholder="TITLE HERE ALL UPPERCASE"
          :max-lines="titleLinesAmt"
          :guides="[
            { position: guidePositions[0], color: 'rgb(0, 190, 0)', alignment: 'horizontal' },
            { position: guidePositions[1] }
          ]"
      />
      <div v-if="showHeaderTxt === '2'">
        <p class="text-lg ml-1 mt-1 mb-0">SUBTITLE</p>
        <TextBox field="Subtitle" v-if="!busy || queryDev"
            class="mb-1 w-full"
            placeholder="SUBTITLE"
            :guides="[
              {position: guidePositions[2]}
            ]"
        />
      </div>
    </div>
    <div v-if="queryDev">
      <hr class="mt-5 mb-1">
      <div class="grid grid-cols-5 gap-2 pb-[255px]">
        <div class="card flex flex-col" v-for="n in 3" :key="n">
          <label class="card-title mb-1">Guide Controls: #{{ n }}</label>
          <input class="card-body px-1 mx-0.5 w-auto border-1 rounded-md border-white" type="number" min="0" max="700" step="1" :value="guidePositions[n-1]"
              @input="(e:Event)=>{onGuideControlChanged((e.target as HTMLInputElement).value, n-1)}">
        </div>
      </div>
    </div>
  </div>
</template>
