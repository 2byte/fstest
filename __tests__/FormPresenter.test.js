import { Field } from '@/Components/FormPresenter/FormPresenter';
import { describe, expect, it } from 'vitest';

describe('Testing FormPresenter class', () => {

    it('Test parse field inline syntax', () => {
        const field = 'sbp_phone|text|label:СБП номер|hidden';

        const fieldEntry = Field.make(field);

        console.log(fieldEntry);
    });
});