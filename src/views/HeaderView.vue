<script setup lang="ts">
  import TextBox from '../components/TextBox.vue'
  import NavBar from '../components/NavBar.vue'
  import { onMounted, ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { PayloadHelper } from '../helpers'

  const busy = ref(true)
  const guidePositions = ref<number[]>([25,150,120])
  const showHeaderTxt = ref('0')
  const titleLinesAmt = ref(3)

  const route = useRoute()

  onMounted(async () => {
    PayloadHelper.initialise().then(() => (busy.value = false))
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

  const queryDev = computed(() => route.query.dev?.toString().toLowerCase() === 'true')
  const showHeader = computed(() => {
    let isHeader: boolean = showHeaderTxt.value !== '0'
    if (isHeader) {
      PayloadHelper.setFieldText('-vizlayer-FG2', 'fg2_title_sub')
      PayloadHelper.setFieldText('bg2_FrameOmo', '1')
      PayloadHelper.setFieldText('fg2_TitleOmo', '0')
    } else {
      PayloadHelper.setFieldText('-vizlayer-FG2', 'fg2_out')
      PayloadHelper.setFieldText('bg2_FrameOmo', '0')
      PayloadHelper.setFieldText('fg2_TitleOmo', '2')
    }

    if (showHeaderTxt.value === '2') {
      PayloadHelper.setFieldText('bg2_SubOmo', '1')
      PayloadHelper.setFieldText('fg2_TitleOmo', '1')
      titleLinesAmt.value = 2
    } else {
      PayloadHelper.setFieldText('bg2_SubOmo', '0')
      titleLinesAmt.value = 3
    }

    return isHeader
  })
</script>

<template>
  <NavBar v-if="queryDev" title="HEADER"></NavBar>
  <div class="context-under-nav">
    <h4 class="mb-0.5">Header</h4>
    <div class="flex gap-1.5">
      <label class="cursor-pointer flex gap-0.5 items-center" for="rb_Off">
        <input class="hidden peer" type="radio" id="rb_Off" value="0" v-model="showHeaderTxt">
        <span class="inline-block size-1.5 rounded-full
            text-white border-viz-blue bg-zinc-800 ring-1 ring-zinc-600
            peer-checked:border-3 peer-checked:bg-gray-100 peer-focus:ring-viz-blue" />
        OFF
      </label>
      <label class="cursor-pointer flex gap-0.5 items-center" for="rb_On">
        <input class="hidden peer" type="radio" id="rb_On" value="1" v-model="showHeaderTxt">
        <span class="inline-block size-1.5 rounded-full
            text-white border-viz-blue bg-zinc-800 ring-1 ring-zinc-600
            peer-checked:border-3 peer-checked:bg-gray-100 peer-focus:ring-viz-blue" />
        ON
      </label>
      <label class="cursor-pointer flex gap-0.5 items-center" for="rb_OnWSubs">
        <input class="hidden peer" type="radio" id="rb_OnWSubs" value="2" v-model="showHeaderTxt">
        <span class="inline-block size-1.5 rounded-full
            text-white border-viz-blue bg-zinc-800 ring-1 ring-zinc-600
            peer-checked:border-3 peer-checked:bg-gray-100 peer-focus:ring-viz-blue" />
        W/ SUBTITLES
      </label>
    </div>
    <div v-if="showHeader">
      <TextBox field="Title" v-if="!busy || queryDev"
          class="my-1 w-full"
          capitalize="true"
          @number-of-lines="onTitleLineAmtChanged"
          placeholder="TITLE"
          :max-lines="titleLinesAmt"
          :guides="[
            { position: guidePositions[0], color: 'rgb(0, 190, 0)', alignment: 'horizontal' },
            { position: guidePositions[1] }
          ]"
      />
      <div v-if="showHeaderTxt === '2'">
        <TextBox field="Subtitle" v-if="!busy || queryDev"
            class="my-1 w-full"
            placeholder="SUBTITLE"
            :guides="[
              {position: guidePositions[2]}
            ]"
        />
      </div>
    </div>
    <div v-if="queryDev">
      <hr class="mt-5 mb-1">
      <div class="grid grid-cols-5 gap-2">
        <div class="card flex flex-col" v-for="n in 3" :key="n">
          <label class="card-title mb-1">Guide Controls: #{{ n }}</label>
          <input class="card-body px-1 mx-0.5 w-auto border-1 rounded-md border-white" type="number" min="0" max="700" step="1" :value="guidePositions[n-1]"
              @input="(e:Event)=>{onGuideControlChanged((e.target as HTMLInputElement).value, n-1)}">
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
  @import '../assets/styles/HeaderView.css'
</style>
