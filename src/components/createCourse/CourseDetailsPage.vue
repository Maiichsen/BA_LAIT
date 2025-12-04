<script setup lang="ts">
import BaseInput from '@/components/atoms/BaseInput.vue';
import {ref} from 'vue';
import {uploadImageToSupabaseBucket} from '@/services/imageService.ts';

const title = ref('');
const shortDescription = ref('');
const timeEstimate = ref('');
const authorName = ref('');
const longDescription = ref('');

/*Imagefile and unique name for upload*/
const imgFile = ref<File | null>(null);
const UniqueImgFileName = Date.now().toString();


const handleFileNameChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  imgFile.value = input.files?.[0] ?? null;
};

const savetest = () => {
  console.log({
    title: title.value,
    short_course_description: shortDescription.value,
    cover_image_url: imgFile.value,
    estimated_time_minutes: timeEstimate.value,
    authorName: authorName.value,
    long_course_description: longDescription.value,
  });

  if (!imgFile.value) {
    return;
  }
  uploadImageToSupabaseBucket(UniqueImgFileName, imgFile.value);
};

savetest();
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
        v-model="title"
      />
      <BaseInput
        input-type="text"
        placeholder="kort beskrivelse"
        input-id="kortbeskrivelse"
        label-text="Kort beskrivelse"
        layout="inline"
        v-model="shortDescription"
      />
      <BaseInput
        input-type="file"
        input-id="image"
        label-text="Billede"
        layout="inline"
        accept="image/*"
        @change="handleFileNameChange"
      />
      <BaseInput
        input-type="text"
        placeholder="varighed"
        input-id="varighed"
        label-text="Varighed"
        layout="inline"
        v-model="timeEstimate"
      />
      <BaseInput
        input-type="text"
        placeholder="oprettet af"
        input-id="oprettet"
        label-text="Oprettet af"
        layout="inline"
        v-model="authorName"
      />
      <BaseInput
        input-type="text"
        placeholder="indhold"
        input-id="indhold"
        label-text="Indhold"
        layout="stacked"
        v-model="longDescription"
      />
    </div>
  </form>

  <div @click="savetest">
    KLIK HER
  </div>
</template>
