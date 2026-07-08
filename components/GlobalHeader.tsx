import type { ReactNode } from "react";
import Button from "./Button";
import { BellIcon, ChevronDownIcon, CommunityIcon, HelpCircleIcon, MenuIcon, PlusIcon, SearchIcon } from "./icons";

// Figma: node 1:882 "cm_header" — https://www.figma.com/design/BP7Y1Gc9sz2HLrcXFHMFhg/Internal-ADS-library?node-id=1-882
// Color/spacing tokens: tokens/header.json (component.globalHeader.*), resolved through tokens/light.json and tokens/global.json.
// Typography: src/typography.css, generated from tokens/light.json's alias.typography.* (see .type-* classes below).
// Responsive behavior: node 7:183 "Header & Footer for Mobile-Tablet-Desktop" — mobile 320-599, tablet
// 600-959, desktop 960+ (breakpoints registered in src/index.css). This used to be a manually-selected
// `type` prop; it's real CSS media queries now, since the Figma spec defines it as width breakpoints,
// not three discrete states a parent picks between. isAuthenticated/showSearch are inferred content
// props (the frame only shows a signed-in, search-enabled state).

export interface GlobalHeaderUser {
  name: string;
  avatarInitial: string;
}

export interface GlobalHeaderProps {
  isAuthenticated?: boolean;
  user?: GlobalHeaderUser;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  onCreateClick?: () => void;
  onSignInClick?: () => void;
  onMenuClick?: () => void;
  notificationCount?: number;
  logo?: ReactNode;
  className?: string;
}

