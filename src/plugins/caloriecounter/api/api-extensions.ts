import gql from "graphql-tag";

// ============================================
// SHARED TYPE DEFINITIONS
// ============================================
const sharedTypes = gql`
  type CustomerEventRegistration implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    customer: Customer!
    regType: String!
    category: String!
    title: String!
    orgname: String
    eventdate: DateTime!
    code: String!
  }

  type CustomerEventRegistrationList implements PaginatedList {
    items: [CustomerEventRegistration!]!
    totalItems: Int!
  }

  input CustomerEventRegistrationListOptions
`;

// ============================================
// ADMIN API EXTENSIONS
// ============================================
export const customerEventRegistrationAdminApiExtensions = gql`
  ${sharedTypes}

  input CreateCustomerEventRegistrationInput {
    customerId: ID!
    regType: String
    category: String!
    title: String!
    orgname: String
    eventdate: DateTime!
    code: String!
  }

  input UpdateCustomerEventRegistrationInput {
    id: ID!
    customerId: ID
    regType: String
    category: String
    title: String
    orgname: String
    eventdate: DateTime
    code: String
  }

  extend type Query {
    """
    Get a single event registration by ID
    """
    customerEventRegistration(id: ID!): CustomerEventRegistration

    """
    Get all event registrations with filtering and pagination
    """
    customerEventRegistrations(
      options: CustomerEventRegistrationListOptions
    ): CustomerEventRegistrationList!
  }

  extend type Mutation {
    """
    Create a new event registration for any customer
    """
    createCustomerEventRegistration(
      input: CreateCustomerEventRegistrationInput!
    ): CustomerEventRegistration!

    """
    Update an existing event registration
    """
    updateCustomerEventRegistration(
      input: UpdateCustomerEventRegistrationInput!
    ): CustomerEventRegistration!

    """
    Delete an event registration
    """
    deleteCustomerEventRegistration(id: ID!): DeletionResponse!
  }
`;

// ============================================
// SHOP API EXTENSIONS
// ============================================
export const customerEventRegistrationShopApiExtensions = gql`
  ${sharedTypes}

  input CreateCustomerEventRegistrationShopInput {
    regType: String
    category: String!
    title: String!
    orgname: String
    eventdate: DateTime!
    code: String!
    firstName: String
    lastName: String
    emailAddress: String
    phoneNumber: String
  }

  input UpdateCustomerEventRegistrationShopInput {
    id: ID!
    regType: String
    category: String
    title: String
    orgname: String
    eventdate: DateTime
    code: String
  }

  extend type Query {
    """
    Get a single event registration by ID (only your own registrations)
    """
    customerEventRegistration(id: ID!): CustomerEventRegistration

    """
    Get all your event registrations
    """
    customerEventRegistrations(
      options: CustomerEventRegistrationListOptions
    ): CustomerEventRegistrationList!

    """
    Get your registration for a specific event by code
    """
    customerEventRegistrationByCode(code: String!): CustomerEventRegistration

    """
    Check if you are registered for an event
    """
    isRegisteredForEvent(code: String!): Boolean!
  }

  extend type Mutation {
    """
    Register for a new event
    """
    createCustomerEventRegistration(
      input: CreateCustomerEventRegistrationShopInput!
    ): CustomerEventRegistration!

    """
    Update your event registration
    """
    updateCustomerEventRegistration(
      input: UpdateCustomerEventRegistrationShopInput!
    ): CustomerEventRegistration!

    """
    Cancel your event registration
    """
    deleteCustomerEventRegistration(id: ID!): Boolean!
  }
`;
