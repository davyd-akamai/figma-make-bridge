// Mirrors components/ContentPanel.tsx (class strings copied verbatim, hand-reimplemented in vanilla JS):
// collapsible header (caret rotates -90deg, body animates via grid-template-rows), icon actions (max 3
// including the more trigger) and a label-only "..." dropdown, rendered as a fixed-position "portal" on
// document.body (same technique as table.js / select.js) so no ancestor overflow can clip it.
(function () {
  var ICONS = {"caret": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M15.5905 8.09047L10.5905 13.0905C10.2644 13.4166 9.73572 13.4166 9.40963 13.0905L4.40963 8.09047C4.17082 7.85167 4.09938 7.49252 4.22862 7.1805C4.35787 6.86848 4.66234 6.66504 5.00006 6.66504H15.0001C15.3378 6.66504 15.6423 6.86848 15.7715 7.1805C15.9007 7.49252 15.8293 7.85167 15.5905 8.09047Z\"/></svg>", "download": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M10.8349 2.50001C10.8349 2.03885 10.461 1.66501 9.99986 1.66501C9.5387 1.66501 9.16486 2.03885 9.16486 2.50001V10.4842L6.4236 7.74295C6.09752 7.41686 5.56882 7.41686 5.24274 7.74295C4.91665 8.06904 4.91665 8.59773 5.24274 8.92382L9.4094 13.0905C9.50479 13.1859 9.61752 13.2534 9.73744 13.2929C9.79172 13.3109 9.84846 13.3234 9.90703 13.3299C9.967 13.3366 10.0275 13.3368 10.0875 13.3305C10.2711 13.3112 10.4496 13.2312 10.5903 13.0905L14.7569 8.92382C15.083 8.59773 15.083 8.06904 14.7569 7.74295C14.4309 7.41686 13.9022 7.41686 13.5761 7.74295L10.8349 10.4842V2.50001ZM3.33154 17.5C3.33154 17.0388 3.70539 16.665 4.16654 16.665H15.8332C16.2944 16.665 16.6682 17.0388 16.6682 17.5C16.6682 17.9612 16.2944 18.335 15.8332 18.335H4.16654C3.70539 18.335 3.33154 17.9612 3.33154 17.5Z\"/></svg>", "edit": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M15.0001 3.47798C14.8002 3.47798 14.6023 3.51735 14.4176 3.59384C14.2329 3.67033 14.0652 3.78244 13.9238 3.92377L4.49729 13.3504L3.69012 16.31L6.64976 15.5028L16.0763 6.07624C16.2176 5.93491 16.3297 5.76712 16.4062 5.58246C16.4827 5.3978 16.5221 5.19988 16.5221 5.00001C16.5221 4.80013 16.4827 4.60221 16.4062 4.41755C16.3297 4.23289 16.2176 4.06511 16.0763 3.92377C15.935 3.78244 15.7672 3.67033 15.5825 3.59384C15.3979 3.51735 15.1999 3.47798 15.0001 3.47798ZM13.7785 2.05096C14.1658 1.89055 14.5809 1.80798 15.0001 1.80798C15.4192 1.80798 15.8343 1.89055 16.2216 2.05096C16.6089 2.21138 16.9608 2.4465 17.2572 2.74291C17.5536 3.03931 17.7887 3.3912 17.9491 3.77847C18.1095 4.16575 18.1921 4.58083 18.1921 5.00001C18.1921 5.41919 18.1095 5.83426 17.9491 6.22154C17.7887 6.60882 17.5536 6.9607 17.2572 7.25711L7.67383 16.8405C7.57108 16.9432 7.44329 17.0174 7.30309 17.0556L2.71976 18.3056C2.43067 18.3845 2.12151 18.3024 1.90962 18.0905C1.69774 17.8786 1.61564 17.5694 1.69448 17.2803L2.94448 12.697C2.98271 12.5568 3.05687 12.429 3.15962 12.3263L12.743 2.74291L13.3334 3.33334L12.743 2.74291C13.0394 2.4465 13.3913 2.21138 13.7785 2.05096Z\"/></svg>", "del": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M7.74532 3.5786C7.90128 3.42263 8.11282 3.33501 8.33339 3.33501H11.6667C11.8873 3.33501 12.0988 3.42263 12.2548 3.5786C12.4108 3.73457 12.4984 3.9461 12.4984 4.16667V4.99838H7.50173V4.16667C7.50173 3.9461 7.58935 3.73457 7.74532 3.5786ZM5.83173 4.99838V4.16667C5.83173 3.50319 6.09529 2.86688 6.56445 2.39773C7.0336 1.92858 7.66991 1.66501 8.33339 1.66501H11.6667C12.3302 1.66501 12.9665 1.92858 13.4357 2.39773C13.9048 2.86688 14.1684 3.50319 14.1684 4.16667V4.99838H15.8251L15.8334 4.99834L15.8417 4.99838H17.5C17.9612 4.99838 18.335 5.37222 18.335 5.83338C18.335 6.29454 17.9612 6.66838 17.5 6.66838H16.6684V15.8333C16.6684 16.4968 16.4048 17.1331 15.9357 17.6023C15.4665 18.0714 14.8302 18.335 14.1667 18.335H5.83339C5.16991 18.335 4.5336 18.0714 4.06445 17.6023C3.59529 17.1331 3.33173 16.4968 3.33173 15.8333V6.66838H2.50004C2.03888 6.66838 1.66504 6.29454 1.66504 5.83338C1.66504 5.37222 2.03888 4.99838 2.50004 4.99838H4.15839L4.16673 4.99834L4.17506 4.99838H5.83173ZM5.00173 6.66838V15.8333C5.00173 16.0539 5.08935 16.2654 5.24532 16.4214C5.40128 16.5774 5.61282 16.665 5.83339 16.665H14.1667C14.3873 16.665 14.5988 16.5774 14.7548 16.4214C14.9108 16.2654 14.9984 16.0539 14.9984 15.8333V6.66838H5.00173ZM8.33335 8.33163C8.79451 8.33163 9.16835 8.70548 9.16835 9.16663V14.1666C9.16835 14.6278 8.79451 15.0016 8.33335 15.0016C7.87219 15.0016 7.49835 14.6278 7.49835 14.1666V9.16663C7.49835 8.70548 7.87219 8.33163 8.33335 8.33163ZM12.5017 9.16663C12.5017 8.70548 12.1279 8.33163 11.6667 8.33163C11.2056 8.33163 10.8317 8.70548 10.8317 9.16663V14.1666C10.8317 14.6278 11.2056 15.0016 11.6667 15.0016C12.1279 15.0016 12.5017 14.6278 12.5017 14.1666V9.16663Z\"/></svg>", "more": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M5 10C3.8954 10 3 10.8954 3 12C3 13.1046 3.8954 14 5 14C6.1046 14 7 13.1046 7 12C7 10.8954 6.1046 10 5 10ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z\"/></svg>"};
  var FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alias-interaction-border-focus,#0174BC)]";
  var ICON_BUTTON = "flex size-[20px] shrink-0 cursor-pointer items-center justify-center text-[color:var(--component-contentpanel-icon,#3D3D42)] hover:text-[color:var(--alias-content-icon-primary-hover,#009CDE)] disabled:cursor-not-allowed disabled:text-[color:var(--alias-content-icon-primary-disabled,#A3A3AB)]";
  var LABEL = "type-label-bold-l min-w-0 text-left text-[color:var(--component-contentpanel-text,#343438)]";
  var MENU = "flex min-w-[160px] flex-col items-stretch bg-[var(--component-dropdown-background-default,#FFFFFF)] py-[var(--global-spacing-s4,4px)] shadow-[var(--component-dropdown-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))]";
  var MENU_ITEM = "type-label-regular-s px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] text-left";
  var MENU_ITEM_ON = "cursor-pointer text-[color:var(--component-dropdown-text-default,#343438)] hover:bg-[var(--component-dropdown-background-hover,#EDF8FF)]";
  var MENU_ITEM_OFF = "cursor-not-allowed text-[color:var(--component-dropdown-text-disabled,#A3A3AB)]";
  var log = document.getElementById("cp-log");
  function say(t) { if (log) log.textContent = t; }

  // Same split as splitActions() in ContentPanel.tsx.
  function split(actions) {
    var wantsIcon = function (a) { return a.placement !== "menu" && a.icon; };
    var cands = actions.filter(wantsIcon);
    var hasMenuOnly = actions.some(function (a) { return !wantsIcon(a); });
    var max = hasMenuOnly || cands.length > 3 ? 2 : 3;
    var ids = cands.slice(0, max).map(function (a) { return a.id; });
    return {
      icons: actions.filter(function (a) { return ids.indexOf(a.id) !== -1; }),
      menu: actions.filter(function (a) { return ids.indexOf(a.id) === -1; }),
    };
  }

  var openMenu = null;
  function closeMenu() {
    if (!openMenu) return;
    openMenu.el.remove();
    openMenu.trigger.setAttribute("aria-expanded", "false");
    document.removeEventListener("mousedown", openMenu.onOutside);
    document.removeEventListener("keydown", openMenu.onKey);
    openMenu = null;
  }
  function toggleMenu(trigger, actions) {
    var wasOpen = openMenu && openMenu.trigger === trigger;
    closeMenu();
    if (wasOpen) return;
    var el = document.createElement("div");
    el.setAttribute("role", "menu");
    el.setAttribute("aria-label", "More actions");
    el.className = MENU;
    var r = trigger.getBoundingClientRect();
    el.style.cssText = "position:fixed;top:" + r.bottom + "px;right:" + (window.innerWidth - r.right) + "px;z-index:1000;";
    actions.forEach(function (a) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "menuitem");
      b.disabled = !!a.disabled;
      b.className = MENU_ITEM + " " + (a.disabled ? MENU_ITEM_OFF : MENU_ITEM_ON);
      b.textContent = a.label;
      b.addEventListener("click", function () { a.onClick(); closeMenu(); });
      el.appendChild(b);
    });
    document.body.appendChild(el);
    trigger.setAttribute("aria-expanded", "true");
    var onOutside = function (e) { if (!el.contains(e.target) && !trigger.contains(e.target)) closeMenu(); };
    var onKey = function (e) { if (e.key === "Escape") closeMenu(); };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onKey);
    openMenu = { el: el, trigger: trigger, onOutside: onOutside, onKey: onKey };
  }

  var uid = 0;
  function createPanel(root, cfg) {
    var expanded = cfg.defaultExpanded !== false;
    var expandable = cfg.expandable !== false;
    var type = cfg.type || "default";
    var actions = cfg.actions || [];
    var hasBody = cfg.body != null;
    var bodyId = "cp-body-" + (++uid);
    var sp = split(actions);
    var isExp = function () { return !expandable || expanded; };

    root.className = "box-border flex w-full flex-col items-start bg-[var(--component-contentpanel-background,#FFFFFF)] " +
      (type === "default" ? "border border-solid border-[var(--component-contentpanel-border,#D6D6DD)]" : "");

    var header = document.createElement("div");
    header.className = "flex min-h-[56px] w-full items-stretch";
    var toggleBtn = null, caret = null;
    if (expandable) {
      toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      if (hasBody) toggleBtn.setAttribute("aria-controls", bodyId);
      toggleBtn.className = "flex min-w-0 flex-1 cursor-pointer items-center gap-[var(--global-spacing-s8,8px)] pl-[var(--global-spacing-s24,24px)] text-[color:var(--component-contentpanel-icon,#3D3D42)] " + FOCUS_RING + " focus-visible:-outline-offset-2";
      toggleBtn.innerHTML = '<span aria-hidden="true" class="shrink-0 transition-transform duration-[350ms] ease-linear" style="display:inline-flex">' + ICONS.caret + '</span><span class="' + LABEL + '">' + cfg.title + "</span>";
      caret = toggleBtn.firstChild;
      header.appendChild(toggleBtn);
    } else {
      var plain = document.createElement("div");
      plain.className = "flex min-w-0 flex-1 items-center pl-[var(--global-spacing-s24,24px)]";
      plain.innerHTML = '<span class="' + LABEL + '">' + cfg.title + "</span>";
      header.appendChild(plain);
    }
    if (sp.icons.length || sp.menu.length) {
      var ctl = document.createElement("div");
      ctl.className = "flex shrink-0 items-center gap-[var(--global-spacing-s8,8px)] pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s24,24px)]";
      sp.icons.forEach(function (a) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", a.label);
        b.title = a.label;
        b.disabled = !!a.disabled;
        b.className = ICON_BUTTON + " " + FOCUS_RING;
        b.innerHTML = a.icon;
        b.addEventListener("click", a.onClick);
        ctl.appendChild(b);
      });
      if (sp.menu.length) {
        var m = document.createElement("button");
        m.type = "button";
        m.setAttribute("aria-haspopup", "menu");
        m.setAttribute("aria-expanded", "false");
        m.setAttribute("aria-label", "More actions");
        m.className = ICON_BUTTON + " " + FOCUS_RING;
        m.innerHTML = ICONS.more;
        m.addEventListener("click", function () { toggleMenu(m, sp.menu); });
        ctl.appendChild(m);
      }
      header.appendChild(ctl);
    }
    root.appendChild(header);

    var body = null;
    if (hasBody) {
      body = document.createElement("div");
      body.id = bodyId;
      body.setAttribute("role", "region");
      body.innerHTML = '<div class="min-h-0 overflow-hidden"><div class="border-t border-solid border-[var(--component-contentpanel-divider,#D6D6DD)] px-[var(--global-spacing-s24,24px)] py-[var(--global-spacing-s16,16px)]">' + cfg.body + "</div></div>";
      root.appendChild(body);
      body.addEventListener("transitionend", function (e) {
        if (e.target === body && !isExp()) body.classList.add("invisible");
      });
    }

    function sync() {
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", String(isExp()));
      if (caret) caret.classList.toggle("-rotate-90", !isExp());
      if (body) {
        body.setAttribute("aria-hidden", String(!isExp()));
        body.className = "grid w-full transition-[grid-template-rows] duration-[350ms] ease-linear " + (isExp() ? "grid-rows-[1fr]" : "grid-rows-[0fr]");
        if (!isExp() && cfg._startHidden) body.classList.add("invisible");
      }
    }
    cfg._startHidden = !isExp();
    sync();
    cfg._startHidden = false;
    if (toggleBtn) toggleBtn.addEventListener("click", function () {
      expanded = !expanded;
      sync();
      if (cfg.onChange) cfg.onChange(expanded);
    });
    return { setExpanded: function (v) { expanded = v; sync(); } };
  }

  var BODY = '<p class="type-body-regular" style="margin:0;">Panel body content goes here. The body height is intrinsic.</p>';
  function mount(id, cfg) {
    var el = document.getElementById(id);
    if (el) createPanel(el, cfg);
  }
  function act(id, label, icon, extra) {
    var a = { id: id, label: label, icon: icon, onClick: function () { say(label.toLowerCase()); } };
    for (var k in extra || {}) a[k] = extra[k];
    return a;
  }

  mount("cp-default", { title: "Default \u2014 download + menu", body: BODY, actions: [
    act("download", "Download", ICONS.download),
    act("rename", "Rename", null, { placement: "menu" }),
    act("dup", "Duplicate", null, { placement: "menu" }),
    act("arch", "Archive (disabled)", null, { placement: "menu", disabled: true }),
  ] });
  mount("cp-borderless", { title: "Borderless", type: "borderless", body: BODY, actions: [act("download", "Download", ICONS.download), act("share", "Share", null, { placement: "menu" })] });
  mount("cp-collapsed", { title: "Starts collapsed", defaultExpanded: false, body: BODY, actions: [act("download", "Download", ICONS.download)] });
  mount("cp-three", { title: "Three icons, no menu", body: BODY, actions: [act("download", "Download", ICONS.download), act("edit", "Edit", ICONS.edit), act("delete", "Delete", ICONS.del)] });
  mount("cp-four", { title: "Four icons \u2014 fourth demoted to menu", body: BODY, actions: [act("download", "Download", ICONS.download), act("edit", "Edit", ICONS.edit), act("delete", "Delete", ICONS.del), act("export", "Export CSV", ICONS.download)] });
  mount("cp-static", { title: "Not expandable", expandable: false, body: BODY, actions: [act("download", "Download", ICONS.download)] });
  mount("cp-header-only", { title: "Header only (no body)", expandable: false, actions: [act("download", "Download", ICONS.download)] });
})();
