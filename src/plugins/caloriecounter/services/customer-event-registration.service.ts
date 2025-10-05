import { Inject, Injectable } from "@nestjs/common";
import {
  DeletionResponse,
  DeletionResult,
} from "@vendure/common/lib/generated-types";
import {
  CustomFieldsObject,
  ID,
  PaginatedList,
} from "@vendure/common/lib/shared-types";
import {
  CustomFieldRelationService,
  CustomerService,
  ListQueryBuilder,
  ListQueryOptions,
  RelationPaths,
  RequestContext,
  TransactionalConnection,
  assertFound,
  patchEntity,
} from "@vendure/core";
import { CALORIECOUNTER_PLUGIN_OPTIONS } from "../constants";
import { CustomerEventRegistration } from "../entities/customer-event-registration.entity";
import { PluginInitOptions } from "../types";

// These can be replaced by generated types if you set up code generation
interface CreateCustomerEventRegistrationInput {
  category: string;
  title: string;
  orgname?: string;
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

@Injectable()
export class CustomerEventRegistrationService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private customFieldRelationService: CustomFieldRelationService,
  ) {}

  findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<CustomerEventRegistration>,
    relations?: RelationPaths<CustomerEventRegistration>,
  ): Promise<PaginatedList<CustomerEventRegistration>> {
    return this.listQueryBuilder
      .build(CustomerEventRegistration, options, {
        relations,
        ctx,
      })
      .getManyAndCount()
      .then(([items, totalItems]) => {
        return {
          items,
          totalItems,
        };
      });
  }

  findOne(
    ctx: RequestContext,
    id: ID,
    relations?: RelationPaths<CustomerEventRegistration>,
  ): Promise<CustomerEventRegistration | null> {
    return this.connection
      .getRepository(ctx, CustomerEventRegistration)
      .findOne({
        where: { id },
        relations,
      });
  }

  async create(
    ctx: RequestContext,
    input: CreateCustomerEventRegistrationInput,
  ): Promise<CustomerEventRegistration> {
    const newEntityInstance = new CustomerEventRegistration(input);
    const newEntity = await this.connection
      .getRepository(ctx, CustomerEventRegistration)
      .save(newEntityInstance);
    await this.customFieldRelationService.updateRelations(
      ctx,
      CustomerEventRegistration,
      input,
      newEntity,
    );
    return assertFound(this.findOne(ctx, newEntity.id));
  }

  async update(
    ctx: RequestContext,
    input: UpdateCustomerEventRegistrationInput,
  ): Promise<CustomerEventRegistration> {
    const entity = await this.connection.getEntityOrThrow(
      ctx,
      CustomerEventRegistration,
      input.id,
    );
    const updatedEntity = patchEntity(entity, input);
    await this.connection
      .getRepository(ctx, CustomerEventRegistration)
      .save(updatedEntity, { reload: false });
    await this.customFieldRelationService.updateRelations(
      ctx,
      CustomerEventRegistration,
      input,
      updatedEntity,
    );
    return assertFound(this.findOne(ctx, updatedEntity.id));
  }

  async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
    const entity = await this.connection.getEntityOrThrow(
      ctx,
      CustomerEventRegistration,
      id,
    );
    try {
      await this.connection
        .getRepository(ctx, CustomerEventRegistration)
        .remove(entity);
      return {
        result: DeletionResult.DELETED,
      };
    } catch (e: any) {
      return {
        result: DeletionResult.NOT_DELETED,
        message: e.toString(),
      };
    }
  }
  // async addCustomerToOrder(ctx: RequestContext, id: ID, customer: Customer) {
  //   const customerobj = await this.customerServive.findOne(ctx, customer.id);
  //   if (!customerobj) {
  //     throw new UserInputError(`No Customer with the id could be found`);
  //   }
  //   const entity = await this.connection.getEntityOrThrow(
  //     ctx,
  //     CustomerEventRegistration,
  //     input.id,
  //   );
  // }
}
