// Figma: Tooltip, node 149:6624 — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=149-6624
// Variant set "Property 1" = Top/Bottom/Left/Right/None: a dark 2px-radius bubble (6px padding, Label/Semibold XS
// white text) with a 24x4 arrow on one side. Figma names each swatch after the side the ARROW is on (its "Top"
// swatch has the arrow above the bubble, i.e. the tooltip sits BELOW the trigger); `placement` here is the
// conventional meaning (where the tooltip sits relative to its trigger, same as CDS's `cds-tooltip`), so
// placement="top" renders Figma's "Bottom" swatch and placement="bottom" renders Figma's "Top" swatch.
// Figma's "None" swatch (no arrow) is the `arrow={false}` prop.
// Figma only shows the static bubble. Behavior is ported from CDS's `cds-tooltip` (Lit): wraps its trigger, shows
// on hover and keyboard focus, Esc dismisses, flips to a side that fits the viewport, 250ms fade. Not ported:
// CDS's show-only-on-overflow mode and its elevation shadow (Figma shows none).

import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { TooltipArrowIcon } from "./icons";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** Tooltip text. Keep it short; a bubble wraps at 240px. */
  content: ReactNode;
  /** Side of the trigger the tooltip sits on. Flips to a side that fits if there isn't room. */
  placement?: TooltipPlacement;
  /** Show the arrow pointing at the trigger. Figma's "None" swatch is `arrow={false}`. */
  arrow?: boolean;
  /** Never show the tooltip. */
  disabled?: boolean;
  /** The trigger. Wrapped in an `inline-flex` span that listens for hover and focus. */
  children: ReactNode;
  /** Applied to the wrapping span. */
  className?: string;
}

const FADE_MS = 250;
const VIEWPORT_MARGIN = 4;
const ARROW_HEIGHT = 4;
// Distance from the trigger to the bubble's edge: the arrow tip lands 4px from the trigger (CDS's `ARROW_SIZE * 2`).
const BUBBLE_GAP = 8;
// The arrow's visible triangle is 8px wide (x 8-16 of the 24px box); keep it at least this far inside the bubble.
const ARROW_INSET = 8;

const OPPOSITE: Record<TooltipPlacement, TooltipPlacement> = { top: "bottom", bottom: "top", left: "right", right: "left" };

interface Layout {
  x: number;
  y: number;
  placement: TooltipPlacement;
  /** Slide of the arrow along the cross axis, so it still points at the trigger when the bubble is clamped. */
  arrowShift: number;
}

function computeLayout(anchor: DOMRect, w: number, h: number, preferred: TooltipPlacement, arrow: boolean): Layout {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // `w`/`h` are the whole tooltip (bubble + arrow), so its edge sits 4px from the trigger with an arrow, 8px without.
  const gap = arrow ? BUBBLE_GAP - ARROW_HEIGHT : BUBBLE_GAP;
  const fits: Record<TooltipPlacement, boolean> = {
    top: anchor.top >= h + gap + VIEWPORT_MARGIN,
    bottom: vh - anchor.bottom >= h + gap + VIEWPORT_MARGIN,
    left: anchor.left >= w + gap + VIEWPORT_MARGIN,
    right: vw - anchor.right >= w + gap + VIEWPORT_MARGIN,
  };
  const candidates: TooltipPlacement[] =
    preferred === "top" || preferred === "bottom"
      ? [preferred, OPPOSITE[preferred], "right", "left"]
      : [preferred, OPPOSITE[preferred], "bottom", "top"];
  const placement = candidates.find((p) => fits[p]) ?? preferred;

  const centerX = anchor.left + anchor.width / 2;
  const centerY = anchor.top + anchor.height / 2;
  let x: number;
  let y: number;
  let arrowShift: number;
  if (placement === "top" || placement === "bottom") {
    y = placement === "top" ? anchor.top - h - gap : anchor.bottom + gap;
    const unclamped = centerX - w / 2;
    x = Math.max(VIEWPORT_MARGIN, Math.min(unclamped, vw - w - VIEWPORT_MARGIN));
    const maxSlide = Math.max(0, w / 2 - ARROW_INSET);
    arrowShift = Math.max(-maxSlide, Math.min(centerX - (x + w / 2), maxSlide));
  } else {
    x = placement === "left" ? anchor.left - w - gap : anchor.right + gap;
    const unclamped = centerY - h / 2;
    y = Math.max(VIEWPORT_MARGIN, Math.min(unclamped, vh - h - VIEWPORT_MARGIN));
    const maxSlide = Math.max(0, h / 2 - ARROW_INSET);
    arrowShift = Math.max(-maxSlide, Math.min(centerY - (y + h / 2), maxSlide));
  }
  return { x, y, placement, arrowShift };
}

