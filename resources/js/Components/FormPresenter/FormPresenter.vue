<script setup lang="ts">
import { reactive } from "vue"
import { FormPresenter } from "./FormPresenter";

const props = defineProps({
    presenter: {
        type: FormPresenter,
        required: true,
    },
});

const emit = defineEmits([]);

</script>

<template>
    <template v-for="[name, field] of props.presenter.entryFields" :key="field.name">
        <label class="block mb-2">
            <span class="text-gray-700">{{ field.label }}</span>
            <template v-if="field.isFormInput">
                <input :type="field.type" :name="field.name" :="field.nativeAttributes" class="mt-0 block w-full px-0.5 bg-transparent border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black" />
            </template>
        </label>
    </template>
</template>
