// Mirrors components/Pagination.tsx (class strings copied verbatim, hand-reimplemented in vanilla JS):
// table / list bars, the page-size menu (fixed-position "portal" on document.body, flips above the trigger
// when there is no room below, same technique as content-panel.js / select.js), the prev/next arithmetic
// and the list "selected" bar with the Checkbox classes from checkbox.js. Re-renders replace innerHTML,
// which is fine here: nothing in the bar holds text-input focus.
(function () {
  var CHEVRON_LEFT = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.9096 10.5904C6.58352 10.2643 6.58352 9.73561 6.9096 9.40953L11.9096 4.40953C12.2357 4.08344 12.7644 4.08344 13.0905 4.40953C13.4166 4.73561 13.4166 5.26431 13.0905 5.59039L8.68091 9.99996L13.0905 14.4095C13.4166 14.7356 13.4166 15.2643 13.0905 15.5904C12.7644 15.9165 12.2357 15.9165 11.9096 15.5904L6.9096 10.5904Z"/></svg>';
  var CHEVRON_RIGHT = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.0904 9.40961C13.4165 9.73569 13.4165 10.2644 13.0904 10.5905L8.09039 15.5905C7.76431 15.9166 7.23561 15.9166 6.90953 15.5905C6.58344 15.2644 6.58344 14.7357 6.90953 14.4096L11.3191 10L6.90953 5.59047C6.58344 5.26439 6.58344 4.73569 6.90953 4.4096C7.23561 4.08352 7.76431 4.08352 8.09039 4.4096L13.0904 9.40961Z"/></svg>';
  var CHEVRON_DOWN = '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.53 5.5297C3.789 5.27 4.21 5.27 4.47 5.5297L8 9.0595L11.53 5.5297C11.789 5.27 12.21 5.27 12.47 5.5297C12.73 5.7894 12.73 6.2105 12.47 6.4702L8.47 10.4702C8.21 10.7299 7.789 10.7299 7.53 10.4702L3.53 6.4702C3.27 6.2105 3.27 5.7894 3.53 5.5297Z"/></svg>';
  var CHECK = '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.46967 6.06952C1.76256 5.77663 2.23744 5.77663 2.53033 6.06952L4.93032 8.46951C5.22321 8.76241 5.22321 9.23728 4.93032 9.53017C4.63743 9.82307 4.16255 9.82307 3.86966 9.53017L1.46967 7.13018C1.17678 6.83729 1.17678 6.36242 1.46967 6.06952Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5303 2.86957C10.8232 3.16247 10.8232 3.63734 10.5303 3.93023L4.93032 9.53017C4.63743 9.82307 4.16255 9.82307 3.86966 9.53017C3.57677 9.23728 3.57669 8.76256 3.86958 8.46966L9.46967 2.86957C9.76256 2.57668 10.2374 2.57668 10.5303 2.86957Z"/></svg>';

  var FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alias-interaction-border-focus,#0174BC)]";
  var ICON_ON = "cursor-pointer text-[color:var(--component-pagination-icon-default,#3D3D42)] hover:text-[color:var(--component-pagination-icon-hover,#009CDE)] active:text-[color:var(--component-pagination-icon-active,#0174BC)]";
  var ICON_OFF = "cursor-not-allowed text-[color:var(--component-pagination-icon-disabled,#A3A3AB)]";
  var LINK_ON = "cursor-pointer text-[color:var(--component-pagination-text-link,#0174BC)] hover:text-[color:var(--component-pagination-text-hover,#009CDE)]";
  var LINK_OFF = "cursor-not-allowed text-[color:var(--component-pagination-text-disabled,#A3A3AB)]";
  var MENU = "flex min-w-[80px] flex-col items-stretch bg-[var(--component-dropdown-background-default,#FFFFFF)] py-[var(--global-spacing-s4,4px)] shadow-[var(--component-dropdown-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))]";
  var MENU_ROW = "h-[36px] cursor-pointer px-[var(--global-spacing-s12,12px)] text-left text-[color:var(--component-dropdown-text-default,#343438)] hover:bg-[var(--component-dropdown-background-hover,#EDF8FF)] " + FOCUS_RING;
  var OPTIONS = [10, 20, 50, 100];
  var ROW = 36;

  var BOX_LARGE = "size-[20px] p-[var(--global-spacing-s4,4px)]";
  var BOXI_E = "border-[var(--component-checkbox-empty-default-border,#83838C)] bg-[var(--component-checkbox-empty-default-background,#FFFFFF)] peer-hover:border-[var(--component-checkbox-empty-hover-border,#009CDE)] peer-focus-visible:border-[var(--component-checkbox-empty-active-border,#0174BC)]";
  var BOXI_C = "border-[var(--component-checkbox-checked-default-background,#0174BC)] bg-[var(--component-checkbox-checked-default-background,#0174BC)] peer-hover:border-[var(--component-checkbox-checked-hover-background,#009CDE)] peer-hover:bg-[var(--component-checkbox-checked-hover-background,#009CDE)] peer-focus-visible:border-[var(--component-checkbox-checked-active-background,#0174BC)] peer-focus-visible:bg-[var(--component-checkbox-checked-active-background,#0174BC)]";
  var BOXD_E = "border-[var(--component-checkbox-empty-disabled-border,#C2C2CA)] bg-[var(--component-checkbox-empty-disabled-background,#E5E5EA)]";
  var ICONI_C = "text-[color:var(--component-checkbox-checked-default-icon,#FFFFFF)]";
  var TXT_E = "text-[color:var(--component-checkbox-empty-default-text,#343438)]";
  var TXT_C = "text-[color:var(--component-checkbox-checked-default-text,#343438)]";
  var TXTD_E = "text-[color:var(--component-checkbox-empty-disabled-text,#A3A3AB)]";

  var uid = 0;
  var openMenu = null;
  function closeMenu() {
    if (!openMenu) return;
    openMenu.el.remove();
    openMenu.trigger.setAttribute("aria-expanded", "false");
    document.removeEventListener("mousedown", openMenu.onOutside);
    document.removeEventListener("keydown", openMenu.onKey);
    openMenu = null;
  }

  function mount(root, cfg) {
    var s = {
      variant: cfg.variant || "table",
      length: cfg.length == null ? 50 : cfg.length,
      page: 1,
      size: cfg.size || 20,
      disabled: !!cfg.disabled,
      selectable: !!cfg.selectable,
      selected: cfg.selected || 0,
      selectedOnly: false,
    };
    var inSel = function () { return s.selectable && s.variant === "list"; };
    var lastPage = function () { return Math.max(1, Math.ceil(s.length / s.size)); };
    var notify = function () { if (cfg.onChange) cfg.onChange(s); };

    function chevron(dir, disabled) {
      return '<button type="button" data-act="' + dir + '" aria-label="' + (dir === "prev" ? "Previous page" : "Next page") + '"' + (disabled ? " disabled" : "") +
        ' class="flex size-[20px] shrink-0 items-center justify-center ' + (disabled ? ICON_OFF : ICON_ON) + " " + FOCUS_RING + '">' +
        (dir === "prev" ? CHEVRON_LEFT : CHEVRON_RIGHT) + "</button>";
    }
    function picker(flush) {
      var d = s.disabled;
      return '<div class="flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)] py-[var(--global-spacing-s8,8px)] pr-[var(--global-spacing-s8,8px)] ' + (flush ? "" : "pl-[var(--global-spacing-s8,8px)]") + '">' +
        "<span>Page size:</span>" +
        '<button type="button" data-act="size" aria-haspopup="menu" aria-expanded="false" aria-label="Page size: ' + s.size + '"' + (d ? " disabled" : "") +
        ' class="type-label-semibold-s flex items-center ' + (d ? "cursor-not-allowed text-[color:var(--component-pagination-text-disabled,#A3A3AB)]" : LINK_ON) + " " + FOCUS_RING + '">' +
        s.size + '<span class="' + (d ? "text-[color:var(--component-pagination-icon-disabled,#A3A3AB)]" : "text-[color:var(--component-pagination-icon-default,#3D3D42)]") + '" style="display:inline-flex">' + CHEVRON_DOWN + "</span></button></div>";
    }
    function controls() {
      var page = Math.min(s.page, lastPage());
      var start = s.length > 0 ? (page - 1) * s.size + 1 : 0;
      var end = Math.min(page * s.size, s.length);
      var range = s.length > 0 ? start + " - " + end + " of " + s.length : "0 of 0";
      return '<div class="flex shrink-0 items-center justify-end gap-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s8,8px)]">' +
        chevron("prev", s.disabled || page <= 1) + '<span aria-live="polite" class="text-center">' + range + "</span>" +
        chevron("next", s.disabled || page * s.size >= s.length) + "</div>";
    }
    function action(label, count, off, act) {
      return '<button type="button" data-act="' + act + '"' + (off ? " disabled" : "") +
        ' class="flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)] p-[var(--global-spacing-s8,8px)] whitespace-nowrap ' + (off ? LINK_OFF : LINK_ON) + " " + FOCUS_RING + '"><span>' + label + "</span><span>" + count + "</span></button>";
    }
    var divider = '<span aria-hidden="true" class="h-[24px] w-px shrink-0 bg-[var(--component-pagination-divider-border,#D6D6DD)]"></span>';
    var rootClass = "type-label-regular-s box-border flex h-[40px] w-full items-center border-y border-solid border-[var(--component-pagination-border,#D6D6DD)] bg-[var(--component-pagination-background,#FFFFFF)] pl-[var(--global-spacing-s12,12px)] text-[color:var(--component-pagination-text-default,#343438)] whitespace-nowrap";

    function paint() {
      closeMenu();
      if (s.selected === 0 && s.selectedOnly) { s.selectedOnly = false; notify(); }
      var html;
      if (inSel()) {
        var off = s.disabled || s.selected === 0;
        var id = "pg-cb-" + (++uid);
        var checked = s.selectedOnly && !off;
        var box = "box-border flex shrink-0 items-center justify-center border border-solid " + BOX_LARGE + " " + (off ? BOXD_E : checked ? BOXI_C : BOXI_E);
        html = '<div class="' + rootClass + ' gap-[var(--global-spacing-s24,24px)]">' +
          '<div class="flex shrink-0 items-center">' +
          '<div class="flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)] py-[var(--global-spacing-s8,8px)] pr-[var(--global-spacing-s8,8px)]"><span>Items:</span><span>' + s.length + "</span></div>" +
          divider + action("Select:", s.length, s.disabled || s.length === 0, "select-all") +
          divider + action("Deselect:", s.selected, s.disabled || s.selected === 0, "deselect-all") + "</div>" +
          '<div class="flex items-start gap-[var(--global-spacing-s4,4px)]"><label for="' + id + '" class="flex items-start gap-[var(--global-spacing-s8,8px)] ' + (off ? "cursor-not-allowed" : "cursor-pointer") + '">' +
          '<span class="relative inline-flex shrink-0 items-center"><input id="' + id + '" data-act="selected-only" type="checkbox" class="peer sr-only"' + (checked ? " checked" : "") + (off ? " disabled" : "") + ' />' +
          '<span aria-hidden="true" class="' + box + '">' + (checked ? '<span class="' + ICONI_C + '" style="display:inline-flex">' + CHECK + "</span>" : "") + "</span></span>" +
          '<span class="type-label-regular-s pt-[var(--global-spacing-s2,2px)] ' + (off ? TXTD_E : checked ? TXT_C : TXT_E) + '">Selected only ' + s.selected + "</span></label></div></div>";
      } else if (s.variant === "list") {
        html = '<div class="' + rootClass + '"><div class="flex min-w-0 flex-1 items-center">' + picker(true) + "</div>" + controls() + "</div>";
      } else {
        html = '<div class="' + rootClass + '"><div class="flex min-w-0 flex-1 items-center gap-[var(--global-spacing-s4,4px)] py-[var(--global-spacing-s8,8px)] pr-[var(--global-spacing-s8,8px)]"><span>Items:</span><span>' + s.length + "</span></div>" +
          '<div class="flex shrink-0 items-center gap-[var(--global-spacing-s16,16px)]">' + picker(false) + controls() + "</div></div>";
      }
      root.innerHTML = html;
    }

    function toggleMenu(trigger) {
      var was = openMenu && openMenu.trigger === trigger;
      closeMenu();
      if (was) return;
      var r = trigger.getBoundingClientRect();
      var up = window.innerHeight - r.bottom < OPTIONS.length * ROW + 16;
      var el = document.createElement("div");
      el.setAttribute("role", "menu");
      el.setAttribute("aria-label", "Page size:");
      el.className = MENU;
      el.style.cssText = "position:fixed;left:" + r.left + "px;" + (up ? "bottom:" + (window.innerHeight - r.top) + "px;" : "top:" + r.bottom + "px;") + "z-index:1000;";
      OPTIONS.forEach(function (n) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("role", "menuitemradio");
        b.setAttribute("aria-checked", String(n === s.size));
        b.className = (n === s.size ? "type-label-semibold-s" : "type-label-regular-s") + " " + MENU_ROW;
        b.textContent = n;
        b.addEventListener("click", function () {
          if (n !== s.size) {
            // Keep the first visible item on screen: page 2 of 10 -> page 3 of 5.
            s.page = Math.floor(((Math.min(s.page, lastPage()) - 1) * s.size) / n) + 1;
            s.size = n;
            notify();
          }
          paint();
        });
        el.appendChild(b);
      });
      document.body.appendChild(el);
      trigger.setAttribute("aria-expanded", "true");
      var onOutside = function (e) { if (!el.contains(e.target) && !trigger.contains(e.target)) closeMenu(); };
      var onKey = function (e) {
        if (e.key === "Escape") { closeMenu(); trigger.focus(); }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          var items = Array.prototype.slice.call(el.querySelectorAll('[role="menuitemradio"]'));
          var i = items.indexOf(document.activeElement);
          items[(e.key === "ArrowDown" ? i + 1 : i - 1 + items.length) % items.length].focus();
        }
      };
      document.addEventListener("mousedown", onOutside);
      document.addEventListener("keydown", onKey);
      openMenu = { el: el, trigger: trigger, onOutside: onOutside, onKey: onKey };
      var cur = el.querySelector('[aria-checked="true"]');
      if (cur) cur.focus();
    }

    root.addEventListener("click", function (e) {
      var t = e.target.closest("[data-act]");
      if (!t || t.disabled) return;
      var a = t.getAttribute("data-act");
      if (a === "prev") { s.page = Math.min(s.page, lastPage()) - 1; notify(); paint(); }
      else if (a === "next") { s.page = Math.min(s.page, lastPage()) + 1; notify(); paint(); }
      else if (a === "size") toggleMenu(t);
      else if (a === "select-all") { s.selected = s.length; if (cfg.onSelectAll) cfg.onSelectAll(); notify(); paint(); }
      else if (a === "deselect-all") { s.selected = 0; if (cfg.onDeselectAll) cfg.onDeselectAll(); notify(); paint(); }
    });
    root.addEventListener("change", function (e) {
      if (e.target.getAttribute("data-act") === "selected-only") { s.selectedOnly = e.target.checked; notify(); paint(); }
    });
    paint();
    return { state: s, set: function (patch) { for (var k in patch) s[k] = patch[k]; paint(); } };
  }

  document.addEventListener("DOMContentLoaded", function () {
    var logTable = document.getElementById("pg-table-log");
    mount(document.getElementById("pg-table"), { variant: "table", length: 50, size: 20, onChange: function (s) {
      logTable.textContent = "page " + Math.min(s.page, Math.max(1, Math.ceil(s.length / s.size))) + ", size " + s.size;
    } });
    mount(document.getElementById("pg-list"), { variant: "list", length: 95, size: 10 });
    mount(document.getElementById("pg-disabled"), { variant: "table", disabled: true });
    mount(document.getElementById("pg-empty"), { variant: "table", length: 0 });

    // List selected: the chips below are the "list" the bar controls.
    var chips = document.getElementById("pg-chips");
    var on = {};
    var ctl;
    // Plain inline styles: docs/ is excluded from the Tailwind scan, so no invented utility classes here.
    function chipStyle(i) {
      return "font:inherit;font-size:14px;line-height:16px;height:24px;padding:0 8px;cursor:pointer;border:1px solid #0174BC;" +
        (on[i] ? "background:#0174BC;color:#fff;" : "background:#fff;color:#0174BC;");
    }
    function paintChips() {
      var only = ctl && ctl.state.selectedOnly;
      var html = "";
      for (var i = 1; i <= 20; i++) if (!only || on[i]) html += '<button type="button" data-i="' + i + '" style="' + chipStyle(i) + '">Item ' + i + "</button>";
      chips.innerHTML = html;
    }
    function count() { return Object.keys(on).filter(function (k) { return on[k]; }).length; }
    ctl = mount(document.getElementById("pg-selected"), {
      variant: "list", selectable: true, length: 20,
      onSelectAll: function () { for (var i = 1; i <= 20; i++) on[i] = true; },
      onDeselectAll: function () { on = {}; },
      onChange: function () { paintChips(); },
    });
    chips.addEventListener("click", function (e) {
      var b = e.target.closest("[data-i]");
      if (!b) return;
      on[b.getAttribute("data-i")] = !on[b.getAttribute("data-i")];
      ctl.set({ selected: count() });
      paintChips();
    });
    paintChips();
  });
})();
