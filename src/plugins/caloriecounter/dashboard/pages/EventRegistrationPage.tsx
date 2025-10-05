import {
  Button,
  DashboardRouteDefinition,
  ListPage,
  PageActionBarRight,
  DetailPageButton,
} from "@vendure/dashboard";
import { Link } from "@tanstack/react-router";
import { PlusIcon, DownloadIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@vendure/dashboard";
import { graphql } from "@/gql";
import * as XLSX from "xlsx";

// ============================================
// GraphQL Queries
// ============================================
const getCustomerEventRegistrationsQuery = graphql(`
  query GetCustomerEventRegistrations(
    $options: CustomerEventRegistrationListOptions
  ) {
    customerEventRegistrations(options: $options) {
      items {
        id
        title
        category
        regType
        orgname
        eventdate
        code
        customer {
          id
          firstName
          lastName
          emailAddress
          phoneNumber
          user {
            identifier
            verified
          }
        }
      }
      totalItems
    }
  }
`);

// ============================================
// Download All Button
// ============================================
function DownloadAllButton() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["allCustomerEventRegistrations"],
    queryFn: () =>
      api.query(getCustomerEventRegistrationsQuery, {
        options: { take: 1000, skip: 0 }, // fetch all
      }),
  });

  const handleDownload = () => {
    if (!data) return;

    const rows = data.customerEventRegistrations.items.map((r) => ({
      RegistrationID: r.id,
      Title: r.title,
      Category: r.category,
      RegType: r.regType,
      OrgName: r.orgname,
      EventDate: new Date(r.eventdate).toLocaleDateString(),
      Code: r.code,
      CustomerID: r.customer?.id,
      CustomerName: `${r.customer?.firstName ?? ""} ${r.customer?.lastName ?? ""}`,
      Email: r.customer?.emailAddress,
      Phone: r.customer?.phoneNumber,
      Identifier: r.customer?.user?.identifier,
      Verified: r.customer?.user?.verified ? "Yes" : "No",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "EventRegistrations");
    XLSX.writeFile(wb, "customer_event_registrations.xlsx");
  };

  return (
    <Button variant="outline" onClick={handleDownload} disabled={isLoading}>
      <DownloadIcon className="mr-2 h-4 w-4" />
      {isLoading ? "Loading..." : "Download All"}
    </Button>
  );
}

// ============================================
// Dashboard Route Definition
// ============================================
export const customerEventRegistrationList: DashboardRouteDefinition = {
  navMenuItem: {
    sectionId: "customers",
    id: "customer-event-registrations",
    url: "/customer-event-registrations",
    title: "Event Registrations(CCRUN)",
  },
  path: "/customer-event-registrations",
  loader: () => ({
    breadcrumb: "Event Registrations",
  }),
  component: (route) => (
    <ListPage
      pageId="customer-event-registration-list"
      title="Customer Event Registrations(CCRUN25)"
      listQuery={getCustomerEventRegistrationsQuery}
      route={route}
      customizeColumns={{
        customer: {
          header: "Customer",
          cell: ({ row }) => {
            const { customer } = row.original;
            return (
              <DetailPageButton
                href={`/customers/${customer.id}`}
                label={`${customer.firstName} ${customer.lastName}`}
                search={{ tab: "details" }}
              />
            );
          },
        },
        eventdate: {
          header: "Event Date",
          cell: ({ row }) =>
            new Date(row.original.eventdate).toLocaleDateString(),
        },
      }}
    >
      <PageActionBarRight>
        <DownloadAllButton />
        {/* <Button asChild> */}
        {/*   <Link to="./new"> */}
        {/*     <PlusIcon className="mr-2 h-4 w-4" /> */}
        {/*     New Registration */}
        {/*   </Link> */}
        {/* </Button> */}
      </PageActionBarRight>
    </ListPage>
  ),
};
