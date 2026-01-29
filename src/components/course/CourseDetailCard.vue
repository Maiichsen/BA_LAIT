<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getCoverImgUrlByCourseId } from '@/services/courseService';
import { GlobeIcon, ClockIcon, VideoIcon, CertificateIcon, ImageIcon } from '@/assets/icons';
import BaseButton from '../atoms/BaseButton.vue';

interface CourseDetailCardProps {
	courseId: string;
	title: string;
	estimatedTimeMinutes: number | null;
	coverImageUrl: string | null;
	language?: string;
	videoContentMinutes?: number | null;
	hasCertificate?: boolean;
	courseType?: string;
	pacing?: string;
}

const props = withDefaults(defineProps<CourseDetailCardProps>(), {
	language: 'Dansk',
	hasCertificate: true,
	courseType: 'Online',
	pacing: 'Selvvalgt tempo',
});

const emit = defineEmits<{
	contact: [];
}>();

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
const estimatedHours = computed(() => {
	if (!props.estimatedTimeMinutes) return null;
	const hours = Math.floor(props.estimatedTimeMinutes / 60);
	return hours > 0 ? `ca. ${hours} ${hours === 1 ? 'time' : 'timer'}` : null;
});

// Konverter video minutter til timer og minutter
const videoContentFormatted = computed(() => {
	if (!props.videoContentMinutes) return null;
	const hours = Math.floor(props.videoContentMinutes / 60);
	const minutes = props.videoContentMinutes % 60;

	if (hours > 0 && minutes > 0) {
		return `${hours} ${hours === 1 ? 'time' : 'timer'} og ${minutes} ${minutes === 1 ? 'minut' : 'minutters'} video`;
	} else if (hours > 0) {
		return `${hours} ${hours === 1 ? 'time' : 'timer'} video`;
	} else {
		return `${minutes} ${minutes === 1 ? 'minut' : 'minutters'} video`;
	}
});
</script>

<template>
	<div class="flex flex-col border border-tutara-200 bg-white rounded-md overflow-hidden">
		<!-- Billede med titel overlay -->
		<div class="w-full h-auto overflow-hidden relative">
			<!-- Loading state -->
			<div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center bg-tutara-100">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
			</div>

			<!-- Billede -->
			<img v-else-if="imageUrl" :src="imageUrl" :alt="title" class="w-full h-full object-cover" loading="lazy" />

			<!-- Placeholder -->
			<div v-else class="w-full h-full flex items-center justify-center bg-tutara-100">
				<ImageIcon :width="80" :height="80" stroke-class="text-tutara-400" />
			</div>
		</div>

		<!-- Content -->
		<div class="flex flex-col p-4 sm:p-6 gap-4 sm:gap-6">
			<h2 class="text-h6 text-center sm:text-left">{{ title }}</h2>

			<div class="space-y-2 sm:space-y-3">
				<h3 class="text-t3">Om kurset</h3>
				<div class="flex items-center gap-2 text-p1 text-tutara-700">
					<GlobeIcon :width="20" :height="20" stroke-class="text-tutara-600" />
					<span>{{ language }}</span>
				</div>
				<div v-if="estimatedHours" class="flex items-center gap-2 text-p1 text-tutara-700">
					<ClockIcon :width="20" :height="20" stroke-class="text-tutara-600" />
					<span>{{ estimatedHours }}</span>
				</div>
			</div>

			<div class="space-y-2 sm:space-y-3">
				<h3 class="text-t3">Indeholder</h3>
				<div v-if="videoContentFormatted" class="flex items-center gap-2 text-p1 text-tutara-700">
					<VideoIcon :width="20" :height="20" stroke-class="text-tutara-600" />
					<span>{{ videoContentFormatted }}</span>
				</div>
				<div v-if="hasCertificate" class="flex items-center gap-2 text-p1 text-tutara-700">
					<CertificateIcon :width="20" :height="20" stroke-class="text-tutara-600" />
					<span>Certifikat for gennemførelse</span>
				</div>
			</div>

			<div class="space-y-2 sm:space-y-3">
				<h3 class="text-t3">Tidsplan</h3>
				<p class="text-p1 text-tutara-700">{{ pacing }}</p>
			</div>

			<div class="space-y-2 sm:space-y-3">
				<h3 class="text-t3">Kurstype</h3>
				<p class="text-p1 text-tutara-700">{{ courseType }}</p>
			</div>

			<BaseButton class="self-center w-full sm:w-auto" variant="primary" @click="emit('contact')">
				Bliv kontaktet
			</BaseButton>
		</div>
	</div>
</template>
