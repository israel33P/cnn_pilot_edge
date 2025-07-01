<script setup lang="ts">
  defineProps<{
    concept?: string,
    title?: string,
  }>()
</script>

<template>
  <nav class="flex-layout fixed top-[0] h-[55px] p-1 shadow-xl bg-cnn mb-4">
    <router-link to="/">
      <img class="h-[55px] w-auto" src="../assets/images/CNNDesignWhite.png" alt="cnn-logo">
    </router-link>
    <div class="flex-layout my-[0] py-[0] px-2 pr-0.5">
      <div class="flex gap-2">
        <h3 class="place-self-center" v-if="title != ''">{{ title }}</h3>
        <select id="conceptList" class="hover:bg-red-900 hover:border-2 border-neutral-500 p-0.5 rounded-xl">
          <option v-bind:value="'-- EMPTY --'" selected
                class="bg-gray-600 text-lg font-bold">
            -- EMPTY --
          </option>
          <option v-bind:value="'-- ALL --'"
                class="bg-gray-600 text-lg font-bold">
            -- ALL --
          </option>
        </select>
      </div>
      <div>
        <p v-if="concept != ''" class="badge bg-is-light/75 text-cnn font-medium leading-1 shadow">
          Concept: <span class="text-is-dark font-bold text-sm">{{ concept }}</span>
        </p>
      </div>
    </div>
  </nav>
</template>
