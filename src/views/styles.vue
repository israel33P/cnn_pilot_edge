<script lang="ts">
  export const metadata: ITemplate = {
    name: 'styles',
    description: 'This is the Tailwinds style guide.',
    author: 'Israel Sanchez',
    updated: '06/24/2025',
  };
</script>
<script setup lang="ts">
  import type { ITemplate  } from '@/models';
  import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <NavBar title="STYLE GUIDE"></NavBar>
  <div class="context-under-nav">
    <h2 class="mb-2">Colors</h2>
    <span class="text-primary">text-primary</span> |
    <span class="text-secondary">text-secondary</span> |
    <span class="text-tertiary">text-tertiary</span> |
    <span class="text-success">text-success</span> |
    <span class="text-info">text-info</span> |
    <span class="text-warning">text-warning</span> |
    <span class="text-danger">text-danger</span> |
    <span class="text-cnn">text-cnn</span>

    <br><br>

    <span class="bg-primary text-is-dark p-1 rounded-lg">bg-primary</span> |
    <span class="bg-secondary text-is-dark p-1 rounded-lg">bg-secondary</span> |
    <span class="bg-tertiary text-is-dark p-1 rounded-lg">bg-tertiary</span> |
    <span class="bg-success p-1 rounded-lg">bg-success</span> |
    <span class="bg-info p-1 rounded-lg">bg-info</span> |
    <span class="bg-warning text-is-dark p-1 rounded-lg">bg-warning</span> |
    <span class="bg-danger p-1 rounded-lg">bg-danger</span> |
    <span class="bg-cnn p-1 rounded-lg">bg-cnn</span>
    
    <hr class="mt-4 mb-4">

    <h2 class="mb-2">Font Sizes</h2>
    <div class="text-sm">this is small font</div>
    <div class="text-base">this is medium font</div>
    <div class="text-lg">this is large font</div>
    <div class="text-xl">this is extra large font</div>
    <div class="text-2xl">this is extra large x2 font</div>
    <div class="text-3xl">this is extra large x3 font</div>
    <div class="text-4xl">this is extra large x4 font</div>
    <div class="text-5xl">this is extra large x5 font</div>
    <div class="text-6xl">this is extra large x6 font</div>
    <div class="text-7xl">this is extra large x7 font</div>
    <div class="text-8xl">this is extra large x8 font</div>
    <div class="text-9xl">this is extra large x9 font</div>
    
    <hr class="mt-4 mb-4">
    
    <h2 class="mb-2">Buttons</h2>
    <button class="bg-primary mr-1">Primary button</button>
    <button class="bg-secondary mr-1">Secondary button</button>
    <button class="bg-tertiary mr-1">Tertiary button</button>
    <button class="bg-success mr-1">Success button</button>
    <button class="bg-info mr-1 text-is-light">Info button</button>
    <button class="bg-warning mr-1">Warning button</button>
    <button class="bg-danger mr-1 text-is-light">Danger button</button>
    <button class="bg-cnn mr-1 text-white">CNN button</button>
    <button class="btn mr-1">Default button</button>

    <h4 class="my-2">Outlined buttons</h4>
    <button class="btn-outline mr-1 border-primary text-primary
      hover:text-is-dark hover:bg-primary">Primary buttons</button>
    <button class="btn-outline mr-1 border-secondary text-secondary
      hover:text-is-dark hover:bg-secondary">Secondary buttons</button>
    <button class="btn-outline mr-1 border-tertiary text-tertiary
      hover:text-is-dark hover:bg-tertiary">Tertiarty buttons</button>
    <button class="btn-outline mr-1 border-success text-success
      hover:text-is-dark hover:bg-success">Success buttons</button>
    <button class="btn-outline mr-1 border-info text-info
      hover:text-is-light hover:bg-info">Info buttons</button>
    <button class="btn-outline mr-1 border-warning text-warning
      hover:text-is-dark hover:bg-warning">Warning buttons</button>
    <button class="btn-outline mr-1 border-danger text-danger
      hover:text-is-light hover:bg-danger">Danger buttons</button>
    <button class="btn-outline mr-1 border-cnn text-white
      hover:text-white hover:bg-cnn">CNN buttons</button>
    <button class="btn-outline mr-1 hover:text-is-dark hover:bg-is-light">Default buttons</button>

    <hr class="mt-4 mb-4">

    <h2 class="mb-2">Badges</h2>
    <div class="flex flex-row">
      <p>Some text
        <span class="badge bg-neutral-300 text-neutral-700">Badge</span>
         - Another line of text.
        <span class="badge bg-primary text-is-dark">Prim</span>
         Some more information here
        <span class="badge bg-cnn">CNN</span>
      </p>
    </div>

    <hr class="mt-4 mb-4">

    <h2 class="mb-2">Cards</h2>
    <div class="card">
      <h1 class="card-title">Card Title Here</h1>
      <p class="card-body">Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi quaerat, laboriosam incidunt saepe earum autem,
        et mollitia placeat molestiae temporibus vel perferendis minus officiis eveniet optio tempore tempora rerum praesentium.</p>
    </div>

    <hr class="mt-4 mb-4">

    <h2 class="mb-2">Grid System</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 gap-3">
      <div class="card">
        <h3 class="card-title">Hello world</h3>
        <p class="card-body">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>
      <div class="card">
        <h3 class="card-title">Hello world</h3>
        <p class="card-body">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>
      <div class="card">
        <h3 class="card-title">Hello world</h3>
        <p class="card-body">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>
      <div class="card">
        <h3 class="card-title">Hello world</h3>
        <p class="card-body">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>
      <div class="card">
        <h3 class="card-title">Hello world</h3>
        <p class="card-body">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>
    </div>

    <hr class="mt-4 mb-4">

  </div>
</template>

<style scoped>

</style>
