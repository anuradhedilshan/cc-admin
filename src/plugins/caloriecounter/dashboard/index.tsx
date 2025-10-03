import { Button, defineDashboardExtension } from "@vendure/dashboard";
import { Blocks, FerrisWheel, Salad } from "lucide-react";
import { customerEventRegistrationList } from "./pages/EventRegistrationPage";
export default defineDashboardExtension({
  routes: [
    customerEventRegistrationList,
    {
      path: "/whatpos",
      component: () => <h1 className="text-4xl m-auto">Module Disabled</h1>,
      navMenuItem: {
        // The section where this item should appear
        sectionId: "whatspos",
        // Unique identifier for this menu item
        id: "wpos",
        // Display text in the navigation
        title: "Overview",
        // Optional: URL if different from path
        // url: "/wposoverview",
      },
    },
    {
      path: "/mealPlan",
      component: () => <h1 className="text-4xl m-auto">Module Disabled</h1>,
      navMenuItem: {
        // The section where this item should appear
        sectionId: "mealplan",
        // Unique identifier for this menu item
        id: "mpl",
        // Display text in the navigation
        title: "Configure & Genarate",
        // Optional: URL if different from path
        // url: "/wposoverview",
      },
    },
  ],
  navSections: [
    {
      id: "whatspos",
      title: "WhatsPos",
      icon: Blocks,
      order: 600, // Between System (100) and Settings (200)
    },
    {
      id: "mealplan",
      title: "MealPlans",
      icon: Salad,
      order: 600, // Between System (100) and Settings (200)
    },
  ],
  pageBlocks: [],
  actionBarItems: [
    {
      pageId: "product-detail",
      component: ({ context }) => {
        const [count, setCount] = useState(0);
        return (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setCount((x) => x + 1)}
          >
            Counter: {count}
          </Button>
        );
      },
    },
  ],
  alerts: [],
  widgets: [],
  customFormComponents: {},
  dataTables: [],
  detailForms: [],
});
