<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue';
import {ref} from 'vue';
import {signUpNewUser} from '@/services/userService.ts';

const userEmail = ref('');
const userPassword = ref('');

const handleLogin = async() => {
  try {
    const data = await signUpNewUser(userEmail.value, userPassword.value);
    console.log(data);
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <form @submit.prevent="handleLogin">
    <BaseInput input-type="text" placeholder="e-mail" input-id="loginEmail" label-text="E-mail" layout="stacked" v-model="userEmail"/>
    <br>
    <BaseInput input-type="text" placeholder="adgangskode" input-id="loginPassword" label-text="Adgangskode" layout="stacked" v-model="userPassword"/>
    <br>
    <button type="submit" class="hover:text-red-700">LOG IND!</button>
  </form>
</template>
