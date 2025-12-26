<script setup lang="ts">
import { ref } from 'vue';
import CourseGrid from '@/components/course/CourseGrid.vue';
import BaseButton from '@/components/atoms/BaseButton.vue';
import {useUserStore} from '@/stores/userStore.ts';

const userStore = useUserStore();
const isEditMode = ref(false);

const toggleEditMode = () => {
	isEditMode.value = !isEditMode.value;
	console.log('Edit mode:', isEditMode.value);
};
</script>

<template>
	<div class="container">
		<div class="container-row space-y-20">
			<div class="lg:col-start-2 lg:col-span-14 col-span-full flex items-center justify-between">
				<h1 class="text-h1">Kursusoversigt</h1>
				<BaseButton :variant="isEditMode ? 'stroke' : 'primary'" icon-name="EditIcon" @click="toggleEditMode" v-if="userStore.isInitialized && userStore.isUserAdmin">
					{{ isEditMode ? 'Deaktivér redigering' : 'Aktivér redigering' }}

					<!-- <span class="flex items-center gap-2.5">
						<EditIcon :strokeClass="isEditMode ? 'stroke-tutara-900' : 'stroke-tutara-50'" />
						{{ isEditMode ? 'Deaktivér redigering' : 'Aktivér redigering' }}
					</span> -->
				</BaseButton>
			</div>

			<!-- Course Grid -->
			<CourseGrid :is-edit-mode="isEditMode" />
		</div>
	</div>
</template>
