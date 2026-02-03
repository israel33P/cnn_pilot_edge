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
  import RadioButtons from '@/components/RadioButtons.vue'
  import { onMounted, ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { PayloadHelper } from '@/helpers/PayloadHelper'
  import { useClipboard } from '@vueuse/core'

  const busy = ref(true)
  const showHeaderTxt = ref('0')
  const errorTxt = ref('')
  const tempUrl = ref('{$PDS}/app/cnn/?template=header_generic')

  const route = useRoute()

  const { copy, isSupported } = useClipboard( )

  onMounted(async () => {
    PayloadHelper.initialise().then(() => (busy.value = false))
    if (!busy.value) {
      showHeaderTxt.value = PayloadHelper.getFieldText('HeaderFields/Omo')
      showHeader;
    }
  })

  const onErrorChange = (errorText:string) => {
    errorTxt.value = errorText
  }
  const onHeaderRadioChange = (val: string) => {
    showHeaderTxt.value = val
  }

  const queryDev = computed(() => route.query.dev?.toString().toLowerCase() === 'true')
  const showHeader = computed(() => showHeaderTxt.value !== '0')
</script>

<template>
  <div>
    <RadioButtons v-if="!busy || queryDev"
          field="HeaderFields/Omo"
          @rb-selected="onHeaderRadioChange"
          :radio-buttons="[
            {label: 'OFF', value: '0'},
            {label: 'ON', value: '1', color: 'border-cnn'},
            {label: 'W/SUBTITLES', value: '2'}
          ]"
     />
    <div v-if="showHeader">
      <p class="text-lg ml-1 mt-1 mb-0 pb-0">TITLE<span class="text-red-500 text-base italic" v-if="errorTxt!=''"> | {{ errorTxt }}</span></p>
      <TextBox field="HeaderFields/Title" v-if="!busy || queryDev"
          class="mb-1 w-full"
          @error-text="onErrorChange"
          placeholder="TITLE HERE ALL UPPERCASE"
          :default-line-count="parseInt('2')"
      />
      <div v-if="showHeaderTxt === '2'">
        <p class="text-lg ml-1 mt-1 mb-0">SUBTITLE</p>
        <TextBox field="HeaderFields/Subtitle" v-if="!busy || queryDev"
            class="mb-1 w-full"
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
