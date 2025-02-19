import { reactive, ref, watch } from "vue";

/**
 * Type representing any valid field name string
 */
type NameField = `${string}`;

/**
 * Available form field types
 */
type TypeField =
    | "text"
    | "number"
    | "email"
    | "radio"
    | "hidden"
    | "radio_group"
    | "checkbox"
    | "checkbox_group"
    | "switch"
    | "textarea"
    | "range"
    | "date"
    | "datetime-local"
    | "submit";

/**
 * HTML input types supported by the form presenter
 */
type TypeHtmlField =
    | "text"
    | "number"
    | "email"
    | "radio"
    | "hidden"
    | "checkbox"
    | "textarea"
    | "range"
    | "date"
    | "datetime-local"
    | "button"
    | `${null}`;

/**
 * Additional parameters for field configuration
 */
type AdditionalParamsField = `label:${string | number}` | "hidden";

/**
 * Standard HTML attributes that can be applied to form fields
 */
type AdditionalAttributesHtmlField =
    | "class"
    | "id"
    | "style"
    | "value"
    | "disabled"
    | "readonly"
    | "required"
    | "disabled"
    | "readonly"
    | "placeholder"
    | "min"
    | "max"
    | "minlength"
    | "maxlength"
    | "step"
    | "pattern"
    | "autocomplete"
    | "autofocus"
    | "autocapitalize";

type AdditionalParams = AdditionalParamsField | AdditionalAttributesHtmlField;

/**
 * String format for inline field definition
 * Example: "fieldName|text|label:Field Label"
 */
type InputFieldInline = `${NameField}|${TypeField}|${AdditionalParams}`;

/**
 * Field configuration object or inline string definition
 */
type InputField =
    | {
          name: string;
          type: TypeField;
          label?: string;
      }
    | InputFieldInline;

/**
 * Options for checkbox, radio and select fields
 */
type CheckboxRadioSelectOptions = {
    text: string;
    value: string | number;
};

/**
 * Complete field settings configuration
 */
type FieldSetting = {
    name: string;
    type: TypeField;
    typeHtmlField: TypeHtmlField;
    label?: string;
    nativeAttributes?: Object;
    visible: boolean;
    options?: CheckboxRadioSelectOptions[];
};

/**
 * Callback type for field hide/show triggers
 */
type HideTriggerFieldCallback = (
    newValue: any,
    oldValue: any,
    formRemoteControl: FormRemoteControl,
) => void;

/**
 * Configuration for field visibility triggers
 */
type TriggerHideField = {
    fieldName: string;
    relateToFieldName: string;
    targetValue?: string | number | HideTriggerFieldCallback | Symbol;
};

/**
 * Watchers for field setting changes
 */
type WatcherFieldSettings = {
    [key: string]: (
        newVal: any,
        oldVal: any,
        prop: string,
        formRemoteControl: FormRemoteControl,
    ) => void;
};

/**
 * Represents a form field with its configuration and state
 */
export class Field {
    name: string;
    typeHtmlField: TypeHtmlField;
    fieldSettings: FieldSetting = reactive({}) as FieldSetting;

    static typeCustomFields: string[] = [
        "checkbox_group",
        "radio_group",
        "switch",
        "switch_group",
    ];

    /**
     * Creates a new Field instance
     * @param field Field configuration object or inline string
     */
    constructor(field: InputField) {
        if (typeof field == "string")
            Object.assign(this.fieldSettings, Field.parseField(field));

        this.name = this.fieldSettings.name;
    }

    /**
     * Factory method to create a new Field instance
     * @param field Field configuration
     */
    static make(field: InputField): Field {
        return new Field(field);
    }

    /**
     * Parses an inline field definition string into field settings
     * @param field Inline field definition string
     */
    static parseField(field: InputFieldInline): FieldSetting {
        const [name, type, ...params] = field.split("|");

        let label = null;

        if (params.toString().includes("label:")) {
            label = params
                .filter((param) => param.includes("label:"))[0]
                .split(":")[1];
        }

        const options = [];

        if (
            ["checkbox_group", "radio_group"].includes(type) &&
            params.toString().includes("options:")
        ) {
            params
                .filter((item) => item.includes("options:"))
                .forEach((item) => {
                    const valueOptions = item.split(":")[1].split(",");

                    if (item.includes("=")) {
                        valueOptions.forEach((option) => {
                            const [value, text] = option.split("=");
                            options.push({ text, value });
                        });
                    } else {
                        valueOptions.forEach((option) => {
                            options.push({ text: option, value: option });
                        });
                    }
                });
        }

        return {
            name,
            type: type as TypeField,
            typeHtmlField: Field.typeCustomFields.includes(type)
                ? (type as TypeHtmlField)
                : (null as TypeHtmlField),
            visible: !params.includes("hidden"),
            label,
            options: options as CheckboxRadioSelectOptions[],
        };
    }

