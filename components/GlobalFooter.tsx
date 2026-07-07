// Figma: node 1:926 "cm_footer" — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=1-926
// Color tokens: tokens/footer.json (component.globalFooter.*), resolved through tokens/light.json and tokens/global.json.
// Typography: src/typography.css .type-body-regular, generated from tokens/light.json's alias.typography.*
// (matches this design's "Body/Regular" text style — regular weight, font/size/xs, font/line-height/xs).
// Responsive behavior: two named variants, Desktop (node 1:927) and Tablet-Mobile (node 1:933) — same
// breakpoint split as GlobalHeader (tablet 600-959 stacked column, desktop 960+ single row with the
// copyright right-aligned), reusing the `desktop:` breakpoint registered in src/index.css. Figma's desktop
// frame also encodes a secondary "wrap to two rows if the window narrows" affordance internal to that
// variant (flex-1 halves + gap-y), but that's redundant with the dedicated Tablet-Mobile variant already
// covering everything below 960px, so it's collapsed into the same single breakpoint switch GlobalHeader
// uses rather than reimplemented.
// Links (cm_link, node 1:793): plain text links, underline on hover per that component's usage notes —
// no icon overrides are present on any of the three instances actually used here, so no icon slot is built.

export interface GlobalFooterLink {
  id: string;
  label: string;
  href: string;
  target?: string;
}

export interface GlobalFooterProps {
  links?: GlobalFooterLink[];
  copyrightText?: string;
  className?: string;
}

const DEFAULT_FOOTER_LINKS: GlobalFooterLink[] = [
  { id: "version", label: "v1.133.0", href: "#" },
  { id: "api-reference", label: "API Reference", href: "#" },
  { id: "feedback", label: "Provide Feedback", href: "#" },
];

function FooterLink({ label, href, target }: GlobalFooterLink) {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className="type-body-regular text-[color:var(--component-globalfooter-link-default,#0174BC)] hover:text-[color:var(--component-globalfooter-link-hover,#009CDE)] hover:underline"
    >
      {label}
    </a>
  );
}

export default function GlobalFooter({ links = DEFAULT_FOOTER_LINKS, copyrightText, className }: GlobalFooterProps) {
  const copyright = copyrightText ?? `© ${new Date().getFullYear()} Akamai Technologies, Inc. All Rights Reserved`;

  return (
    <footer
      className={
        className ??
        "flex w-full flex-col items-start gap-[var(--global-spacing-s16,16px)] border-t border-solid bg-[var(--component-globalfooter-background,#F7F7FA)] border-[var(--component-globalfooter-border,#D6D6DD)] px-[var(--global-spacing-s16,16px)] py-[var(--global-spacing-s12,12px)] desktop:flex-row desktop:items-center desktop:justify-between"
      }
    >
      <div className="flex flex-wrap items-center gap-x-[var(--global-spacing-s24,24px)] gap-y-[var(--global-spacing-s8,8px)]">
        {links.map((link) => (
          <FooterLink key={link.id} {...link} />
        ))}
      </div>
      <p className="type-body-regular m-0 w-full text-[color:var(--component-globalfooter-text,#343438)] desktop:w-auto desktop:text-right">
        {copyright}
      </p>
    </footer>
  );
}
