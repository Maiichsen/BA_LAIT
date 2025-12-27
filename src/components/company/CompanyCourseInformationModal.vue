<script setup lang="ts">
import { ref, watch } from 'vue';
import { getCoursesByCompanyId, type CompanyCourseWithStats } from '@/services/companyService.ts';
import BaseModal from '@/components/BaseModal.vue';
import BaseTable from '@/components/BaseTable.vue';
import { computed } from 'vue';

interface Props {
	modelValue: boolean;
	companyId: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	'update:modelValue': [value: boolean];
}>();

// Courses data for the selected company
const companyCourses = ref<CompanyCourseWithStats[]>([]);
const isLoadingCourses = ref(false);

// Define courses table columns
const courseTableColumns = ['Kursus', 'Beskrivelse', 'Antal pladser', 'Brugte pladser', 'Ledige pladser'] as const;

// Transform courses data to table format
const courseTableRows = computed(() => {
	return companyCourses.value.map(course => [
		course.title,
		course.short_course_description || '-',
		course.totalSeats,
		course.usedSeats,
		course.availableSeats,
	]);
});

// Load courses when modal opens or company changes
watch(
	() => [props.modelValue, props.companyId] as const,
	async ([isOpen, companyId]) => {
		if (isOpen && companyId) {
			isLoadingCourses.value = true;
			try {
				companyCourses.value = await getCoursesByCompanyId(companyId);
			} catch (error) {
				console.error('Error loading courses:', error);
				companyCourses.value = [];
			} finally {
				isLoadingCourses.value = false;
			}
		}
	},
	{ immediate: true },
);

const isOpen = computed({
	get: () => props.modelValue,
	set: (value: boolean) => emit('update:modelValue', value),
});
</script>

<template>
	<BaseModal v-model="isOpen" title="Tildelte kurser" :show-footer="false">
		<div class="space-y-4">
			<BaseTable
				:cols="courseTableColumns"
				:rows="courseTableRows"
				:is-loading="isLoadingCourses"
				:has-search="true"
				search-placeholder="Søg kurser..."
				:page-size="5">
			</BaseTable>
		</div>
	</BaseModal>
</template>

<style scoped></style>
