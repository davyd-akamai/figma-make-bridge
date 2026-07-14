// Mirrors components/Drawer.tsx's class-selection logic (literal strings copied verbatim) and
// its focus-trap/Esc/backdrop-click/body-scroll-lock behavior — hand-reimplemented in vanilla JS,
// same treatment every other interactive docs page gets, per GUIDELINES.md's "Interactivity is
// real, not static screenshots" call.
(function () {
  var ICON_DEFAULT_CLASS = "text-[color:var(--component-drawer-icon-default,#3D3D42)]";

  var CLOSE_SVG =
    '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.5905 5.59043C15.9166 5.26435 15.9166 4.73565 15.5905 4.40957C15.2644 4.08348 14.7357 4.08348 14.4096 4.40957L10 8.81913L5.59047 4.40957C5.26439 4.08348 4.73569 4.08348 4.4096 4.40957C4.08352 4.73565 4.08352 5.26435 4.4096 5.59043L8.81917 10L4.4096 14.4096C4.08352 14.7357 4.08352 15.2643 4.4096 15.5904C4.73569 15.9165 5.26439 15.9165 5.59047 15.5904L10 11.1809L14.4096 15.5904C14.7357 15.9165 15.2644 15.9165 15.5905 15.5904C15.9166 15.2643 15.9166 14.7357 15.5905 14.4096L11.1809 10L15.5905 5.59043Z"/></svg>';
  var HELP_CIRCLE_SVG =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.0166 13.0225V13.6104H13.1152V13.2617C13.1152 13.1159 13.1471 12.986 13.2109 12.8721C13.2793 12.7581 13.391 12.6396 13.5459 12.5166C13.7054 12.3936 13.9219 12.2454 14.1953 12.0723C14.5827 11.8216 14.8949 11.5664 15.1318 11.3066C15.3688 11.0469 15.542 10.7689 15.6514 10.4727C15.7607 10.1764 15.8154 9.85059 15.8154 9.49512C15.8154 8.74772 15.5306 8.14616 14.9609 7.69043C14.3913 7.23014 13.5892 7 12.5547 7C11.8665 7 11.2308 7.08887 10.6475 7.2666C10.0641 7.43978 9.51497 7.67448 9 7.9707L9.9502 9.83008C10.4059 9.58854 10.8343 9.40625 11.2354 9.2832C11.641 9.16016 12.0169 9.09863 12.3633 9.09863C12.6413 9.09863 12.8669 9.1556 13.04 9.26953C13.2132 9.37891 13.2998 9.5293 13.2998 9.7207C13.2998 9.84375 13.277 9.9668 13.2314 10.0898C13.1859 10.2083 13.0902 10.3405 12.9443 10.4863C12.7985 10.6276 12.5706 10.7962 12.2607 10.9922C11.9372 11.1973 11.6842 11.4023 11.502 11.6074C11.3197 11.8125 11.1921 12.029 11.1191 12.2568C11.0508 12.4847 11.0166 12.7399 11.0166 13.0225Z"/><path d="M11.1396 14.9844C10.8617 15.1803 10.7227 15.5199 10.7227 16.0029C10.7227 16.4632 10.8617 16.7959 11.1396 17.001C11.4222 17.2061 11.764 17.3086 12.165 17.3086C12.5479 17.3086 12.8783 17.2061 13.1562 17.001C13.4388 16.7959 13.5801 16.4632 13.5801 16.0029C13.5801 15.5199 13.4388 15.1803 13.1562 14.9844C12.8783 14.7884 12.5479 14.6904 12.165 14.6904C11.764 14.6904 11.4222 14.7884 11.1396 14.9844Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z"/></svg>';

  var BUTTON_BASE =
    "relative box-border inline-flex shrink-0 items-center justify-center gap-[var(--global-spacing-s4,4px)] whitespace-nowrap text-center transition-colors";
  var BUTTON_CLASSES = {
    link:
      BUTTON_BASE +
      " h-auto p-0 type-label-semibold-s cursor-pointer border-none bg-transparent text-[color:var(--component-button-link-default-text,#0174BC)] hover:text-[color:var(--component-button-link-hover-text,#009CDE)] active:text-[color:var(--component-button-link-active-text,#0174BC)]",
    secondary:
      BUTTON_BASE +
      " h-[34px] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] type-label-semibold-s cursor-pointer border border-solid bg-[var(--component-button-secondary-default-background,#FFFFFF)] border-[var(--component-button-secondary-default-border,#0174BC)] text-[color:var(--component-button-secondary-default-text,#0174BC)] hover:bg-[var(--component-button-secondary-hover-background,#EDF8FF)] hover:border-[var(--component-button-secondary-hover-border,#009CDE)] hover:text-[color:var(--component-button-secondary-hover-text,#0174BC)] active:bg-[var(--component-button-secondary-active-background,#FFFFFF)] active:border-[var(--component-button-secondary-active-border,#0174BC)] active:text-[color:var(--component-button-secondary-active-text,#0174BC)]",
    primary:
      BUTTON_BASE +
      " h-[34px] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] type-label-semibold-s cursor-pointer border border-solid bg-[var(--component-button-primary-default-background,#0174BC)] border-[var(--component-button-primary-default-border,#0174BC)] text-[color:var(--component-button-primary-default-text,#FFFFFF)] hover:bg-[var(--component-button-primary-hover-background,#009CDE)] hover:border-[var(--component-button-primary-hover-border,#009CDE)] hover:text-[color:var(--component-button-primary-hover-text,#FFFFFF)] active:bg-[var(--component-button-primary-active-background,#0174BC)] active:border-[var(--component-button-primary-active-border,#0174BC)] active:text-[color:var(--component-button-primary-active-text,#FFFFFF)]",
  };

  function footerButton(variant, label, onClick) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = BUTTON_CLASSES[variant];
    btn.innerHTML = "<span>" + label + "</span>";
    btn.addEventListener("click", onClick);
    return btn;
  }

  var SIZE_CLASSES = {
    default: "w-[480px] max-w-full",
    small: "w-[300px] max-w-full",
    flexible: "min-w-[300px] w-[600px] max-w-[90vw]",
  };

  var FOCUSABLE_SELECTOR =
    'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

  // config: { size, title, icon (bool), buildFooter?(close) -> HTMLElement[] | null,
  //           buildContent(close) -> HTMLElement[] }
  function createDrawer(config) {
    var wrapper = document.createElement("div");
    wrapper.className = "fixed inset-0 z-[1000] pointer-events-none";
    wrapper.style.display = "none"; // nothing rendered until first open — mirrors hasOpenedOnce

    var backdrop = document.createElement("div");
    backdrop.setAttribute("aria-hidden", "true");

    var aside = document.createElement("aside");
    aside.setAttribute("role", "dialog");
    aside.setAttribute("aria-modal", "true");
    aside.setAttribute("tabindex", "-1");

    var scrollArea = document.createElement("div");
    scrollArea.className =
      "drawer-scroll flex-1 min-h-0 flex flex-col gap-[var(--global-spacing-s24,24px)] p-[var(--global-spacing-s24,24px)] overflow-y-auto";

    var headerRow = document.createElement("div");
    headerRow.className = "flex gap-4 items-start shrink-0 w-full";

    var titleWrap = document.createElement("div");
    titleWrap.className = "flex flex-1 min-w-0 gap-2 items-center";

    if (config.icon) {
      var iconSpan = document.createElement("span");
      iconSpan.setAttribute("aria-hidden", "true");
      iconSpan.className = "shrink-0 size-6 inline-flex items-center justify-center " + ICON_DEFAULT_CLASS;
      iconSpan.innerHTML = HELP_CIRCLE_SVG;
      titleWrap.appendChild(iconSpan);
    }

    var h2 = document.createElement("h2");
    h2.className = "type-heading-m flex-1 min-w-0 [word-break:break-word] text-[color:var(--component-drawer-text,#343438)]";
    h2.textContent = config.title;
    titleWrap.appendChild(h2);

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.className = "shrink-0 size-5 inline-flex items-center justify-center " + ICON_DEFAULT_CLASS + " hover:opacity-80";
    closeBtn.innerHTML = CLOSE_SVG;

    headerRow.appendChild(titleWrap);
    headerRow.appendChild(closeBtn);
    scrollArea.appendChild(headerRow);

    config.buildContent(function () { setOpen(false); }).forEach(function (el) {
      scrollArea.appendChild(el);
    });

    aside.appendChild(scrollArea);

    var footerEl = null;
    if (config.buildFooter) {
      var footerButtons = config.buildFooter(function () { setOpen(false); });
      if (footerButtons && footerButtons.length) {
        footerEl = document.createElement("div");
        footerEl.className =
          "shrink-0 flex items-center justify-end gap-3 px-[var(--global-spacing-s24,24px)] py-[var(--global-spacing-s16,16px)] border-t border-solid border-[var(--component-drawer-border,#D6D6DD)] bg-[var(--component-drawer-background,#FFFFFF)]";
        footerButtons.forEach(function (btn) { footerEl.appendChild(btn); });
        aside.appendChild(footerEl);
      }
    }

    wrapper.appendChild(backdrop);
    wrapper.appendChild(aside);
    document.body.appendChild(wrapper);

    var state = { open: false, hasOpenedOnce: false, previouslyFocused: null };

    function setOpen(next, isInitial) {
      state.open = next;
      if (next && !state.hasOpenedOnce) {
        state.hasOpenedOnce = true;
        wrapper.style.display = "";
      }

      // Always apply the class strings for the current state, even before the first real open —
      // otherwise a never-opened drawer's elements sit classless (default computed opacity: 1,
      // no translate), which only stays invisible by luck of the wrapper's own `display: none`.
      wrapper.className = "fixed inset-0 z-[1000]" + (next ? "" : " pointer-events-none");

      backdrop.className =
        "absolute inset-0 bg-[var(--component-drawer-overlay,rgba(35,35,38,0.24))] transition-opacity duration-200 ease-in-out " +
        (next ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none");

      aside.className =
        "absolute right-0 top-0 h-full box-border flex flex-col bg-[var(--component-drawer-background,#FFFFFF)] shadow-[var(--component-drawer-elevation-right,-16px_0px_32px_0px_rgba(61,61,66,0.18))] transition-[transform,opacity] duration-300 ease-out " +
        (next ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none") +
        " " +
        SIZE_CLASSES[config.size];
      aside.setAttribute("aria-hidden", next ? "false" : "true");

      if (isInitial) return; // establishing the closed-state classes only, no side effects yet

      if (next) {
        state.previouslyFocused = document.activeElement;
        document.body.style.overflow = "hidden";
        requestAnimationFrame(function () { aside.focus({ preventScroll: true }); });
      } else {
        document.body.style.overflow = "";
        if (state.previouslyFocused && state.previouslyFocused.focus) {
          state.previouslyFocused.focus({ preventScroll: true });
        }
      }
    }

    setOpen(false, true);

    backdrop.addEventListener("click", function () { setOpen(false); });
    closeBtn.addEventListener("click", function () { setOpen(false); });

    document.addEventListener(
      "keydown",
      function (e) {
        if (!state.open) return;
        if (e.key === "Escape") {
          e.preventDefault();
          setOpen(false);
          return;
        }
        if (e.key === "Tab") {
          var focusable = Array.prototype.slice.call(aside.querySelectorAll(FOCUSABLE_SELECTOR));
          if (!focusable.length) return;
          var first = focusable[0];
          var last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      },
      true,
    );

    return { open: function () { setOpen(true); } };
  }

  function paragraph(text) {
    var p = document.createElement("p");
    p.className = "type-body-regular";
    p.style.margin = "0";
    p.textContent = text;
    return p;
  }

  function longContentParagraphs() {
    var out = [];
    for (var i = 1; i <= 20; i++) {
      out.push(
        paragraph(
          "Content block " + i + ". This paragraph exists only to give the drawer enough content " +
          "height to overflow the panel, so the two footer-button placements can be compared.",
        ),
      );
    }
    return out;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var defaultDrawer = createDrawer({
      size: "default",
      title: "Header title",
      icon: true,
      buildContent: function () {
        return [
          paragraph(
            "Default (480px) drawer content goes here. This slot is fully consumer-composed — the " +
            "drawer only owns the header, optional footer, and scroll behavior around it. The footer " +
            "buttons shown here are just one example composition — how many buttons, and whether a " +
            "Link button is included at all, is a per-drawer design decision, not something this " +
            "component enforces.",
          ),
        ];
      },
      buildFooter: function (close) {
        return [
          footerButton("link", "Button", close),
          footerButton("secondary", "Cancel", close),
          footerButton("primary", "Apply", close),
        ];
      },
    });

    var smallDrawer = createDrawer({
      size: "small",
      title: "Header title",
      icon: true,
      buildContent: function () {
        return [paragraph("Small (300px) drawer content goes here. No Link button this time — the footer only needs Cancel/Apply.")];
      },
      buildFooter: function (close) {
        return [footerButton("secondary", "Cancel", close), footerButton("primary", "Apply", close)];
      },
    });

    var flexibleDrawer = createDrawer({
      size: "flexible",
      title: "Header title",
      icon: true,
      buildContent: function () {
        return [paragraph("Flexible (min 300px) drawer content goes here. A single primary button is enough for this footer.")];
      },
      buildFooter: function (close) {
        return [footerButton("primary", "Done", close)];
      },
    });

    var noFooterDrawer = createDrawer({
      size: "default",
      title: "Header title",
      icon: false,
      buildContent: function () {
        return [paragraph("A drawer with no leading icon and no footer — both are optional.")];
      },
    });

    var stickyFooterDrawer = createDrawer({
      size: "default",
      title: "Sticky footer",
      icon: false,
      buildContent: longContentParagraphs,
      buildFooter: function (close) {
        return [footerButton("secondary", "Cancel", close), footerButton("primary", "Apply", close)];
      },
    });

    var inlineFooterDrawer = createDrawer({
      size: "default",
      title: "Buttons after content",
      icon: false,
      buildContent: function (close) {
        var content = longContentParagraphs();
        var row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "flex-end";
        row.style.gap = "12px";
        row.appendChild(footerButton("secondary", "Cancel", close));
        row.appendChild(footerButton("primary", "Apply", close));
        content.push(row);
        return content;
      },
      // No buildFooter — Cancel/Apply are just the last elements of the content, scrolling with it.
    });

    document.getElementById("dr-open-default").addEventListener("click", defaultDrawer.open);
    document.getElementById("dr-open-small").addEventListener("click", smallDrawer.open);
    document.getElementById("dr-open-flexible").addEventListener("click", flexibleDrawer.open);
    document.getElementById("dr-open-nofooter").addEventListener("click", noFooterDrawer.open);
    document.getElementById("dr-open-sticky").addEventListener("click", stickyFooterDrawer.open);
    document.getElementById("dr-open-inline").addEventListener("click", inlineFooterDrawer.open);
  });
})();
