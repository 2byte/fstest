```js
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
        "btnsubmit|submit|label:Оплатить",
    ])
    .options({
        bank_id: [
            { value: 1, text: 'Банк 1' },
            { value: 2, text: 'Банк 2' },
        ]
    })
    .fieldModel(orderForm)
    .fieldHideIf('card_number_client', ,'outputt')
    .fieldShowIf('card_holder', 'type', 'output')
    .fieldShowIf('card_holder', 'type', 'output')
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
    }).submit((event, remoteControl) => {
        // remoteControl.field
        event.preventDefault();
        // console.log(event);
        setTimeout(() => {
            remoteControl.offImgLoader();
            remoteControl.hideForm()
        }, 5000)
    });
    
    const presenter = form.make();
```