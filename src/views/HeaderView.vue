<script setup lang="ts">
  import TextBox from '../components/TextBox.vue'
  import { onMounted, ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { PayloadHelper } from '../helpers'

  const busy = ref(true)
  const guidePositions = ref<number[]>([0,0,0])
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
  <div class="Container">
    <div class="Row">
      <h3 style="margin:0">Header</h3>
    </div>
    <div class="Row">
      <input type="radio" id="rb_Off" value="0" v-model="showHeaderTxt">
      <label for="rb_Off">OFF</label>
      <input type="radio" id="rb_On" value="1" v-model="showHeaderTxt">
      <label for="rb_On">ON</label>
      <input type="radio" id="rb_OnWSubs" value="2" v-model="showHeaderTxt">
      <label for="rb_OnWSubs">W/ SUBTITLES</label>
    </div>
    <div v-if="showHeader">
      <div class="Row">
        <TextBox field="Title" v-if="!busy || queryDev"
            label-position="top"
            label="Title" 
            capitalize="true"
            @number-of-lines="onTitleLineAmtChanged"
            :max-lines="titleLinesAmt"
            :guides="[
              { position: guidePositions[0], color: 'rgb(255, 0, 0)', alignment: 'horizontal' },
              { position: guidePositions[1] }
            ]"
        />
      </div>
      <div class="Row" v-if="showHeaderTxt === '2'">
        <TextBox field="Subtitle" v-if="!busy || queryDev"
            label="Subtitle"
            label-position="top"
            :guides="[
              { position: guidePositions[2], color: '#4477DD' }
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
