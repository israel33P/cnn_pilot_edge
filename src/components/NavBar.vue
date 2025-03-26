<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <nav class="flex-layout fixed top-[0] h-[55px] p-1 shadow-xl bg-cnn mb-4">
    <a href="/">
      <img class="h-[55px] w-auto" src="../assets/images/CNNDesignWhite.png" alt="cnn-logo">
    </a>
    <div class="flex-layout my-[0] mx-auto py-[0] px-2">
      <h2 class="text-2xl text-is-light font-medium">{{ title }}</h2>
      <ul>
        <li class="text-is-light hover:text-yellow-200"><a href="/style-guide">Style Guide</a></li>
      </ul>
    </div>
  </nav>
</template>
