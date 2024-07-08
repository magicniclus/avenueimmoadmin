"use client";
import { AllDataEstimation } from "@/components/dataTable.tsx/AllDataEstimation";
import Drawer from "@/components/tailwindUi/drawer/Drawer";
import DrawerEstimationContent from "@/components/tailwindUi/drawer/DrawerEstimationContent";
import SideBarLayout from "@/components/tailwindUi/layout/SideBarLayout";

export const Page = () => {
  // const testFirebase = async () => {
  //   try {
  //     const dbRef = ref(getDatabase(), "/estimations");
  //     const snapshot = await get(dbRef);
  //     if (snapshot.exists()) {
  //     } else {
  //       console.log("No data available");
  //     }
  //   } catch (error) {
  //     console.error("Error testing Firebase configuration:", error);
  //   }
  // };

  // testFirebase();
  // const [leads, setLeads] = useState<any>(null);

  // useEffect(() => {
  //   const fetchLeads = async () => {
  //     try {
  //       const data = await getAllData("/estimations");
  //       setLeads(data);
  //     } catch (error) {
  //       console.error("Error getting leads:", error);
  //     }
  //   };

  //   fetchLeads();
  // }, []);

  return (
    <div className="relative">
      <Drawer>
        <DrawerEstimationContent />
      </Drawer>
      <SideBarLayout>
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <AllDataEstimation />
      </SideBarLayout>
    </div>
  );
};

export default Page;
