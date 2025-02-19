<script setup lang="ts">
import { computed } from "vue";
import AppLayout from "@/Layouts/AppLayout.vue";
import { Head, useForm } from "@inertiajs/vue3";
import FormPresenter from "@/Components/FormPresenter/FormPresenter.vue";
import { FormPresenter as FormPresenterBuilder } from "@/Components/FormPresenter/FormPresenter";
import { Header, Item } from "vue3-easy-data-table";
import { router } from "@inertiajs/vue3";
import Pagination from "@/Components/Pagination.vue";
import { mdiArrowBottomLeft, mdiArrowTopRight, mdiCancel, mdiCheck } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'

const props = defineProps({
    data: Object,
    flash: Object,
    orders: Object,
});

const modelOrder = useForm({
    amount: 0,
    type: "input",
    card_number: null,
    card_number_client: null,
    card_holder: null,
    sbp: 0,
    bank_id: 0,
    provider_id: props.data.id,
});

if (props.flash) {
    Object.assign(modelOrder, props.flash);
}

const presenter = FormPresenterBuilder.init()
    .fields([
        "type|radio_group|label:Направление платежа|options:input=Ввод,output=Вывод",
        "card_number|text|label:Номер карты|hidden",
        "card_holder|text|label:Имя на карте|hidden",
        "card_number_client|text|label:Номер карты клиента",
        "amount|text|label:Сумма платежа",
        "bank_id|radio_group|label:Банк",
        "sbp|checkbox|label:СБП",
        "btnsubmit|submit|label:Отправить",
    ])
    .options({
        bank_id: [
            { text: "Sberbank", value: 1 },
            { text: "Tinkoff", value: 2 },
            { text: "VTB", value: 3 },
            { text: "Alfa-Bank", value: 4 },
            { text: "Gazprombank", value: 5 },
            { text: "Pochtabank", value: 6 },
            { text: "Любой", value: 7 },
        ],
    })
    .fieldModel(modelOrder)
    .fieldHideIf('card_number_client', 'sbp', 1)
    .fieldShowIf('card_number', 'type', 'output')
    .fieldShowIf('card_holder', 'type', 'output')
    .make()
    .submit((event, remoteControl) => {
        event.preventDefault();
        modelOrder.post(route("order.store"), {
            onSuccess() {
                router.reload({ only: ["orders"] });
            },
        });
        remoteControl.offImgLoader();
    });

const responseApi = computed(() =>
    JSON.stringify(props.flash.created_order, null, 4),
);

const columns: Header[] = [
    {
        text: "ID",
        value: "id",
    },
    {
        text: "Направление",
        value: "type",
    },
    {
        text: "Сумма",
        value: "amount",
    },
    {
        text: "Карта",
        value: "card_number",
    },
    {
        text: "Карта клиента",
        value: "card_number_client",
    },
    {
        text: "СБП",
        value: "sbp_phone",
    },
    {
        text: "Статус ",
        value: "status",
    },
    {
        text: "Callback ответ ",
        value: "callback_status",
    },
    {
        text: "Дата",
        value: "created_at",
    },
];

const rows: Item = computed(() =>
    (props.orders.data as Item).map((item) => {
        // item.type = item.type == 'input' ? 'Ввод' : 'Вывод'; 
        item.callback_status = item.callback_data ? "получен" : "не получен";
        return item;
    }),
);
</script>

<template>
    <Head title="Provider view" />

    <AppLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Provider #{{ data.id }} {{ data.name }}
            </h2>
        </template>
        <div class="p-4 space-y-2">
            <div class="flex gap-4">
                <div>Token</div>
                <div>{{ data.token }}</div>
            </div>
            <form>
                <label class="block">URL callback обработчика</label>
                <input
                    type="text"
                    :value="route('provider.handler', [data.id])" />
            </form>
        </div>

        <div v-if="props.flash.created_order">
            <div
                v-if="flash.created_order?.success"
                class="text-2xl text-green-500 mb-2 p-4">
                Заказ успешно создан
            </div>
            <div class="text-lg">Ответ API</div>
            <pre>{{ flash.created_order }}</pre>
        </div>
        <div
            class="text-red-500 p-2 bg-red-100"
            v-if="flash.order_api_errors"
            v-for="(error, field, index) in flash.order_api_errors">
            {{ field }} - {{ error }}
        </div>

        <div class="p-4">
            <FormPresenter :presenter />
        </div>

        <EasyDataTable :headers="columns" :items="rows" class="mb-4">
            <template #item-type="item">
                <div v-if="item.type == 'input'">
                    <SvgIcon :path="mdiArrowBottomLeft" type="mdi"/>
                    Ввод
                </div>
                <div v-else>
                    <SvgIcon :path="mdiArrowTopRight" type="mdi"/>
                    Вывод
                </div>
            </template>
            <template #item-callback_status="item">
                <div v-if="item.callback_data">
                    <SvgIcon :path="mdiCheck" type="mdi" />
                    Получен
                </div>
                <div v-else>
                    <SvgIcon :path="mdiCancel" type="mdi" />
                    Не получен
                </div>
            </template>
            <template #expand="item">
                <pre v-if="item.callback_data">{{ item.callback_data }}</pre>
                <div v-else>Пока не было обратного ответа</div>
            </template>
        </EasyDataTable>

        <Pagination :pagination="orders" />
    </AppLayout>
</template>
