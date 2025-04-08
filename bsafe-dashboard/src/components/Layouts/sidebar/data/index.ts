import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MENU",
    items: [
      {
        title: "Inicio",
        icon: Icons.HomeIcon,
        url: "/",
        items: [],
      },
      {
        title: "Proveedores",
        url: "/proveedores",
        icon: Icons.Table,
        items: [],
      },
      {
        title: "Usuarios",
        url: "/usuarios",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Clientes",
        url: "/clientes",
        icon: Icons.PieChart,
        items: [],
      },
      {
        title: "Productos",
        url: "/productos",
        icon: Icons.FourCircle,
        items: [],
      },
      {
        title: "Settings",
        icon: Icons.SettingsIcon,
        url: "/pages/settings",
        items: [],
      },
    ],
  },
  {
    label: "OTROS",
    items: [
      {
        title: "Authentication",
        icon: Icons.Authentication,
        url: "/auth/sign-in",
        items: [],
      },
    ],
  },
];
