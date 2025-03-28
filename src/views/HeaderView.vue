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
    <div class="">
      <input type="radio" id="rb_Off" value="0" v-model="showHeaderTxt">
      <label for="rb_Off">OFF</label>
      <input type="radio" id="rb_On" value="1" v-model="showHeaderTxt">
      <label for="rb_On">ON</label>
      <input type="radio" id="rb_OnWSubs" value="2" v-model="showHeaderTxt">
      <label for="rb_OnWSubs">W/ SUBTITLES</label>
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
            { position: guidePositions[1], color: '#FF00FF84' }
          ]"
      />
      <div v-if="showHeaderTxt === '2'">
        <TextBox field="Subtitle" v-if="!busy || queryDev"
            class="my-1 w-full"
            placeholder="SUBTITLE"
            :guides="[
              {position: guidePositions[2], color:'#FFFFFF88'}
            ]"
        />
      </div>
    </div>
    <div class="Row Controls" v-if="queryDev" v-for="n in 3" :key="n">
      <label>Controls guide #: {{ n }}</label>
      <input type="number" min="0" max="700" step="1" :value="guidePositions[n-1]"
          @input="(e:Event)=>{onGuideControlChanged((e.target as HTMLInputElement).value, n-1)}">
    </div>
  </div>
</template>

<style lang="css" scoped>
  @import '../assets/styles/HeaderView.css'
</style>
