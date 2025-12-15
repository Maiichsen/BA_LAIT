<script setup lang="ts">
import LaitLogo from '@/assets/icons/LaitLogo.vue';

interface FooterLink {
	name: string;
	url: string;
}

const navigationLinks: FooterLink[] = [
	{ name: 'Alle kurser', url: '/alle-kurser' },
	{ name: 'Tilgængelige kurser', url: '/mine-kurser' },
	{ name: 'Virksomheder', url: '/virksomheder' },
	{ name: 'Kursister', url: '/kursister' },
	{ name: 'Kontakt', url: '/kontakt' },
];

const contactInfo = {
	address: 'Havnegade 98B',
	zipCity: '5000 Odense C',
	phone: '(+45) 70220737',
	phoneHref: '+4570220737',
	email: 'info@lait.dk',
};
</script>

<template>
	<footer class="bg-tutara-900 text-tutara-50 py-6 lg:py-14 mt-[120px]">
		<div class="container">
			<div class="container-row">
				<!-- Logo -->
				<RouterLink to="/alle-kurser" class="col-span-full mb-12 lg:mb-[100px]">
					<LaitLogo fillClass="fill-tutara-50" :height="55" />
				</RouterLink>

				<!-- Navigation Links -->
				<nav class="col-span-full mb-12 lg:mb-16" aria-label="Footer navigation">
					<ul class="flex flex-col lg:flex-row gap-6 lg:gap-8 text-base lg:text-lg">
						<li v-for="link in navigationLinks" :key="link.url">
							<a :href="link.url" class="hover:text-tutara-300 transition-colors duration-200">
								{{ link.name }}
							</a>
						</li>
					</ul>
				</nav>

				<!-- Divider -->
				<div class="col-span-full border-t border-tutara-600 mb-8 lg:mb-16"></div>

				<!-- Contact Info -->
				<div class="flex gap-8 lg:gap-6 lg:flex-row flex-col lg:items-center col-span-full">
					<div class="flex flex-col max-lg:gap-4">
						<p>{{ contactInfo.address }}</p>
						<p>{{ contactInfo.zipCity }}</p>
					</div>
					<div class="flex flex-col max-lg:gap-4">
						<a :href="`tel:${contactInfo.phoneHref}`" class="hover:text-tutara-50 transition-colors duration-200">
							{{ contactInfo.phone }}
						</a>
						<a :href="`mailto:${contactInfo.email}`" class="hover:text-tutara-50 transition-colors duration-200">
							{{ contactInfo.email }}
						</a>
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>
