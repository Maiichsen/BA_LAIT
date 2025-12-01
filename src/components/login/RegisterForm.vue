<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue';
import {ref} from 'vue';
import {signUpNewUser} from '@/services/userService.ts';

const userEmail = ref('');
const userPassword = ref('');

const handleLogin = () => {
  signUpNewUser(userEmail.value, userPassword.value);
};
</script>

<template>
  <form action="">
    <BaseInput input-type="text" placeholder="e-mail" input-id="loginEmail" label-text="E-mail" layout="stacked" v-model="userEmail"/>
    <br>
    <BaseInput input-type="text" placeholder="adgangskode" input-id="loginPassword" label-text="Adgangskode" layout="stacked" v-model="userPassword"/>
    <br>
    <button type="submit" class="hover:text-red-700" @click="handleLogin()">LOG IND!</button>
  </form>
</template>
