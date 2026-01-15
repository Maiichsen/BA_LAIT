<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue';
import { computed } from 'vue';
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';

const courseStore = useCourseEditorStore();

const displayedCoverUrl = computed(() => {
	if (courseStore.newCoverImageFile) return URL.createObjectURL(courseStore.newCoverImageFile);
	return courseStore.originalCoverImageUrl;
});

const handleSelectCoverImage = (event: Event) => {
	const input = event.target as HTMLInputElement;
	courseStore.newCoverImageFile = input.files?.[0] ?? null;
};
</script>

<template>
	<form action="">
		<div class="flex flex-col gap-2">
			<BaseInput
				input-type="text"
				placeholder="overskrift"
				input-id="overskrift"
				label-text="Overskrift"
				layout="inline"
				v-model="courseStore.courseFrontpageDetails.title" />
			<BaseInput
				input-type="text"
				placeholder="kort beskrivelse"
				input-id="kortbeskrivelse"
				label-text="Kort beskrivelse"
				layout="inline"
				v-model="courseStore.courseFrontpageDetails.short_course_description" />
			<BaseInput
				input-type="file"
				input-id="image"
				label-text="Billede"
				layout="inline"
				accept="image/*"
				@change="handleSelectCoverImage" />
			<div v-if="displayedCoverUrl" class="h-80 flex">
				<div class="w-1/3 max-w-50"></div>
				<img :src="displayedCoverUrl" class="h-full object-cover rounded-2xl" />
			</div>
			<BaseInput
				input-type="number"
				placeholder="varighed"
				input-id="varighed"
				label-text="Varighed i minutter"
				layout="inline"
				v-model="courseStore.courseFrontpageDetails.estimated_time_minutes" />
			<BaseInput
				input-type="text"
				placeholder="oprettet af"
				input-id="oprettet"
				label-text="Oprettet af"
				layout="inline"
				v-model="courseStore.courseFrontpageDetails.author_name" />
			<BaseInput
				input-type="text"
				placeholder="indhold"
				input-id="indhold"
				label-text="Indhold"
				layout="stacked"
				v-model="courseStore.courseFrontpageDetails.long_course_description" />
		</div>
	</form>
</template>
