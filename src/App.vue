<script setup lang="ts">
/*import { RouterLink, RouterView } from 'vue-router';*/

import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore.ts';
import { useRouter } from 'vue-router';
const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
	userStore.verifyUserRole().catch(() => {
		router.replace({ name: 'login' });
	});
});
</script>

<template class="">
	<component :is="$route.meta.layout">
		<RouterView />
	</component>

	<!--  <header class="">
      <nav class="flex space-x-4 border-b border-tutara-200 h-20 items-center px-4">
        <div>
          <img alt="lait logo" class="" src="@/assets/images/logo.png" width="100" height="100" />
        </div>
        <div class="w-full text-c2 text-center [&_a]:text-cornflower-blue-500 flex gap-2">
          <RouterLink to="/">Side 1</RouterLink>
        </div>
      </nav>
  </header>
  <RouterView />-->
</template>
