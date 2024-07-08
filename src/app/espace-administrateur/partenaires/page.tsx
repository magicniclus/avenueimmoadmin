"use client";
import { AllDataPartenaire } from "@/components/dataTable.tsx/AllDataPartenaire";
import Drawer from "@/components/tailwindUi/drawer/Drawer";
import DrawerPartenaireContent from "@/components/tailwindUi/drawer/DrawerPartenaireContent";
import SideBarLayout from "@/components/tailwindUi/layout/SideBarLayout";

const Page = () => {
  return (
    <div className="relative">
      <Drawer>
        <DrawerPartenaireContent />
      </Drawer>
      <SideBarLayout>
        <h1 className="text-2xl font-bold text-gray-900">Partenaires</h1>
        <AllDataPartenaire />
      </SideBarLayout>
    </div>
  );
};

export default Page;
