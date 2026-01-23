"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Signin = () => {
  const [data, setData] = useState({
    id: "",
    password: "",
  });
  const [error, setError] = useState(""); // Para manejar errores de inicio de sesión

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cedula: data.id,
          password: data.password,
        }),
      });

      if (response.ok) {
        // Login exitoso, redirigir al panel de administración
        window.location.href = "/admin";
      } else if (response.status === 401) {
        // Credenciales incorrectas
        setError("Cédula o contraseña incorrectas");
      } else {
        // Otro error
        setError("Hubo un problema con el inicio de sesión. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setError("Error al intentar iniciar sesión. Intenta nuevamente.");
    }
  };

  return (
    <section className="overflow-hidden pt-60 pb-20">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0 pb-5">
        <div className="flex lg:items-center xl:gap-10">
          <div className="animate_right hidden md:w-1/2 lg:block">
            <div className="relative 2xl:-mr-7.5">
              <Image src="/images/shape/shape-01.png" alt="shape" width={46} height={246} className="absolute -left-11.5 top-0" />
              <Image src="/images/shape/shape-02.svg" alt="shape" width={36.9} height={36.7} className="absolute bottom-0 right-0 z-10" />
              <Image src="/images/shape/shape-03.svg" alt="shape" width={21.64} height={21.66} className="absolute -right-6.5 bottom-0 z-1" />
              <div className="relative aspect-[700/444] w-full">
                <Image className="shadow-solid-l dark:hidden" src="/images/hero/hero-light.svg" alt="Hero" fill />
                <Image className="hidden shadow-solid-l dark:block" src="/images/hero/hero-dark.svg" alt="Hero" fill />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="rounded-lg bg-white px-7.5 pt-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-10"
            >
              <h2 className="mb-5 text-center text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
                Ingresar a tu Cuenta
              </h2>
              <div className="mb-5 flex items-center justify-center">
                <span className="hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
                <p className="text-body-color dark:text-body-color-dark w-full px-5 text-center text-base">
                  Con tus credenciales FOBESO
                </p>
                <span className="hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-7.5 mx-30 lg:mb-5 xl:mb-10">
                  <input
                    type="text"
                    placeholder="Cédula"
                    name="id"
                    value={data.id}
                    onChange={(e) => setData({ ...data, id: e.target.value })}
                    className="w-full border-b border-stroke !bg-white focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:!bg-black dark:focus:border-manatee dark:focus:placeholder:text-white"
                  />

                  <input
                    type="password"
                    placeholder="Contraseña"
                    name="password"
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    className="w-full border-b border-stroke !bg-white focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:!bg-black dark:focus:border-manatee dark:focus:placeholder:text-white"
                  />
                </div>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <div className="flex justify-center mt-2 mx-20 gap-6">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 mb-10 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-primary dark:bg-opacity-75 dark:hover:bg-blackho"
                  >
                    Iniciar Sesión
                    <svg
                      className="fill-white"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                        fill=""
                      />
                    </svg>
                  </button>
                  <Link href='/'>
                    <button
                      className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 mb-10 font-medium text-white duration-300 ease-in-out border border-white"
                    >
                      Cancelar
                    </button>
                  </Link>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