function DefaultLogo() {
  // Figma node 1:885 "Logo" — hand-drawn vector artwork (icon mark + wordmark), not a font.
  // Rendering it as styled text (as an earlier version of this file did) is what made
  // typography look wrong next to Figma: this mark was never driven by any type token.
  return (
    <svg
      viewBox="0 0 84 34"
      className="-scale-y-100 h-[34px] w-[84px] text-[color:var(--component-globalheader-text-hover,#FFFFFF)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Akamai"
    >
      <path
        d="M17.2441 0C18.1394 0 18.1934 0.512499 17.3799 0.754883C10.3297 2.8838 5.20605 9.34898 5.20605 17C5.20606 24.7323 10.4394 31.2512 17.5967 33.3252C18.3294 33.5413 18.1393 34 17.2441 34C7.72683 34 4.71286e-07 26.3752 0 17C0 7.62482 7.72683 4.34324e-05 17.2441 0ZM7.91699 13.0674C8.16088 12.4204 8.5402 12.4198 8.48633 13.0391C8.43225 13.4975 8.4043 13.9556 8.4043 14.4141C8.40446 21.8764 14.4798 27.9102 21.9902 27.9102C29.0929 27.91 31.2079 24.7587 31.4795 24.9746C31.7775 25.1896 28.9031 31.4404 20.5791 31.4404C13.0686 31.4404 6.99521 25.4057 6.99512 17.9434C6.99512 16.2194 7.32102 14.5753 7.91699 13.0674ZM31.29 20.4209C31.534 20.5284 29.5811 23.573 26.083 24.8936C21.8531 26.4827 17.2984 25.6477 13.9902 23.0615C13.6107 22.7655 13.7469 22.577 14.1807 22.7656C17.705 24.3009 22.1523 24.3546 26.5166 22.8193C29.4432 21.7967 31.1523 20.3418 31.29 20.4209Z"
        fill="currentColor"
      />
      <path
        d="M82.2109 14.6298C83.1865 14.6299 83.9999 15.4377 84 16.4071C84 17.404 83.2142 18.1853 82.2109 18.1854C81.2075 18.1854 80.4218 17.3766 80.4218 16.4071C80.4219 15.4102 81.234 14.6298 82.2109 14.6298ZM34.5429 8.00183H35.0849L36.5771 4.0946H40.292L38.0136 9.10632L41.7285 13.7401H38.2314L35.5468 10.1034H34.9775L36.6308 17.8622H33.458L30.5312 4.0946H33.7031L34.5429 8.00183ZM20.7968 6.4657H25.7588L25.9746 4.0946H29.7441L28.4697 17.8612H22.8574L15.7529 4.0946H19.6035L20.7968 6.4657ZM25.081 15.0868H25.1074L25.5683 9.13367H22.124L25.081 15.0868ZM55.4756 9.56433C55.7195 10.7225 56.1273 11.4237 57.4287 11.4237C58.5397 11.4236 58.4856 10.8304 58.3222 9.94226L57.0752 4.0946H60.247L61.4131 9.56433C61.6305 10.615 62.0368 11.4237 63.2841 11.4237C64.505 11.4237 64.3419 10.6687 64.1797 9.67175L62.9863 4.0946H66.1582L67.5683 10.6952C68.0574 12.9314 67.1079 13.8475 64.8574 13.8475C63.6377 13.8475 62.2268 13.3361 61.7666 11.9618H61.6308C61.8207 13.6047 60.4649 13.8475 59.1093 13.8475C58.0243 13.8475 56.7506 13.5252 56.1269 12.3934H55.9912L56.289 13.7401H53.1982L51.1377 4.0946H54.3095L55.4756 9.56433ZM43.8984 3.96082C45.0099 3.96088 46.5011 4.17677 47.0166 5.49597H47.124L46.6904 4.09558H49.8633L51.1367 10.1034C51.8421 13.4167 50.5685 13.8202 47.3144 13.8202C45.0373 13.8202 42.8405 13.8478 42.2168 10.8583H45.3896C45.5795 11.7201 46.1212 11.9071 46.9082 11.9071C48.2901 11.9071 48.2357 11.3425 48.0459 10.453L47.7207 8.91785H47.5859C47.4766 10.0222 46.0671 9.995 45.1718 9.995C42.8682 9.995 41.5113 9.26741 41.0234 6.95105C40.5092 4.5 41.6754 3.96082 43.8984 3.96082ZM70.6865 3.96082C71.7992 3.96084 73.2903 4.17664 73.8047 5.49597H73.914L73.4521 4.09558H76.625L77.9267 10.1034C78.6321 13.4167 77.3565 13.8202 74.1035 13.8202C71.8254 13.8202 69.6294 13.8475 69.0068 10.8583H72.1787C72.3674 11.72 72.9106 11.9071 73.6963 11.9071C75.0794 11.9071 75.0258 11.3425 74.8359 10.453L74.5097 8.91785H74.374C74.2658 10.0222 72.8561 9.995 71.9609 9.995C69.6563 9.99491 68.3013 9.26728 67.8134 6.95105C67.298 4.49992 68.4634 3.96082 70.6865 3.96082ZM81.2343 4.09558L83.2949 13.7401H80.0947L78.0615 4.09558H81.2343ZM45.3613 6.00769C44.8734 6.00769 43.9802 6.00821 44.1963 7.05847C44.3861 7.94797 45.0099 8.08191 45.7959 8.08191C46.8266 8.08189 47.5042 8.00144 47.3408 7.19324C47.1244 6.19664 46.6902 6.00769 45.3613 6.00769ZM72.1513 6.00769C71.6635 6.00769 70.7681 6.00809 70.9853 7.05847C71.1752 7.94796 71.799 8.0819 72.5849 8.08191C73.6148 8.08191 74.2931 8.00156 74.1308 7.19324C73.9145 6.19659 73.4801 6.00771 72.1513 6.00769Z"
        fill="currentColor"
      />
    </svg>
  );
}

function NotificationBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      className="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--component-globalheader-badge-background,#D63C42)] px-[3px] text-[length:var(--font-size-xxxs,0.75rem)] leading-none text-[color:var(--component-globalheader-badge-text,#FFFFFF)]"
      aria-hidden="true"
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

