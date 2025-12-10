<script setup lang="ts">
import RegisterForm from '@/components/login/RegisterForm.vue';
</script>

<template>
	<!--	TODO: styling til små skærme..-->
	<div class="container bg-blue-100">
		<div class="container-row">
			<div class="col-start-2 col-span-6">
				<img src="/images/loginBanner.png" alt="LAIT" />
			</div>
			<div class="bg-amber-400 col-start-9 col-span-7">
				<RegisterForm />
			</div>
		</div>
	</div>
</template>
