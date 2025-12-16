<script setup lang="ts">
import { ref, computed, watch } from 'vue';

type CellValue = string | number | boolean | null | undefined;
type Row = CellValue[];

interface Props {
	cols: readonly string[];
	rows: Row[];
	pageSize?: number;
	hasSearch?: boolean;
	searchPlaceholder?: string;
	defaultSort?: string;
	isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	pageSize: 10,
	hasSearch: false,
	searchPlaceholder: 'Søg...',
	defaultSort: '',
	isLoading: false,
});

const searchQuery = ref('');
const currentPage = ref(1);
const sortColumn = ref(props.defaultSort || props.cols[0]);
const sortDirection = ref<'asc' | 'desc'>('asc');

// Filtered rows based on search
const filteredRows = computed(() => {
	if (!searchQuery.value) return props.rows;

	const query = searchQuery.value.toLowerCase();
	return props.rows.filter(row => {
		return row.some(cell => {
			if (cell === null || cell === undefined) return false;
			const cellValue = String(cell).toLowerCase();
			return cellValue.includes(query);
		});
	});
});

// Sorted rows
const sortedRows = computed(() => {
	if (!sortColumn.value) return filteredRows.value;

	const colIndex = props.cols.indexOf(sortColumn.value);
	if (colIndex === -1) return filteredRows.value;

	return [...filteredRows.value].sort((a, b) => {
		const aVal = a[colIndex];
		const bVal = b[colIndex];

		// Handle null/undefined values
		if (aVal === null || aVal === undefined) return 1;
		if (bVal === null || bVal === undefined) return -1;

		let comparison = 0;
		if (typeof aVal === 'number' && typeof bVal === 'number') {
			comparison = aVal - bVal;
		} else {
			comparison = String(aVal).localeCompare(String(bVal));
		}

		return sortDirection.value === 'asc' ? comparison : -comparison;
	});
});

// Paginated rows
const paginatedRows = computed(() => {
	const start = (currentPage.value - 1) * props.pageSize;
	const end = start + props.pageSize;
	return sortedRows.value.slice(start, end);
});

const totalPages = computed(() => {
	return Math.ceil(filteredRows.value.length / props.pageSize);
});

// Reset to first page when search changes
watch(searchQuery, () => {
	currentPage.value = 1;
});

// Reset to first page when rows change
watch(
	() => props.rows,
	() => {
		currentPage.value = 1;
	},
);

function toggleSort(col: string) {
	if (sortColumn.value === col) {
		sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
	} else {
		sortColumn.value = col;
		sortDirection.value = 'asc';
	}
}

function nextPage() {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
	}
}

function previousPage() {
	if (currentPage.value > 1) {
		currentPage.value--;
	}
}
</script>

<template>
	<div class="w-full flex flex-col gap-4">
		<!-- Search -->
		<div v-if="hasSearch" class="relative w-full">
			<svg
				class="absolute left-4 top-1/2 -translate-y-1/2 text-tutara-500"
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none">
				<path
					d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round" />
				<path
					d="M14 14L10.5 10.5"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round" />
			</svg>
			<input
				v-model="searchQuery"
				type="text"
				:placeholder="searchPlaceholder"
				class="w-full py-3 px-4 pl-11 border border-tutara-200 rounded-lg text-p1outline-none transition-colors focus:border-purple-500 placeholder:text-tutara-500 bg-white" />
		</div>

		<!-- Table -->
		<div class="w-full overflow-x-auto border border-tutara-200 rounded-xl">
			<table class="w-full border-collapse bg-white">
				<thead class="bg-tutara-50 border-b border-tutara-200">
					<tr>
						<th
							v-for="(col, index) in cols"
							:key="index"
							@click="toggleSort(col)"
							class="py-3.5 px-6 text-left text-p1 text-tutara-900 cursor-pointer select-none transition-colors hover:bg-tutara-200">
							<div class="flex items-center gap-2">
								<span>{{ col }}</span>
								<svg
									v-if="sortColumn === col"
									class="text-tutara-900 transition-transform"
									:class="{ 'rotate-180': sortDirection === 'desc' }"
									width="12"
									height="12"
									viewBox="0 0 12 12"
									fill="none">
									<path d="M6 3L9 6L3 6L6 3Z" fill="currentColor" />
								</svg>
							</div>
						</th>
					</tr>
				</thead>
				<tbody v-if="!isLoading">
					<tr
						v-for="(row, rowIndex) in paginatedRows"
						:key="rowIndex"
						class="border-b border-tutara-200 last:border-b-0 transition-colors hover:bg-purple-10">
						<td v-for="(cell, cellIndex) in row" :key="cellIndex" class="py-4 px-6 text-p1 text-tutara-900">
							<slot
								:name="`cell-${cols[cellIndex]}`"
								:value="cell"
								:row="row"
								:rowIndex="rowIndex"
								:colIndex="cellIndex">
								{{ cell }}
							</slot>
						</td>
					</tr>
					<tr v-if="paginatedRows.length === 0">
						<td :colspan="cols.length" class="text-center py-12 px-6 text-tutara-900 text-p1">
							Ingen data fundet
						</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<td :colspan="cols.length" class="text-center py-12 px-6 text-tutara-900 text-p1">
							<div class="flex items-center justify-center gap-3">
								<div class="spinner"></div>
								Indlæser...
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		<div v-if="totalPages > 1 && !isLoading" class="flex items-center justify-center gap-4">
			<button
				@click="previousPage"
				:disabled="currentPage === 1"
				class="py-2 px-4 border border-tutara-200 rounded-lg bg-tutara-50 text-tutara-900 text-p1font-medium cursor-pointer transition-all hover:bg-tutara-100 hover:border-tutara-300 disabled:opacity-50 disabled:cursor-not-allowed">
				Forrige
			</button>
			<span class="text-p1text-tutara-600"> Side {{ currentPage }} af {{ totalPages }} </span>
			<button
				@click="nextPage"
				:disabled="currentPage === totalPages"
				class="py-2 px-4 border border-tutara-200 rounded-lg bg-tutara-50 text-tutara-900 text-p1font-medium cursor-pointer transition-all hover:bg-tutara-100 hover:border-tutara-300 disabled:opacity-50 disabled:cursor-not-allowed">
				Næste
			</button>
		</div>
	</div>
</template>

<style scoped>
.spinner {
	width: 1rem;
	height: 1rem;
	border: 2px solid var(--color-tutara-200);
	border-top-color: var(--color-purple-500);
	border-radius: 50%;
	animation: spin 0.6s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
