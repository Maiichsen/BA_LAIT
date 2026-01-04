<script setup lang="ts">
import type { ContentWithText, RichCoursePage } from '@/types/courseTypes.ts';
import { computed, onMounted, ref, watch } from 'vue';
import { useCourseEditorStore } from '@/stores/courseEditorStore.ts';

const editorStore = useCourseEditorStore();

interface Props {
	page: RichCoursePage;
}

const { page } = defineProps<Props>();

const articleData = ref<ContentWithText | null>(null);

const editableText = ref('');
const originalText = ref('');

onMounted(() => {
	initEditor();
});

const initEditor = () => {
	articleData.value = (page.content as ContentWithText);

	originalText.value = articleData.value.content_json.temp_raw_text;
	editableText.value = articleData.value.content_json.temp_raw_text_edited ?? originalText.value ?? '';
};

const hasUnsavedChanges = computed(() => editableText.value.trim() !== originalText.value);

watch(hasUnsavedChanges, (hasChanges) => {
	editorStore.setPageHasUnsavedChange(page.content!.course_page_id, hasChanges);
});

watch(editableText, (newText) => {
	editorStore.setPageArticleContentJson(page.content!.course_page_id, newText);
});

// Re-init article editor when page changed but component is not re-mounted, e.g. when switching between two article pages
watch(() => page.content?.course_page_id, () => initEditor());
// Re-init article editor when viewed article changes non-editor content - e.g. when the document is saved
watch(() => (page.content as ContentWithText).content_json?.temp_raw_text, () => initEditor());
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
