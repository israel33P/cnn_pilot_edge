<script setup lang="ts">
    import NavBar from '../components/NavBar.vue'
</script>

<template>
  <NavBar title="STYLE GUIDE"></NavBar>
  <div class="w-full max-w-[1600px] mb-0 mt-2 mx-auto pb-0 pt-[55px] px-[20px] box-border">
    <h2>Colors</h2>
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
    <div class="font-sm">this is small font</div>
    <div class="font-md">this is medium font</div>
    <div class="font-lg">this is large font</div>
    <div class="font-xl">this is extra large font</div>
    <div class="font-xll">this is extra, extra large font</div>
    
    <hr class="mt-4 mb-4">
    

    <h2>Buttons</h2>
    <div class="row">
      <button class="btn-primary mr-1">Primary button</button>
      <button class="btn-outline-primary mr-1">Primary buttons</button>
      <button class="btn mr-1">Default button</button>
      <button class="btn-outline mr-1">Default buttons</button>
      <button class="btn-outline-danger">Default buttons</button>
    </div>

    <hr class="mt-4 mb-4">

    <h2 class="mb-2">Badges</h2>
    <div class="row">
      <div class="badge">Badge</div>
      <div class="badge-primary">Prim</div>
      <div class="badge-cnn">CNN</div>
    </div>

    <hr class="mt-4 mb-4">

    <h2>Cards</h2>
    <div class="card">
      <h1 class="card-title">Card Title Here</h1>
      <p class="card-body">Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi quaerat, laboriosam incidunt saepe earum autem,
        et mollitia placeat molestiae temporibus vel perferendis minus officiis eveniet optio tempore tempora rerum praesentium.</p>
    </div>

    <hr class="mt-4 mb-4">

    <h2 class="mb-2">Grid System</h2>
    <div class="row gap-2 justify-center">
      <div class="col-16-sm col-5-md col-3-xll">
        <div class="card">
          <h3 class="card-title">Hello world</h3>
          <p class="card-body">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </div>
      <div class="col-16-sm col-5-md col-3-xll">
        <div class="card">
          <h3 class="card-title">Hello world</h3>
          <p class="card-body">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </div>
      <div class="col-16-sm col-5-md col-3-xll">
        <div class="card">
          <h3 class="card-title">Hello world</h3>
          <p class="card-body">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </div>
      <div class="col-16-sm col-5-md col-3-xll">
        <div class="card">
          <h3 class="card-title">Hello world</h3>
          <p class="card-body">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </div>
      <div class="col-16-sm col-5-md col-3-xll">
        <div class="card">
          <h3 class="card-title">Hello world</h3>
          <p class="card-body">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </div>
    </div>

    <hr class="mt-4 mb-4">

  </div>
</template>

<style scoped>

</style>
