<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue';
import {ref} from 'vue';
import {
  checkIfUserExists,
  createAuthStudent,
  createInvitedStudent, signInUser,
} from '@/services/userService.ts';
import {supabase} from '@/db/connection.ts';

const userEmail = ref('');
const userPassword = ref('');
const companyId = ref('');

/*admin email, inviting user*/
const createStudent = async () => {
  try {
    const data = await createInvitedStudent(userEmail.value, companyId.value);
    console.log(data);
  } catch (e) {
    console.error(e);
  }
};

/*invited user, creates auth account*/
const handleSignUp = async () => {
  try {
    const data = await createAuthStudent(userEmail.value, userPassword.value);
    console.log(data);
  } catch (e) {
    console.error(e);
  }
};

const handleLogin = async () => {
  try {
    const data = await signInUser(userEmail.value, userPassword.value);
    console.log(data);
  } catch (e) {
    console.error(e);
  }
};

const test = async () => {
  const data = await supabase.auth.getUser();
  console.log(data);
};

test();

</script>

<template>
  <h1>ADMIN OPRET STUDENT</h1>
  <form @submit.prevent="createStudent">
    <BaseInput input-type="text" placeholder="mail" input-id="mail" label-text="mail"
               layout="stacked" v-model="userEmail"/>
    <br>
    <BaseInput input-type="text" placeholder="virksomhed" input-id="virksomhed"
               label-text="virksomhed" layout="stacked" v-model="companyId"/>
    <br>
    <button type="submit" class="hover:text-red-700">send mail</button>
    <br>
  </form>
  <br>
  <br>
  <h1>OPRET STUDENT</h1>
  <form @submit.prevent="handleSignUp">
    <BaseInput input-type="text" placeholder="e-mail" input-id="opretemail" label-text="E-mail"
               layout="stacked" v-model="userEmail"/>
    <br>
    <BaseInput input-type="text" placeholder="adgangskode" input-id="opretpassword"
               label-text="Adgangskode" layout="stacked" v-model="userPassword"/>
    <br>
    <button type="submit" class="hover:text-red-700">opret bruger</button>
  </form>
  <br>
  <br>

<h1>log ind</h1>
  <form @submit.prevent="handleLogin">
    <BaseInput input-type="text" placeholder="e-mail" input-id="loginEmail" label-text="E-mail"
               layout="stacked" v-model="userEmail"/>
    <br>
    <BaseInput input-type="text" placeholder="adgangskode" input-id="loginPassword"
               label-text="Adgangskode" layout="stacked" v-model="userPassword"/>
    <br>
    <button type="submit" class="hover:text-red-700">log ind</button>
  </form>


</template>
