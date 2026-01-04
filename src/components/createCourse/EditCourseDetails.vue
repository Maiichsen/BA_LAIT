<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue';
import { computed, onMounted, ref } from 'vue';
import { uploadImageToSupabaseBucket } from '@/services/imageService.ts';
import { getCourseById, getCoverImgUrlByCourseId } from '@/services/courseService.ts';
import { updateCourse } from '@/services/courseService.ts';
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';

const courseStore = useCourseEditorStore();

const title = ref('');
const shortDescription = ref('');
const timeEstimate = ref<number | null>(null);
const authorName = ref<string | null>('');
const longDescription = ref('');
const imgFile = ref<File | null>(null);
let coverImgUrl: string | null = null;
const existingCoverUrl = ref<string | null>(null);
const displayedCoverUrl = computed(() => {
	if (imgFile.value) return URL.createObjectURL(imgFile.value);
	return existingCoverUrl.value;
});

const handleFileNameChange = (event: Event) => {
	const input = event.target as HTMLInputElement;
	imgFile.value = input.files?.[0] ?? null;
};

/*Update course*/
const handleUpdateCourse = async () => {
	if (imgFile.value) {
		coverImgUrl = Date.now().toString();
		await uploadImageToSupabaseBucket(coverImgUrl, imgFile.value);
	}

	await updateCourse(courseStore.currentEditedCourseId, {
		title: title.value,
		short_course_description: shortDescription.value,
		cover_image_url: coverImgUrl,
		estimated_time_minutes: timeEstimate.value,
		author_name: authorName.value,
		long_course_description: longDescription.value,
	});
};

onMounted(() => {
	getCourseById(courseStore.currentEditedCourseId)
		.then(course => {
			title.value = course.title;
			shortDescription.value = course.short_course_description;
			timeEstimate.value = course.estimated_time_minutes;
			authorName.value = course.author_name;
			longDescription.value = course.long_course_description;
			coverImgUrl = course.cover_image_url;
		})
		.catch(err => {
			console.log(err);
		});
	getCoverImgUrlByCourseId(courseStore.currentEditedCourseId)
		.then(imgUrl => {
			existingCoverUrl.value = imgUrl;
		})
		.catch(err => console.log(err));
});
</script>

<template>
	<form action="">
		<div class="flex flex-col gap-2">
			<BaseInput
				input-type="text"
				:placeholder="title"
				input-id="overskrift"
				label-text="Overskrift"
				layout="inline"
				v-model="title" />
			<BaseInput
				input-type="text"
				placeholder="kort beskrivelse"
				input-id="kortbeskrivelse"
				label-text="Kort beskrivelse"
				layout="inline"
				v-model="shortDescription" />
			<BaseInput
				input-type="file"
				input-id="image"
				label-text="Billede"
				layout="inline"
				accept="image/*"
				@change="handleFileNameChange" />
			<BaseInput
				input-type="number"
				placeholder="varighed"
				input-id="varighed"
				label-text="Varighed i minutter"
				layout="inline"
				v-model="timeEstimate" />
			<BaseInput
				input-type="text"
				placeholder="oprettet af"
				input-id="oprettet"
				label-text="Oprettet af"
				layout="inline"
				v-model="authorName" />
			<BaseInput
				input-type="text"
				placeholder="indhold"
				input-id="indhold"
				label-text="Indhold"
				layout="stacked"
				v-model="longDescription" />
		</div>
	</form>

	<br>
	<div @click="handleUpdateCourse" class="hover:text-amber-600 cursor-pointer">GEM</div>

	<div v-if="displayedCoverUrl">
		<img :src="displayedCoverUrl" />
	</div>
</template>
