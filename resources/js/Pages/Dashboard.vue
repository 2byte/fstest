<script setup lang="ts">
import AppLayout from "@/Layouts/AppLayout.vue";
import { useForm } from "@inertiajs/vue3";
import { ref, reactive, watch, watchEffect } from "vue";
import FormPresenter from "@/Components/FormPresenter/FormPresenter.vue";
import { FormPresenter as FormPresenterBuilder } from "@/Components/FormPresenter/FormPresenter";
import PrimaryButton from "@/Components/PrimaryButton.vue";

const poviderCreateForm = useForm({
    name: null,
    token: null,
});

const form = FormPresenterBuilder.init()
    .fields([
        "name|text|label:Имя",
        "token|text|label:Токен",
        "btnsubmit|submit|label:Создать",
    ])
    .fieldModel(poviderCreateForm)
    .submit((event, remoteControl) => {
        // remoteControl.field
        event.preventDefault();
        // console.log(event);
        remoteControl.hideForm();

        poviderCreateForm.post(route("provider.store"));
    });

const presenter = form.make();

const isShowCreateProviderForm = ref(false);
</script>

<template>
    <AppLayout title="Dashboard">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Dashboard
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow sm:rounded-lg mb-2">
                    <div class="p-12 text-xl">
                        Welcome to test frutokassa.ru for payment provider
                    </div>
                </div>

                <div>
                    <PrimaryButton v-if="!isShowCreateProviderForm" @click="isShowCreateProviderForm = !isShowCreateProviderForm">Создать провайдера</PrimaryButton> 
                </div>

                <div class="p-12 md:w-1/4" v-if="isShowCreateProviderForm">
                    <FormPresenter :presenter/>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
