import AnimatedText from "../../components/ui/AnimatedText";
import MagneticButton from "../../components/ui/MagneticButton";
import SocialIcon from "../../components/ui/SocialIcon";
import Parallax from "../../components/ui/Parallax";
import { useTransition } from "../../components/Fullpage/Fullpage";
import { useT } from "../../i18n/LanguageContext";
import { EMAIL, socials } from "../../data/socials";
import styles from "./Contact.module.css";

export default function Contact() {
  const { navigate } = useTransition();
  const { t } = useT();

  return (
    <footer className={styles.contact}>
      <div className="container">
        <header data-vstep className={styles.head}>
          <span className="eyebrow">{t("(Contact)", "(Contato)")}</span>
          <span className={styles.headIndex}>05 — 05</span>
        </header>

        <Parallax speed={7}>
          <AnimatedText
            as="h2"
            className={styles.title}
            text={t(
              "Let's build something worth shipping.",
              "Vamos construir algo que valha a pena entregar."
            )}
            stagger={0.04}
          />
        </Parallax>

        <div className={styles.cta}>
          <MagneticButton
            href={`mailto:${EMAIL}`}
            className={styles.email}
            strength={0.3}
          >
            {EMAIL}
          </MagneticButton>
          <p className={styles.ctaNote}>
            {t(
              "Available for freelance, contract and full-time roles — remote worldwide.",
              "Disponível para freelance, contrato e vagas full-time — remoto no mundo todo."
            )}
          </p>
        </div>

        <div data-vstep className={styles.socials}>
          {socials.map((s) => {
            const external = s.href.startsWith("http");
            return (
              <MagneticButton
                key={s.label}
                href={s.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className={styles.social}
                aria-label={s.label}
                strength={0.4}
              >
                <SocialIcon name={s.icon} />
              </MagneticButton>
            );
          })}
        </div>

        <div className={styles.footer}>
          <span>© {new Date().getFullYear()} Lucas Galvão França</span>
          <span className={styles.built}>
            {t("Built with", "Feito com")} React, Three.js &amp; GSAP
          </span>
          <button
            type="button"
            className={styles.top}
            data-cursor="hover"
            onClick={() => navigate("#hero")}
          >
            {t("Back to top ↑", "Voltar ao topo ↑")}
          </button>
        </div>
      </div>
    </footer>
  );
}