interface HeaderIconButtonProps {
  label: string;
  onClick?: () => void;
  badgeCount?: number;
  children: ReactNode;
}

function HeaderIconButton({ label, onClick, badgeCount, children }: HeaderIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative flex size-6 shrink-0 items-center justify-center text-[color:var(--component-globalheader-icon-default,#D6D6DD)] hover:text-[color:var(--component-globalheader-icon-hover,#FFFFFF)]"
    >
      {children}
      {badgeCount != null && <NotificationBadge count={badgeCount} />}
    </button>
  );
}

interface UserAvatarProps {
  initial: string;
}

function UserAvatar({ initial }: UserAvatarProps) {
  return (
    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--global-color-neutrals-30,#D6D6DD)]">
      <span className="type-body-bold text-[color:var(--global-color-neutrals-100,#343438)]">{initial}</span>
    </div>
  );
}

interface HeaderAccountProps {
  user: GlobalHeaderUser;
}

// Full avatar + name + chevron — desktop only per the Figma spec ("no username, no
// chevron" below 960px). The mobile/tablet state is just <UserAvatar/> on its own,
// rendered directly at the call site.
function HeaderAccount({ user }: HeaderAccountProps) {
  return (
    <button type="button" className="hidden h-[34px] items-center gap-[var(--global-spacing-s8,8px)] desktop:flex">
      <UserAvatar initial={user.avatarInitial} />
      <span className="type-body-semibold text-[color:var(--component-globalheader-text-default,#D6D6DD)]">
        {user.name}
      </span>
      <ChevronDownIcon className="size-4 text-[color:var(--component-globalheader-icon-default,#D6D6DD)]" />
    </button>
  );
}

interface SignInLinkProps {
  onClick?: () => void;
}

function SignInLink({ onClick }: SignInLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="type-body-semibold text-[color:var(--component-globalheader-text-default,#D6D6DD)] hover:text-[color:var(--component-globalheader-text-hover,#FFFFFF)]"
    >
      Sign in
    </button>
  );
}

interface SearchFieldProps {
  placeholder: string;
  onChange?: (value: string) => void;
  className: string;
}

// The mobile icon-only search trigger is handled separately at the call site (it's
// just a HeaderIconButton, not this field) since mobile has no field at all — see
// the Figma annotation "no search field, icon size 24".
function SearchField({ placeholder, onChange, className }: SearchFieldProps) {
  return (
    <label
      className={`items-center gap-[var(--global-spacing-s8,8px)] border border-solid bg-[var(--component-globalheader-search-background,#3D3D42)] border-[var(--component-globalheader-search-border-default,#3D3D42)] px-[9px] py-[7px] hover:border-[var(--component-globalheader-search-border-hover,#696970)] focus-within:border-[var(--component-globalheader-search-border-active,#A3A3AB)] ${className}`}
    >
      <SearchIcon className="size-5 shrink-0 text-[color:var(--component-globalheader-search-icon-default,#D6D6DD)]" />
      <input
        type="search"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="type-body-italic min-w-0 flex-1 bg-transparent text-[color:var(--component-globalheader-search-text-filled,#FFFFFF)] outline-none placeholder:text-[color:var(--component-globalheader-search-text-placeholder,#D6D6DD)]"
      />
    </label>
  );
}

// Header padding: 24px mobile+tablet, 16px desktop ("changed from 16 to 24" reads backwards
// from a desktop baseline — the annotation sits on the tablet frame). Header/icon gaps: 24
// mobile, 32 tablet, 16 (icons only) or 32 (everything else) desktop. All literal strings so
// Tailwind's JIT scanner can find them — see the note this replaced, same reasoning still holds.
const HEADER_PADDING_X = "px-[var(--global-spacing-s24,24px)] desktop:px-[var(--global-spacing-s16,16px)]";
const HEADER_GAP = "gap-[var(--global-spacing-s24,24px)] tablet:gap-[var(--global-spacing-s32,32px)]";
const HEADER_ICONS_GAP =
  "gap-[var(--global-spacing-s24,24px)] tablet:gap-[var(--global-spacing-s32,32px)] desktop:gap-[var(--global-spacing-s16,16px)]";

