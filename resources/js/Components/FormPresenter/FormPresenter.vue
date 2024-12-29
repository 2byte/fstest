<script setup lang="ts">
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
    <form>
        <template
            v-for="[name, field] of props.presenter.entryFields"
            :key="field.name"
        >
            <label class="block mb-4" v-if="field.isVisible">
                <span class="text-gray-700">{{ field.label }}</span>
                <template v-if="field.isFormInput">
                    <input
                        :type="field.type"
                        :name="field.name"
                        :="field.nativeAttributes"
                        class="mt-0 block w-full px-0.5 bg-transparent border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black"
                        v-model="props.presenter.model[field.name]"
                    />
                </template>
                <template v-else-if="field.isRadioGroup">
                    <div class="flex flex-wrap space-x-2">
                        <label
                            v-for="({ value, text }, index) of field.options"
                            :key="index"
                            class="space-x-2"
                        >
                            <input
                                type="radio"
                                :name="field.name"
                                :value
                                v-model="props.presenter.model[field.name]"
                                :="field.nativeAttributes"
                            />
                            <span class="text-gray-700">{{ text }}</span>
                        </label>
                    </div>
                </template>
            </label>
        </template>
    </form>
</template>
