<script setup lang="ts">
  defineProps<{
    title: string,
  }>()
</script>

<template>
  <nav class="flex-layout fixed top-[0] h-[55px] p-1 shadow-xl bg-cnn mb-4">
    <router-link to="/">
      <img class="h-[55px] w-auto" src="../assets/images/CNNDesignWhite.png" alt="cnn-logo">
    </router-link>
    <div class="flex-layout my-[0] mx-auto py-[0] px-2">
      <h2 class="text-2xl text-is-light font-medium">{{ title }}</h2>
      <router-link to="/header">Header link</router-link>
      <ul class="flex flex-row gap-1">
        <li class="text-is-light hover:text-secondary">
          <router-link to="/header?dev=true">Header</router-link>
        </li> |
        <li class="text-is-light hover:text-secondary">
          <router-link to="/style-guide">Style Guide</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
