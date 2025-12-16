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
	<div class="base-table">
		<!-- Search -->
		<div v-if="hasSearch" class="table-search">
			<svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
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
			<input v-model="searchQuery" type="text" :placeholder="searchPlaceholder" class="search-input" />
		</div>

		<!-- Table -->
		<div class="table-wrapper">
			<table>
				<thead>
					<tr>
						<th
							v-for="(col, index) in cols"
							:key="index"
							@click="toggleSort(col)"
							:class="{ sortable: true, sorted: sortColumn === col }">
							<div class="th-content">
								<span>{{ col }}</span>
								<svg
									v-if="sortColumn === col"
									class="sort-icon"
									:class="{ 'sort-desc': sortDirection === 'desc' }"
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
					<tr v-for="(row, rowIndex) in paginatedRows" :key="rowIndex">
						<td v-for="(cell, cellIndex) in row" :key="cellIndex">
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
						<td :colspan="cols.length" class="empty-state">Ingen data fundet</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<td :colspan="cols.length" class="loading-state">
							<div class="spinner"></div>
							Indlæser...
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		<div v-if="totalPages > 1 && !isLoading" class="pagination">
			<button @click="previousPage" :disabled="currentPage === 1" class="pagination-btn">Forrige</button>
			<span class="pagination-info"> Side {{ currentPage }} af {{ totalPages }} </span>
			<button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">Næste</button>
		</div>
	</div>
</template>

<style scoped>
.base-table {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.table-search {
	position: relative;
	width: 100%;
}

.search-icon {
	position: absolute;
	left: 1rem;
	top: 50%;
	transform: translateY(-50%);
	color: #9ca3af;
}

.search-input {
	width: 100%;
	padding: 0.75rem 1rem 0.75rem 2.75rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	outline: none;
	transition: border-color 0.2s;
}

.search-input:focus {
	border-color: #6366f1;
}

.search-input::placeholder {
	color: #9ca3af;
}

.table-wrapper {
	width: 100%;
	overflow-x: auto;
	border: 1px solid #e5e7eb;
	border-radius: 0.75rem;
}

table {
	width: 100%;
	border-collapse: collapse;
	background: white;
}

thead {
	background-color: #f9fafb;
	border-bottom: 1px solid #e5e7eb;
}

th {
	padding: 0.875rem 1.5rem;
	text-align: left;
	font-weight: 500;
	font-size: 0.875rem;
	color: #6b7280;
	cursor: pointer;
	user-select: none;
	transition: background-color 0.2s;
}

th:hover {
	background-color: #f3f4f6;
}

.th-content {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.sort-icon {
	color: #6b7280;
	transition: transform 0.2s;
}

.sort-icon.sort-desc {
	transform: rotate(180deg);
}

tbody tr {
	border-bottom: 1px solid #e5e7eb;
	transition: background-color 0.2s;
}

tbody tr:last-child {
	border-bottom: none;
}

tbody tr:hover {
	background-color: #f9fafb;
}

td {
	padding: 1rem 1.5rem;
	font-size: 0.875rem;
	color: #1f2937;
}

.empty-state,
.loading-state {
	text-align: center;
	padding: 3rem 1.5rem;
	color: #6b7280;
	font-size: 0.875rem;
}

.loading-state {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
}

.spinner {
	width: 1rem;
	height: 1rem;
	border: 2px solid #e5e7eb;
	border-top-color: #6366f1;
	border-radius: 50%;
	animation: spin 0.6s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.pagination {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
}

.pagination-btn {
	padding: 0.5rem 1rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	background: white;
	color: #374151;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
	background-color: #f9fafb;
	border-color: #d1d5db;
}

.pagination-btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.pagination-info {
	font-size: 0.875rem;
	color: #6b7280;
}
</style>
