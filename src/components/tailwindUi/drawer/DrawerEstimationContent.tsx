/* eslint-disable @next/next/no-img-element */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDataById } from "@/firebase/database";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Estimation {
  id: string;
  adresse: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  predictedPrice: number;
  date: string;
  assigned?: boolean;
  partenaire?: string;
}

const fetchEstimationById = async (id: string): Promise<Estimation | null> => {
  console.log("Fetching estimation by ID:", id);
  try {
    const result = await getDataById("/estimations", id);
    if (result) {
      return { id, ...result } as Estimation;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'estimation:", error);
    return null;
  }
};

const DrawerEstimationContent: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [estimation, setEstimation] = useState<Estimation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await fetchEstimationById(id);
        console.log("Data:", data);
        if (data) {
          setEstimation(data);
        } else {
          setError("Estimation non trouvée");
        }
      }
    };

    fetchData();
  }, [id]);

  if (error) return <div>Erreur: {error}</div>;
  if (!estimation)
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-white">
        <div className="text-center">
          <img
            src="/favicon.png"
            alt="logo"
            className="animate-pulse w-20 h-20"
          />
        </div>
      </div>
    );

  if (error) return <div>Erreur: {error}</div>;
  if (!estimation)
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-white">
        <div className="text-center">
          <img
            src="/favicon.png"
            alt="logo"
            className="animate-pulse w-20 h-20"
          />
        </div>
      </div>
    );

  return (
    <div>
      <div className="px-4 sm:px-6">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Informations sur l&apos;estimation
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Détails personnels et estimation.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100 px-4 sm:px-6">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Adresse
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {estimation.adresse}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Prénom
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {estimation.firstName}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Nom</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {estimation.lastName}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Email
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {estimation.email}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Téléphone
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {estimation.phone}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Prix Prévu
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(estimation.predictedPrice)}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Date
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {estimation.date}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Attribué
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {estimation?.assigned ? "Oui" : "Non"}
            </dd>
          </div>
          {
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Partenaire
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </dd>
            </div>
          }
        </dl>
      </div>
    </div>
  );
};

export default DrawerEstimationContent;
