<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue';
import {ref} from 'vue';
import {getAuthUser, getInvitedUserByEmail, signInUser} from '@/services/userService.ts';
import {supabase} from '@/db/connection.ts';
import {createInvitedStudent, createStudent} from '@/services/studentService.ts';
import BaseButton from '@/components/atoms/BaseButton.vue';

const userFirstname = ref('');
const userLastname = ref('');
const userPassword = ref('');
const repeatUserPassword = ref('');
const companyId = ref('');

/*admin email, inviting user*/
const handleCreateStudent = async () => {
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
		const data = await createStudent(userEmail.value, userPassword.value);
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

const authUserMail = ref('');

const getUser = async () => {
	getAuthUser().then((user) => {
		authUserMail.value = user.email!;
	}).catch((err) => {
		console.log(err);
	});
};

const handleCreateNewUser = async () => {
	await getUser();
	getInvitedUserByEmail(authUserMail.value).then((invitedUser) => {
		console.log(invitedUser);
	}).catch((err) => {
		console.log(err);
	});
};
</script>

<template>
	<div class="mt-[1.5rem]">
		<form @submit.prevent="handleCreateNewUser">
			<div class="flex flex-col gap-[1.5rem]">
				<BaseInput
					input-type="text"
					input-id="registerfirstname"
					label-text="Fornavn"
					layout="stacked"
					v-model="userFirstname"
				/>
				<BaseInput
					input-type="text"
					input-id="registerlastname"
					label-text="Efternavn"
					layout="stacked"
					v-model="userLastname"
				/>
				<BaseInput
					input-type="text"
					input-id="registerpassword"
					label-text="Adgangskode"
					layout="stacked"
					v-model="userPassword"
				/>
				<BaseInput
					input-type="text"
					input-id="repeatregisterpassword"
					label-text="Gentag adgangskode"
					layout="stacked"
					v-model="repeatUserPassword"
				/>
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
