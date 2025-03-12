import * as React from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  PieChart,
  SquareTerminal,
  Users,
} from "lucide-react";

import { NavMain } from "../components/nav-main"
import { NavUser } from "../components/nav-user";
import { TeamSwitcher } from "../components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "../components/ui/sidebar";
import { useState } from "react";
import { useEffect } from "react";

export function AppSidebar({ ...props }) {
  const [userLogged, setUserLogged] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserLogged(user);
  }, []);

  const hasAccess = (permittedAreas, area) => {
    return permittedAreas?.includes(area);
  };

  const data = {
    user: {
      // id: userLogged._id,
      name: "Usuário",
      email: "email.exemplo@teste.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "reservation-system",
        logo: GalleryVerticalEnd,
        plan: "Sistema de reservas",
      },
    ],
    salas: [
      {
        title: "Gestão de Salas",
        url: "salas",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "Cadastro de sala",
            url: "/sala-cadastro",
          },
          {
            title: "Salas cadastradas",
            url: "/gestao-salas",
          },
          // {
          //   title: "Edição de sala",
          //   url: "/sala-edicao",
          // },
        ],
      },
    ],
    equipamentos: [
      {
        title: "Gestão de Equipamentos",
        url: "#",
        icon: Users,
        items: [
          {
            title: "Cadastro de equipamento",
            url: "/equipamento-cadastro",
          },
          {
            title: "Edição de equipamento",
            url: "/equipamento-edicao",
          },
        ],
      },
    ],
    reservas: [
      {
        title: "Reservas",
        url: "/reservas",
        icon: PieChart,
        items: [
          {
            title: "Gestão de Reservas",
            url: "/reservas",
          },
        ],
      },
    ],
    historico: [
      {
        title: "Histórico",
        url: "/historico",
        icon: AudioWaveform,
        items: [
          {
            title: "Histórico de Reservas",
            url: "/historico-reservas",
          },
        ],
      },
    ]
  };
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
          <>
            <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
            <NavMain items={data.salas} />
            <NavMain items={data.equipamentos} />
            <NavMain items={data.reservas} />
            <NavMain items={data.historico} />
          </>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
