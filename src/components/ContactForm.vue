<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from './atoms/BaseButton.vue';

const formData = ref({
	name: '',
	phone: '',
	company: '',
	email: '',
	message: '',
});

const successMessage = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
	// Clear previous messages
	successMessage.value = '';
	errorMessage.value = '';

	if (!formData.value.name.trim() || !formData.value.phone.trim()) {
		errorMessage.value = 'Udfyld venligst alle påkrævede felter.';
		return;
	}

	try {
		// TODO: Implement actual form submission logic This could be sent to Supabase, an email service, or another backend
		console.log('Form submitted:', formData.value);

		// Simulate successful submission
		successMessage.value = 'Tak for din henvendelse! Vi vender tilbage hurtigst muligt.';

		// Reset form
		formData.value = {
			name: '',
			phone: '',
			company: '',
			email: '',
			message: '',
		};
	} catch (error) {
		console.error('Error submitting form:', error);
		errorMessage.value = 'Der opstod en fejl. Prøv venligst igen senere.';
	}
};
</script>

<template>
	<form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Navn (Name) -->
		<div class="flex flex-col relative gap-1">
			<label class="text-tutara-900 text-t3" for="contact-name"> Navn * </label>
			<input
				id="contact-name"
				v-model="formData.name"
				type="text"
				class="bg-tutara-50 rounded-2xl h-12 px-6 text-p1 placeholder:text-p1 placeholder:text-tutara-600 border border-tutara-900"
				placeholder="Indsæt dit navn"
				required
				aria-required="true"
				aria-describedby="name-error"
				autocomplete="name" />
			<span
				id="name-error"
				class="absolute left-0 bottom-[-26px] text-p2 text-red-600 w-full"
				aria-live="assertive"></span>
		</div>

		<!-- Telefonnummer (Phone) -->
		<div class="flex flex-col relative gap-1">
			<label class="text-tutara-900 text-t3" for="contact-phone"> Telefonnummer * </label>
			<input
				id="contact-phone"
				v-model="formData.phone"
				type="tel"
				class="bg-tutara-50 rounded-2xl h-12 px-6 text-p1 placeholder:text-p1 placeholder:text-tutara-600 border border-tutara-900"
				placeholder="Indsæt dit telefonnummer"
				required
				aria-required="true"
				aria-describedby="phone-error"
				autocomplete="tel" />
			<span
				id="phone-error"
				class="absolute left-0 bottom-[-26px] text-p2 text-red-600 w-full"
				aria-live="assertive"></span>
		</div>

		<!-- Virksomhed (Company) -->
		<div class="flex flex-col relative gap-1">
			<label class="text-tutara-900 text-t3" for="contact-company"> Virksomhed </label>
			<input
				id="contact-company"
				v-model="formData.company"
				type="text"
				class="bg-tutara-50 rounded-2xl h-12 px-6 text-p1 placeholder:text-p1 placeholder:text-tutara-600 border border-tutara-900"
				placeholder="Indsæt din virksomhed"
				aria-describedby="company-error"
				autocomplete="organization" />
			<span
				id="company-error"
				class="absolute left-0 bottom-[-26px] text-p2 text-red-600 w-full"
				aria-live="assertive"></span>
		</div>

		<!-- E-mail -->
		<div class="flex flex-col relative gap-1">
			<label class="text-tutara-900 text-t3" for="contact-email"> E-mail </label>
			<input
				id="contact-email"
				v-model="formData.email"
				type="email"
				class="bg-tutara-50 rounded-2xl h-12 px-6 text-p1 placeholder:text-p1 placeholder:text-tutara-600 border border-tutara-900"
				placeholder="Indsæt din email"
				aria-describedby="email-error"
				autocomplete="email" />
			<span
				id="email-error"
				class="absolute left-0 bottom-[-26px] text-p2 text-red-600 w-full"
				aria-live="assertive"></span>
		</div>

		<!-- Besked (Message) -->
		<div class="flex flex-col col-span-full relative gap-1">
			<label class="text-tutara-900 text-t3" for="contact-message"> Besked </label>
			<textarea
				id="contact-message"
				v-model="formData.message"
				class="bg-tutara-50 rounded-2xl h-[92px] px-6 py-4 text-p1 placeholder:text-p1 placeholder:text-tutara-600 border border-tutara-900"
				placeholder="Hvad ønsker du at snakke med os om?"
				aria-describedby="message-error"
				aria-label="Besked"></textarea>
			<span
				id="message-error"
				class="absolute left-0 bottom-[-26px] text-p2 text-red-600 w-full"
				aria-live="assertive"></span>
		</div>

		<!-- Privacy Policy Notice -->
		<div class="col-span-full text-tutara-900 text-p1">
			<p>Ved at indsende denne formular, accepterer du LAITs privatpolitik</p>
		</div>

		<!-- Submit Button -->
		<div class="col-span-full">
			<BaseButton type="submit" variant="primary"> Bliv ringet op </BaseButton>
		</div>

		<!-- Success/Error Messages -->
		<div v-if="successMessage" class="col-span-full p-4 bg-green-50 border border-green-200 rounded-2xl">
			<p class="text-t3 text-green-700">{{ successMessage }}</p>
		</div>
		<div v-if="errorMessage" class="col-span-full p-4 bg-red-50 border border-info-red rounded-2xl">
			<p class="text-t3 text-info-red">{{ errorMessage }}</p>
		</div>
	</form>
</template>
