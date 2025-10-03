import {
  Customer,
  DeepPartial,
  HasCustomFields,
  VendureEntity,
} from "@vendure/core";
import { Column, Entity, ManyToOne } from "typeorm";

export class CustomerEventRegistrationCustomFields {}
export enum RegistrationType {
  INDIVIDUAL = "individual",
  CLUB = "club",
  ORGANIZATION = "organization",
  GYM = "gym",
}
@Entity()
export class CustomerEventRegistration
  extends VendureEntity
  implements HasCustomFields
{
  constructor(input?: DeepPartial<CustomerEventRegistration>) {
    super(input);
  }
  @ManyToOne(() => Customer)
  customer: Customer;
  @Column({
    type: "text",
    enum: RegistrationType,
    default: RegistrationType.INDIVIDUAL,
  })
  regType: RegistrationType;
  @Column({ default: "general" })
  category: string; // e.g., "marathon", "food-fest", "competition"
  @Column()
  title: string;
  @Column()
  orgname: string;
  @Column()
  eventdate: Date;
  @Column()
  code: string;

  @Column(() => CustomerEventRegistrationCustomFields)
  customFields: CustomerEventRegistrationCustomFields;
}
