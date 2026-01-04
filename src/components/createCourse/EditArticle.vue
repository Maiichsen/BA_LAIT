<script setup lang="ts">
import type { RichCoursePage } from '@/types/courseTypes.ts';
import type { Content } from '@/types/db.ts';
import { computed, onMounted, ref, watch } from 'vue';
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';

const editorStore = useCourseEditorStore();

interface Props {
	page: RichCoursePage;
}

const { page } = defineProps<Props>();

const articleData = ref<Content | null>(null);

const editableText = ref('');
const originalText = ref('');

onMounted(() => {
	initEditor();
});

const initEditor = () => {
	articleData.value = page.content;

	originalText.value = page.content.content_json.temp_raw_text;
	editableText.value = page.content.content_json.temp_raw_text_edited ?? originalText.value ?? '';
};

const hasUnsavedChanges = computed(() => editableText.value.trim() !== originalText.value);

watch(hasUnsavedChanges, (hasChanges) => {
	editorStore.setPageHasUnsavedChange(page.content!.course_page_id, hasChanges);
});

watch(editableText, (newText) => {
	editorStore.setPageArticleContentJson(page.content!.course_page_id, newText);
});

// Re-init article editor when component is not re-mounted, e.g. when switching between two article pages
watch(() => page.content?.course_page_id, () => {
	initEditor();
});
</script>

<template>
	<div class="bg-white rounded border border-tutara-200">
		<div class="shadow py-1 px-2">
			TOOLBAR
		</div>
		<textarea
			class="w-full h-full m-0 outline-none p-2 cursor-text pb-50 h-auto resize-none"
			v-model="editableText"
		/>
	</div>
</template>
