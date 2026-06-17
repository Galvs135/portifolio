import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Sensible defaults for the whole site.
gsap.defaults({
  ease: "expo.out",
  duration: 1,
});

export { gsap, ScrollTrigger };
