// Builds GlobalHeader's markup as an HTML string, mirroring components/GlobalHeader.tsx exactly,
// so it can be reused both inline (live demo, real interactivity) and inside <iframe srcdoc> for
// forced mobile/tablet/desktop breakpoint demos (iframes get their own real viewport, so
// desktop:/tablet: media queries evaluate correctly regardless of the parent window's width).
(function () {
  var LOGO_SVG =
    '<svg viewBox="0 0 84 34" class="-scale-y-100 h-[34px] w-[84px] text-[color:var(--component-globalheader-text-hover,#FFFFFF)]" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Akamai"><path d="M17.2441 0C18.1394 0 18.1934 0.512499 17.3799 0.754883C10.3297 2.8838 5.20605 9.34898 5.20605 17C5.20606 24.7323 10.4394 31.2512 17.5967 33.3252C18.3294 33.5413 18.1393 34 17.2441 34C7.72683 34 4.71286e-07 26.3752 0 17C0 7.62482 7.72683 4.34324e-05 17.2441 0ZM7.91699 13.0674C8.16088 12.4204 8.5402 12.4198 8.48633 13.0391C8.43225 13.4975 8.4043 13.9556 8.4043 14.4141C8.40446 21.8764 14.4798 27.9102 21.9902 27.9102C29.0929 27.91 31.2079 24.7587 31.4795 24.9746C31.7775 25.1896 28.9031 31.4404 20.5791 31.4404C13.0686 31.4404 6.99521 25.4057 6.99512 17.9434C6.99512 16.2194 7.32102 14.5753 7.91699 13.0674ZM31.29 20.4209C31.534 20.5284 29.5811 23.573 26.083 24.8936C21.8531 26.4827 17.2984 25.6477 13.9902 23.0615C13.6107 22.7655 13.7469 22.577 14.1807 22.7656C17.705 24.3009 22.1523 24.3546 26.5166 22.8193C29.4432 21.7967 31.1523 20.3418 31.29 20.4209Z" fill="currentColor"/><path d="M82.2109 14.6298C83.1865 14.6299 83.9999 15.4377 84 16.4071C84 17.404 83.2142 18.1853 82.2109 18.1854C81.2075 18.1854 80.4218 17.3766 80.4218 16.4071C80.4219 15.4102 81.234 14.6298 82.2109 14.6298ZM34.5429 8.00183H35.0849L36.5771 4.0946H40.292L38.0136 9.10632L41.7285 13.7401H38.2314L35.5468 10.1034H34.9775L36.6308 17.8622H33.458L30.5312 4.0946H33.7031L34.5429 8.00183ZM20.7968 6.4657H25.7588L25.9746 4.0946H29.7441L28.4697 17.8612H22.8574L15.7529 4.0946H19.6035L20.7968 6.4657ZM25.081 15.0868H25.1074L25.5683 9.13367H22.124L25.081 15.0868ZM55.4756 9.56433C55.7195 10.7225 56.1273 11.4237 57.4287 11.4237C58.5397 11.4236 58.4856 10.8304 58.3222 9.94226L57.0752 4.0946H60.247L61.4131 9.56433C61.6305 10.615 62.0368 11.4237 63.2841 11.4237C64.505 11.4237 64.3419 10.6687 64.1797 9.67175L62.9863 4.0946H66.1582L67.5683 10.6952C68.0574 12.9314 67.1079 13.8475 64.8574 13.8475C63.6377 13.8475 62.2268 13.3361 61.7666 11.9618H61.6308C61.8207 13.6047 60.4649 13.8475 59.1093 13.8475C58.0243 13.8475 56.7506 13.5252 56.1269 12.3934H55.9912L56.289 13.7401H53.1982L51.1377 4.0946H54.3095L55.4756 9.56433ZM43.8984 3.96082C45.0099 3.96088 46.5011 4.17677 47.0166 5.49597H47.124L46.6904 4.09558H49.8633L51.1367 10.1034C51.8421 13.4167 50.5685 13.8202 47.3144 13.8202C45.0373 13.8202 42.8405 13.8478 42.2168 10.8583H45.3896C45.5795 11.7201 46.1212 11.9071 46.9082 11.9071C48.2901 11.9071 48.2357 11.3425 48.0459 10.453L47.7207 8.91785H47.5859C47.4766 10.0222 46.0671 9.995 45.1718 9.995C42.8682 9.995 41.5113 9.26741 41.0234 6.95105C40.5092 4.5 41.6754 3.96082 43.8984 3.96082ZM70.6865 3.96082C71.7992 3.96084 73.2903 4.17664 73.8047 5.49597H73.914L73.4521 4.09558H76.625L77.9267 10.1034C78.6321 13.4167 77.3565 13.8202 74.1035 13.8202C71.8254 13.8202 69.6294 13.8475 69.0068 10.8583H72.1787C72.3674 11.72 72.9106 11.9071 73.6963 11.9071C75.0794 11.9071 75.0258 11.3425 74.8359 10.453L74.5097 8.91785H74.374C74.2658 10.0222 72.8561 9.995 71.9609 9.995C69.6563 9.99491 68.3013 9.26728 67.8134 6.95105C67.298 4.49992 68.4634 3.96082 70.6865 3.96082ZM81.2343 4.09558L83.2949 13.7401H80.0947L78.0615 4.09558H81.2343ZM45.3613 6.00769C44.8734 6.00769 43.9802 6.00821 44.1963 7.05847C44.3861 7.94797 45.0099 8.08191 45.7959 8.08191C46.8266 8.08189 47.5042 8.00144 47.3408 7.19324C47.1244 6.19664 46.6902 6.00769 45.3613 6.00769ZM72.1513 6.00769C71.6635 6.00769 70.7681 6.00809 70.9853 7.05847C71.1752 7.94796 71.799 8.0819 72.5849 8.08191C73.6148 8.08191 74.2931 8.00156 74.1308 7.19324C73.9145 6.19659 73.4801 6.00771 72.1513 6.00769Z" fill="currentColor"/></svg>';
  var MENU_SVG =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="size-6"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 11.4477 2.44772 11 3 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3C2.44772 13 2 12.5523 2 12Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2 18C2 17.4477 2.44772 17 3 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18Z"/></svg>';
  var SEARCH_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 12.8858 17.2543 14.5974 16.0417 15.8561C16.0073 15.8825 15.9743 15.9114 15.9428 15.9429C15.9113 15.9744 15.8824 16.0074 15.856 16.0418C14.5973 17.2543 12.8857 18 11 18C7.13401 18 4 14.866 4 11ZM16.6176 18.0319C15.078 19.2635 13.125 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11C20 13.125 19.2635 15.0781 18.0319 16.6177L21.707 20.2929C22.0975 20.6834 22.0975 21.3166 21.707 21.7071C21.3165 22.0976 20.6833 22.0976 20.2928 21.7071L16.6176 18.0319Z"/></svg>';
  var HELP_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="size-6"><path d="M11.0166 13.0225V13.6104H13.1152V13.2617C13.1152 13.1159 13.1471 12.986 13.2109 12.8721C13.2793 12.7581 13.391 12.6396 13.5459 12.5166C13.7054 12.3936 13.9219 12.2454 14.1953 12.0723C14.5827 11.8216 14.8949 11.5664 15.1318 11.3066C15.3688 11.0469 15.542 10.7689 15.6514 10.4727C15.7607 10.1764 15.8154 9.85059 15.8154 9.49512C15.8154 8.74772 15.5306 8.14616 14.9609 7.69043C14.3913 7.23014 13.5892 7 12.5547 7C11.8665 7 11.2308 7.08887 10.6475 7.2666C10.0641 7.43978 9.51497 7.67448 9 7.9707L9.9502 9.83008C10.4059 9.58854 10.8343 9.40625 11.2354 9.2832C11.641 9.16016 12.0169 9.09863 12.3633 9.09863C12.6413 9.09863 12.8669 9.1556 13.04 9.26953C13.2132 9.37891 13.2998 9.5293 13.2998 9.7207C13.2998 9.84375 13.277 9.9668 13.2314 10.0898C13.1859 10.2083 13.0902 10.3405 12.9443 10.4863C12.7985 10.6276 12.5706 10.7962 12.2607 10.9922C11.9372 11.1973 11.6842 11.4023 11.502 11.6074C11.3197 11.8125 11.1921 12.029 11.1191 12.2568C11.0508 12.4847 11.0166 12.7399 11.0166 13.0225Z"/><path d="M11.1396 14.9844C10.8617 15.1803 10.7227 15.5199 10.7227 16.0029C10.7227 16.4632 10.8617 16.7959 11.1396 17.001C11.4222 17.2061 11.764 17.3086 12.165 17.3086C12.5479 17.3086 12.8783 17.2061 13.1562 17.001C13.4388 16.7959 13.5801 16.4632 13.5801 16.0029C13.5801 15.5199 13.4388 15.1803 13.1562 14.9844C12.8783 14.7884 12.5479 14.6904 12.165 14.6904C11.764 14.6904 11.4222 14.7884 11.1396 14.9844Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z"/></svg>';
  var COMMUNITY_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="size-6"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.17585 15.541C6.94917 14.5892 8.04794 14 9.25006 14H14.75C15.9521 14 17.0509 14.5892 17.8242 15.541C18.5929 16.4871 19 17.7334 19 19L19 20C19 20.5523 18.5523 21 18 21C17.4477 21 17 20.5523 17 20L17 19C17 18.1449 16.7222 17.3563 16.272 16.8022C15.8263 16.2536 15.2718 16 14.75 16H9.25006C8.72828 16 8.17375 16.2536 7.72808 16.8022C7.27781 17.3563 7.00006 18.1449 7.00006 19L7.00007 20C7.00007 20.5523 6.55235 21 6.00007 21C5.44778 21 5.00007 20.5523 5.00007 20L5.00006 19C5.00006 17.7334 5.40714 16.4871 6.17585 15.541Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.75 11C16.75 10.4477 17.1977 10 17.75 10C18.9521 10 20.0509 10.5892 20.8242 11.541C21.5929 12.4871 22 13.7334 22 15L22 16C22 16.5523 21.5523 17 21 17C20.4477 17 20 16.5523 20 16L20 15C20 14.1449 19.7223 13.3563 19.272 12.8022C18.8263 12.2536 18.2718 12 17.75 12C17.1977 12 16.75 11.5523 16.75 11Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.25 11C7.25 10.4477 6.80229 9.99998 6.25 9.99998C5.04788 9.99998 3.94911 10.5892 3.17579 11.541C2.40708 12.4871 2 13.7334 2 15L2 16C2 16.5523 2.44771 17 3 17C3.55228 17 4 16.5523 4 16L4 15C4 14.1449 4.27775 13.3563 4.72802 12.8021C5.17369 12.2536 5.72822 12 6.25 12C6.80229 12 7.25 11.5523 7.25 11Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 8C11.1716 8 10.5 8.67157 10.5 9.5C10.5 10.3284 11.1716 11 12 11C12.8284 11 13.5 10.3284 13.5 9.5C13.5 8.67157 12.8284 8 12 8ZM8.5 9.5C8.5 7.567 10.067 6 12 6C13.933 6 15.5 7.567 15.5 9.5C15.5 11.433 13.933 13 12 13C10.067 13 8.5 11.433 8.5 9.5Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.5515 4.4599C14.2753 3.98161 14.4392 3.37002 14.9175 3.09387C16.5915 2.12738 18.7321 2.70094 19.6986 4.37496C20.6651 6.04899 20.0915 8.18955 18.4175 9.15605C17.9392 9.43219 17.3276 9.26832 17.0515 8.79003C16.7753 8.31173 16.9392 7.70014 17.4175 7.424C18.1349 7.00979 18.3807 6.0924 17.9665 5.37496C17.5523 4.65752 16.6349 4.41171 15.9175 4.82592C15.4392 5.10207 14.8276 4.93819 14.5515 4.4599Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.36605 4.49997C9.64219 4.02168 9.47831 3.41009 9.00002 3.13395C7.326 2.16745 5.18543 2.74101 4.21893 4.41504C3.25243 6.08906 3.826 8.22963 5.50002 9.19613C5.97831 9.47227 6.5899 9.30839 6.86605 8.8301C7.14219 8.35181 6.97831 7.74022 6.50002 7.46408C5.78258 7.04986 5.53677 6.13248 5.95098 5.41504C6.3652 4.6976 7.28258 4.45179 8.00002 4.866C8.47831 5.14214 9.0899 4.97827 9.36605 4.49997Z"/></svg>';
  var BELL_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="size-6"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C10.1435 2 8.36298 2.7375 7.05022 4.05025C5.73747 5.36301 4.99997 7.14348 4.99997 9C4.99997 12.3601 4.28034 14.1517 3.66792 15.0703C3.36091 15.5308 3.07026 15.7886 2.88323 15.9237C2.78878 15.9919 2.71816 16.0307 2.68166 16.0489C2.66953 16.055 2.66112 16.0588 2.65679 16.0607C2.20754 16.2247 1.93585 16.6855 2.01288 17.1602C2.09144 17.6443 2.50951 18 2.99997 18H21C21.4904 18 21.9085 17.6443 21.9871 17.1602C22.0641 16.6855 21.7924 16.2247 21.3431 16.0607C21.3388 16.0588 21.3304 16.055 21.3183 16.0489C21.2818 16.0307 21.2112 15.9919 21.1167 15.9237C20.9297 15.7886 20.639 15.5308 20.332 15.0703C19.7196 14.1517 19 12.3601 19 9C19 7.14349 18.2625 5.36301 16.9497 4.05025C15.637 2.7375 13.8565 2 12 2ZM18.5522 16H5.44776C6.28634 14.6525 6.99997 12.4808 6.99997 9C6.99997 7.67392 7.52675 6.40215 8.46443 5.46447C9.40212 4.52678 10.6739 4 12 4C13.326 4 14.5978 4.52678 15.5355 5.46447C16.4732 6.40215 17 7.67392 17 9C17 12.4808 17.7136 14.6525 18.5522 16ZM11.135 19.4982C10.8579 19.0205 10.2459 18.8579 9.76822 19.135C9.29049 19.4121 9.12787 20.024 9.40499 20.5018C9.6687 20.9564 10.0472 21.3337 10.5026 21.5961C10.9581 21.8584 11.4744 21.9965 12 21.9965C12.5256 21.9965 13.0419 21.8584 13.4973 21.5961C13.9528 21.3337 14.3313 20.9564 14.595 20.5018C14.8721 20.024 14.7095 19.4121 14.2318 19.135C13.754 18.8579 13.1421 19.0205 12.865 19.4982C12.7771 19.6498 12.6509 19.7756 12.4991 19.863C12.3473 19.9504 12.1752 19.9965 12 19.9965C11.8248 19.9965 11.6527 19.9504 11.5009 19.863C11.3491 19.7756 11.2229 19.6498 11.135 19.4982Z"/></svg>';
  var CHEVRON_DOWN_SVG =
    '<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="size-4"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.53 5.5297C3.789 5.27 4.21 5.27 4.47 5.5297L8 9.0595L11.53 5.5297C11.789 5.27 12.21 5.27 12.47 5.5297C12.73 5.7894 12.73 6.2105 12.47 6.4702L8.47 10.4702C8.21 10.7299 7.789 10.7299 7.53 10.4702L3.53 6.4702C3.27 6.2105 3.27 5.7894 3.53 5.5297Z"/></svg>';
  var PLUS_SVG =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.665 3.33331C8.665 2.96604 8.36727 2.66831 8 2.66831C7.63273 2.66831 7.335 2.96604 7.335 3.33331V7.335H3.33325C2.96598 7.335 2.66825 7.63273 2.66825 8C2.66825 8.36727 2.96598 8.665 3.33325 8.665H7.335V12.6666C7.335 13.0339 7.63273 13.3316 8 13.3316C8.36727 13.3316 8.665 13.0339 8.665 12.6666V8.665H12.6666C13.0339 8.665 13.3316 8.36727 13.3316 8C13.3316 7.63273 13.0339 7.335 12.6666 7.335H8.665V3.33331Z"/></svg>';

  var HEADER_PADDING_X = "px-[var(--global-spacing-s24,24px)] desktop:px-[var(--global-spacing-s16,16px)]";
  var HEADER_GAP = "gap-[var(--global-spacing-s24,24px)] tablet:gap-[var(--global-spacing-s32,32px)]";
  var HEADER_ICONS_GAP =
    "gap-[var(--global-spacing-s24,24px)] tablet:gap-[var(--global-spacing-s32,32px)] desktop:gap-[var(--global-spacing-s16,16px)]";

  function headerIconButton(label, svg, badgeCount) {
    var badge =
      badgeCount != null && badgeCount > 0
        ? '<span class="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--component-globalheader-badge-background,#D63C42)] px-[3px] text-[length:var(--font-size-xxxs,0.75rem)] leading-none text-[color:var(--component-globalheader-badge-text,#FFFFFF)]" aria-hidden="true">' +
          (badgeCount > 9 ? "9+" : badgeCount) +
          "</span>"
        : "";
    return (
      '<button type="button" aria-label="' +
      label +
      '" class="relative flex size-6 shrink-0 items-center justify-center text-[color:var(--component-globalheader-icon-default,#D6D6DD)] hover:text-[color:var(--component-globalheader-icon-hover,#FFFFFF)]">' +
      svg +
      badge +
      "</button>"
    );
  }

  function buildHeaderHTML(opts) {
    opts = opts || {};
    var isAuthenticated = opts.isAuthenticated !== false;
    var showSearch = opts.showSearch !== false;
    var notificationCount = opts.notificationCount;
    var userName = opts.userName || "CloudUserName";
    var userInitial = opts.userInitial || "C";

    var accountHtml = isAuthenticated
      ? '<div class="flex desktop:hidden">' +
        '<div class="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--global-color-neutrals-30,#D6D6DD)]"><span class="type-body-bold text-[color:var(--global-color-neutrals-100,#343438)]">' +
        userInitial +
        "</span></div></div>" +
        '<button type="button" class="hidden h-[34px] items-center gap-[var(--global-spacing-s8,8px)] desktop:flex">' +
        '<div class="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--global-color-neutrals-30,#D6D6DD)]"><span class="type-body-bold text-[color:var(--global-color-neutrals-100,#343438)]">' +
        userInitial +
        "</span></div>" +
        '<span class="type-body-semibold text-[color:var(--component-globalheader-text-default,#D6D6DD)]">' +
        userName +
        "</span>" +
        CHEVRON_DOWN_SVG +
        "</button>"
      : '<button type="button" class="type-body-semibold text-[color:var(--component-globalheader-text-default,#D6D6DD)] hover:text-[color:var(--component-globalheader-text-hover,#FFFFFF)]">Sign in</button>';

    var searchHtml = showSearch
      ? '<div class="flex tablet:hidden">' + headerIconButton("Search", SEARCH_SVG) + "</div>" +
        '<label class="items-center gap-[var(--global-spacing-s8,8px)] border border-solid bg-[var(--component-globalheader-search-background,#3D3D42)] border-[var(--component-globalheader-search-border-default,#3D3D42)] px-[9px] py-[7px] hover:border-[var(--component-globalheader-search-border-hover,#696970)] focus-within:border-[var(--component-globalheader-search-border-active,#A3A3AB)] hidden h-[34px] w-full tablet:flex desktop:hidden">' +
        '<span class="size-5 shrink-0 text-[color:var(--component-globalheader-search-icon-default,#D6D6DD)]">' + SEARCH_SVG + '</span>' +
        '<input type="search" placeholder="Search..." class="type-body-italic min-w-0 flex-1 bg-transparent text-[color:var(--component-globalheader-search-text-filled,#FFFFFF)] outline-none placeholder:text-[color:var(--component-globalheader-search-text-placeholder,#D6D6DD)]" /></label>' +
        '<label class="items-center gap-[var(--global-spacing-s8,8px)] border border-solid bg-[var(--component-globalheader-search-background,#3D3D42)] border-[var(--component-globalheader-search-border-default,#3D3D42)] px-[9px] py-[7px] hover:border-[var(--component-globalheader-search-border-hover,#696970)] focus-within:border-[var(--component-globalheader-search-border-active,#A3A3AB)] hidden h-[34px] min-w-0 max-w-[800px] flex-1 desktop:flex">' +
        '<span class="size-5 shrink-0 text-[color:var(--component-globalheader-search-icon-default,#D6D6DD)]">' + SEARCH_SVG + '</span>' +
        '<input type="search" placeholder="Search products, IP addresses, tags..." class="type-body-italic min-w-0 flex-1 bg-transparent text-[color:var(--component-globalheader-search-text-filled,#FFFFFF)] outline-none placeholder:text-[color:var(--component-globalheader-search-text-placeholder,#D6D6DD)]" /></label>'
      : "";

    return (
      '<header class="flex h-14 w-full items-center bg-[var(--component-globalheader-background,#232326)] ' +
      HEADER_PADDING_X +
      " " +
      HEADER_GAP +
      '">' +
      '<div class="flex min-w-0 flex-1 items-center ' +
      HEADER_GAP +
      '">' +
      '<button type="button" aria-label="Open menu" class="flex size-6 shrink-0 items-center justify-center text-[color:var(--component-globalheader-icon-default,#D6D6DD)] hover:text-[color:var(--component-globalheader-icon-hover,#FFFFFF)] desktop:hidden">' +
      MENU_SVG +
      "</button>" +
      '<div class="hidden h-[34px] shrink-0 items-center desktop:flex">' +
      LOGO_SVG +
      "</div>" +
      searchHtml +
      "</div>" +
      '<div class="flex shrink-0 items-center justify-end ' +
      HEADER_GAP +
      '">' +
      '<div class="hidden shrink-0 tablet:flex">' +
      '<button type="button" class="relative box-border inline-flex shrink-0 items-center justify-center gap-[var(--global-spacing-s4,4px)] whitespace-nowrap text-center transition-colors h-[34px] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] type-label-semibold-s cursor-pointer border border-solid bg-[var(--component-button-primary-default-background,#0174BC)] border-[var(--component-button-primary-default-border,#0174BC)] text-[color:var(--component-button-primary-default-text,#FFFFFF)] hover:bg-[var(--component-button-primary-hover-background,#009CDE)] hover:border-[var(--component-button-primary-hover-border,#009CDE)] hover:text-[color:var(--component-button-primary-hover-text,#FFFFFF)] active:bg-[var(--component-button-primary-active-background,#0174BC)] active:border-[var(--component-button-primary-active-border,#0174BC)] active:text-[color:var(--component-button-primary-active-text,#FFFFFF)]"><span aria-hidden="true" class="inline-flex shrink-0 items-center justify-center">' +
      PLUS_SVG +
      "</span><span>Create</span></button></div>" +
      '<div class="flex shrink-0 items-center ' +
      HEADER_ICONS_GAP +
      '">' +
      headerIconButton("Help", HELP_SVG) +
      headerIconButton("Community", COMMUNITY_SVG) +
      headerIconButton("Notifications", BELL_SVG, notificationCount) +
      "</div>" +
      accountHtml +
      "</div>" +
      "</header>"
    );
  }

  window.GlobalHeaderDemo = { build: buildHeaderHTML };
})();
