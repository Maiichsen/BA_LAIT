<script setup lang="ts">
import RegisterForm from '@/components/login/RegisterForm.vue';
</script>

<template>
	<!--	TODO: styling til små skærme..-->
	<div class="container ">
		<div class="container-row">
			<div class="col-start-2 col-span-6 ">
				<img src="/images/loginBanner.png" alt="LAIT" class="w-full h-full object-cover"/>
			</div>
			<div class="col-start-9 col-span-7 flex flex-col justify-center">
				<h1 class="text-h1 text-tutara-900">Velkommen</h1>
				<h2 class="text-t1 text-tutara-900">Opret din bruger</h2>
				<RegisterForm/>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
