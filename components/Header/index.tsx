import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);

  const pathUrl = usePathname();

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  const closeNavigation = () => {
    setNavigationOpen(false);
  };

  const filteredMenuData = menuData.filter((menuItem) => {
    if (pathUrl.startsWith("/admin")) {
      return !menuItem.public;
    } else if (pathUrl === "/auth/signin") {
      return false;
    } else {
      return menuItem.public;
    }
  });

  const linkHref = pathUrl.startsWith('/admin') ? '/admin' : '/';

  return (
    <header
      className={`fixed bg-blacksection dark:bg-black left-0 top-0 z-40 w-full py-5 ${stickyMenu ? "bg-blacksection !py-5 shadow transition duration-100 dark:bg-black" : ""}`}
    >
      <div className="w-full mx-auto flex gap-4 items-center justify-between max-w-c-1390 px-4 md:px-8 xl:flex 2xl:px-0">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href={linkHref}>
            <Image
              src="/images/logo/logo-blanco.png"
              alt="logo"
              width={80}
              height={100}
              className="cursor-pointer"
            />
          </Link>
        </div>

        {/* Título */}
        <div className="items-center text-center lg:hidden xl:block">
          <h1 className={`text-mg text-center px-10 w-auto font-bold text-gray-200 mx-auto lg:mx-0 sm:px-4 xs:px-4`}>
            <Link href={linkHref}>Sitio Web de Convenios FBS UNA-SITUN</Link>
          </h1>
        </div>


        {/* Menú Hamburguesa */}
        {pathUrl !== "/auth/signin" && (
          <button
            aria-label="hamburger Toggler"
            className="block lg:hidden"
            onClick={() => setNavigationOpen(!navigationOpen)}
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="absolute right-0 block h-full w-full">
                <span className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-white dark:bg-white ${!navigationOpen ? "!w-full delay-300" : "w-0"}`}></span>
                <span className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-white dark:bg-white ${!navigationOpen ? "delay-400 !w-full" : "w-0"}`}></span>
                <span className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-white dark:bg-white ${!navigationOpen ? "!w-full delay-500" : "w-0"}`}></span>
              </span>
              <span className="du-block absolute right-0 h-full w-full rotate-45">
                <span className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-white dark:bg-white ${!navigationOpen ? "!h-0" : "h-full"}`}></span>
                <span className={`absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-white dark:bg-white ${!navigationOpen ? "!h-0" : "h-0.5"}`}></span>
              </span>
            </span>
          </button>
        )}

        {pathUrl !== "/auth/signin" && (
          <div
            className={`absolute w-full top-full justify-around items-center left-0 right-0 lg:static lg:flex lg:w-full ${navigationOpen ? "navbar visible bg-blacksection p-7.5 shadow-solid-5 dark:bg-black" : "hidden"
              } transition-all duration-300 ease-in-out`}
          >
            <nav className="flex flex-col text-center lg:flex-row items-center justify-evenly overflow-hidden whitespace-normal gap-4 mb-4">
              {filteredMenuData.map((menuItem, key) => (
                <ul key={key} className="hover:text-primary lg:min-w-[100px] lg:max-w-[100px] text-white dark:text-white">
                  <Link
                    href={menuItem.path || "#"}
                    className={`hover:text-primary text-center ${pathUrl === menuItem.path ? "text-primary" : ""} ${navigationOpen ? "text-black dark:text-white" : "text-white dark:text-white"}`}
                    onClick={closeNavigation}
                    style={{ width: "100px", whiteSpace: "normal" }} // Agrega ancho y permite salto de línea
                  >
                    {menuItem.title}
                  </Link>
                </ul>
              ))}
            </nav>
            {/* Botón de Iniciar Sesión y Theme Toggler alineados a la derecha */}
            <div className="flex justify-center gap-5">
              <ThemeToggler />
              <Link
                href={pathUrl.startsWith('/admin') ? '/' : '/auth/signin'}
                className={`rounded-full border border-primary px-5 py-2.5 text-center
                 hover:bg-primary ${navigationOpen ? "text-black dark:text-white" : "text-white dark:text-white"}`}
                onClick={() => pathUrl.startsWith('/admin') ? console.log('Cerrar sesión') : closeNavigation()}
              >
                {pathUrl.startsWith('/admin') ? 'Cerrar Sesión' : 'Iniciar Sesión'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header >
  );
};

export default Header;
