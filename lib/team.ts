export type TeamMember = {
  name: string;
  alias?: string;
  role: string;
  initials: string;
  photo?: string;
  photoClass: string;
  photoWidth: number;
  photoHeight: number;
  note: string;
  description: string;
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Kaung Zaw Hein",
    role: "Project Manager & Backend",
    initials: "KZ",
    photo: "/images/kaung.png",
    photoClass: "kaung",
    photoWidth: 810,
    photoHeight: 1080,
    note: "Keeping us on track",
    description:
      "Connecting the big picture with all the little details that make the fair run smoothly.",
  },
  {
    name: "Shun Lak Thaw Tar",
    role: "Project Manager & Backend",
    initials: "SL",
    photo: "/images/Shun Lak Thaw Tar.jpg",
    photoClass: "shun",
    photoWidth: 959,
    photoHeight: 1280,
    note: "Making it all click",
    description:
      "Turning ideas into a plan, and that plan into the logic behind your Fun Fair experience.",
  },
  {
    name: "Aung Myint Myat",
    alias: "Joseph",
    role: "Backend",
    initials: "AM",
    photo: "/images/Joseph.jpg",
    photoClass: "joseph",
    photoWidth: 335,
    photoHeight: 722,
    note: "Behind the scenes",
    description:
      "Joining the dots between your clicks, your orders, and the information that keeps everything moving.",
  },
  {
    name: "No Ko",
    role: "Backend",
    initials: "NK",
    photo: "/images/Noko.jpg",
    photoClass: "noko",
    photoWidth: 962,
    photoHeight: 1280,
    note: "Details matter",
    description:
      "Looking after the foundations, so the fun on the surface has something solid underneath.",
  },
  {
    name: "Linn Khant Kyaw",
    role: "Frontend",
    initials: "LK",
    photo: "/images/Linn Khant Kyaw.jpg",
    photoClass: "linn",
    photoWidth: 961,
    photoHeight: 1280,
    note: "From idea to screen",
    description:
      "Giving the fair its digital face, one thoughtful layout and finishing touch at a time.",
  },
  {
    name: "Thant Sin Aung",
    alias: "Eddie",
    role: "Frontend & AWS DevOps",
    initials: "TS",
    photo: "/images/eddie.jpg",
    photoClass: "eddie",
    photoWidth: 720,
    photoHeight: 1280,
    note: "A little extra personality",
    description:
      "Bringing the pages to life with playful details and interactions that feel good to use.",
  },
];