export default function GlobalHeader({
  isAuthenticated = true,
  user = { name: "CloudUserName", avatarInitial: "C" },
  showSearch = true,
  searchPlaceholder,
  onSearchChange,
  onCreateClick,
  onSignInClick,
  onMenuClick,
  notificationCount,
  logo,
  className,
}: GlobalHeaderProps) {
  const tabletPlaceholder = searchPlaceholder ?? "Search...";
  const desktopPlaceholder = searchPlaceholder ?? "Search products, IP addresses, tags...";

  return (
    <header
      className={
        className ?? `flex h-14 w-full items-center bg-[var(--component-globalheader-background,#232326)] ${HEADER_PADDING_X} ${HEADER_GAP}`
      }
    >
      <div className={`flex min-w-0 flex-1 items-center ${HEADER_GAP}`}>
        {/* Hamburger menu: mobile + tablet only ("no logo, + menu" below 960px) */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenuClick}
          className="flex size-6 shrink-0 items-center justify-center text-[color:var(--component-globalheader-icon-default,#D6D6DD)] hover:text-[color:var(--component-globalheader-icon-hover,#FFFFFF)] desktop:hidden"
        >
          <MenuIcon className="size-6" />
        </button>

        {/* Logo: desktop only */}
        <div className="hidden h-[34px] shrink-0 items-center desktop:flex">{logo ?? <DefaultLogo />}</div>

        {showSearch && (
          <>
            {/* Mobile: icon-only search trigger, no field ("no search field, icon size 24") */}
            <div className="flex tablet:hidden">
              <HeaderIconButton label="Search">
                <SearchIcon className="size-6" />
              </HeaderIconButton>
            </div>

            {/* Tablet: full-width field, short hint */}
            <SearchField
              placeholder={tabletPlaceholder}
              onChange={onSearchChange}
              className="hidden h-[34px] w-full tablet:flex desktop:hidden"
            />

            {/* Desktop: field capped at 800px, long hint ("search field max width 800") */}
            <SearchField
              placeholder={desktopPlaceholder}
              onChange={onSearchChange}
              className="hidden h-[34px] min-w-0 max-w-[800px] flex-1 desktop:flex"
            />
          </>
        )}
      </div>

      <div className={`flex shrink-0 items-center justify-end ${HEADER_GAP}`}>
        {/* Create button: hidden on mobile ("no create button"). Visibility toggled on a wrapper
            div, not on Button's own className, so its unconditional `inline-flex` base class never
            has to fight a `hidden` override for the `display` property. */}
        <div className="hidden shrink-0 tablet:flex">
          <Button variant="primary" size="large" onClick={onCreateClick} startIcon={<PlusIcon />}>
            Create
          </Button>
        </div>

        <div className={`flex shrink-0 items-center ${HEADER_ICONS_GAP}`}>
          <HeaderIconButton label="Help">
            <HelpCircleIcon className="size-6" />
          </HeaderIconButton>
          <HeaderIconButton label="Community">
            <CommunityIcon className="size-6" />
          </HeaderIconButton>
          <HeaderIconButton label="Notifications" badgeCount={notificationCount}>
            <BellIcon className="size-6" />
          </HeaderIconButton>
        </div>

        {isAuthenticated ? (
          <>
            {/* Mobile + tablet: avatar only ("no username, no chevron" below 960px) */}
            <div className="flex desktop:hidden">
              <UserAvatar initial={user.avatarInitial} />
            </div>
            {/* Desktop: avatar + name + chevron */}
            <HeaderAccount user={user} />
          </>
        ) : (
          <SignInLink onClick={onSignInClick} />
        )}
      </div>
    </header>
  );
}