    /**
     * Sets options for checkbox/radio group fields
     * @param options Array of options with text and value
     */
    setOptions(options: CheckboxRadioSelectOptions[]) {
        this.fieldSettings.options = options;
        return this;
    }

    // Getters
    get isVisible(): boolean {
        return this.fieldSettings.visible;
    }

    get type(): string {
        return this.fieldSettings.type;
    }

    get label(): string {
        return this.fieldSettings.label;
    }

    get nativeAttributes() {
        return this.fieldSettings.nativeAttributes;
    }

    /**
     * Checks if the field is a standard form input
     */
    get isFormInput(): boolean {
        const targetTypes = [
            "text",
            "number",
            "email",
            "radio",
            "hidden",
            "checkbox",
            "range",
            "date",
            "datetime-local",
        ];

        return targetTypes.some((type) =>
            type.includes(this.fieldSettings.type),
        );
    }

    get isRadioGroup(): boolean {
        return this.fieldSettings.type == "radio_group";
    }

    get isCheckboxGroup(): boolean {
        return this.fieldSettings.type == "checkbox_group";
    }

    get isSingleCheckbox(): boolean {
        return this.fieldSettings.type == "checkbox";
    }

    get isSingleRadio(): boolean {
        return this.fieldSettings.type == "radio";
    }

    get isSingleCheckboxOrRadio(): boolean {
        return ["checkbox", "radio"].includes(this.fieldSettings.type);
    }

    get isBtnSubmit() {
        return this.fieldSettings.type == "submit";
    }

    get options(): CheckboxRadioSelectOptions[] {
        return this.fieldSettings.options;
    }
}

/**
 * Controls individual field visibility and state
 */
class FieldRemoteControl {
    #field: Field;
    #remoteControl: FormRemoteControl;
    #formPresenter: FormPresenter;

    constructor(
        field: Field,
        remoteControl: FormRemoteControl,
        formPresenter: FormPresenter,
    ) {
        this.#field = field;
        this.#remoteControl = remoteControl;
        this.#formPresenter = formPresenter;
    }

    /**
     * Hides the field
     */
    hide() {
        this.#field.fieldSettings.visible = false;
        return this;
    }

    hideIf(fieldName: string, relateFieldName: string) {}

    /**
     * Shows the field
     */
    show() {
        this.#field.fieldSettings.visible = true;
        return this;
    }

    showIf() {}

    /**
     * Shows and enables the field
     */
    mount() {
        this.show();
        return this;
    }

    /**
     * Hides and disables the field
     */
    unmount() {
        this.hide();
        return this;
    }
}

/**
 * Controls form-wide operations and state
 */
class FormRemoteControl {
    #fp: FormPresenter;

    constructor(formPresenter: FormPresenter) {
        this.#fp = formPresenter;
    }

    /**
     * Gets remote control for a specific field
     * @param name Field name
     * @param value Optional value to set
     */
    field(name: string, value?: any): FieldRemoteControl {
        if (!this.#fp._fieldsMap.has(name)) {
            throw new Error(
                `Field ${name} used FieldRemoteControl.field() not found`,
            );
        }

        const field = this.#fp._fieldsMap.get(name);

        return new FieldRemoteControl(field, this, this.#fp);
    }

    /**
     * Checks if a field has a specific value
     */
    isVal(fieldName: string, val: any) {
        return this.#fp._fieldsModel[fieldName] == val;
    }

    /**
     * Hides the loading indicator
     */
    offImgLoader(): this {
        this.#fp.isShowImgLoader.value = false;
        return this;
    }

    /**
     * Hides the entire form
     */
    hideForm() {
        this.#fp.isShowForm.value = false;
        return false;
    }
}

type WatchFieldsTrigger = {
    [key: string]: (
        newVal: any,
        oldVal: any,
        remoteControl: FormRemoteControl,
    ) => void;
};

type FieldOptions = {
    [key: string]: CheckboxRadioSelectOptions[];
};

type CallbackSubmit = (
    event: SubmitEvent,
    remoteControl: FormRemoteControl,
) => void;

/**
 * Main form presenter class that manages form fields, state and behavior
 */
export class FormPresenter {
    inputFields: InputField[] = [];

    _fieldsMap: Map<string, Field> = new Map<string, Field>();

    _fieldHideTriggers: Map<string | Symbol, TriggerHideField> = new Map();

