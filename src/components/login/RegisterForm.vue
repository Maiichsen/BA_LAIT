<script setup lang="ts">

import BaseInput from '@/components/atoms/BaseInput.vue';
</script>

<template>
  <form action="">
    <BaseInput input-type="text" placeholder="e-mail" input-id="loginEmail" label-text="E-mail" layout="stacked"/>
    <br>
    <BaseInput input-type="text" placeholder="adgangskode" input-id="loginPassword" label-text="Adgangskode" layout="stacked"/>
    <br>
    <button type="submit" class="hover:text-red-700">LOG IND!</button>
  </form>
</template>

<style scoped>

</style>
