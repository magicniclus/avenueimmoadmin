/* eslint-disable @next/next/no-img-element */

"use client";

import { resetPassword } from "@/firebase/auth"; // Importez la fonction resetPassword depuis son chemin
import { useState } from "react";
import { Toaster, toast } from "sonner"; // Assurez-vous que l'importation est correcte

const ChangePasseword: React.FC = ({ href }: { href?: string }) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("L'adresse email n'est pas valide.");
      toast.error("L'adresse email n'est pas valide."); // Afficher le message d'erreur avec Toaster
      return;
    }

    try {
      await resetPassword(email);
      toast.success("Email de réinitialisation de mot de passe envoyé."); // Afficher le message de succès avec Toaster
    } catch (error) {
      setError("Échec de l'envoi de l'email de réinitialisation.");
      toast.error("Échec de l'envoi de l'email de réinitialisation."); // Afficher le message d'erreur avec Toaster
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Toaster /> {/* Assurez-vous que le composant Toaster est inclus */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="/logo.png"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Réinitialisez votre mot de passe
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Adresse email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Réinitialiser
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Vous souvenez-vous de votre mot de passe ?{" "}
          <a
            href={href ? href : "/user/connexion"}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
};

export default ChangePasseword;
