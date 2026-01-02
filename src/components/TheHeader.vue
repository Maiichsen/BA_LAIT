<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import { XIcon, MenuIcon, LaitLogo } from '@/assets/icons';
import { useUserStore } from '@/stores/userStore.ts';

const isProfileOpen = ref(false);
const isMobileMenuOpen = ref(false);
const userStore = useUserStore();

const handleClickOutside = (event: MouseEvent) => {
	const target = event.target as HTMLElement;
	if (!target.closest('.profile-dropdown')) {
		isProfileOpen.value = false;
	}
};

onMounted(() => {
	document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
	<header class="text-center bg-tutara-50 py-4 sticky top-0 left-0 right-0 z-50 border-b border-tutara-100">
		<div class="container">
			<div class="container-row items-center">
				<!-- Logo -->
				<RouterLink to="/alle-kurser" class="col-span-2 lg:col-span-3">
					<LaitLogo />
				</RouterLink>

				<!-- <router-link to="/alle-kurser" class="col col-span-2 lg:col-span-3">
					<img class="w-[70px] h-[25px] lg:w-20 lg:h-[27px]" src="/logo.svg" alt="Lait logo" width="80" height="30" />
				</router-link> -->

				<!-- Desktop Navigation -->
				<nav class="hidden lg:block col-span-9">
					<ul class="flex gap-[100px]">
						<li><router-link to="/alle-kurser" class="text-nav">Alle kurser</router-link></li>
						<li v-if="userStore.isInitialized && !userStore.isUserAdmin">
							<router-link to="/mine-kurser" class="text-nav">Mine kurser</router-link>
						</li>
						<li v-if="userStore.isInitialized && userStore.isUserAdmin">
							<router-link to="/virksomheder" class="text-nav">Virksomheder</router-link>
						</li>
						<li v-if="userStore.isInitialized && (userStore.isUserCompany || userStore.isUserAdmin)">
							<router-link to="/Kursister" class="text-nav">Kursister</router-link>
						</li>
					</ul>
				</nav>

				<!-- Desktop Kontakt og profil -->
				<div class="hidden lg:flex col-span-3 lg:col-span-4 justify-end items-center gap-3">
					<BaseButton variant="primary-small" as="router-link" to="/kontakt"> Kontakt </BaseButton>

					<div class="profile-dropdown relative">
						<BaseButton variant="primary-tiny" @click="isProfileOpen = !isProfileOpen" aria-label="Profil menu">
							MJ
						</BaseButton>

						<!-- Dropdown -->
						<div
							v-if="isProfileOpen"
							class="absolute right-0 mt-2 w-48 bg-white border border-tutara-100 rounded-lg shadow-lg">
							<ul class="py-2">
								<li>
									<button class="w-full px-4 py-2 text-left text-p1 hover:bg-purple-50">Indstillinger</button>
								</li>
								<li>
									<button class="w-full px-4 py-2 text-left text-p1 hover:bg-purple-50">Skift kodeord</button>
								</li>
								<li class="border-t border-tutara-100 mt-2 pt-2">
									<button class="w-full px-4 py-2 text-left text-p1 text-info-red hover:bg-purple-50">Log ud</button>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<!-- Mobile Burger Menu Button -->
				<div class="lg:hidden col-span-2 flex justify-end">
					<button @click="isMobileMenuOpen = !isMobileMenuOpen" class="p-2" aria-label="Toggle menu">
						<MenuIcon v-if="!isMobileMenuOpen" />
						<XIcon v-else />
					</button>
				</div>
			</div>

			<!-- Mobile Menu -->
			<div v-if="isMobileMenuOpen" class="lg:hidden mt-4 pb-4">
				<ul class="flex flex-col gap-4 mb-4">
					<li>
						<router-link to="/alle-kurser" class="text-nav block" @click="isMobileMenuOpen = false">
							Alle kurser
						</router-link>
					</li>
					<li>
						<router-link to="/virksomheder" class="text-nav block" @click="isMobileMenuOpen = false">
							Virksomheder
						</router-link>
					</li>
					<li>
						<router-link to="/Kursister" class="text-nav block" @click="isMobileMenuOpen = false">
							Kursister
						</router-link>
					</li>
				</ul>

				<div class="pt-4 border-t border-tutara-100 flex flex-col gap-3">
					<router-link to="/kontakt" class="text-nav block text-center" @click="isMobileMenuOpen = false">
						Kontakt
					</router-link>

					<!-- Mobile Profile Section -->
					<div class="profile-dropdown relative">
						<BaseButton
							variant="primary-small"
							@click.stop="isProfileOpen = !isProfileOpen"
							class="w-full justify-center">
							Mai Jockwich
						</BaseButton>

						<!-- Mobile Dropdown -->
						<div v-if="isProfileOpen" class="mt-2 w-full bg-white border border-tutara-100 rounded-lg shadow-lg">
							<ul class="py-2">
								<li>
									<button
										class="w-full px-4 py-2 text-left text-p1 hover:bg-purple-50"
										@click="
											isMobileMenuOpen = false;
											isProfileOpen = false;
										">
										Indstillinger
									</button>
								</li>
								<li>
									<button
										class="w-full px-4 py-2 text-left text-p1 hover:bg-purple-50"
										@click="
											isMobileMenuOpen = false;
											isProfileOpen = false;
										">
										Skift kodeord
									</button>
								</li>
								<li class="border-t border-tutara-100 mt-2 pt-2">
									<button
										class="w-full px-4 py-2 text-left text-p1 text-info-red hover:bg-purple-50"
										@click="
											isMobileMenuOpen = false;
											isProfileOpen = false;
										">
										Log ud
									</button>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>
