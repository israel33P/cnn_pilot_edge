<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <nav class="navbar-cnn mb-4">
    <a href="/">
      <img class="nav-image" src="../assets/images/CNNDesignWhite.png" alt="cnn-logo">
    </a>
    <div class="container ml-1">
      <h2 class="nav-title">{{ title }}</h2>
      <ul class="d-flex">
        <li class="ml-1 text-hover-secondary text-bold"><a href="/style-guide">Style Guide</a></li>
      </ul>
    </div>
  </nav>
</template>
