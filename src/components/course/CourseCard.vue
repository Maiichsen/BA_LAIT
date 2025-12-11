<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getCoverImgUrlByCourseId } from '@/services/courseService';
// import type { Course } from '@/types/db';

type CourseStatus = 'not_started' | 'in_progress' | 'completed';

interface CourseCardProps {
  courseId: string;
  title: string;
  description: string;
  estimatedTimeMinutes: number | null;
  coverImageUrl: string | null;
  authorName?: string | null;
  status?: CourseStatus;
	//course: Course
}

const props = defineProps<CourseCardProps>();

const imageUrl = ref<string | null>(null);
const imageLoading = ref(true);

// Hent billede URL
onMounted(async () => {
	if (props.coverImageUrl) {
		try {
			const url = await getCoverImgUrlByCourseId(props.courseId);
			imageUrl.value = url;
		} catch (error) {
			console.error('Error loading course image:', error);
		} finally {
			imageLoading.value = false;
		}
	} else {
		imageLoading.value = false;
	}
});

// Konverter minutter til timer
const estimatedHours = computed(() =>
	props.estimatedTimeMinutes ? Math.ceil(props.estimatedTimeMinutes / 60) : null,
);

// Status tekster
const statusText = computed(() => {
	if (!props.status) return null;

	switch (props.status) {
	case 'not_started':
		return 'Ikke påbegyndt';
	case 'in_progress':
		return 'Påbegyndt';
	case 'completed':
		return 'Gennemført';
	default:
		return null;
	}
});
</script>

<template>
  <a :href="`/kurser/${courseId}`" class="group flex flex-col h-full border border-tutara-200 rounded-md">
    <!-- Billede med fast højde -->
    <div class="w-full h-[199px] overflow-hidden relative">
      <!-- Loading state -->
      <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center bg-tutara-100">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>

      <!-- Billede -->
      <img
        v-else-if="imageUrl"
        :src="imageUrl"
        :alt="title"
        class="w-full h-full z-1 relative object-cover transition-transform duration-400 transform group-hover:scale-110"
        loading="lazy"
      />

      <!-- Placeholder -->
      <div v-else class="w-full h-full flex items-center justify-center bg-tutara-100">
        <svg class="h-16 w-16 text-tutara-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- Content med padding -->
    <div class="flex flex-col p-4 lg:p-3 flex-1 gap-3">
      <!-- Tags -->
      <div class="flex gap-3 flex-wrap [&>p]:border-cornflower-blue-10 [&>p]:first:bg-cornflower-blue-10">
        <p v-if="estimatedHours" class="text-p2 px-4 border-2 rounded-full">
          {{ estimatedHours }} {{ estimatedHours === 1 ? 'time' : 'timer' }}
        </p>

        <p v-if="authorName" class="text-p2 px-4 border-2 rounded-full">
          {{ authorName }}
        </p>
<!-- Status med conditional farve -->
        <p
          v-if="statusText"
          class="text-p2 px-4 border-2 rounded-full"
          :class="{
            'bg-info-green border-tutara-50! text-green-800': status === 'completed',
            'bg-purple-10 border-tutara-50! text-purple-500': status === 'in_progress',
            'bg-tutara-10 border-tutara-50! text-tutara-500': status === 'not_started'
          }"
        >
          {{ statusText }}
        </p>
      </div>

      <!-- Titel -->
      <h2 class=" text-h6 group-hover:underline line-clamp-2">
        {{ title }}
      </h2>

      <!-- Beskrivelse -->
      <p class=" text-p1 line-clamp-2 text-tutara-700">
        {{ description }}
      </p>
    </div>
  </a>
</template>

