<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue';
import BaseInput from '@/components/atoms/BaseInput.vue';

const handleLogin = () => {
	console.log('LOGIN');
};
</script>

<template>
	<div class="mt-[6rem]">
		<form @submit.prevent="handleLogin">
				<BaseInput input-type="text" input-id="loginemail" label-text="E-mail" layout="stacked"/>
				<BaseInput input-type="text" input-id="loginpassword" label-text="Adgangskode"
									 layout="stacked"  class="mt-[0.8rem]"/>
				<p class="text-p1 text-tutara-600 text-right mt-[1rem]">Glemt adgangskode?</p>
				<BaseButton type="submit" label="Login">Log ind</BaseButton>
		</form>
	</div>
</template>

