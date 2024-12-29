<script setup lang="ts">
import AppLayout from "@/Layouts/AppLayout.vue";
import { useForm } from "@inertiajs/vue3";
import { ref, reactive, watch, watchEffect } from "vue";
import FormPresenter from "@/Components/FormPresenter/FormPresenter.vue";
import { FormPresenter as FormPresenterBuilder } from "@/Components/FormPresenter/FormPresenter";

const orderForm = useForm({
    amount: 1000,
    type: 'input',
    bank_id: 1,
    card_number: '1234567890123456',
    card_number_client: null,
    sbp: 0,
    sbp_phone: null,
});

const form = FormPresenterBuilder.init()
    .fields([
        "amount|number|label:Сумма",
        "type|radio_group|label:Тип|options:input=Ввод,output=Вывод",
        "bank_id|radio_group|label:Банк",
        "card_number|text|label:Номер карты|hidden",
        "card_number_client|text|label:Номер карты клиента",
        "sbp|radio_group|label:СБП|options:1=Да,0=Нет",
        "sbp_phone|text|label:СБП номер|hidden",
    ])
    .options({
        bank_id: [
            { value: 1, text: 'Банк 1' },
            { value: 2, text: 'Банк 2' },
        ]
    })
    .fieldModel(orderForm)
    .defaultState((remoteControl) => {
        remoteControl.field('type', 'input');
    }).watchFields({
        type: (newValue, oldValue, remoteControl) => {
            if (newValue == 'output') {
                remoteControl.field('card_number_client').hide();
            } else {
                remoteControl.field('card_number_client').show();
            }
            // remoteControl.field('card_number_client').hideIf('type', 'output');
        },
        sbp: (newValue, oldValue, remoteControl) => {
            if (newValue == 1) {
                remoteControl.field('sbp_phone').show();
                if (remoteControl.isVal('type', 'input')) {
                    remoteControl.field('card_number_client').hide();
                }
            } else {
                remoteControl.field('sbp_phone').hide();
                if (remoteControl.isVal('type', 'input')) {
                    remoteControl.field('card_number_client').show();
                }
            }
        },
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
