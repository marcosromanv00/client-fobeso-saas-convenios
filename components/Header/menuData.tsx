import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  /*
  {
    id: 1,
    title: "Información",
    newTab: false,
    path: "/#info",
    public: true,
  },
*/
  {
    id: 2,
    title: "Convenios",
    newTab: false,
    path: "/convenios",
    public: true,
  },
  {
    id: 7,
    title: "Convenios",
    newTab: false,
    path: "/admin/convenios", // Ruta de Convenios en admin
    public: false,
  },
  {
    id: 3,
    title: "Ofertas Flash",
    newTab: false,
    path: "/flash",
    public: true,
  },
  {
    id: 6,
    title: "Ofertas Flash",
    newTab: false,
    path: "/admin/flash", // Ruta de Cupones en admin
    public: false,
  },
  {
    id: 5,
    title: "Panel",
    newTab: false,
    path: "/admin/dashboard",
    public: false,
  },
  {
    id: 8,
    title: "Ajustes",
    newTab: false,
    path: "/admin/settings", // Ruta de Configuraciones en admin
    public: false,
  },
  {
    id: 9,
    title: "Nuevos Convenios",
    newTab: false,
    path: "/#convenios-recientes", // Ruta de Usuarios en admin
    public: true,
  },
  {
    id: 10,
    title: "Nuevas Ofertas",
    newTab: false,
    path: "/#flash", // Ruta de Estadísticas en admin
    public: true,
  },
  {
    id: 11,
    title: "Preguntas Frecuentes",
    newTab: false,
    path: "/#faq",
    public: true,
  } /*
  {
    id: 12,
    title: "Contacto",
    newTab: false,
    path: "/#contact",
    public: true,
  },*/,
];

export default menuData;
