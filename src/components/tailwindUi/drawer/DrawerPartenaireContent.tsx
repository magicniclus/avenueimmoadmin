/* eslint-disable @next/next/no-img-element */
"use client";

import { getDataInPartenaireById } from "@/firebase/database";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Lead {
  id: string;
  adresse: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  predictedPrice: number;
  date: string;
  assigned?: boolean;
}

interface Agent {
  id: string;
  informations: {
    prenom: string;
    nom: string;
    contrat: string;
    email: string;
    entreprise: string;
    secteur: string;
    telephone: string;
  };
  leads: Record<string, Lead>;
}

const fetchAgentById = async (id: string): Promise<Agent | null> => {
  try {
    const result = await getDataInPartenaireById(id);
    if (result) {
      console.log("Agent data retrieved:", result); // Debug log
      return { id, ...result } as Agent;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'agent:", error);
    return null;
  }
};

const DrawerPartenaireContent: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [agent, setAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await fetchAgentById(id);
        if (data) {
          setAgent(data);
        } else {
          setError("Agent non trouvé");
        }
      }
    };

    fetchData();
  }, [id]);

  if (error) return <div>Erreur: {error}</div>;
  if (!agent)
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

  console.log("Agent information:", agent); // Debug log

  return (
    <div>
      <div className="px-4 sm:px-6">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Informations sur le partenaire
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Détails personnels et leads attribués.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100 px-4 sm:px-6">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Prénom
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {agent.informations.prenom}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Nom</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {agent.informations.nom}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Contrat
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {agent.informations.contrat}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Email
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {agent.informations.email}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Entreprise
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {agent.informations.entreprise}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Secteur
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {Object.values(agent?.informations?.secteur || {}).map(
                (secteur: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                  >
                    {secteur}
                  </span>
                )
              )}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Téléphone
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {agent.informations.telephone}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Leads attribués
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {Object.values(agent.leads || {}).map((lead: Lead) => (
                <div key={lead.id} className="mb-4">
                  <p>
                    <strong>Adresse:</strong> {lead.adresse}
                  </p>
                  <p>
                    <strong>Nom:</strong> {lead.firstName} {lead.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {lead.email}
                  </p>
                  <p>
                    <strong>Téléphone:</strong> {lead.phone}
                  </p>
                  <p>
                    <strong>Prix Estimé:</strong>{" "}
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(lead.predictedPrice)}
                  </p>
                  <p>
                    <strong>Date:</strong> {lead.date}
                  </p>
                </div>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default DrawerPartenaireContent;
