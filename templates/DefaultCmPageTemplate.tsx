import { useEffect, useState, type ReactNode } from "react";
import GlobalHeader, { type GlobalHeaderProps } from "../components/GlobalHeader";
import SideNavigation, { type SideNavigationProps } from "../components/SideNavigation";
import GlobalFooter, { type GlobalFooterProps } from "../components/GlobalFooter";

// Figma: node 17:5086 "cm_page" — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=17-5086
// Composes GlobalHeader + SideNavigation + GlobalFooter into the base page shell every Figma Make
// prototype gets built inside. The frame's "Grid" layer (a 12-col column guide) is a design-time
// annotation the component's own Figma description says to hide before use — it isn't real layout
// and isn't reproduced here.
//
// Scroll model: the page scrolls as a single document — there's no independent scrollable content
// pane. The header scrolls away with the page (plain flow, not fixed/sticky). SideNavigation is the
// only fixed element: its wrapper is `position: sticky; top: 0; bottom: 0`, and its height tracks how
// much of the header is currently visible (`100vh` minus whatever of the header's 56px hasn't
// scrolled past yet). That tracking is the one bit of scroll-listener JS this template needs — a
// static height can't express it. A flat `100vh - 56px` would leave the rail permanently 56px short
// once the header has scrolled away for good (it isn't sticky), pushing controls anchored to the
// rail's bottom — like SideNavigation's pin button — below the fold until the user scrolls; a flat
// `100vh` instead overflows by 56px while the rail still sits in normal flow below the header (i.e.
// before scrolling starts), with the same effect. Shrinking the height as the header scrolls out of
// view keeps the rail's bottom edge (and the pin button on it) flush with the viewport at all times,
// from the very first paint. `top: 0` and `bottom: 0` together handle the rest of the scroll range:
// `top: 0` keeps the rail pinned while scrolling; without `bottom: 0`, the browser would release the
// sticky box entirely once it neared the bottom of its row (it can't honor top:0 without overflowing
// the container), leaving a gap above the footer — `bottom: 0` makes it switch to bottom-stuck
// instead, so the rail's dark background stays flush against the footer with no gap, right up to the
// very end of the page. The content column is `flex-1` inside a `min-h-screen` shell, so GlobalFooter
// lands at the viewport bottom on short pages and simply follows the content on long ones (the
// standard CSS "sticky footer" layout trick).
//
// Responsive: below 960px, Figma's cm_page frame (Tablet S / Mobile XS size variants) shows
// SideNavigation hidden entirely — no drawer/overlay state exists anywhere in the file — so it's
// hidden here via the same `desktop:` breakpoint GlobalHeader/GlobalFooter already register. No
// mobile nav drawer is built as part of this template.

const HEADER_HEIGHT_PX = 56;

export interface DefaultCmPageTemplateProps {
  children: ReactNode;
  headerProps?: Omit<GlobalHeaderProps, "className">;
  sideNavProps?: Omit<SideNavigationProps, "className">;
  footerProps?: Omit<GlobalFooterProps, "className">;
  className?: string;
}

export default function DefaultCmPageTemplate({
  children,
  headerProps,
  sideNavProps,
  footerProps,
  className,
}: DefaultCmPageTemplateProps) {
  const [navHeight, setNavHeight] = useState(`calc(100vh - ${HEADER_HEIGHT_PX}px)`);

  useEffect(() => {
    function updateNavHeight() {
      const visibleHeaderHeight = Math.max(0, HEADER_HEIGHT_PX - window.scrollY);
      setNavHeight(`${window.innerHeight - visibleHeaderHeight}px`);
    }
    updateNavHeight();
    window.addEventListener("scroll", updateNavHeight, { passive: true });
    window.addEventListener("resize", updateNavHeight);
    return () => {
      window.removeEventListener("scroll", updateNavHeight);
      window.removeEventListener("resize", updateNavHeight);
    };
  }, []);

  return (
    <div className={className ?? "flex min-h-screen w-full flex-col"}>
      <GlobalHeader {...headerProps} />
      <div className="flex flex-1">
        <div
          className="hidden shrink-0 desktop:block"
          style={{ position: "sticky", top: 0, bottom: 0, height: navHeight }}
        >
          <SideNavigation {...sideNavProps} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Figma: node 17:5103 "Page Content & Paddings" — content slot */}
          <main className="flex flex-1 justify-center">
            <div className="w-full max-w-[1280px] px-[var(--global-spacing-s16,16px)] pt-[var(--global-spacing-s24,24px)] pb-[var(--global-spacing-s32,32px)]">
              {children}
            </div>
          </main>
          <GlobalFooter {...footerProps} />
        </div>
      </div>
    </div>
  );
}
