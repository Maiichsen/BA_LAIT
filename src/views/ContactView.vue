<script setup lang="ts">
import { computed } from 'vue';
import ContactForm from '@/components/ContactForm.vue';

interface Person {
	name: string;
	role: string;
	image: string;
	email: string;
	phone: string;
}

const persons: Person[] = [
	{
		name: 'Gert Rasmussen',
		role: 'CEO',
		image: `${import.meta.env.BASE_URL}images/gert.png`,
		email: 'gert@lait.dk',
		phone: '+4540342797',
	},
	{
		name: 'Peter Wehner',
		role: 'DIGITAL ADVISOR',
		image: `${import.meta.env.BASE_URL}images/peter.png`,
		email: 'peter@lait.dk',
		phone: '+4560599692',
	},
	{
		name: 'Peter Bo Madsen',
		role: 'DIGITAL ADVISOR',
		image: `${import.meta.env.BASE_URL}images/peterbo.png`,
		email: 'peter@lait.dk',
		phone: '+4520223737',
	},
];

const gridCols = computed(() => {
	return persons.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';
});
</script>

<template>
	<div class="container">
		<div class="container-row">
			<div class="lg:col-start-2 lg:col-span-14 col-span-full">
				<h1 class="text-h1">Tag en snak med...</h1>
			</div>
		</div>
	</div>

	<section class="bg-cornflower-blue-10 py-10 lg:py-20 mt-10 lg:mt-20">
		<div class="container">
			<div class="container-row">
				<div class="lg:col-start-2 lg:col-span-14 col-span-full space-y-6 lg:space-y-10">
					<div>
						<h2 class="text-h2 mb-4">Intresseret i et kurset?</h2>
					</div>
					<div class="grid md:grid-cols-2 lg:gap-8 gap-6" :class="gridCols">
						<div v-for="person in persons" :key="person.email" class="col-span-1">
							<img :src="person.image" :alt="person.name" class="object-cover mb-6 w-full h-auto" />
							<div class="flex flex-col gap-y-5">
								<p class="text-c2 text-tutara-700">{{ person.role }}</p>
								<h3 class="text-h6">{{ person.name }}</h3>
								<div class="flex gap-x-6">
									<a :href="`mailto:${person.email}`" class="flex items-center gap-x-3 text-p1-button text-tutara-700">
										<svg
											class="relative -top-px"
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											viewBox="0 0 12 12"
											fill="none">
											<rect
												x="5.65686"
												y="1.05086"
												width="7"
												height="7"
												transform="rotate(45 5.65686 1.05086)"
												fill="#252323" />
										</svg>
										<span class="sr-only">Send e-mail til</span>
										{{ person.email }}
									</a>
									<a :href="`tel:${person.phone}`" class="flex items-center gap-x-3 text-p1-button text-tutara-700">
										<svg
											class="relative -top-px"
											xmlns="http://www.w3.org/2000/svg"
											width="12"
											height="12"
											viewBox="0 0 12 12"
											fill="none">
											<rect
												x="5.65686"
												y="1.05086"
												width="7"
												height="7"
												transform="rotate(45 5.65686 1.05086)"
												fill="#252323" />
										</svg>
										<span class="sr-only">Ring til</span>
										{{ person.phone }}
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Contact Form Section -->
	<section class="py-10 lg:py-20">
		<div class="container">
			<div class="container-row">
				<div class="lg:col-start-2 lg:col-span-14 col-span-full space-y-8">
					<h2 class="text-h2">Bliv kontaktet af LAIT</h2>
					<div class="border-t border-tutara-200"></div>
					<ContactForm />
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped></style>
