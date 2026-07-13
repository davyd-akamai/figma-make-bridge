// Mirrors components/TabsHorizontal.tsx's class-selection logic and overflow-measurement
// approach (literal strings/technique copied verbatim from the TSX source) so both demos below
// behave identically to the real React component.
(function () {
  var TAB_PADDING = {
    large: "gap-[var(--global-spacing-s8,8px)] px-[var(--global-spacing-s24,24px)] py-[var(--global-spacing-s12,12px)]",
    small: "gap-[var(--global-spacing-s4,4px)] px-[var(--global-spacing-s16,16px)] py-[var(--global-spacing-s6,6px)]",
  };
  var TAB_TYPE_ACTIVE = { large: "type-label-bold-l", small: "type-body-bold" };
  var TAB_TYPE_DEFAULT = { large: "type-label-semibold-l", small: "type-body-semibold" };
  var ROW_HEIGHT = { large: "h-[44px]", small: "h-[32px]" };
  var ELLIPSIS_BOX = {
    large: { width: 52, className: "w-[52px] h-[44px] px-[16px] py-[12px]", iconSize: 20 },
    small: { width: 48, className: "w-[48px] h-[32px] px-[16px] py-[8px]", iconSize: 16 },
  };
  var MORE_ICON =
    '<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 10C3.8954 10 3 10.8954 3 12C3 13.1046 3.8954 14 5 14C6.1046 14 7 13.1046 7 12C7 10.8954 6.1046 10 5 10ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z"/></svg>';

  function tabButtonClassName(size, selected, disabled) {
    var base = "group content-stretch flex items-center justify-center shrink-0 whitespace-nowrap border-b-3 border-solid " + TAB_PADDING[size];
    if (disabled) {
      return base + " " + TAB_TYPE_DEFAULT[size] + " border-transparent text-[color:var(--component-tabs-disabled-text,#A3A3AB)] cursor-not-allowed";
    }
    if (selected) {
      return base + " " + TAB_TYPE_ACTIVE[size] + " border-[var(--component-tabs-active-border,#0174BC)] text-[color:var(--component-tabs-active-text,#0174BC)]";
    }
    return (
      base +
      " " +
      TAB_TYPE_DEFAULT[size] +
      " border-transparent text-[color:var(--component-tabs-default-text,#343438)] hover:text-[color:var(--component-tabs-hover-text,#009CDE)]"
    );
  }

  var DEMO_TABS = [
    { id: "overview", label: "Overview", icon: true },
    { id: "configuration", label: "Configuration", badge: "New" },
    { id: "monitoring", label: "Monitoring" },
    { id: "activity", label: "Activity log" },
    { id: "access", label: "Access control", disabled: true },
    { id: "tags", label: "Tags" },
  ];

  var ARROW_LEFT_ICON =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.1382 4.1953C7.3985 4.4556 7.3985 4.8777 7.1382 5.1381L4.9429 7.3333H12.6667C13.0349 7.3333 13.3334 7.6318 13.3334 8C13.3334 8.3682 13.0349 8.6667 12.6667 8.6667H4.9429L7.1382 10.8619C7.3985 11.1223 7.3985 11.5444 7.1382 11.8047C6.8778 12.0651 6.4557 12.0651 6.1953 11.8047L2.862 8.4714C2.6017 8.2111 2.6017 7.7889 2.862 7.5286L6.1953 4.1953C6.4557 3.9349 6.8778 3.9349 7.1382 4.1953Z"/></svg>';

  function tabButtonHtml(tab, size, selectedId) {
    var selected = tab.id === selectedId;
    var html = '<button type="button" role="tab" data-tab-id="' + tab.id + '" aria-selected="' + selected + '"';
    if (tab.disabled) html += " disabled";
    html += ' class="' + tabButtonClassName(size, selected, !!tab.disabled) + '">';
    if (tab.icon) {
      var iconColorClass = tab.disabled
        ? "text-[color:var(--component-tabs-disabled-icon,#A3A3AB)]"
        : selected
          ? "text-[color:var(--component-tabs-active-icon,#0174BC)]"
          : "text-[color:var(--component-tabs-default-icon,#3D3D42)] group-hover:text-[color:var(--component-tabs-hover-icon,#009CDE)]";
      html += '<span class="shrink-0 ' + iconColorClass + '">' + ARROW_LEFT_ICON + "</span>";
    }
    html += "<span>" + tab.label + "</span>";
    if (tab.badge) {
      html +=
        '<span class="bg-[var(--component-badge-informative-subtle-background,rgba(52,81,178,0.12))] text-[color:var(--component-badge-informative-subtle-text,#3451B2)] type-label-bold-xs inline-flex items-center rounded-[4px] px-[var(--global-spacing-s6,6px)] py-[var(--global-spacing-s4,4px)]">' +
        tab.badge +
        "</span>";
    }
    html += "</button>";
    return html;
  }

  // Builds a tablist for a given width (px) and size, computing overflow the same way the React
  // component does: measure every tab's natural width via a hidden clone, then greedily fit as
  // many as possible before swapping the remainder for the "..." button.
  function renderTabs(container, tabs, size, selectedId, width, onSelect) {
    container.innerHTML = "";
    container.className = "relative flex items-stretch border-b border-solid border-[var(--component-tabs-default-border,#C2C2CA)] " + ROW_HEIGHT[size];
    if (width) container.style.width = width + "px";

    var measurer = document.createElement("div");
    measurer.style.cssText = "position:absolute;left:0;top:0;display:flex;align-items:stretch;height:0;overflow:hidden;visibility:hidden;";
    measurer.innerHTML = tabs.map(function (t) { return tabButtonHtml(t, size, selectedId); }).join("");
    container.appendChild(measurer);

    var widths = Array.prototype.slice.call(measurer.children).map(function (el) {
      return el.getBoundingClientRect().width;
    });
    var available = container.clientWidth || width || 640;
    var ellipsisWidth = ELLIPSIS_BOX[size].width;

    var total = 0;
    var fit = 0;
    for (; fit < widths.length; fit++) {
      var next = total + widths[fit];
      var hasMore = fit + 1 < widths.length;
      if (next + (hasMore ? ellipsisWidth : 0) > available) break;
      total = next;
    }
    fit = Math.max(1, fit);

    var visible = tabs.slice(0, fit);
    var overflow = tabs.slice(fit);

    var visibleWrap = document.createElement("div");
    visibleWrap.style.display = "contents";
    visibleWrap.innerHTML = visible.map(function (t) { return tabButtonHtml(t, size, selectedId); }).join("");
    container.appendChild(visibleWrap);

    Array.prototype.forEach.call(container.querySelectorAll('[role="tab"]'), function (btn) {
      if (btn.closest !== undefined && measurer.contains(btn)) return;
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        onSelect(btn.dataset.tabId);
      });
    });

    if (overflow.length > 0) {
      var box = ELLIPSIS_BOX[size];
      var wrap = document.createElement("div");
      wrap.className = "relative shrink-0";
      wrap.innerHTML =
        '<button type="button" aria-haspopup="menu" aria-label="More tabs" class="flex items-center justify-end border-b border-solid border-[var(--component-tabs-default-border,#C2C2CA)] text-[color:var(--component-tabs-ellipsis-icon,#3D3D42)] hover:text-[color:var(--component-tabs-ellipsis-icon-hover,#009CDE)] ' +
        box.className +
        '">' +
        MORE_ICON.replace(/{size}/g, box.iconSize) +
        "</button>";
      container.appendChild(wrap);
      var trigger = wrap.querySelector("button");
      trigger.addEventListener("click", function () {
        var existing = wrap.querySelector('[role="menu"]');
        if (existing) {
          existing.remove();
          return;
        }
        var menu = document.createElement("div");
        menu.setAttribute("role", "menu");
        menu.className =
          "absolute right-0 top-full z-10 flex min-w-[160px] flex-col items-stretch py-[var(--global-spacing-s4,4px)] bg-[var(--component-tabs-overflowmenu-background,#FFFFFF)] shadow-[0px_2px_8px_0px_var(--component-tabs-overflowmenu-shadow-color,rgba(58,59,63,0.18))]";
        overflow.forEach(function (t) {
          var item = document.createElement("button");
          item.type = "button";
          item.setAttribute("role", "menuitemradio");
          item.textContent = t.label;
          item.disabled = !!t.disabled;
          item.className =
            "type-label-regular-s flex items-center gap-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s8,8px)] pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s8,8px)] text-left " +
            (t.disabled
              ? "cursor-not-allowed text-[color:var(--component-tabs-disabled-text,#A3A3AB)]"
              : "text-[color:var(--component-tabs-overflowmenu-text,#343438)] hover:bg-[var(--component-tabs-overflowmenu-hover-background,#EDF8FF)]");
          item.addEventListener("click", function () {
            if (t.disabled) return;
            onSelect(t.id);
            menu.remove();
          });
          menu.appendChild(item);
        });
        wrap.appendChild(menu);
        document.addEventListener(
          "mousedown",
          function onOutside(e) {
            if (!wrap.contains(e.target)) {
              menu.remove();
              document.removeEventListener("mousedown", onOutside);
            }
          },
          { once: false },
        );
      });
    }
  }

  // Playground: size toggle + click-to-select.
  (function playground() {
    var container = document.getElementById("th-playground");
    if (!container) return;
    var state = { size: "large", selectedId: "overview" };

    function paint() {
      renderTabs(container, DEMO_TABS, state.size, state.selectedId, null, function (id) {
        state.selectedId = id;
        paint();
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-th-group="size"] .docs-toolbar-btn'), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-th-group="size"] .docs-toolbar-btn'), function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        state.size = btn.dataset.value;
        paint();
      });
    });

    paint();
  })();

  // Collapsible: a horizontally resizable stage, matching the same measured overflow logic —
  // drag the handle to shrink the row and watch trailing tabs move into the "..." menu.
  // Uses a manual drag handle (mousedown/mousemove) rather than native CSS `resize`, since
  // `resize` requires `overflow` to be non-visible on the resized axis — and per the CSS overflow
  // computed-value fixup, leaving the *other* axis as `visible` silently becomes `auto` instead,
  // which still clips the overflow-menu dropdown popping out below. A plain width-driven drag
  // avoids needing `overflow` set at all, so the dropdown is never clipped.
  (function collapsible() {
    var stage = document.getElementById("th-collapsible-stage");
    var container = document.getElementById("th-collapsible");
    var handle = document.getElementById("th-collapsible-handle");
    if (!stage || !container || !handle) return;
    var state = { selectedId: "overview" };

    function paint() {
      renderTabs(container, DEMO_TABS, "large", state.selectedId, null, function (id) {
        state.selectedId = id;
        paint();
      });
    }

    handle.addEventListener("mousedown", function (e) {
      e.preventDefault();
      var startX = e.clientX;
      var startWidth = stage.getBoundingClientRect().width;

      function onMove(moveEvent) {
        var next = Math.max(120, startWidth + (moveEvent.clientX - startX));
        stage.style.width = next + "px";
        paint();
      }
      function onUp() {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });

    window.addEventListener("resize", paint);
    paint();
  })();
})();
