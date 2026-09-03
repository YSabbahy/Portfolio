import { useReveal } from "../hooks/useReveal";

/**
 * Thin wrapper that reproduces the original `<div class="reveal">` fade/slide
 * in-on-scroll pattern used throughout the page.
 */
export default function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const { ref, isVisible } = useReveal();
  const classes = ["reveal", isVisible ? "is-visible" : "", className].filter(Boolean).join(" ");
  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
}
