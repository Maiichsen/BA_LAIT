<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getCoverImgUrlByCourseId } from '@/services/courseService';
import InfoBadge from '@/components/atoms/InfoBadge.vue';
import { ImageIcon } from '@/assets/icons';
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
	isEditMode?: boolean;
	isClickable?: boolean;
	isPublished?: boolean;
}

const props = withDefaults(defineProps<CourseCardProps>(), {
	isClickable: true,
	isPublished: true,
});

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
const estimatedHours = computed(() => (props.estimatedTimeMinutes ? Math.ceil(props.estimatedTimeMinutes / 60) : null));

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

// Status badge variant
const statusVariant = computed(() => {
	if (!props.status) return 'default';

	switch (props.status) {
		case 'completed':
			return 'green';
		case 'in_progress':
			return 'purple';
		case 'not_started':
			return 'tutara';
		default:
			return 'default';
	}
});

// Beregn href baseret på edit mode
const cardHref = computed(() => {
	return props.isEditMode ? `/opret-kursus/${props.courseId}` : `/kurser/${props.courseId}`;
});

// Beregn component type baseret på isClickable
const componentType = computed(() => (props.isClickable ? 'router-link' : 'div'));
</script>

<template>
	<component
		:is="componentType"
		:to="isClickable ? cardHref : undefined"
		:class="[
			'flex flex-col h-full border border-tutara-200 bg-white pb-20 rounded-md',
			isClickable ? 'group cursor-pointer' : '',
		]">
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
				:class="[
					'w-full h-full z-1 relative object-cover transition-transform duration-400 transform',
					isClickable ? 'group-hover:scale-110' : '',
				]"
				loading="lazy" />

			<!-- Placeholder -->
			<div v-else class="w-full h-full flex items-center justify-center bg-tutara-100">
				<ImageIcon :width="80" :height="80" stroke-class="text-tutara-400" />
			</div>

			<!-- Draft overlay -->
			<div v-if="!isPublished" class="absolute inset-0 bg-tutara-900/50 flex items-center justify-center z-10">
				<span class="text-h3 text-purple-300 uppercase drop-shadow-2xl">Kladde</span>
			</div>
		</div>

		<!-- Content med padding -->
		<div class="flex flex-col p-4 lg:p-3 flex-1 gap-3">
			<!-- badge -->
			<div class="flex gap-3 flex-wrap">
				<InfoBadge v-if="!isPublished" :variant="'purple'">Ikke publiceret</InfoBadge>

				<InfoBadge v-if="estimatedHours" :variant="'blue'">
					{{ estimatedHours }} {{ estimatedHours === 1 ? 'time' : 'timer' }}
				</InfoBadge>

				<InfoBadge v-if="authorName">
					{{ authorName }}
				</InfoBadge>

				<InfoBadge v-if="statusText" :variant="statusVariant">
					{{ statusText }}
				</InfoBadge>
			</div>

			<!-- Titel -->
			<h2 :class="['text-h6 line-clamp-2', isClickable ? 'group-hover:underline' : '']">
				{{ title }}
			</h2>

			<!-- Beskrivelse -->
			<p class="text-p1 line-clamp-2 text-tutara-700">
				{{ description }}
			</p>
		</div>
	</component>
</template>
