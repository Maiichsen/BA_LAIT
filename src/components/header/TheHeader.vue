<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue';

const isProfileOpen = ref(false);
const isMobileMenuOpen = ref(false);

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
        <router-link to="/all_courses" class="col col-span-2 lg:col-span-3">
          <img class="w-[70px] h-[25px] lg:w-20 lg:h-[27px]" src="/logo.svg" alt="Lait logo" width="80" height="30">
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:block col-span-9">
          <ul class="flex gap-[100px]">
            <li><router-link to="/all_courses" class="text-nav">Alle kurser</router-link></li>
            <li><router-link to="/my_courses" class="text-nav">Mine kurser</router-link></li>
            <li><router-link to="/companies" class="text-nav">Virksomheder</router-link></li>
          </ul>
        </nav>

        <!-- Desktop Kontakt og profil -->
        <div class="hidden lg:flex col-span-3 lg:col-span-4 justify-end items-center gap-3">
          <BaseButton
            variant="primary-small"
            as="router-link"
            to="/contact">
            Kontakt
          </BaseButton>

          <div class="profile-dropdown relative">
            <BaseButton
              variant="primary-small"
              @click="isProfileOpen = !isProfileOpen"
              aria-label="Profil menu" class="px-2">
              MJ
            </BaseButton>

            <!-- Dropdown -->
            <div
              v-if="isProfileOpen"
              class="absolute right-0 mt-2 w-48 bg-white border border-tutara-100 rounded-lg shadow-lg"
            >
              <ul class="py-2">
                <li>
                  <button class="w-full px-4 py-2 text-left text-p1 hover:bg-purple-50">
                    Indstillinger
                  </button>
                </li>
                <li>
                  <button class="w-full px-4 py-2 text-left text-p1 hover:bg-purple-50">
                    Skift kodeord
                  </button>
                </li>
                <li class="border-t border-tutara-100 mt-2 pt-2">
                  <button class="w-full px-4 py-2 text-left text-p1 text-info-red hover:bg-purple-50">
                    Log ud
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Mobile Burger Menu Button -->
        <div class="lg:hidden col-span-2 flex justify-end">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-2"
            aria-label="Toggle menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

<!-- Mobile Menu -->
<div
  v-if="isMobileMenuOpen"
  class="lg:hidden mt-4 pb-4"
>
  <ul class="flex flex-col gap-4 mb-4">
    <li>
      <router-link
        to="/all_courses"
        class="text-nav block"
        @click="isMobileMenuOpen = false"
      >
        Alle kurser
      </router-link>
    </li>
    <li>
      <router-link
        to="/my_courses"
        class="text-nav block"
        @click="isMobileMenuOpen = false"
      >
        Mine kurser
      </router-link>
    </li>
    <li>
      <router-link
        to="/companies"
        class="text-nav block"
        @click="isMobileMenuOpen = false"
      >
        Virksomheder
      </router-link>
    </li>
  </ul>

  <div class="pt-4 border-t border-tutara-100 flex flex-col gap-3">
    <router-link
      to="/contact"
      class="text-nav block text-center"
      @click="isMobileMenuOpen = false"
    >
      Kontakt
    </router-link>

    <!-- Mobile Profile Section -->
    <div class="profile-dropdown relative">
      <BaseButton
        variant="primary-small"
        @click.stop="isProfileOpen = !isProfileOpen"
        class="w-full justify-center"
      >
        Profil (MJ)
      </BaseButton>

      <!-- Mobile Dropdown -->
      <div
        v-if="isProfileOpen"
        class="mt-2 w-full bg-white border border-tutara-100 rounded-lg shadow-lg"
      >
        <ul class="py-2">
          <li>
            <button
              class="w-full px-4 py-2 text-left text-p1 hover:bg-purple-50"
              @click="isMobileMenuOpen = false; isProfileOpen = false"
            >
              Indstillinger
            </button>
          </li>
          <li>
            <button
              class="w-full px-4 py-2 text-left text-p1 hover:bg-purple-50"
              @click="isMobileMenuOpen = false; isProfileOpen = false"
            >
              Skift kodeord
            </button>
          </li>
          <li class="border-t border-tutara-100 mt-2 pt-2">
            <button
              class="w-full px-4 py-2 text-left text-p1 text-info-red hover:bg-purple-50"
              @click="isMobileMenuOpen = false; isProfileOpen = false"
            >
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
