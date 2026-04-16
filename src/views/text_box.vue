<script lang="ts">
  export const metadata: ITemplate = {
    name: 'text_box',
    description: 'This is a Generic textbox template',
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
  const errorTxt = ref('')
  const labelTxt = ref('')
  const tempUrl = ref('{$PDS}/app/cnn/?template=text_box')

  const route = useRoute()

  const { copy, isSupported } = useClipboard( )

  onMounted(async () => {
    PayloadHelper.initialise().then(() => (busy.value = false))
    if (!busy.value) {
      // thinking
    }
  })

  const onErrorChange = (errorText:string) => {
    errorTxt.value = errorText
  }
  const onLabelChange = (label:string) => {
    labelTxt.value = label
  }

  const queryDev = computed(() => route.query.dev?.toString().toLowerCase() === 'true')
  const queryField = computed(() => route.query.field ? route.query.field.toString() : 'Title')
</script>

<template>
  <div>
    <div v-if="!busy || queryDev">
      <p class="text-lg ml-1 mt-1 mb-0 pb-0">{{ labelTxt }}<span class="text-red-500 text-base italic" v-if="errorTxt!=''"> | {{ errorTxt }}</span></p>
      <TextBox :field="queryField"
          class="mb-1 w-full"
          @error-text="onErrorChange"
          @label-text="onLabelChange"
          placeholder="TEXT HERE"
      />
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
