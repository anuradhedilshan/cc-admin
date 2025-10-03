import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  DeletionResponse,
  Permission,
} from "@vendure/common/lib/generated-types";
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
import { CustomerEventRegistration } from "../entities/customer-event-registration.entity";
import { CustomerEventRegistrationService } from "../services/customer-event-registration.service";

// These can be replaced by generated types if you set up code generation
interface CreateCustomerEventRegistrationInput {
  category: string;
  title: string;
  orgname: string;
  eventdate: Date;
  code: string;
  // Define the input fields here
  customFields?: CustomFieldsObject;
}
interface UpdateCustomerEventRegistrationInput {
  id: ID;
  category?: string;
  title?: string;
  orgname?: string;
  eventdate?: Date;
  code?: string;
  // Define the input fields here
  customFields?: CustomFieldsObject;
}

@Resolver()
export class CustomerEventRegistrationAdminResolver {
  constructor(
    private customerEventRegistrationService: CustomerEventRegistrationService,
  ) {}

  @Query()
  @Allow(Permission.ReadCatalog)
  async customerEventRegistration(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
    @Relations(CustomerEventRegistration)
    relations: RelationPaths<CustomerEventRegistration>,
  ): Promise<CustomerEventRegistration | null> {
    return this.customerEventRegistrationService.findOne(
      ctx,
      args.id,
      relations,
    );
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async customerEventRegistrations(
    @Ctx() ctx: RequestContext,
    @Args() args: { options: ListQueryOptions<CustomerEventRegistration> },
    @Relations(CustomerEventRegistration)
    relations: RelationPaths<CustomerEventRegistration>,
  ): Promise<PaginatedList<CustomerEventRegistration>> {
    return this.customerEventRegistrationService.findAll(
      ctx,
      args.options || undefined,
      relations,
    );
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  async createCustomerEventRegistration(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateCustomerEventRegistrationInput },
  ): Promise<CustomerEventRegistration> {
    return this.customerEventRegistrationService.create(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  async updateCustomerEventRegistration(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdateCustomerEventRegistrationInput },
  ): Promise<CustomerEventRegistration> {
    return this.customerEventRegistrationService.update(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  async deleteCustomerEventRegistration(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
  ): Promise<DeletionResponse> {
    return this.customerEventRegistrationService.delete(ctx, args.id);
  }
}
