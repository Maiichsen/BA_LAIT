<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue';
import {onMounted, ref} from 'vue';
import {
	createUser,
	getAuthUser,
	getInvitedUserByEmail,
	updateAuthUserPassword,
} from '@/services/userService.ts';

import BaseButton from '@/components/atoms/BaseButton.vue';
import type {InvitedUser} from '@/types/db.ts';
import {useRouter} from 'vue-router';

const router = useRouter();
const userFirstname = ref('');
const userLastname = ref('');
const userPassword = ref('');
const repeatUserPassword = ref('');
const errorMessage = ref('');

const authUserMail = ref('');
const authUserId = ref('');
const invitedUser = ref<InvitedUser | null>(null);

const getUserParamsFromAuthUser = async () => {
	await getAuthUser()
		.then(user => {
			authUserMail.value = user.email!;
			authUserId.value = user.id!;
		})
		.catch(err => {
			console.log(err);
		});
};

const handleCreateNewUser = async () => {
	if (!invitedUser.value) return;

	if (userPassword.value.trim() !== repeatUserPassword.value.trim()) {
		errorMessage.value = 'Adgangskode matcher ikke';
		return;
	}

	if (userPassword.value.length < 6) {
		errorMessage.value = 'Adgangskode skal bestå af mindst 6 tegn';
		return;
	}
	await updateAuthUserPassword(userPassword.value);
	await createUser({
		company_id: invitedUser.value.company_id,
		email: invitedUser.value.user_email,
		first_name: userFirstname.value,
		last_name: userLastname.value,
		is_company_user: invitedUser.value.is_company_user,
		user_id: authUserId.value,
	})
		.then(() => {
			router.replace({name: 'login'});
		})
		.catch(error => {
			console.log(error);
		});

	errorMessage.value = '';
};

onMounted(async () => {
	await getUserParamsFromAuthUser();
	getInvitedUserByEmail(authUserMail.value)
		.then(user => {
			if (!user) {
				/*replace to ensure the user cant go back*/
				router.replace({name: 'login'});
				return;
			}
			invitedUser.value = user;
			userFirstname.value = user.first_name ?? '';
			userLastname.value = user.last_name ?? '';
		})
		.catch(error => {
			console.log(error);
		});
});
</script>

<template>
	<div class="mt-[1.5rem]">
		<form @submit.prevent="handleCreateNewUser">
			<div class="flex flex-col gap-[1.5rem]">
				<BaseInput
					v-if="invitedUser && !invitedUser.is_company_user"
					input-type="text"
					input-id="registerfirstname"
					label-text="Fornavn"
					layout="stacked"
					v-model="userFirstname"/>
				<BaseInput
					v-if="invitedUser && !invitedUser.is_company_user"
					input-type="text"
					input-id="registerlastname"
					label-text="Efternavn"
					layout="stacked"
					v-model="userLastname"/>
				<BaseInput
					input-type="text"
					input-id="registerpassword"
					label-text="Adgangskode"
					layout="stacked"
					v-model="userPassword"/>
				<BaseInput
					input-type="text"
					input-id="repeatregisterpassword"
					label-text="Gentag adgangskode"
					layout="stacked"
					v-model="repeatUserPassword"/>
				<p v-if="errorMessage" class="text-info-red">{{ errorMessage }}</p>
			</div>
			<BaseButton label="register" class="mt-[3rem]" type="submit">Opret bruger</BaseButton>
		</form>
	</div>
	<!--	<h1>ADMIN OPRET STUDENT</h1>
		<form @submit.prevent="handleCreateStudent">
			<BaseInput
				input-type="text"
				placeholder="mail"
				input-id="mail"
				label-text="mail"
				layout="stacked"
				v-model="userEmail"/>
			<br/>
			<BaseInput
				input-type="text"
				placeholder="virksomhed"
				input-id="virksomhed"
				label-text="virksomhed"
				layout="stacked"
				v-model="companyId"/>
			<br/>
			<button type="submit" class="hover:text-red-700">send mail</button>
			<br/>
		</form>
		<br/>
		<br/>
		<h1>OPRET STUDENT</h1>
		<form @submit.prevent="handleSignUp">
			<BaseInput
				input-type="text"
				placeholder="e-mail"
				input-id="opretemail"
				label-text="E-mail"
				layout="stacked"
				v-model="userEmail"/>
			<br/>
			<BaseInput
				input-type="text"
				placeholder="adgangskode"
				input-id="opretpassword"
				label-text="Adgangskode"
				layout="stacked"
				v-model="userPassword"/>
			<br/>
			<button type="submit" class="hover:text-red-700">opret bruger</button>
		</form>
		<br/>
		<br/>

		<h1>log ind</h1>
		<form @submit.prevent="handleLogin">
			<BaseInput
				input-type="text"
				placeholder="e-mail"
				input-id="loginEmail"
				label-text="E-mail"
				layout="stacked"
				v-model="userEmail"/>
			<br/>
			<BaseInput
				input-type="text"
				placeholder="adgangskode"
				input-id="loginPassword"
				label-text="Adgangskode"
				layout="stacked"
				v-model="userPassword"/>
			<br/>
			<button type="submit" class="hover:text-red-700">log ind</button>
		</form>-->
</template>
