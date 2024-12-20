<script setup>
import AppLayout from "@/Layouts/AppLayout.vue";
import { useForm } from "@inertiajs/vue3";
import { ref, reactive, watch, watchEffect } from "vue";

const formCreateOrder = reactive({
    amount: "0",
    type: "output",
    bank_id: "6",
    card_number: "",
    card_number_client: "",
    sbp: "",
    sbp_phone: "",
});

const modelValue = reactive({
    amount: "0",
    type: "output",
    bank_id: "6",
    card_number: "",
    card_number_client: "",
    sbp: "",
    sbp_phone: "",
})

const controllerFormCreateOrder = useForm(formCreateOrder);

const createOrderInputFields = ref([
    {
        name: "type",
        label: "Тип",
        type: "radio",
        props: {
            class: "!flex-row",
            options: [
                { value: "input", text: "Ввод" },
                { value: "output", text: "Вывод" },
            ],
        },
    },
    {
        name: "amount",
        label: "Сумма",
        type: "input",
        props: { placeholder: "1000", type: "number" },
    },
    {
        name: "card_number_client",
        label: "Номер карты клиента",
        type: "input",
        props: {class: [], placeholder: "4276600023344332", type: "text" },
    },
    {
        name: "bank_id",
        label: "Bank",
        type: "checkboxes",
        props: {
            class: "!flex-row",
            options: [
                { value: 7, text: "Sberbank" },
                { value: 6, text: "Sberbank" },
            ],
        },
    },
    {
        name: "sbp",
        label: "СБП",
        type: "radio",
        props: {
            class: ["!flex-row"],
            options: [
                { value: 0, text: "Нет" },
                { value: 1, text: "Да" },
            ],
        },
    },
    { component: "vfb-buttons", props: { submitText: "Go" } },
]);

watchEffect(formCreateOrder, (newValue) => {
    console.log('yes');
    if (newValue.type == "input") {
        console.log('no')
        createOrderInputFields
            .find((item) => item.name == "card_number_client")
            .props.class.filter((item) => item != "hidden"); // eslint-disable-line
    } else {
        console.log('yes')
        createOrderInputFields
            .find((item) => item.name == "card_number_client")
            .props.class.push("hidden"); // eslint-disable-line' // eslint-disable-line
    }
}, {deep: true});

const formFields = createOrderInputFields;

// const fields = {
//     name: 'name:name|text',
//     fname: 'name:fname|text|label:First name',
//     lname: 'name:lname|text|label:Last name',
//     username: 'name:username|text',
//     email: 'name:email|email',
//     email_confirmation: 'name:email_confirmation|email',
//     password: 'name:password|password',
//     password_confirmation: 'name:password_confirmation|password',
//     age: 'name:age|number',
//     birthday: 'name:birthday|date',
//     photo: 'name:photo|file|accept=image/*',
//     picture: 'name:picture|file|accept=image/*',
//     profile_picture: 'name:profile_picture|file|accept=image/*'
// };
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
                    <vue-form-builder
                        :fields="formFields"
                        v-model="modelValue"
                    />
                </div>
            </div>
        </div>
    </AppLayout>
</template>
