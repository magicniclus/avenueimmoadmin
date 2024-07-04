import { database } from "@/firebase/firebase.config";
import { get, push, ref, remove, set } from "firebase/database";

/**
 * Fonction pour ajouter des données à une route spécifique dans la Firebase Realtime Database.
 * @param route - La route où les données doivent être ajoutées
 * @param data - Les données à ajouter
 * @returns L'ID des données ajoutées
 */
export const addData = async (route: string, data: any): Promise<string> => {
  try {
    const dataRef = ref(database, route);
    const newDataRef = push(dataRef); // Génère un nouvel ID automatiquement

    // Obtient la date et l'heure actuelle en version française
    const now = new Date();
    const createdAt = now.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Ajoute la date de création aux données
    const newData = {
      createdAt,
    };

    await set(newDataRef, newData); // Ajoute les données à la base de données
    return newDataRef.key || ""; // Retourne l'ID des données ajoutées
  } catch (error) {
    console.error("Error adding data:", error);
    throw error;
  }
};

/**
 * Fonction pour ajouter des données à une route spécifique dans la Firebase Realtime Database avec un ID spécifique.
 * @param route - La route où les données doivent être ajoutées
 * @param id - L'ID spécifique à utiliser pour les nouvelles données
 * @param data - Les données à ajouter
 * @returns Une promesse résolue si les données ont été ajoutées avec succès
 */
export const addDataWithSpecificId = async (
  route: string,
  id: any,
  data: any
): Promise<void> => {
  try {
    const dataRef = ref(database, `${route}/${id}`); // Utilise l'ID spécifique pour la référence

    // Obtient la date et l'heure actuelle en version française
    const now = new Date();
    const createdAt = now.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Ajoute la date de création aux données
    const newData = {
      ...data,
      createdAt,
    };

    await set(dataRef, newData); // Ajoute les données à la base de données
    console.log(`Data added successfully with ID: ${id}`);
  } catch (error) {
    console.error("Error adding data with specific ID:", error);
    throw error;
  }
};

/**
 * Fonction pour supprimer un élément spécifique dans la Firebase Realtime Database.
 * @param route - La route où l'élément doit être supprimé
 * @param id - L'ID de l'élément à supprimer
 * @returns Une promesse résolue en cas de succès ou une erreur en cas d'échec
 */
export const deleteData = async (route: string, id: string): Promise<void> => {
  try {
    const itemRef = ref(database, `${route}/${id}`); // Référence à l'élément à supprimer
    await remove(itemRef); // Supprime l'élément de la base de données
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error; // Relance l'erreur pour être gérée par l'appelant
  }
};

/**
 * Fonction pour récupérer toutes les données d'un dossier spécifique dans la Firebase Realtime Database.
 * @param route - La route du dossier dont les données doivent être récupérées
 * @returns Une promesse résolue avec les données récupérées ou une erreur en cas d'échec
 */
export const getAllData = async (route: string): Promise<any> => {
  try {
    const dataRef = ref(database, route);
    const snapshot = await get(dataRef); // Récupère les données à partir de la base de données
    if (snapshot.exists()) {
      // console.log("Data retrieved successfully:", snapshot.val());
      return snapshot.val(); // Retourne les données si elles existent
    } else {
      console.log("No data available at route:", route);
      return null; // Retourne null si aucune donnée n'existe à cette route
    }
  } catch (error) {
    console.error("Error getting data:", error);
    throw error; // Relance l'erreur pour être gérée par l'appelant
  }
};

/**
 * Fonction pour récupérer des données spécifiques dans la Firebase Realtime Database en utilisant un chemin et un ID.
 * @param route - La route de base où les données doivent être récupérées
 * @param id - L'ID de l'élément à récupérer
 * @returns Une promesse résolue avec les données récupérées ou une erreur en cas d'échec
 */
export const getDataById = async (route: string, id: string): Promise<any> => {
  try {
    const dataRef = ref(database, `${route}/${id}`);
    const snapshot = await get(dataRef); // Récupère les données à partir de la base de données
    if (snapshot.exists()) {
      // console.log("Data retrieved successfully:", snapshot.val());
      return snapshot.val(); // Retourne les données si elles existent
    } else {
      console.log(`No data available at route: ${route}/${id}`);
      return null; // Retourne null si aucune donnée n'existe à cette route
    }
  } catch (error) {
    console.error("Error getting data:", error);
    throw error; // Relance l'erreur pour être gérée par l'appelant
  }
};
