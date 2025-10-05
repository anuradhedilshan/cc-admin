import { Inject, Injectable } from "@nestjs/common";
import {
  CustomFieldsObject,
  PaginatedList,
} from "@vendure/common/lib/shared-types";
import {
  CustomFieldRelationService,
  Customer,
  CustomerService,
  ForbiddenError,
  ID,
  ListQueryBuilder,
  ListQueryOptions,
  RelationPaths,
  RequestContext,
  TransactionalConnection,
  UserInputError,
  assertFound,
} from "@vendure/core";
import {
  CustomerEventRegistration,
  RegistrationType,
} from "../entities/customer-event-registration.entity";
import { loggerCtx } from "../constants";

// Input types for Shop API operations
interface CreateCustomerEventRegistrationShopInput {
  regType?: RegistrationType;
  category: string;
  title: string;
  orgname?: string;
  eventdate: Date;
  code: string;
  customFields?: CustomFieldsObject;
}

interface UpdateCustomerEventRegistrationShopInput {
  id: ID;
  regType?: RegistrationType;
  category?: string;
  title?: string;
  orgname?: string;
  eventdate?: Date;
  code?: string;
  customFields?: CustomFieldsObject;
}

@Injectable()
export class CustomerEventRegistrationShop {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private customerService: CustomerService,
  ) {}

  /**
   * Find all event registrations for the currently authenticated customer
   */
  async findAllForCustomer(
    ctx: RequestContext,
    options?: ListQueryOptions<CustomerEventRegistration>,
    relations?: RelationPaths<CustomerEventRegistration>,
  ): Promise<PaginatedList<CustomerEventRegistration>> {
    const customerId = ctx.activeUserId;
    if (!customerId) {
      throw new ForbiddenError();
    }

    // Build query with customer filter
    const qb = this.listQueryBuilder
      .build(CustomerEventRegistration, options, {
        relations: relations || ["customer"],
        ctx,
      })
      .andWhere("customerEventRegistration.customer.id = :customerId", {
        customerId,
      });

    const [items, totalItems] = await qb.getManyAndCount();

    return {
      items,
      totalItems,
    };
  }

  /**
   * Find one event registration by ID (only if it belongs to the authenticated customer)
   */
  async findOne(
    ctx: RequestContext,
    id: ID,
    relations?: RelationPaths<CustomerEventRegistration>,
  ): Promise<CustomerEventRegistration | null> {
    const customerId = ctx.activeUserId;

    if (!customerId) {
      throw new ForbiddenError();
    }
    // Get the customer entity
    const customer = await this.customerService.findOneByUserId(
      ctx,
      customerId,
    );
    if (!customer) {
      throw new UserInputError(`Cutomer Auth Failed no Account`);
    }

    const registration = await this.connection
      .getRepository(ctx, CustomerEventRegistration)
      .findOne({
        where: { id },
        relations: relations || ["customer"],
      });

    // Verify the registration belongs to the authenticated customer
    if (registration && registration.customer.id !== customer.id) {
      throw new ForbiddenError();
    }

    return registration;
  }

  /**
   * Create a new event registration for the authenticated customer
   */
  async create(
    ctx: RequestContext,
    input: CreateCustomerEventRegistrationShopInput,
  ): Promise<CustomerEventRegistration> {
    const customerId = ctx.activeUserId;
    if (!customerId) {
      throw new ForbiddenError();
    }

    // Get the customer entity
    const customer = await this.customerService.findOneByUserId(
      ctx,
      customerId,
    );
    if (!customer) {
      throw new UserInputError(`Cutomer Auth Failed no Account`);
    }
    // Create new registration instance
    const newRegistration = new CustomerEventRegistration({
      ...input,
      customer,
      regType: input.regType || RegistrationType.INDIVIDUAL,
    });
    console.log("customer new registration", newRegistration);

    // Save the entity
    const savedRegistration = await this.connection
      .getRepository(ctx, CustomerEventRegistration)
      .save(newRegistration);
    console.log("saved registraton,", savedRegistration);
    return assertFound(this.findOne(ctx, savedRegistration.id));
  }

  /**
   * Update an existing event registration (only if it belongs to the authenticated customer)
   */
  async update(
    ctx: RequestContext,
    input: UpdateCustomerEventRegistrationShopInput,
  ): Promise<CustomerEventRegistration> {
    const customerId = ctx.activeUserId;
    if (!customerId) {
      throw new ForbiddenError();
    }

    // Get the entity and verify ownership
    const registration = await this.findOne(ctx, input.id, ["customer"]);
    if (!registration) {
      throw new UserInputError("Registration not found");
    }

    // Update the entity with new values
    Object.assign(registration, {
      ...input,
      id: registration.id, // Preserve the ID
      customer: registration.customer, // Preserve the customer
    });

    // Save the updated entity
    await this.connection
      .getRepository(ctx, CustomerEventRegistration)
      .save(registration, { reload: false });

    return assertFound(this.findOne(ctx, registration.id));
  }

  /**
   * Delete an event registration (only if it belongs to the authenticated customer)
   */
  async delete(ctx: RequestContext, id: ID): Promise<boolean> {
    const customerId = ctx.activeUserId;
    if (!customerId) {
      throw new ForbiddenError();
    }

    // Get the entity and verify ownership
    const registration = await this.findOne(ctx, id, ["customer"]);
    if (!registration) {
      throw new UserInputError("Registration not found");
    }

    try {
      await this.connection
        .getRepository(ctx, CustomerEventRegistration)
        .remove(registration);
      return true;
    } catch (e: any) {
      throw new Error(`Failed to delete registration: ${e.message}`);
    }
  }

  /**
   * Find registrations by event code (useful for checking if a customer is already registered)
   */
  async findByEventCode(
    ctx: RequestContext,
    code: string,
  ): Promise<CustomerEventRegistration | null> {
    const customerId = ctx.activeUserId;
    if (!customerId) {
      throw new ForbiddenError();
    }

    return this.connection
      .getRepository(ctx, CustomerEventRegistration)
      .findOne({
        where: {
          code,
          customer: { id: customerId },
        },
        relations: ["customer"],
      });
  }

  /**
   * Check if a customer is already registered for an event
   */
  async isRegistered(ctx: RequestContext, code: string): Promise<boolean> {
    const registration = await this.findByEventCode(ctx, code);
    return !!registration;
  }
}
