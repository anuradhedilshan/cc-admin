import {
    DeepPartial,
    HasCustomFields,
    VendureEntity
} from '@vendure/core';
import { Column, Entity } from 'typeorm';


export class TestCustomFields {}

@Entity()
export class Test extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<Test>) {
        super(input);
    }

    @Column()
    code: string;

    @Column(type => TestCustomFields)
    customFields: TestCustomFields;
}
