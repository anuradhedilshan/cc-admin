import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Permission } from "@vendure/common/lib/generated-types";
import { CustomFieldsObject } from "@vendure/common/lib/shared-types";
import {
  Allow,
  Ctx,
  ID,
  ListQueryOptions,
  PaginatedList,
  RelationPaths,
  Relations,
  RequestContext,
  Transaction,
} from "@vendure/core";
import {
  CustomerEventRegistration,
  RegistrationType,
} from "../entities/customer-event-registration.entity";
import { CustomerEventRegistrationShop } from "../services/customer-event-registration-shop";

// Input types for Shop API
interface CreateCustomerEventRegistrationShopInput {
  regType?: RegistrationType;
  category: string;
  title: string;
  orgname: string;
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

@Resolver()
export class CustomerEventRegistrationShopResolver {
  constructor(
    private customerEventRegistrationShopService: CustomerEventRegistrationShop,
  ) {}

  /**
   * Get a single event registration by ID (customer's own registration only)
   */
  @Query()
  @Allow(Permission.Authenticated)
  async customerEventRegistration(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
    @Relations(CustomerEventRegistration)
    relations: RelationPaths<CustomerEventRegistration>,
  ): Promise<CustomerEventRegistration | null> {
    return this.customerEventRegistrationShopService.findOne(
      ctx,
      args.id,
      relations,
    );
  }

  /**
   * Get all event registrations for the authenticated customer
   */
  @Query()
  @Allow(Permission.Authenticated)
  async customerEventRegistrations(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: ListQueryOptions<CustomerEventRegistration> },
    @Relations(CustomerEventRegistration)
    relations: RelationPaths<CustomerEventRegistration>,
  ): Promise<PaginatedList<CustomerEventRegistration>> {
    return this.customerEventRegistrationShopService.findAllForCustomer(
      ctx,
      args.options || undefined,
      relations,
    );
  }

  /**
   * Get a registration by event code (for the authenticated customer)
   */
  @Query()
  @Allow(Permission.Authenticated)
  async customerEventRegistrationByCode(
    @Ctx() ctx: RequestContext,
    @Args() args: { code: string },
  ): Promise<CustomerEventRegistration | null> {
    return this.customerEventRegistrationShopService.findByEventCode(
      ctx,
      args.code,
    );
  }

  /**
   * Check if the authenticated customer is registered for an event
   */
  @Query()
  @Allow(Permission.Authenticated)
  async isRegisteredForEvent(
    @Ctx() ctx: RequestContext,
    @Args() args: { code: string },
  ): Promise<boolean> {
    return this.customerEventRegistrationShopService.isRegistered(
      ctx,
      args.code,
    );
  }

  /**
   * Create a new event registration for the authenticated customer
   */
  @Mutation()
  @Transaction()
  @Allow(Permission.Authenticated)
  async createCustomerEventRegistration(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateCustomerEventRegistrationShopInput },
  ): Promise<CustomerEventRegistration> {
    return this.customerEventRegistrationShopService.create(ctx, args.input);
  }

  /**
   * Update an existing event registration (customer's own registration only)
   */
  @Mutation()
  @Transaction()
  @Allow(Permission.Authenticated)
  async updateCustomerEventRegistration(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdateCustomerEventRegistrationShopInput },
  ): Promise<CustomerEventRegistration> {
    return this.customerEventRegistrationShopService.update(ctx, args.input);
  }

  /**
   * Delete an event registration (customer's own registration only)
   */
  @Mutation()
  @Transaction()
  @Allow(Permission.Authenticated)
  async deleteCustomerEventRegistration(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
  ): Promise<boolean> {
    return this.customerEventRegistrationShopService.delete(ctx, args.id);
  }
}
