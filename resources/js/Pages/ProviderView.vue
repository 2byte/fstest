<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
import { Head } from '@inertiajs/vue3';

defineProps({
    data: Object,
});
</script>

<template>
    <Head title="Provider view" />

    <AppLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ data.name }}
            </h2>
        </template>
        <div class="p-4">
            <div class="flex">
                <div>Token</div>
                <div>{{ data.token }}</div>
            </div>
        </div>
    </AppLayout>
</template>