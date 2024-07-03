import Footer from "@/components/tailwindUi/footer/Footer";
import ConnexionForm from "@/components/tailwindUi/form/Connexion";
import Header from "@/components/tailwindUi/header/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col mt-20 justify-between ">
        <ConnexionForm title="Connectez-vous à votre espace administrateur" />
      </main>
      <Footer />
    </>
  );
}
