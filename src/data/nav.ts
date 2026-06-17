export interface NavItem {
  label: string;
  target: string;
  index: string;
}

export const navItems: NavItem[] = [
  { label: "Home", target: "#hero", index: "01" },
  { label: "About", target: "#about", index: "02" },
  { label: "Work", target: "#work", index: "03" },
  { label: "Skills", target: "#skills", index: "04" },
  { label: "Contact", target: "#contact", index: "05" },
];