    _fieldsModel: Object = reactive({});

    _fieldsOptions: Map<string, CheckboxRadioSelectOptions[]> = new Map<
        string,
        CheckboxRadioSelectOptions[]
    >();

    _formRemoteControl: FormRemoteControl = new FormRemoteControl(this);

    #watchFieldTriggers: Map<string, CallableFunction | CallableFunction[]> =
        new Map<string, CallableFunction | CallableFunction[]>();

    #defaultStateCb: CallableFunction;

    #cbSubmit: CallbackSubmit;

    isShowImgLoader: ref = ref(false);
    isShowForm: ref = ref(true);

    constructor() {}

    /**
     * Creates a new FormPresenter instance
     */
    static init() {
        return new FormPresenter();
    }

    /**
     * Sets the form fields configuration
     * @param input Array of field configurations
     */
    fields(input: InputField[]): this {
        this.inputFields = input;
        return this;
    }

    /**
     * Sets up watchers for field value changes
     * @param triggers Map of field names to watcher callbacks
     */
    watchFields(triggers: WatchFieldsTrigger): this {
        for (const fieldName in triggers) {
            this.#watchFieldTriggers.set(fieldName, triggers[fieldName]);
        }
        return this;
    }

    /**
     * Builds field instances from configuration
     */
    fieldBuild() {
        this.inputFields.forEach((field) => {
            const fieldName =
                typeof field === "string" ? field.split("|")[0] : field.name;
            this._fieldsMap.set(fieldName, Field.make(field));
        });

        this.addOptionToField();
    }

    /**
     * Sets the form data model
     * @param modelObj Form data object
     */
    fieldModel(modelObj: Object): this {
        this._fieldsModel = modelObj;
        return this;
    }

    /**
     * Sets the default form state callback
     * @param cb Callback function
     */
    defaultState(cb: (remoteControl: FormRemoteControl) => void): this {
        this.#defaultStateCb = cb;
        return this;
    }

    /**
     * Sets the form submit handler
     * @param cbSubmit Submit callback function
     */
    submit(cbSubmit: CallbackSubmit): this {
        this.#cbSubmit = cbSubmit;
        return this;
    }

    /**
     * Sets options for select/radio/checkbox fields
     * @param fieldOptions Map of field names to options
     */
    options(fieldOptions: FieldOptions): this {
        for (const [name, options] of Object.entries(fieldOptions)) {
            this._fieldsOptions.set(name, options);
        }
        return this;
    }

    /**
     * Applies options to fields that support them
     */
    addOptionToField() {
        for (const [name, options] of this._fieldsOptions) {
            if (!this._fieldsMap.has(name)) {
                throw new Error(
                    `Error set options for field ${name}, not found`,
                );
            }
            this._fieldsMap.get(name).setOptions(options);
        }
    }

    /**
     * Sets up conditional field hiding
     * @param targetFieldName Field to hide
     * @param relateToFieldName Field to watch
     * @param value Trigger value
     */
    fieldHideIf(
        targetFieldName: NameField,
        relateToFieldName: NameField,
        value: string | number | CallableFunction,
    ): this {
        this._fieldHideTriggers.set(Symbol(targetFieldName), {
            fieldName: targetFieldName,
            relateToFieldName,
            targetValue: (
                newValue,
                oldValue,
                formRemoteControl: FormRemoteControl,
            ) => {
                if (this._fieldsModel[relateToFieldName] == value) {
                    formRemoteControl.field(targetFieldName).hide();
                } else {
                    formRemoteControl.field(targetFieldName).show();
                }
            },
        });
        return this;
    }

    /**
     * Sets up conditional field showing
     * @param targetFieldName Field to show
     * @param relateToFieldName Field to watch
     * @param value Trigger value
     */
    fieldShowIf(
        targetFieldName: NameField,
        relateToFieldName: NameField,
        value: string | number | CallableFunction,
    ): this {
        this._fieldHideTriggers.set(Symbol(targetFieldName), {
            fieldName: targetFieldName,
            relateToFieldName,
            targetValue: (
                newValue,
                oldValue,
                formRemoteControl: FormRemoteControl,
            ) => {
                if (this._fieldsModel[relateToFieldName] == value) {
                    formRemoteControl.field(targetFieldName).show();
                } else {
                    formRemoteControl.field(targetFieldName).hide();
                }
            },
        });
        return this;
    }

    /**
     * Handles form submission
     * @param e Submit event
     */
    fireSubmit(e: SubmitEvent): this {
        this.isShowImgLoader.value = true;

        if (this.#cbSubmit) {
            this.#cbSubmit(e, this._formRemoteControl);
        }
        return this;
    }

