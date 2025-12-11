<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseInput from '@/components/atoms/BaseInput.vue';
import {getUserById, signInUser} from '@/services/userService.ts';
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useUserStore} from '@/stores/userStore.ts';

const router = useRouter();
const userStore = useUserStore();
const userEmail = ref('');
const userPassword = ref('');

const handleLogin = () => {
	signInUser(userEmail.value, userPassword.value).then( async (authData) => {
		const foundUser = await getUserById(authData.user.id);
		userStore.isUserAdmin = foundUser.is_admin;
		userStore.isUserCompany = foundUser.is_company_user;
		router.push({name: 'allCourses'});
	}).catch((error) => {
		console.log(error);
	});
};
</script>

<template>
	<div class="mt-[6rem]">
		<form @submit.prevent="handleLogin">
				<BaseInput input-type="text" input-id="loginemail" label-text="E-mail" layout="stacked" v-model="userEmail"/>
				<BaseInput input-type="text" input-id="loginpassword" label-text="Adgangskode"
									 layout="stacked"  class="mt-[0.8rem]" v-model="userPassword"/>
				<p class="text-p1 text-tutara-600 text-right mt-[1rem]">Glemt adgangskode?</p>
				<BaseButton type="submit" label="Login">Log ind</BaseButton>
		</form>
	</div>
</template>

