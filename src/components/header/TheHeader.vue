<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BaseButton from '@/components/atoms/BaseButton.vue';

const isProfileOpen = ref(false);

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
  <header class="border-b border-tutara-100">
    <div class="container">
      <div class="container-row h-20 items-center gap-7">
        <!-- Logo -->
        <router-link to="/all_courses" class="col col-span-2">
          <img class="w-20 h-[30px]" src="/logo.svg" alt="Lait logo">
        </router-link>

        <!-- Main Navigation -->
        <nav class="col-span-10">
          <ul class="flex gap-6">
            <li><router-link to="/all_courses" class="text-nav">Alle kurser</router-link></li>
            <li><router-link to="/my_courses" class="text-nav">Mine kurser</router-link></li>
            <li><router-link to="/companies" class="text-nav">Virksomheder</router-link></li>
          </ul>
        </nav>

        <!-- Kontakt og profil -->
        <div class="col-span-3 lg:col-span-4 flex justify-end items-center gap-3">
            <BaseButton
              variant="primary-small"
              as="router-link"
              to="/contact">
              Kontakt
          </BaseButton>

          <!-- Profile dropdown -->
          <div class="profile-dropdown relative">
            <BaseButton
                variant="primary-tiny"
                @click="isProfileOpen = !isProfileOpen"
                aria-label="Profil menu">
                MJ
            </BaseButton>

            <!-- Dropdown -->
            <div
              v-if="isProfileOpen"
              class="absolute right-0 mt-2 w-48 bg-white border border-tutara-100 rounded-lg shadow-lg"
            >
              <ul class="py-2">
                <li>
                  <button class="w-full px-4 py-2 text-left text-p1 hover:bg-tutara-50">
                    Indstillinger
                  </button>
                </li>
                <li>
                  <button class="w-full px-4 py-2 text-left text-p1 hover:bg-tutara-50">
                    Skift kodeord
                  </button>
                </li>
                <li class="border-t border-tutara-100 mt-2 pt-2">
                  <button class="w-full px-4 py-2 text-left text-p1 text-burnt-sienna-500 hover:bg-tutara-50">
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
