// Mirrors components/Table.tsx's class-selection logic and CSS Grid layout approach (literal
// strings/technique copied verbatim from the TSX source, including the `display:contents` row
// wrappers and `createPortal`-equivalent fixed-position dropdown) so every demo below behaves and
// renders identically to the real React component — same treatment every other interactive docs
// page gets, per GUIDELINES.md's "Interactivity is real, not static screenshots" call.
(function () {
  var ICONS = {
    sort:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.00029 4.00171C5.36756 4.00171 5.66529 4.29944 5.66529 4.66671V12.3946L6.86339 11.1965C7.12309 10.9368 7.54415 10.9368 7.80385 11.1965C8.06354 11.4562 8.06354 11.8772 7.80385 12.1369L5.47051 14.4703C5.3458 14.595 5.17666 14.665 5.00029 14.665C4.82392 14.665 4.65477 14.595 4.53006 14.4703L2.19673 12.1369C1.93703 11.8772 1.93703 11.4562 2.19673 11.1965C2.45643 10.9368 2.87748 10.9368 3.13718 11.1965L4.33529 12.3946V4.66671C4.33529 4.29944 4.63302 4.00171 5.00029 4.00171Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.0003 1.33496C11.1767 1.33496 11.3458 1.40502 11.4705 1.52974L13.8039 3.86311C14.0635 4.12281 14.0635 4.54387 13.8038 4.80356C13.5441 5.06326 13.1231 5.06326 12.8634 4.80355L11.6653 3.60543V11.3333C11.6653 11.7006 11.3676 11.9983 11.0003 11.9983C10.633 11.9983 10.3353 11.7006 10.3353 11.3333V3.60543L9.13718 4.80355C8.87749 5.06326 8.45643 5.06326 8.19673 4.80356C7.93703 4.54387 7.93703 4.12281 8.19672 3.86311L10.5301 1.52974C10.6548 1.40502 10.8239 1.33496 11.0003 1.33496Z"/></svg>',
    caret:
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.9239 10.5904C14.25 10.2643 14.25 9.73565 13.9239 9.40956L8.92389 4.40956C8.68508 4.17076 8.32593 4.09932 8.01392 4.22856C7.7019 4.3578 7.49846 4.66227 7.49846 5L7.49846 15C7.49846 15.3377 7.7019 15.6422 8.01392 15.7714C8.32593 15.9007 8.68508 15.8292 8.92389 15.5904L13.9239 10.5904ZM9.16846 12.9841L9.16846 7.01587L12.1526 10L9.16846 12.9841Z"/></svg>',
    statusAlert:
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10.0002 7.08166C10.4613 7.08166 10.8352 7.4555 10.8352 7.91666V11.25C10.8352 11.7111 10.4613 12.085 10.0002 12.085C9.539 12.085 9.16516 11.7111 9.16516 11.25V7.91666C9.16516 7.4555 9.539 7.08166 10.0002 7.08166Z"/><path d="M10.8335 14.1667C10.8335 14.6269 10.4604 15 10.0002 15C9.53994 15 9.16685 14.6269 9.16685 14.1667C9.16685 13.7064 9.53994 13.3333 10.0002 13.3333C10.4604 13.3333 10.8335 13.7064 10.8335 14.1667Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.91455 1.95102C9.2476 1.7635 9.62337 1.66499 10.0056 1.66499C10.3878 1.66499 10.7636 1.7635 11.0966 1.95102C11.4297 2.13853 11.7088 2.40872 11.907 2.73551C11.9156 2.7497 11.9238 2.76414 11.9315 2.77881L18.1696 14.5978C18.358 14.9303 18.4577 15.3059 18.4588 15.6883C18.4599 16.0766 18.3592 16.4584 18.167 16.7958C17.9747 17.1332 17.6974 17.4143 17.3627 17.6112C17.028 17.8081 16.6476 17.914 16.2593 17.9183L16.2502 17.9184L3.74095 17.9183C3.35265 17.9141 2.97225 17.8081 2.63758 17.6112C2.3029 17.4143 2.02562 17.1332 1.83333 16.7958C1.64103 16.4584 1.54043 16.0766 1.54151 15.6883C1.54258 15.3058 1.6423 14.9301 1.83088 14.5976L8.07991 2.77828C8.08757 2.76379 8.09566 2.74953 8.10416 2.73551C8.30238 2.40872 8.58149 2.13853 8.91455 1.95102ZM10.0056 3.33499C9.91039 3.33499 9.8168 3.35953 9.73384 3.40623C9.65643 3.44981 9.59072 3.51133 9.54216 3.58551L3.3008 15.3903C3.29595 15.3995 3.29092 15.4085 3.28573 15.4175C3.23737 15.5013 3.21178 15.5963 3.21151 15.693C3.21124 15.7897 3.23629 15.8848 3.28419 15.9688C3.33208 16.0528 3.40114 16.1229 3.4845 16.1719C3.56683 16.2203 3.66028 16.2467 3.75575 16.2483H16.2445C16.34 16.2467 16.4334 16.2203 16.5158 16.1719C16.5991 16.1228 16.6682 16.0528 16.7161 15.9688C16.764 15.8848 16.789 15.7897 16.7888 15.693C16.7885 15.5963 16.7629 15.5013 16.7146 15.4175C16.7093 15.4084 16.7041 15.3991 16.6992 15.3897L10.4689 3.58532C10.4203 3.51123 10.3547 3.44978 10.2773 3.40623C10.1944 3.35953 10.1008 3.33499 10.0056 3.33499Z"/></svg>',
    dot: '<svg width="20" height="20" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="4"/></svg>',
    edit:
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0001 3.47798C14.8002 3.47798 14.6023 3.51735 14.4176 3.59384C14.2329 3.67033 14.0652 3.78244 13.9238 3.92377L4.49729 13.3504L3.69012 16.31L6.64976 15.5028L16.0763 6.07624C16.2176 5.93491 16.3297 5.76712 16.4062 5.58246C16.4827 5.3978 16.5221 5.19988 16.5221 5.00001C16.5221 4.80013 16.4827 4.60221 16.4062 4.41755C16.3297 4.23289 16.2176 4.06511 16.0763 3.92377C15.935 3.78244 15.7672 3.67033 15.5825 3.59384C15.3979 3.51735 15.1999 3.47798 15.0001 3.47798ZM13.7785 2.05096C14.1658 1.89055 14.5809 1.80798 15.0001 1.80798C15.4192 1.80798 15.8343 1.89055 16.2216 2.05096C16.6089 2.21138 16.9608 2.4465 17.2572 2.74291C17.5536 3.03931 17.7887 3.3912 17.9491 3.77847C18.1095 4.16575 18.1921 4.58083 18.1921 5.00001C18.1921 5.41919 18.1095 5.83426 17.9491 6.22154C17.7887 6.60882 17.5536 6.9607 17.2572 7.25711L7.67383 16.8405C7.57108 16.9432 7.44329 17.0174 7.30309 17.0556L2.71976 18.3056C2.43067 18.3845 2.12151 18.3024 1.90962 18.0905C1.69774 17.8786 1.61564 17.5694 1.69448 17.2803L2.94448 12.697C2.98271 12.5568 3.05687 12.429 3.15962 12.3263L12.743 2.74291L13.3334 3.33334L12.743 2.74291C13.0394 2.4465 13.3913 2.21138 13.7785 2.05096Z"/></svg>',
    download:
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.8349 2.50001C10.8349 2.03885 10.461 1.66501 9.99986 1.66501C9.5387 1.66501 9.16486 2.03885 9.16486 2.50001V10.4842L6.4236 7.74295C6.09752 7.41686 5.56882 7.41686 5.24274 7.74295C4.91665 8.06904 4.91665 8.59773 5.24274 8.92382L9.4094 13.0905C9.50479 13.1859 9.61752 13.2534 9.73744 13.2929C9.79172 13.3109 9.84846 13.3234 9.90703 13.3299C9.967 13.3366 10.0275 13.3368 10.0875 13.3305C10.2711 13.3112 10.4496 13.2312 10.5903 13.0905L14.7569 8.92382C15.083 8.59773 15.083 8.06904 14.7569 7.74295C14.4309 7.41686 13.9022 7.41686 13.5761 7.74295L10.8349 10.4842V2.50001ZM3.33154 17.5C3.33154 17.0388 3.70539 16.665 4.16654 16.665H15.8332C16.2944 16.665 16.6682 17.0388 16.6682 17.5C16.6682 17.9612 16.2944 18.335 15.8332 18.335H4.16654C3.70539 18.335 3.33154 17.9612 3.33154 17.5Z"/></svg>',
    del:
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.74532 3.5786C7.90128 3.42263 8.11282 3.33501 8.33339 3.33501H11.6667C11.8873 3.33501 12.0988 3.42263 12.2548 3.5786C12.4108 3.73457 12.4984 3.9461 12.4984 4.16667V4.99838H7.50173V4.16667C7.50173 3.9461 7.58935 3.73457 7.74532 3.5786ZM5.83173 4.99838V4.16667C5.83173 3.50319 6.09529 2.86688 6.56445 2.39773C7.0336 1.92858 7.66991 1.66501 8.33339 1.66501H11.6667C12.3302 1.66501 12.9665 1.92858 13.4357 2.39773C13.9048 2.86688 14.1684 3.50319 14.1684 4.16667V4.99838H15.8251L15.8334 4.99834L15.8417 4.99838H17.5C17.9612 4.99838 18.335 5.37222 18.335 5.83338C18.335 6.29454 17.9612 6.66838 17.5 6.66838H16.6684V15.8333C16.6684 16.4968 16.4048 17.1331 15.9357 17.6023C15.4665 18.0714 14.8302 18.335 14.1667 18.335H5.83339C5.16991 18.335 4.5336 18.0714 4.06445 17.6023C3.59529 17.1331 3.33173 16.4968 3.33173 15.8333V6.66838H2.50004C2.03888 6.66838 1.66504 6.29454 1.66504 5.83338C1.66504 5.37222 2.03888 4.99838 2.50004 4.99838H4.15839L4.16673 4.99834L4.17506 4.99838H5.83173ZM5.00173 6.66838V15.8333C5.00173 16.0539 5.08935 16.2654 5.24532 16.4214C5.40128 16.5774 5.61282 16.665 5.83339 16.665H14.1667C14.3873 16.665 14.5988 16.5774 14.7548 16.4214C14.9108 16.2654 14.9984 16.0539 14.9984 15.8333V6.66838H5.00173ZM8.33335 8.33163C8.79451 8.33163 9.16835 8.70548 9.16835 9.16663V14.1666C9.16835 14.6278 8.79451 15.0016 8.33335 15.0016C7.87219 15.0016 7.49835 14.6278 7.49835 14.1666V9.16663C7.49835 8.70548 7.87219 8.33163 8.33335 8.33163ZM12.5017 9.16663C12.5017 8.70548 12.1279 8.33163 11.6667 8.33163C11.2056 8.33163 10.8317 8.70548 10.8317 9.16663V14.1666C10.8317 14.6278 11.2056 15.0016 11.6667 15.0016C12.1279 15.0016 12.5017 14.6278 12.5017 14.1666V9.16663Z"/></svg>',
    more:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 10C3.8954 10 3 10.8954 3 12C3 13.1046 3.8954 14 5 14C6.1046 14 7 13.1046 7 12C7 10.8954 6.1046 10 5 10ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z"/></svg>',
    info:
      '<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 3.33333C6.3181 3.33333 3.33333 6.3181 3.33333 10C3.33333 13.6819 6.3181 16.6667 10 16.6667C13.6819 16.6667 16.6667 13.6819 16.6667 10C16.6667 6.3181 13.6819 3.33333 10 3.33333ZM1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10ZM9.16667 5.83333C9.16667 5.3731 9.53976 5 10 5H10.0083C10.4686 5 10.8417 5.3731 10.8417 5.83333C10.8417 6.29357 10.4686 6.66667 10.0083 6.66667H10C9.53976 6.66667 9.16667 6.29357 9.16667 5.83333ZM10 7.91667C10.4602 7.91667 10.8333 8.28976 10.8333 8.75V14.1667C10.8333 14.6269 10.4602 15 10 15C9.53976 15 9.16667 14.6269 9.16667 14.1667V8.75C9.16667 8.28976 9.53976 7.91667 10 7.91667Z"/></svg>',
  };

  var HEADER_VARIANT_CLASSES = {
    filled: {
      bg: "bg-[var(--component-table-headerfilled-background,#E5E5EA)]",
      text: "text-[color:var(--component-table-headerfilled-text,#343438)]",
      border: "border-[var(--component-table-headerfilled-border,#A3A3AB)]",
      iconDefault: "text-[color:var(--component-table-headerfilled-icon-default,#696970)]",
      iconGroupHover: "group-hover:text-[color:var(--component-table-headerfilled-icon-hover,#009CDE)]",
      iconActive: "text-[color:var(--component-table-headerfilled-icon-active,#0174BC)]",
    },
    outlined: {
      bg: "bg-white",
      text: "text-[color:var(--component-table-headeroutlined-text,#343438)]",
      border: "border-[var(--component-table-headeroutlined-border,#A3A3AB)]",
      iconDefault: "text-[color:var(--component-table-headeroutlined-icon-default,#696970)]",
      iconGroupHover: "group-hover:text-[color:var(--component-table-headeroutlined-icon-hover,#009CDE)]",
      iconActive: "text-[color:var(--component-table-headeroutlined-icon-active,#0174BC)]",
    },
  };

  var ROW_BORDER = "border-[var(--component-table-row-border,#D6D6DD)]";
  var ROW_BG_DEFAULT = "bg-[var(--component-table-row-background-default,#FFFFFF)]";
  var ROW_BG_ZEBRA = "bg-[var(--component-table-row-background-zebra,#F7F7FA)]";
  var ROW_HOVER_GROUP = "group-hover:bg-[var(--component-table-row-background-hover,#EDF8FF)]";
  var ROW_TEXT_DEFAULT = "text-[color:var(--component-table-row-text-default,#343438)]";
  var ROW_ICON_DEFAULT = "text-[color:var(--component-table-row-icon-default,#3D3D42)]";
  var ROW_ICON_HOVER = "hover:text-[color:var(--component-table-row-icon-hover,#009CDE)]";
  var ROW_ICON_DISABLED = "disabled:text-[color:var(--component-table-row-icon-disabled,#A3A3AB)]";

  var CHECKBOX_SMALL_BOX = "size-[16px] p-[var(--global-spacing-s2,2px)]";
  var CHECKBOX_EMPTY = "border-[var(--component-checkbox-empty-default-border,#83838C)] bg-[var(--component-checkbox-empty-default-background,#FFFFFF)]";
  var CHECKBOX_CHECKED =
    "border-[var(--component-checkbox-checked-default-background,#0174BC)] bg-[var(--component-checkbox-checked-default-background,#0174BC)]";
  var CHECKBOX_INDETERMINATE =
    "border-[var(--component-checkbox-indeterminated-default-background,#0174BC)] bg-[var(--component-checkbox-indeterminated-default-background,#0174BC)]";
  var CHECK_SVG =
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="color:#fff"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.46967 6.06952C1.76256 5.77663 2.23744 5.77663 2.53033 6.06952L4.93032 8.46951C5.22321 8.76241 5.22321 9.23728 4.93032 9.53017C4.63743 9.82307 4.16255 9.82307 3.86966 9.53017L1.46967 7.13018C1.17678 6.83729 1.17678 6.36242 1.46967 6.06952Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5303 2.86957C10.8232 3.16247 10.8232 3.63734 10.5303 3.93023L4.93032 9.53017C4.63743 9.82307 4.16255 9.82307 3.86966 9.53017C3.57677 9.23728 3.57669 8.76256 3.86958 8.46966L9.46967 2.86957C9.76256 2.57668 10.2374 2.57668 10.5303 2.86957Z"/></svg>';
  var MINUS_SVG =
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="color:#fff"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.75 6C10.75 6.41421 10.4142 6.75 10 6.75L2.00001 6.75C1.5858 6.75 1.25001 6.41421 1.25001 6C1.25001 5.58579 1.5858 5.25 2.00001 5.25L10 5.25C10.4142 5.25 10.75 5.58579 10.75 6Z"/></svg>';

  function smallCheckbox(checked, indeterminate, ariaLabel, onChange) {
    var box = document.createElement("span");
    box.setAttribute("aria-hidden", "true");
    var kind = indeterminate ? "indeterminate" : checked ? "checked" : "empty";
    box.className =
      "box-border inline-flex shrink-0 items-center justify-center border border-solid " +
      CHECKBOX_SMALL_BOX +
      " " +
      (kind === "checked" ? CHECKBOX_CHECKED : kind === "indeterminate" ? CHECKBOX_INDETERMINATE : CHECKBOX_EMPTY);
    box.innerHTML = kind === "checked" ? CHECK_SVG : kind === "indeterminate" ? MINUS_SVG : "";

    var input = document.createElement("input");
    input.type = "checkbox";
    input.className = "sr-only";
    input.checked = checked;
    input.setAttribute("aria-label", ariaLabel);
    input.addEventListener("change", function () {
      onChange(input.checked);
    });

    var label = document.createElement("label");
    label.className = "relative inline-flex shrink-0 cursor-pointer items-center";
    label.appendChild(input);
    label.appendChild(box);
    return label;
  }

  function badgeHtml(label, colorVar, textVar, fallbackBg, fallbackText) {
    return (
      '<span class="inline-flex shrink-0 items-center gap-[var(--global-spacing-s2,2px)] rounded-[4px] px-[var(--global-spacing-s6,6px)] py-[var(--global-spacing-s4,4px)] h-5 min-w-6 box-border font-bold text-[12px] leading-[12px] tracking-[0.12px] whitespace-nowrap bg-[var(--' +
      colorVar +
      "," +
      fallbackBg +
      ')] text-[color:var(--' +
      textVar +
      "," +
      fallbackText +
      ')]">' +
      label +
      "</span>"
    );
  }

  function buildGridTemplateColumns(columns) {
    return columns
      .map(function (column) {
        if (column.width) return column.width;
        if (!column.header) return "36px";
        if (column.cellType === "actionIcons" || column.cellType === "actionMenu") return "max-content";
        return "1fr";
      })
      .join(" ");
  }

  // Row action menu — a real fixed-position "portal" appended to document.body, positioned from
  // the trigger button's live getBoundingClientRect(), same fix as the React component's
  // createPortal — the table wrapper needs overflow:hidden for its rounded corners, so the
  // dropdown has to render outside that ancestor entirely rather than as a CSS-absolute child.
  function createActionMenu(actions, rowRef) {
    var wrap = document.createElement("span");
    wrap.className = "contents";

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-label", "More actions");
    trigger.className = "flex shrink-0 items-center justify-center " + ROW_ICON_DEFAULT + " " + ROW_ICON_HOVER;
    trigger.innerHTML = ICONS.more;
    wrap.appendChild(trigger);

    var menu = null;
    function close() {
      if (menu) {
        menu.remove();
        menu = null;
        trigger.setAttribute("aria-expanded", "false");
        document.removeEventListener("mousedown", onOutside);
        window.removeEventListener("scroll", reposition, true);
        window.removeEventListener("resize", reposition);
      }
    }
    function onOutside(e) {
      if (!trigger.contains(e.target) && (!menu || !menu.contains(e.target))) close();
    }
    function reposition() {
      if (!menu) return;
      var rect = trigger.getBoundingClientRect();
      menu.style.top = rect.bottom + "px";
      menu.style.right = window.innerWidth - rect.right + "px";
    }
    function open() {
      var rect = trigger.getBoundingClientRect();
      menu = document.createElement("div");
      menu.setAttribute("role", "menu");
      menu.setAttribute("aria-label", "More actions");
      menu.style.position = "fixed";
      menu.style.top = rect.bottom + "px";
      menu.style.right = window.innerWidth - rect.right + "px";
      menu.className =
        "z-50 flex min-w-[160px] flex-col items-stretch py-[var(--global-spacing-s4,4px)] bg-white shadow-[0px_2px_8px_0px_rgba(58,59,63,0.18)]";
      actions.forEach(function (action) {
        var item = document.createElement("button");
        item.type = "button";
        item.setAttribute("role", "menuitem");
        item.textContent = action.label;
        item.className =
          "type-label-regular-s flex items-center gap-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s8,8px)] pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s8,8px)] text-left " +
          ROW_TEXT_DEFAULT +
          " hover:bg-[var(--component-table-row-background-hover,#EDF8FF)]";
        item.addEventListener("click", function () {
          action.onClick(rowRef());
          close();
        });
        menu.appendChild(item);
      });
      document.body.appendChild(menu);
      trigger.setAttribute("aria-expanded", "true");
      document.addEventListener("mousedown", onOutside);
      window.addEventListener("scroll", reposition, true);
      window.addEventListener("resize", reposition);
    }
    trigger.addEventListener("click", function () {
      if (menu) close();
      else open();
    });
    return wrap;
  }

  function cellContentNode(column, row) {
    var type = column.cellType || "text";

    if (type === "custom") {
      var holder = document.createElement("span");
      holder.className = "contents";
      holder.innerHTML = column.render(row);
      return holder;
    }

    if (type === "actionIcons") {
      var wrap = document.createElement("div");
      wrap.className = "flex items-center gap-[var(--global-spacing-s16,16px)]";
      (column.actions || []).forEach(function (action) {
        var disabled = typeof action.disabled === "function" ? action.disabled(row) : !!action.disabled;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.disabled = disabled;
        btn.setAttribute("aria-label", action.label);
        btn.title = action.label;
        btn.className =
          "flex shrink-0 items-center justify-center " +
          ROW_ICON_DEFAULT +
          " " +
          ROW_ICON_HOVER +
          " " +
          ROW_ICON_DISABLED +
          " disabled:cursor-not-allowed";
        btn.innerHTML = ICONS[action.icon];
        btn.addEventListener("click", function () {
          if (!disabled) action.onClick(row);
        });
        wrap.appendChild(btn);
      });
      return wrap;
    }

    if (type === "actionMenu") {
      return createActionMenu(column.actions || [], function () {
        return row;
      });
    }

    var value = column.accessor ? column.accessor(row) : undefined;

    if (type === "link") {
      if (!value) return document.createTextNode("");
      var a = document.createElement("a");
      a.href = value.href || "#";
      a.className =
        "flex min-w-0 items-center gap-[var(--global-spacing-s8,8px)] text-[color:var(--component-table-row-text-link,#0174BC)] hover:underline";
      a.innerHTML = '<span class="type-body-regular truncate">' + value.label + "</span>";
      return a;
    }

    if (type === "iconText") {
      if (!value) return document.createTextNode("");
      var span = document.createElement("span");
      span.className = "flex min-w-0 items-center gap-[var(--global-spacing-s8,8px)]";
      // `iconColorHex` is a real per-status color the source data picks at runtime — same as
      // src/App.tsx's demo, which sets it via inline `style={{ color }}`, not a Tailwind class
      // (a fabricated `text-[#hex]` class here wouldn't exist in the compiled stylesheet, since
      // Tailwind only emits utility classes it finds literally in the scanned component source).
      span.innerHTML =
        '<span class="shrink-0' + (value.iconColorHex ? "" : " " + ROW_ICON_DEFAULT) + '"' +
        (value.iconColorHex ? ' style="color:' + value.iconColorHex + '"' : "") +
        ">" +
        ICONS[value.icon] +
        '</span><span class="type-body-regular truncate ' +
        ROW_TEXT_DEFAULT +
        '">' +
        value.label +
        "</span>";
      return span;
    }

    if (type === "badge") {
      if (!value) return document.createTextNode("");
      var badgeHolder = document.createElement("span");
      badgeHolder.className = "contents";
      badgeHolder.innerHTML = badgeHtml(value.label, "component-badge-informative-subtle-background", "component-badge-informative-subtle-text", "rgba(52,81,178,0.12)", "#3451B2");
      return badgeHolder;
    }

    // 'text' — empty/missing value renders Figma's literal "No data" placeholder, matching the
    // per-cell "Empty state" cell type (a sub-variant of "Text only", not a whole-table state).
    var text = value === undefined || value === null || value === "" ? null : String(value);
    var textSpan = document.createElement("span");
    if (!text) {
      textSpan.className = "type-body-regular truncate text-[color:var(--component-table-row-text-placeholder,#696970)]";
      textSpan.textContent = "No data";
    } else {
      textSpan.className = "type-body-regular truncate " + ROW_TEXT_DEFAULT;
      textSpan.textContent = text;
    }
    return textSpan;
  }

  // config: { columns, rows, headerVariant, zebra, bordered, selectable, expandable,
  //           renderExpandedContent(row) -> HTMLElement, defaultExpandedIds, defaultSelectedIds }
  function renderTable(container, config) {
    var headerVariant = config.headerVariant || "filled";
    var bordered = config.bordered !== false;
    var zebra = !config.expandable && !!config.zebra;
    var selectedIds = {};
    (config.defaultSelectedIds || []).forEach(function (id) { selectedIds[id] = true; });
    var expandedIds = {};
    (config.defaultExpandedIds || []).forEach(function (id) { expandedIds[id] = true; });
    var sortState = { key: config.defaultSortKey || null, dir: config.defaultSortDir || "asc" };

    container.innerHTML = "";
    container.style.gridTemplateColumns = buildGridTemplateColumns(config.columns);
    container.className =
      "grid " + (bordered ? "border border-solid " + ROW_BORDER + " rounded-[4px] overflow-hidden" : "");
    container.setAttribute("role", "table");

    function selectedCount() {
      return Object.keys(selectedIds).filter(function (k) { return selectedIds[k]; }).length;
    }

    function paint() {
      var rows = config.rows;
      if (config.onSort) rows = config.onSort(rows, sortState);

      container.innerHTML = "";
      var allSelected = rows.length > 0 && rows.every(function (r) { return selectedIds[r.id]; });
      var someSelected = !allSelected && rows.some(function (r) { return selectedIds[r.id]; });
      var c = HEADER_VARIANT_CLASSES[headerVariant];

      var headerRow = document.createElement("div");
      headerRow.setAttribute("role", "row");
      headerRow.className = "contents";
      config.columns.forEach(function (column, colIndex) {
        headerRow.appendChild(headerCell(column, colIndex === 0, c, allSelected, someSelected));
      });
      container.appendChild(headerRow);

      rows.forEach(function (row, rowIndex) {
        var isExpanded = !!expandedIds[row.id];
        var rowBg = zebra && rowIndex % 2 === 1 ? ROW_BG_ZEBRA : ROW_BG_DEFAULT;

        var rowWrap = document.createElement("div");
        rowWrap.setAttribute("role", "row");
        rowWrap.className = "group contents";
        config.columns.forEach(function (column, colIndex) {
          rowWrap.appendChild(bodyCell(column, row, rowIndex, colIndex === 0, rowBg, isExpanded));
        });
        container.appendChild(rowWrap);

        if (config.expandable && isExpanded) {
          var expandedRow = document.createElement("div");
          expandedRow.setAttribute("role", "row");
          expandedRow.className = "contents";
          var expandedCell = document.createElement("div");
          expandedCell.setAttribute("role", "cell");
          expandedCell.style.gridColumn = "1 / -1";
          expandedCell.className =
            "flex px-[var(--global-spacing-s24,24px)] py-[var(--global-spacing-s16,16px)] border-b border-solid " + ROW_BORDER + " " + rowBg;
          expandedCell.appendChild(config.renderExpandedContent(row));
          expandedRow.appendChild(expandedCell);
          container.appendChild(expandedRow);
        }
      });

      if (config.onStateChange) config.onStateChange({ selectedIds: Object.keys(selectedIds).filter(function (k) { return selectedIds[k]; }), expandedIds: Object.keys(expandedIds).filter(function (k) { return expandedIds[k]; }) });
    }

    function headerCell(column, isFirst, c, allSelected, someSelected) {
      if (!column.header) {
        var iconOnly = document.createElement("div");
        iconOnly.setAttribute("role", "columnheader");
        iconOnly.className =
          "flex min-w-0 items-center justify-center gap-[var(--global-spacing-s16,16px)] px-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s10,10px)] border-b border-solid " +
          c.bg + " " + c.border + " " + c.iconDefault;
        if (column.headerIcon) iconOnly.innerHTML = ICONS[column.headerIcon];
        return iconOnly;
      }

      var cell = document.createElement("div");
      cell.setAttribute("role", "columnheader");
      var sortable = !!column.sortable;
      cell.className =
        "group flex min-w-0 items-center gap-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s12,12px)] pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s16,16px)] first:pl-[var(--global-spacing-s24,24px)] last:pr-[var(--global-spacing-s24,24px)] border-b border-solid " +
        c.bg + " " + c.border + (sortable ? " cursor-pointer select-none" : "");

      if (isFirst && config.selectable) {
        var cbWrap = document.createElement("span");
        cbWrap.addEventListener("click", function (e) { e.stopPropagation(); });
        cbWrap.appendChild(
          smallCheckbox(allSelected, someSelected, "Select all rows", function (checked) {
            config.rows.forEach(function (r) { selectedIds[r.id] = checked; });
            paint();
          }),
        );
        cell.appendChild(cbWrap);
      }

      var label = document.createElement("span");
      label.className = "type-label-bold-s truncate " + c.text;
      label.textContent = column.header;
      cell.appendChild(label);

      if (column.infoIcon) {
        var info = document.createElement("span");
        info.className = "shrink-0 " + c.iconDefault;
        info.title = column.infoText || "";
        info.innerHTML = ICONS.info;
        cell.appendChild(info);
      }

      if (sortable) {
        var sorted = sortState.key === column.key ? sortState.dir : null;
        var sortIcon = document.createElement("span");
        sortIcon.className =
          "shrink-0 " + (sorted ? c.iconActive : c.iconDefault + " " + c.iconGroupHover) + (sorted === "desc" ? " rotate-180" : "");
        sortIcon.innerHTML = ICONS.sort;
        cell.appendChild(sortIcon);
        cell.addEventListener("click", function () {
          sortState.dir = sortState.key === column.key && sortState.dir === "asc" ? "desc" : "asc";
          sortState.key = column.key;
          paint();
        });
      }

      return cell;
    }

    function bodyCell(column, row, rowIndex, isFirst, rowBg, isExpanded) {
      var cell = document.createElement("div");
      cell.setAttribute("role", "cell");
      cell.className =
        "flex h-[40px] min-w-0 items-center gap-[var(--global-spacing-s8,8px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s10,10px)] first:pl-[var(--global-spacing-s24,24px)] last:pr-[var(--global-spacing-s24,24px)] border-b border-solid " +
        ROW_BORDER + " " + rowBg + " " + ROW_HOVER_GROUP;

      if (isFirst && config.selectable) {
        cell.appendChild(
          smallCheckbox(!!selectedIds[row.id], false, "Select row " + (rowIndex + 1), function (checked) {
            selectedIds[row.id] = checked;
            paint();
          }),
        );
      }
      if (isFirst && config.expandable) {
        var expandBtn = document.createElement("button");
        expandBtn.type = "button";
        expandBtn.setAttribute("aria-expanded", String(isExpanded));
        expandBtn.setAttribute("aria-label", isExpanded ? "Collapse row" : "Expand row");
        expandBtn.className =
          "flex shrink-0 items-center justify-center transition-transform duration-200 " +
          (isExpanded ? "rotate-90 " : "") + ROW_ICON_DEFAULT + " " + ROW_ICON_HOVER;
        expandBtn.innerHTML = ICONS.caret;
        expandBtn.addEventListener("click", function () {
          expandedIds[row.id] = !expandedIds[row.id];
          paint();
        });
        cell.appendChild(expandBtn);
      }

      var contentWrap = document.createElement("div");
      contentWrap.className = "min-w-0 flex-1";
      contentWrap.appendChild(cellContentNode(column, row));
      cell.appendChild(contentWrap);
      return cell;
    }

    paint();
    return {
      repaint: paint,
      getSelectedIds: function () { return Object.keys(selectedIds).filter(function (k) { return selectedIds[k]; }); },
    };
  }

  // ---- Demo data ----
  var INSTANCE_ROWS = [
    { id: "1", name: "web-server-01", status: "running", plan: "Dedicated 4GB", region: "us-east", tags: ["prod", "web"] },
    { id: "2", name: "web-server-02", status: "running", plan: "Dedicated 4GB", region: "us-east", tags: ["prod", "web"] },
    { id: "3", name: "db-primary", status: "running", plan: "High Memory 16GB", region: "eu-west", tags: ["prod", "db"] },
    { id: "4", name: "db-replica", status: "stopped", plan: "High Memory 16GB", region: "eu-west", tags: ["prod", "db", "replica"] },
    { id: "5", name: "batch-worker-01", status: "error", plan: "Shared 2GB", region: "ap-south", tags: ["batch"] },
  ];
  var STATUS_ICON = { running: { icon: "dot", color: "#138246" }, stopped: { icon: "dot", color: "#696970" }, error: { icon: "dot", color: "#B82329" } };
  var STATUS_LABEL = { running: "Running", stopped: "Stopped", error: "Error" };

  var INSTANCE_COLUMNS = [
    { key: "name", header: "Name", sortable: true, cellType: "link", accessor: function (r) { return { label: r.name, href: "#" }; } },
    {
      key: "status",
      header: "Status",
      cellType: "iconText",
      accessor: function (r) { return { label: STATUS_LABEL[r.status], icon: STATUS_ICON[r.status].icon, iconColorHex: STATUS_ICON[r.status].color }; },
    },
    { key: "plan", header: "Plan", cellType: "badge", accessor: function (r) { return { label: r.plan }; } },
    { key: "region", header: "Region", sortable: true, cellType: "text", accessor: function (r) { return r.region; } },
    {
      key: "tags",
      header: "Tags",
      cellType: "custom",
      render: function (r) {
        return (
          '<div style="display:flex;flex-wrap:wrap;gap:4px;">' +
          r.tags.map(function (t) { return badgeHtml(t, "component-badge-neutral-subtle-background", "component-badge-neutral-subtle-text", "rgba(81,81,87,0.12)", "#515157"); }).join("") +
          "</div>"
        );
      },
    },
    { key: "actions", cellType: "actionMenu", actions: [{ label: "Edit", onClick: function () {} }, { label: "Restart", onClick: function () {} }, { label: "Delete", onClick: function () {} }] },
  ];

  var COMPACT_COLUMNS = [
    { key: "name", header: "Name", cellType: "text", accessor: function (r) { return r.name; } },
    { key: "region", header: "Region", cellType: "text", accessor: function (r) { return r.region; } },
    {
      key: "actions",
      header: "Actions",
      cellType: "actionIcons",
      actions: [
        { label: "Edit", icon: "edit", onClick: function () {} },
        { label: "Download", icon: "download", onClick: function () {} },
        { label: "Delete", icon: "del", disabled: function (r) { return r.status === "running"; }, onClick: function () {} },
      ],
    },
  ];

  function sortRows(rows, sortState) {
    if (!sortState.key) return rows;
    var dir = sortState.dir === "desc" ? -1 : 1;
    return rows.slice().sort(function (a, b) {
      return String(a[sortState.key]).localeCompare(String(b[sortState.key])) * dir;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var playgroundEl = document.getElementById("tbl-playground");
    if (playgroundEl) {
      renderTable(playgroundEl, {
        columns: INSTANCE_COLUMNS,
        rows: INSTANCE_ROWS,
        selectable: true,
        expandable: true,
        defaultSelectedIds: ["1"],
        defaultExpandedIds: ["3"],
        defaultSortKey: "name",
        onSort: sortRows,
        renderExpandedContent: function (row) {
          var p = document.createElement("p");
          p.className = "type-body-regular";
          p.style.margin = "0";
          p.textContent = "Expanded details for " + row.name + ": " + row.tags.join(", ") + " — fully consumer-composed content.";
          return p;
        },
        onStateChange: function (state) {
          var el = document.getElementById("tbl-playground-state");
          if (el) el.textContent = "Selected: " + (state.selectedIds.join(", ") || "none") + " · Expanded: " + (state.expandedIds.join(", ") || "none");
        },
      });
    }

    var compactEl = document.getElementById("tbl-compact");
    if (compactEl) {
      renderTable(compactEl, { columns: COMPACT_COLUMNS, rows: INSTANCE_ROWS, headerVariant: "outlined", zebra: true });
    }

    var cellTypesEl = document.getElementById("tbl-cell-types");
    if (cellTypesEl) {
      var showcaseRow = { id: "1", name: "Row 1" };
      var CELL_TYPE_COLUMNS = [
        { key: "text", header: "Text only", cellType: "text", accessor: function () { return "Text"; } },
        { key: "link", header: "Link", cellType: "link", accessor: function () { return { label: "Link", href: "#" }; } },
        { key: "textIcon", header: "Text & icon", cellType: "iconText", accessor: function () { return { label: "Text", icon: "statusAlert" }; } },
        { key: "status", header: "Status", cellType: "iconText", accessor: function () { return { label: "Success", icon: "dot", iconColorHex: "#138246" }; } },
        { key: "badge", header: "Badge", cellType: "badge", accessor: function () { return { label: "Badge" }; } },
        {
          key: "checkboxIconText",
          header: "Checkbox with icon & text",
          cellType: "custom",
          render: function () {
            return (
              '<div style="display:flex;align-items:center;gap:8px;">' +
              '<span aria-hidden="true" class="box-border inline-flex shrink-0 items-center justify-center border border-solid ' +
              CHECKBOX_SMALL_BOX + " " + CHECKBOX_EMPTY + '"></span>' +
              ICONS.caret +
              '<span class="type-body-regular">Text</span></div>'
            );
          },
        },
        {
          key: "radioIconText",
          header: "Radio with icon & text",
          cellType: "custom",
          render: function () {
            return (
              '<div style="display:flex;align-items:center;gap:8px;">' +
              '<span aria-hidden="true" class="box-border shrink-0 rounded-full border border-solid size-[16px] border-[var(--component-radiobutton-inactive-default-border,#83838C)] bg-[var(--component-radiobutton-inactive-default-background,#FFFFFF)]"></span>' +
              ICONS.caret +
              '<span class="type-body-regular">Text</span></div>'
            );
          },
        },
        {
          key: "button",
          header: "Button",
          cellType: "custom",
          render: function () {
            return (
              '<button type="button" class="relative box-border inline-flex shrink-0 items-center justify-center gap-[var(--global-spacing-s4,4px)] whitespace-nowrap text-center transition-colors h-[26px] px-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s4,4px)] type-label-semibold-xs cursor-pointer border border-solid bg-[var(--component-button-secondary-default-background,#FFFFFF)] border-[var(--component-button-secondary-default-border,#0174BC)] text-[color:var(--component-button-secondary-default-text,#0174BC)]"><span>Button</span></button>'
            );
          },
        },
        {
          key: "actionIcons",
          header: "Action icons",
          cellType: "actionIcons",
          actions: [
            { label: "Edit", icon: "edit", onClick: function () {} },
            { label: "Download", icon: "download", onClick: function () {} },
            { label: "Delete", icon: "del", onClick: function () {} },
          ],
        },
        { key: "actionMenu", cellType: "actionMenu", actions: [{ label: "Edit", onClick: function () {} }, { label: "Delete", onClick: function () {} }] },
      ];
      renderTable(cellTypesEl, {
        columns: CELL_TYPE_COLUMNS,
        rows: [showcaseRow],
        expandable: true,
        defaultExpandedIds: ["1"],
        renderExpandedContent: function () {
          var p = document.createElement("p");
          p.className = "type-body-regular";
          p.style.margin = "0";
          p.textContent = 'Expanded content for the "Expandable text" cell type — the row-level expand affordance lands on the first column\'s cell.';
          return p;
        },
      });
    }

    // Header variations — four small tables side by side.
    var headerVariationConfigs = [
      { id: "tbl-hv-filled", headerVariant: "filled", columns: [{ key: "name", header: "Name", sortable: true, infoIcon: true, infoText: "More information", cellType: "text", accessor: function (r) { return r.name; } }] },
      { id: "tbl-hv-outlined", headerVariant: "outlined", columns: [{ key: "name", header: "Name", sortable: true, infoIcon: true, infoText: "More information", cellType: "text", accessor: function (r) { return r.name; } }] },
      { id: "tbl-hv-filled-icon", headerVariant: "filled", columns: [{ key: "actions", cellType: "actionMenu", actions: [{ label: "Edit", onClick: function () {} }] }] },
      { id: "tbl-hv-outlined-icon", headerVariant: "outlined", columns: [{ key: "actions", cellType: "actionMenu", actions: [{ label: "Edit", onClick: function () {} }] }] },
      { id: "tbl-hv-selectable", headerVariant: "filled", selectable: true, columns: [{ key: "name", header: "Name", cellType: "text", accessor: function (r) { return r.name; } }] },
    ];
    headerVariationConfigs.forEach(function (cfg) {
      var el = document.getElementById(cfg.id);
      if (!el) return;
      renderTable(el, { columns: cfg.columns, rows: [{ id: "1", name: "Row 1" }], headerVariant: cfg.headerVariant, selectable: cfg.selectable });
    });

    // Nested table — an expanded row renders a second, independent table via
    // renderExpandedContent. Per design decision, nested tables always keep the default filled
    // (grey) header and pass bordered:false, since they sit inside the outer row's own border.
    var VOLUMES_BY_INSTANCE = {
      "1": [{ id: "v1", name: "boot-disk", size: "25 GB" }, { id: "v2", name: "data-disk", size: "100 GB" }],
      "3": [{ id: "v3", name: "boot-disk", size: "50 GB" }],
    };
    var VOLUME_COLUMNS = [
      { key: "name", header: "Volume", cellType: "text", accessor: function (r) { return r.name; } },
      { key: "size", header: "Size", cellType: "text", accessor: function (r) { return r.size; } },
    ];
    var nestedEl = document.getElementById("tbl-nested");
    if (nestedEl) {
      renderTable(nestedEl, {
        columns: INSTANCE_COLUMNS,
        rows: INSTANCE_ROWS,
        expandable: true,
        defaultExpandedIds: ["1"],
        renderExpandedContent: function (row) {
          var wrap = document.createElement("div");
          wrap.style.cssText = "display:flex;flex-direction:column;gap:8px;width:100%;";
          var volumes = VOLUMES_BY_INSTANCE[row.id];
          if (!volumes) {
            var p = document.createElement("p");
            p.className = "type-body-regular";
            p.style.margin = "0";
            p.textContent = "No volumes attached.";
            wrap.appendChild(p);
            return wrap;
          }
          var label = document.createElement("span");
          label.className = "type-label-semibold-xs";
          label.textContent = "Volumes";
          var inner = document.createElement("div");
          wrap.appendChild(label);
          wrap.appendChild(inner);
          renderTable(inner, { columns: VOLUME_COLUMNS, rows: volumes, bordered: false });
          return wrap;
        },
      });
    }
  });
})();