    /**
     * Watches for changes in a state object
     * @param stateObject Object to watch
     * @param cb Callback function
     */
    watchObjectChanges(stateObject: Object, cb): void {
        const previousState: Object = { ...stateObject };

        watch(stateObject, (newVal: any, oldVal: any) => {
            const keys = Object.keys(newVal);

            keys.forEach((key) => {
                if (newVal[key] !== previousState[key]) {
                    const trigger = this.#watchFieldTriggers.get(key);

                    if (typeof trigger == "function") {
                        trigger(
                            newVal[key],
                            previousState[key],
                            this._formRemoteControl,
                        );
                    } else if (Array.isArray(trigger)) {
                        trigger.forEach((triggerCb) => {
                            triggerCb(
                                newVal[key],
                                previousState[key],
                                this._formRemoteControl,
                            );
                        });
                    }
                }
            });
            Object.assign(previousState, newVal);
        });
    }

    /**
     * Watches for changes in field settings
     * @param watchers Map of field names to watcher callbacks
     */
    watcherFieldSettings(watchers: WatcherFieldSettings): void {
        const currentStateFields = Array.from(
            this._fieldsMap
                .entries()
                .map(([k, v]) => {
                    return { [k]: { ...v.fieldSettings } };
                })
                .filter((obj: object) => {
                    return watchers[Object.keys(obj)[0]];
                }),
        );

        this._fieldsMap
            .entries()
            .forEach(([name, field]: [string, Field], index: number): void => {
                watch(
                    field.fieldSettings,
                    (newValue: FieldSetting, oldValue: FieldSetting) => {
                        const keys = Object.keys(newValue);

                        keys.forEach((key) => {
                            const prevStateSetting = currentStateFields.find(
                                (data, i) =>
                                    data[field.name] && data[field.name][key],
                            );

                            if (prevStateSetting === undefined) return;

                            if (newValue[key] !== prevStateSetting) {
                                if (watchers[field.name]) {
                                    watchers[field.name](
                                        newValue[key],
                                        oldValue[key],
                                        key,
                                        this._formRemoteControl,
                                    );
                                    Object.assign(prevStateSetting, newValue);
                                }
                            }
                        });
                    },
                );
            });
    }

    /**
     * Sets up watchers for model changes
     */
    watcherModelChanges() {
        const previousState: Object = { ...this._fieldsModel };

        watch(this._fieldsModel, (newVal: any, oldVal: any) => {
            const keys = Object.keys(newVal);

            keys.forEach((key) => {
                if (newVal[key] !== previousState[key]) {
                    const trigger = this.#watchFieldTriggers.get(key);

                    if (typeof trigger == "function") {
                        trigger(
                            newVal[key],
                            previousState[key],
                            this._formRemoteControl,
                        );
                    } else if (Array.isArray(trigger)) {
                        trigger.forEach((triggerCb) => {
                            triggerCb(
                                newVal[key],
                                previousState[key],
                                this._formRemoteControl,
                            );
                        });
                    }
                }
            });
            Object.assign(previousState, newVal);
        });
    }

    /**
     * Sets up field visibility triggers
     */
    makeTriggers() {
        this._fieldHideTriggers.forEach(
            (trigger: TriggerHideField, fieldName: NameField): void => {
                let cb = null;
                if (typeof trigger.targetValue == "function") {
                    cb = trigger.targetValue;
                } else {
                    cb = (
                        newValue,
                        oldValue,
                        formRemoteControl: FormRemoteControl,
                    ): void => {
                        if (
                            trigger.targetValue &&
                            newValue == trigger.targetValue
                        ) {
                            formRemoteControl.field(trigger.fieldName).hide();
                        }
                    };
                }
                if (this.#watchFieldTriggers.has(trigger.relateToFieldName)) {
                    this.#watchFieldTriggers.set(trigger.relateToFieldName, [
                        this.#watchFieldTriggers.get(trigger.relateToFieldName),
                        cb,
                    ]);
                } else {
                    this.#watchFieldTriggers.set(trigger.relateToFieldName, cb);
                }
            },
        );
    }

    /**
     * Initializes the form presenter
     */
    make(): this {
        this.fieldBuild();
        if (this.#defaultStateCb) {
            this.#defaultStateCb(this._formRemoteControl);
        }
        this.makeTriggers();
        this.watcherModelChanges();

        return this;
    }

    /**
     * Gets all form fields
     */
    get entryFields(): Map<string, Field> {
        return this._fieldsMap;
    }

    /**
     * Gets the form data model
     */
    get model(): Object {
        return this._fieldsModel;
    }
}