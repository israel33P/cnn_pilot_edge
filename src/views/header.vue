<script lang="ts">
  export const metadata: ITemplate = {
    name: 'header_generic',
    description: 'This is the Generic Header template',
    concept: '',
    author: 'Israel Sanchez',
    updated: '02/03/2026',
  };
</script>
<script setup lang="ts">
  import type { ITemplate  } from '@/models';
  import TextBox from '@/components/TextBox.vue'
  import { onMounted, ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { PayloadHelper } from '@/helpers/PayloadHelper'
  import { useClipboard } from '@vueuse/core'

  const busy = ref(true)
  const parentField = ref('HeaderFields')
  const showHeaderTxt = ref('0')
  const hideSubtitle = ref(false)
  const labelTxt = ref('Header')
  const labelSubTxt = ref('')
  const errorTxt = ref('')
  const errorSubTxt = ref('')
  const sizeDisplay = ref<[string,number]>(['text-sm',16])
  const sizeSubDisplay = ref<[string,number]>(['text-sm',16])
  const tempUrl = ref('{$PDS}/app/cnn/?template=header_generic')
  
  const route = useRoute()

  const { copy, isSupported } = useClipboard( )

  onMounted(async () => {
    PayloadHelper.initialise().then(() => {
      busy.value = false
      PayloadHelper.addFieldValueCallbacks({[ parentField.value+'/Omo']: onOmoFieldChanged })
      PayloadHelper.addFieldValueCallbacks({[ parentField.value+'/HideSubtitle']: onHideSubtitleFieldChanged })
      onOmoFieldChanged()
      onHideSubtitleFieldChanged()
    })
  })
  
  const onOmoFieldChanged = () => {
      const fieldVal = PayloadHelper.getFieldText(parentField.value+'/Omo')
      showHeaderTxt.value = fieldVal
  }
  const onHideSubtitleFieldChanged = () => {
    PayloadHelper.fieldExists(parentField.value+'/HideSubtitle', false)
      hideSubtitle.value = PayloadHelper.getFieldText(parentField.value+'/HideSubtitle') === 'true'
  }
  
  const onLabelSubChange = (label:string) => {
    labelSubTxt.value = label
  }
  const onLabelChange = (label:string) => {
    labelTxt.value = label
  }
  const onSizeChange = (size:number) => {
    switch(size){
      case -1: sizeDisplay.value = ["text-[0.5rem]",9];break;
      case 0: sizeDisplay.value = ["text-xs",13];break;
      case 1: sizeDisplay.value = ["text-sm",16];break;
      case 2: sizeDisplay.value = ["text-base", 18];break;
      case 3: sizeDisplay.value = ["text-lg",20];break;
      case 4: sizeDisplay.value = ["text-xl",22];break;
      case 5: sizeDisplay.value = ["text-2xl",24];break;
      case 6: sizeDisplay.value = ["text-3xl",26];break;
    }
  }
  const onSizeSubChange = (size:number) => {
    switch(size){
      case -1: sizeSubDisplay.value = ["text-[0.5rem]",9];break;
      case 0: sizeSubDisplay.value = ["text-xs",13];break;
      case 1: sizeSubDisplay.value = ["text-sm",16];break;
      case 2: sizeSubDisplay.value = ["text-base", 18];break;
      case 3: sizeDisplay.value = ["text-lg",20];break;
      case 4: sizeSubDisplay.value = ["text-xl",22];break;
      case 5: sizeSubDisplay.value = ["text-2xl",24];break;
      case 6: sizeSubDisplay.value = ["text-3xl",26];break;
    }
  }
  const onErrorChange = (errorText:string) => {
    errorTxt.value = errorText
  }
  const onErrorSubChange = (errorText:string) => {
    errorSubTxt.value = errorText
  }

  const queryDev = computed(() => route.query.dev?.toString().toLowerCase() === 'true')
</script>

<template>
  <div v-if="!busy || queryDev">
    <div>
      <!--HEADER-->
      <p class="ml-0.5 mb-0 pb-0" :class="sizeDisplay[0]">
        {{ labelTxt }}
        <span class="text-red-500 italic ml-0.5" :class="sizeDisplay[0]" v-if="errorTxt!=''">
          <svg xmlns="http://www.w3.org/2000/svg" :height="sizeDisplay[1]" fill="currentColor" class="inline-flex mb-0.5" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
          </svg>
          {{ errorTxt }}
        </span>
      </p>
      <TextBox :field="parentField +'/Title'" v-if="!busy || queryDev"
          class="mb-1 w-full"
          @error-text="onErrorChange"
          @size-control="onSizeChange"
          @label-text="onLabelChange"
          placeholder="Title"
          :default-line-count="parseInt('2')"
      />
      <div class="py-0 my-0" v-if="!hideSubtitle">
        <!--SUBTITLE-->
        <p class="ml-0.5" :class="sizeSubDisplay[0]">
          {{ labelSubTxt }}
          <span class="text-red-500 italic ml-0.5" :class="sizeSubDisplay[0]" v-if="errorSubTxt!=''">
            <svg xmlns="http://www.w3.org/2000/svg" :height="sizeSubDisplay[1]" fill="currentColor" class="inline-flex mb-0.5" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
            </svg>
            {{ errorSubTxt }}
          </span>
        </p>
        <TextBox :field="parentField +'/Subtitle'" v-if="!busy || queryDev"
            class="mb-1 w-full"
            @error-text="onErrorSubChange"
            @size-control="onSizeSubChange"
            @label-text="onLabelSubChange"
            placeholder="SUBTITLE"
        />
      </div>
    </div>
    <div v-if="queryDev">
      <hr class="mt-5 mb-1">
      <div class="grid grid-cols-1 gap-2 pb-21.25">
        <div class="card flex flex-col mt-2">
          <label class="card-title mb-1">
            Component URL:
            <p @click="copy(tempUrl)" class="flex gap-1 font-medium text-is-light-m/85 text-lg mt-1 cursor-pointer" v-if="isSupported">
              <span class="font-light">
                <svg xmlns="http://www.w3.org/2000/svg" class=" h-2" fill="currentColor" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                </svg>
              </span> 
              {{ tempUrl }}
            </p>
            <p class="font-medium text-is-light-m/85 text-lg mt-1" v-else>{{ tempUrl }}</p>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
