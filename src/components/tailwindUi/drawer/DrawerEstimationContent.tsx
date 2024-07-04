/* eslint-disable @next/next/no-img-element */
"use client";

import {
  addData,
  addDataWithSpecificId,
  getAllData,
  getDataById,
} from "@/firebase/database";
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

interface Agent {
  id: string;
  informations: {
    prenom: string;
    nom: string;
    secteur: { key: string; value: string }[];
  };
}

const fetchEstimationById = async (id: string): Promise<Estimation | null> => {
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

const fetchAllAgents = async (): Promise<Agent[]> => {
  try {
    const result = await getAllData("/agents");
    const agents = Object.keys(result).map((key) => ({
      id: key,
      ...result[key],
    }));
    return agents;
  } catch (error) {
    console.error("Erreur lors de la récupération des agents:", error);
    return [];
  }
};

const DrawerEstimationContent: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [estimation, setEstimation] = useState<Estimation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [partenaire, setPartenaire] = useState<string | undefined>(undefined);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await fetchEstimationById(id);
        if (data) {
          setEstimation(data);
          setPartenaire(data.partenaire);
        } else {
          setError("Estimation non trouvée");
        }
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchAgentsData = async () => {
      const agentsData = await fetchAllAgents();
      setAgents(agentsData);
      // console.log("Agents data:", agentsData);
    };

    fetchAgentsData();
  }, []);

  if (error) return <div>Erreur: {error}</div>;
  if (!estimation || !agents.length)
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

  const renderAgentsOptions = () => {
    const defaultOption = (
      <option key="default" value="" disabled className="text-gray-500">
        Attribuer à un agent
      </option>
    );

    if (!partenaire) {
      return [
        defaultOption,
        ...agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {`${agent.informations.prenom} ${agent.informations.nom} - ${
              Array.isArray(agent.informations.secteur)
                ? agent.informations.secteur
                    .map((secteur) => secteur.value)
                    .join(", ")
                : Object.values(agent.informations.secteur).join(", ")
            }`}
          </option>
        )),
      ];
    }

    const selectedAgent = agents.find((agent) => agent.id === partenaire);

    return [
      selectedAgent && (
        <option key={selectedAgent.id} value={selectedAgent.id}>
          {`${selectedAgent.informations.prenom} ${
            selectedAgent.informations.nom
          } - ${
            Array.isArray(selectedAgent.informations.secteur)
              ? selectedAgent.informations.secteur
                  .map((secteur) => secteur.value)
                  .join(", ")
              : Object.values(selectedAgent.informations.secteur).join(", ")
          }`}
        </option>
      ),
      defaultOption,
      ...agents
        .filter((agent) => agent.id !== partenaire)
        .map((agent) => (
          <option key={agent.id} value={agent.id}>
            {`${agent.informations.prenom} ${agent.informations.nom} - ${
              Array.isArray(agent.informations.secteur)
                ? agent.informations.secteur
                    .map((secteur) => secteur.value)
                    .join(", ")
                : Object.values(agent.informations.secteur).join(", ")
            }`}
          </option>
        )),
    ];
  };

  const handleAssignAgent = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPartenaire(e.target.value);
    console.log("id: ", id);
    try {
      await addDataWithSpecificId(
        `agents/${agents[0].id}/leads`,
        id,
        estimation
      );
      await addData(`estimations/${id}/agent`, agents[0].id);
      await addData(`estimations/${id}/assigned`, true);
    } catch (error) {
      console.error("Erreur lors de l'attribution de l'estimation:", error);
    }
  };

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
              Prix estimer
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
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Partenaire
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div>
                <select
                  id="partenaire"
                  name="partenaire"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={partenaire || ""}
                  onChange={handleAssignAgent}
                >
                  {renderAgentsOptions()}
                </select>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default DrawerEstimationContent;
