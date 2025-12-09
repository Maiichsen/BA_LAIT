<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue';
import { onMounted, ref } from 'vue';
import { uploadImageToSupabaseBucket } from '@/services/imageService.ts';
import { getCoverImgUrlByCourseId } from '@/services/courseService.ts';
import { updateCourse } from '@/services/courseService.ts';

interface Props {
	course_id: string;
}

const props = defineProps<Props>();

const title = ref('');
const shortDescription = ref('');
const timeEstimate = ref(null);
const authorName = ref('');
const longDescription = ref('');

/*Imagefile and unique name for upload*/
const imgFile = ref<File | null>(null);
const UniqueImgFileName = Date.now().toString();

const handleFileNameChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  imgFile.value = input.files?.[0] ?? null;
};

/*Update course*/
const handleUpdateCourse = async () => {
  await updateCourse(props.course_id, {
    title: title.value,
    short_course_description: shortDescription.value,
    cover_image_url: UniqueImgFileName,
    estimated_time_minutes: timeEstimate.value,
    author_name: authorName.value,
    long_course_description: longDescription.value,
  });

  if (!imgFile.value) {
    return;
  }
  await uploadImageToSupabaseBucket(UniqueImgFileName, imgFile.value);
};

const coverUrl = ref<string | null>(null);

onMounted(() => {
  getCoverImgUrlByCourseId('7c97008e-6258-4138-ac18-5c5848a8abd8')
    .then(imgUrl => {
      coverUrl.value = imgUrl;
    })
    .catch(err => console.log(err));
});
</script>

<template>
	<form action="">
		<div class="border-2 border-green-500">
			<BaseInput
				input-type="text"
				placeholder="overskrift"
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

	<div @click="handleUpdateCourse" class="hover:text-amber-600 cursor-pointer">GEM</div>

	<div v-if="coverUrl">
		<img :src="coverUrl" />
	</div>
</template>
