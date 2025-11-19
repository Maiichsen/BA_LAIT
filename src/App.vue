<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template class="">
  <header class="">
    <h1>HEJ GÅS</h1>
      <nav class="flex space-x-4 border-b border-tutara-200 h-20 items-center px-4">
        <div>
          <img alt="lait logo" class="" src="@/assets/images/logo.png" width="100" height="100" />
        </div>
        <div class="w-full text-c2 text-center [&_a]:text-cornflower-blue-500 flex gap-2">
          <RouterLink to="/">Side 1</RouterLink>
          <RouterLink to="/About">Side 2</RouterLink>
        </div>
      </nav>
  </header>

  <RouterView />
</template>

<style scoped>
</style>
