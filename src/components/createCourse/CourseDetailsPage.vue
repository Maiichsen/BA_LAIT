<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue';

</script>

<template>
  <div class="border-2 border-green-500">
    <BaseInput input-type="text" placeholder="overskrift" input-id="overskrift"
               label-text="Overskrift" layout="inline"/>
    <BaseInput input-type="text" placeholder="kort beskrivelse" input-id="kortbeskrivelse"
               label-text="Kort beskrivelse" layout="inline"/>
    <BaseInput input-type="image" input-id="image" label-text="Billede" layout="inline"/>
    <BaseInput input-type="text" input-id="varighed" label-text="Varighed" layout="inline"/>
    <BaseInput input-type="text" input-id="indhold" label-text="Indhold" layout="stacked"/>
  </div>
</template>
