import Signin from "@/components/Auth/Signin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio de Sesión Módulo Administrador",
  description: "Esta es la página de inicio de sesión para personas administradoras de la página web de convenios del Fondo de Beneficio Social",
  // other metadata
};

const SigninPage = () => {
  return (
    <>
      <Signin />
    </>
  );
};

export default SigninPage;
