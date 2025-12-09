<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue';
import { ref } from 'vue';
import { updateNewStudent } from '@/services/studentService.ts';

const userPassword = ref('');
const userFirstName = ref('');
const userLastName = ref('');

const handleUpdateUser = async () => {
	await updateNewStudent(userPassword.value, userFirstName.value, userLastName.value);
};
</script>

<template>
	<form @submit.prevent="handleUpdateUser">
		<BaseInput
			input-type="text"
			placeholder="password"
			input-id="password"
			label-text="New password"
			layout="stacked"
			v-model="userPassword" />
		<BaseInput
			input-type="text"
			placeholder="firstname"
			input-id="firstname"
			label-text="new first name"
			layout="stacked"
			v-model="userFirstName" />
		<BaseInput
			input-type="text"
			placeholder="lastname"
			input-id="lastname"
			label-text="new last name"
			layout="stacked"
			v-model="userLastName" />
		<br />
		<button type="submit">Opret bruger</button>
	</form>
</template>

<style scoped></style>
