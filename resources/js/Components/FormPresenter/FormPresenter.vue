<script lang="ts" setup>
import { FormPresenter } from "./FormPresenter";
import ImgLoader from "./ImgLoader.vue";

type PropsParams = {
    presenter: FormPresenter;
};

const props: PropsParams = defineProps({
    presenter: {
        type: FormPresenter,
        required: true,
    },
});

// const emit = defineEmits([]);

const commonInputClasses =
    "mt-0 block w-full px-0.5 bg-transparent border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black".split(
        " ",
    );

const checkboxInputClasses =
    "mt-0 ml-2 px-2 bg-transparent border-2 border-gray-200 focus:ring-0 focus:border-black";
</script>

<template>
    <form
        @submit="props.presenter.fireSubmit($event as SubmitEvent)"
        v-if="props.presenter.isShowForm.value">
        <template
            v-for="[name, field] of props.presenter.entryFields"
            :key="field.name">
            <label class="block mb-4" v-if="field.isVisible">
                <span
                    class="text-gray-700"
                    v-if="!field.isBtnSubmit && !field.isSingleCheckboxOrRadio"
                    >{{ field.label }}</span
                >
                <template v-if="field.isFormInput">
                    <input
                        :type="field.type"
                        :name="field.name"
                        :="field.nativeAttributes"
                        :class="
                            field.isSingleCheckboxOrRadio
                                ? checkboxInputClasses
                                : commonInputClasses
                        "
                        v-model="props.presenter.model[field.name]" />
                    <span
                        class="text-gray-700 ml-2"
                        v-if="field.isSingleCheckboxOrRadio"
                        >{{ field.label }}</span
                    >
                </template>
                <template v-else-if="field.isRadioGroup">
                    <div class="flex flex-wrap space-x-2">
                        <label
                            v-for="({ value, text }, index) of field.options"
                            :key="index"
                            class="space-x-2">
                            <input
                                type="radio"
                                :name="field.name"
                                :value
                                v-model="props.presenter.model[field.name]"
                                :="field.nativeAttributes" />
                            <span class="text-gray-700">{{ text }}</span>
                        </label>
                    </div>
                </template>
                <template v-if="field.isBtnSubmit">
                    <button
                        type="submit"
                        class="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
                        {{ field.label }}
                        <ImgLoader
                            v-if="props.presenter.isShowImgLoader.value" />
                    </button>
                </template>
            </label>
        </template>
    </form>
</template>