// One fully-spelled-out literal per placement — Tailwind's scanner can't see interpolated class names.
const ROOT_CLASSES: Record<TooltipPlacement, string> = {
  top: "flex-col",
  bottom: "flex-col-reverse",
  left: "flex-row",
  right: "flex-row-reverse",
};

// Arrow rotation per placement (the asset points up): the arrow sits on the bubble's side facing the trigger.
const ARROW_ROTATION: Record<TooltipPlacement, string> = {
  top: "rotate-180",
  bottom: "",
  left: "rotate-90",
  right: "-rotate-90",
};

export default function Tooltip({ content, placement = "top", arrow = true, disabled = false, children, className }: TooltipProps) {
  const id = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [layout, setLayout] = useState<Layout | null>(null);

  const hasContent = content !== null && content !== undefined && content !== false && content !== "";
  const open = (hovered || focused) && !disabled && hasContent;

  // Keep the tooltip in the DOM through the fade-out, then unmount it.
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    setEntered(false);
    const t = window.setTimeout(() => {
      setMounted(false);
      setLayout(null);
    }, FADE_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  // Measure the real bubble, then place it; re-place on scroll/resize while open.
  useLayoutEffect(() => {
    if (!open || !mounted) return;
    function update() {
      const anchor = anchorRef.current;
      const tip = tipRef.current;
      if (!anchor || !tip) return;
      setLayout(computeLayout(anchor.getBoundingClientRect(), tip.offsetWidth, tip.offsetHeight, placement, arrow));
    }
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, mounted, placement, arrow, content]);

  // Start the fade-in one frame after the tooltip is positioned, so the opacity transition actually runs.
  useEffect(() => {
    if (!open || !layout) return;
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [open, layout]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setHovered(false);
        setFocused(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Describe the trigger itself (not the wrapper span, which never takes focus) while the tooltip is shown.
  useEffect(() => {
    const trigger = anchorRef.current?.firstElementChild;
    if (!open || !trigger) return;
    const previous = trigger.getAttribute("aria-describedby");
    trigger.setAttribute("aria-describedby", previous ? `${previous} ${id}` : id);
    return () => {
      if (previous) trigger.setAttribute("aria-describedby", previous);
      else trigger.removeAttribute("aria-describedby");
    };
  }, [open, id]);

  const actual = layout?.placement ?? placement;
  const vertical = actual === "left" || actual === "right";
  const shift = layout?.arrowShift ?? 0;

  return (
    <span
      ref={anchorRef}
      className={["inline-flex", className].filter(Boolean).join(" ")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => {
        // Keyboard focus only: a mouse click already shows it through hover.
        if (e.target.matches(":focus-visible")) setFocused(true);
      }}
      onBlur={() => setFocused(false)}
    >
      {children}
      {mounted &&
        createPortal(
          <div
            ref={tipRef}
            id={id}
            role="tooltip"
            style={{
              position: "fixed",
              left: layout?.x ?? 0,
              top: layout?.y ?? 0,
              // Hidden for the one layout pass that measures it at its natural size.
              visibility: layout ? "visible" : "hidden",
            }}
            className={`pointer-events-none z-[1200] flex w-max items-center transition-opacity duration-[250ms] ease-in-out ${ROOT_CLASSES[actual]} ${open && entered ? "opacity-100" : "opacity-0"}`}
          >
            <div className="type-label-semibold-xs max-w-[240px] rounded-[2px] bg-[var(--component-tooltip-background,#343438)] p-[6px] text-[color:var(--component-tooltip-text,#FFFFFF)] [overflow-wrap:break-word]">
              {content}
            </div>
            {arrow && (
              <div
                className={`flex shrink-0 items-center justify-center text-[color:var(--component-tooltip-background,#343438)] ${vertical ? "h-[24px] w-[4px]" : "h-[4px] w-[24px]"}`}
                style={{ transform: vertical ? `translateY(${shift}px)` : `translateX(${shift}px)` }}
              >
                <TooltipArrowIcon className={`flex-none ${ARROW_ROTATION[actual]}`} aria-hidden="true" />
              </div>
            )}
          </div>,
          document.body,
        )}
    </span>
  );
}
