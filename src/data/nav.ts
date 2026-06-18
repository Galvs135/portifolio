export interface NavItem {
  label: { en: string; pt: string };
  target: string;
  index: string;
}

export const navItems: NavItem[] = [
  { label: { en: "Home", pt: "Início" }, target: "#hero", index: "01" },
  { label: { en: "About", pt: "Sobre" }, target: "#about", index: "02" },
  { label: { en: "Work", pt: "Trabalhos" }, target: "#work", index: "03" },
  { label: { en: "Skills", pt: "Skills" }, target: "#skills", index: "04" },
  { label: { en: "Contact", pt: "Contato" }, target: "#contact", index: "05" },
];
