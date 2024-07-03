"use client";
import { AllDataEstimation } from "@/components/dataTable.tsx/AllDataEstimation";
import SideBarLayout from "@/components/tailwindUi/layout/SideBarLayout";
import { getAllData } from "@/firebase/database";
import { get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";

export const Page = () => {
  const testFirebase = async () => {
    try {
      const dbRef = ref(getDatabase(), "/estimations");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error testing Firebase configuration:", error);
    }
  };

  testFirebase();
  const [leads, setLeads] = useState<any>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getAllData("/estimations");
        console.log("Fetched leads:", data);
        setLeads(data);
      } catch (error) {
        console.error("Error getting leads:", error);
      }
    };

    fetchLeads();
  }, []);

  return (
    <SideBarLayout>
      <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
      <AllDataEstimation />
    </SideBarLayout>
  );
};

export default Page;
