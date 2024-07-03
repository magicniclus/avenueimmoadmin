/* eslint-disable @next/next/no-img-element */

"use client";

import { Toaster } from "@/components/ui/sonner"; // Importez votre composant Toaster
import { signIn } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"; // Assurez-vous que l'importation est correcte

interface ConnexionFormProps {
  title?: string;
  href?: string;
}

const ConnexionForm: React.FC<ConnexionFormProps> = ({ title, href }) => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("L'adresse email n'est pas valide.");
      toast.error("L'adresse email n'est pas valide."); // Afficher le message d'erreur avec Toaster
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre."
      );
      toast.error(
        "Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre."
      ); // Afficher le message d'erreur avec Toaster
      return;
    }

    try {
      await signIn(email, password);
      router.push(href || "/espace-administrateur/partenaires");
      // Redirection ou autres actions après connexion réussie
    } catch (error) {
      setError("Échec de la connexion. Veuillez vérifier vos informations.");
      toast.error("Échec de la connexion. Veuillez vérifier vos informations."); // Afficher le message d'erreur avec Toaster
    }
  };

  return (
    <div className="flex flex-col justify-center px-6 lg:px-8">
      <Toaster /> {/* Assurez-vous que le composant Toaster est inclus */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
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
                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mot de passe
              </label>
              <div className="text-sm">
                <a
                  href="/changer-le-mot-de-passe"
                  className="font-semibold text-blue-600 hover:text-blue-500"
                >
                  Mot de passe oublié ?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Se connecter
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Pas encore inscrit ?{" "}
          <a
            href="/"
            className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
          >
            Publiez votre projet
          </a>
        </p>
      </div>
    </div>
  );
};

export default ConnexionForm;
