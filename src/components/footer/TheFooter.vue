<script setup lang="ts">
import LaitLogo from '@/assets/icons/LaitLogo.vue';

interface FooterLink {
	name: string;
	url: string;
}

const navigationLinks: FooterLink[] = [
	{ name: 'Alle kurser', url: '/all_courses' },
	{ name: 'Tilgængelige kurser', url: '/my_courses' },
	{ name: 'Virksomheder', url: '/companies' },
	{ name: 'Kursister', url: '/kursister' },
	{ name: 'Kontakt', url: '/contact' },
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
	<footer class="bg-tutara-900 text-tutara-50 py-12 lg:py-16">
		<div class="container">
			<div class="container-row">
				<!-- Logo -->
				<div class="col-span-full mb-12 lg:mb-[100px]">
					<LaitLogo class="h-12 lg:h-16 w-auto text-tutara-50" />
				</div>

				<!-- Navigation Links -->
				<nav class="col-span-full mb-12 lg:mb-16" aria-label="Footer navigation">
					<ul class="flex flex-wrap gap-6 lg:gap-8 text-base lg:text-lg">
						<li v-for="link in navigationLinks" :key="link.url">
							<a :href="link.url" class="hover:text-tutara-300 transition-colors duration-200">
								{{ link.name }}
							</a>
						</li>
					</ul>
				</nav>

				<!-- Divider -->
				<div class="col-span-full border-t border-tutara-400 mb-8 lg:mb-16"></div>

				<!-- Contact Info -->
				<div class="flex gap-8 lg:gap-6 lg:flex-row flex-col flex-wrap lg:items-center col-span-full">
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
