export type SocialIconName = "github" | "linkedin" | "email" | "whatsapp";

export interface Social {
  label: string;
  handle: string;
  href: string;
  icon: SocialIconName;
}

export const EMAIL = "lg_franca@hotmail.com";
export const PHONE_DISPLAY = "+55 31 98431-3766";
const PHONE_E164 = "5531984313766";

export const socials: Social[] = [
  {
    label: "GitHub",
    handle: "@galvs135",
    href: "https://github.com/galvs135",
    icon: "github",
  },
  {
    label: "LinkedIn",
    handle: "in/lucas-g-franca",
    href: "https://www.linkedin.com/in/lucas-g-franca",
    icon: "linkedin",
  },
  {
    label: "Email",
    handle: EMAIL,
    href: `mailto:${EMAIL}`,
    icon: "email",
  },
  {
    label: "WhatsApp",
    handle: PHONE_DISPLAY,
    href: `https://wa.me/${PHONE_E164}`,
    icon: "whatsapp",
  },
];
