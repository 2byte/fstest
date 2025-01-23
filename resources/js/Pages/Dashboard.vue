<script setup lang="ts">
import AppLayout from "@/Layouts/AppLayout.vue";
import { useForm } from "@inertiajs/vue3";
import { ref, reactive, watch, watchEffect } from "vue";
import FormPresenter from "@/Components/FormPresenter/FormPresenter.vue";
import { FormPresenter as FormPresenterBuilder } from "@/Components/FormPresenter/FormPresenter";

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
                <div class="bg-white overflow-hidden shadow sm:rounded-lg">
                    <div class="p-12 text-xl">
                        Welcome to test frutokassa.ru for payment provider
                    </div>
                </div>

                <div class="p-12">
                    <FormPresenter :presenter />
                </div>
            </div>
        </div>
    </AppLayout>
</template>
