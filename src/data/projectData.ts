import type { Project } from "../types/projectup";

export const projectData: Project[] = [
  {
    id: 1,
    generation: "1기",

    title: "구석방 홈페이지",
    subtitle: "React + Spring Boot",

    description: "동아리 홈페이지 제작",

    logo: "/logo.png",
    banner: "/banner.png",

    members: [
      {
        role: "Frontend",
        name: "짱구",
      },
      {
        role: "Backend",
        name: "김철수",
      },
    ],
  },

  {
    id: 2,
    generation: "2기",

    title: "출석 시스템",
    subtitle: "QR 출석",

    description: "QR을 이용한 출석 관리",

    logo: "/logo.png",
    banner: "/banner.png",

    members: [
      {
        role: "Frontend",
        name: "피카츄",
      },
    ],
  },

  {
    id: 3,
    generation: "3기",

    title: "동아리 관리",

    subtitle: "관리 시스템",

    description: "회원관리 프로젝트",

    logo: "/logo.png",
    banner: "/banner.png",

    members: [],
  },
];