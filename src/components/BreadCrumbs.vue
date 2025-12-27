<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

interface BreadcrumbItem {
	name: string;
	path: string;
	isCurrentPage: boolean;
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
	const items: BreadcrumbItem[] = [];

	// Always add Forside as the first item
	const isOnFrontpage = route.name === 'frontpage';

	if (!isOnFrontpage) {
		items.push({
			name: 'Forside',
			path: '/',
			isCurrentPage: false,
		});
	}

	// Get the current route's breadcrumb
	const currentMatch = route.matched[route.matched.length - 1];
	if (currentMatch?.meta.breadcrumb) {
		items.push({
			name: currentMatch.meta.breadcrumb as string,
			path: currentMatch.path,
			isCurrentPage: true,
		});
	}

	return items;
});

// Only show breadcrumbs if we're not on the frontpage alone
const showBreadcrumbs = computed(
	() => breadcrumbs.value.length > 1 || (breadcrumbs.value.length === 1 && route.name !== 'frontpage'),
);
</script>

<template>
	<div v-if="showBreadcrumbs" class="container mb-3">
		<div class="container-row">
			<nav aria-label="Brødkrumme" class="lg:col-start-2 lg:col-span-14 col-span-full">
				<ol class="flex items-center gap-5 uppercase">
					<template v-for="(item, index) in breadcrumbs" :key="item.path">
						<li v-if="!item.isCurrentPage">
							<router-link :to="item.path" class="text-c2 text-tutara-600 relative top-0.5">
								{{ item.name }}
							</router-link>
						</li>
						<li v-else class="text-c2 text-tutara-900 relative top-0.5" aria-current="page">
							{{ item.name }}
						</li>

						<!-- Separator -->
						<span
							v-if="index < breadcrumbs.length - 1"
							aria-hidden="true"
							class="block w-0.5 h-3.5 rotate-25 bg-tutara-600"></span>
					</template>
				</ol>
			</nav>
		</div>
	</div>
</template>
