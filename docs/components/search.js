// Mirrors components/Search.tsx: a leading SearchIcon inside a bordered box, close (×) button
// whenever there's a value, and an opt-in suggestions dropdown (a fixed-position "portal" appended
// to document.body, same technique as select.js/table.js) that only opens once there's a non-empty
// query — matching the "Focus" swatch showing no dropdown at all while empty. No closed-state
// chevron exists anywhere in the Figma file; the chevron only renders while the dropdown is open,
// to collapse it while keeping the typed query.
(function () {
  var ICONS = {
    search:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 12.8858 17.2543 14.5974 16.0417 15.8561C16.0073 15.8825 15.9743 15.9114 15.9428 15.9429C15.9113 15.9744 15.8824 16.0074 15.856 16.0418C14.5973 17.2543 12.8857 18 11 18C7.13401 18 4 14.866 4 11ZM16.6176 18.0319C15.078 19.2635 13.125 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11C20 13.125 19.2635 15.0781 18.0319 16.6177L21.707 20.2929C22.0975 20.6834 22.0975 21.3166 21.707 21.7071C21.3165 22.0976 20.6833 22.0976 20.2928 21.7071L16.6176 18.0319Z"/></svg>',
    close:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.4702 4.47023C12.7299 4.21053 12.7299 3.78947 12.4702 3.52977C12.2105 3.27008 11.7895 3.27008 11.5298 3.52977L8 7.05955L4.47023 3.52977C4.21053 3.27008 3.78947 3.27008 3.52977 3.52977C3.27008 3.78947 3.27008 4.21053 3.52977 4.47023L7.05955 8L3.52977 11.5298C3.27008 11.7895 3.27008 12.2105 3.52977 12.4702C3.78947 12.7299 4.21053 12.7299 4.47023 12.4702L8 8.94045L11.5298 12.4702C11.7895 12.7299 12.2105 12.7299 12.4702 12.4702C12.7299 12.2105 12.7299 11.7895 12.4702 11.5298L8.94045 8L12.4702 4.47023Z"/></svg>',
    chevronUp:
      '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.53 5.5297C7.789 5.27 8.21 5.27 8.47 5.5297L12.47 9.5297C12.73 9.7894 12.73 10.2105 12.47 10.4702C12.21 10.7299 11.789 10.7299 11.53 10.4702L8 6.9404L4.47 10.4702C4.21 10.7299 3.789 10.7299 3.53 10.4702C3.27 10.2105 3.27 9.7894 3.53 9.5297L7.53 5.5297Z"/></svg>',
    info:
      '<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 3.33333C6.3181 3.33333 3.33333 6.3181 3.33333 10C3.33333 13.6819 6.3181 16.6667 10 16.6667C13.6819 16.6667 16.6667 13.6819 16.6667 10C16.6667 6.3181 13.6819 3.33333 10 3.33333ZM1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10ZM9.16667 5.83333C9.16667 5.3731 9.53976 5 10 5H10.0083C10.4686 5 10.8417 5.3731 10.8417 5.83333C10.8417 6.29357 10.4686 6.66667 10.0083 6.66667H10C9.53976 6.66667 9.16667 6.29357 9.16667 5.83333ZM10 7.91667C10.4602 7.91667 10.8333 8.28976 10.8333 8.75V14.1667C10.8333 14.6269 10.4602 15 10 15C9.53976 15 9.16667 14.6269 9.16667 14.1667V8.75C9.16667 8.28976 9.53976 7.91667 10 7.91667Z"/></svg>',
  };

  function matches(suggestion, query) {
    return suggestion.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  }

  function createSearch(root, config) {
    var suggestionsEnabled = config.suggestions !== undefined;
    var suggestions = config.suggestions || [];
    var disabled = !!config.disabled;
    var placeholder = config.placeholder || "Search";
    var noResultsMessage = config.noResultsMessage || "No items found";

    var state = {
      value: config.value || "",
      open: false,
      highlighted: -1,
    };

    var fieldRef, inputRef, listWrapEl, listEl;

    function filteredSuggestions() {
      var q = state.value.trim();
      if (!suggestionsEnabled || !q) return [];
      return suggestions.filter(function (s) { return matches(s, q); });
    }

    function showDropdown() {
      return state.open && suggestionsEnabled && state.value.trim() !== "";
    }

    function closeDropdown() {
      state.open = false;
      state.highlighted = -1;
      paint();
    }

    function openDropdown() {
      // Guard against re-entrancy: paint() explicitly refocuses the freshly-rebuilt <input> when it
      // was already focused, which itself fires a native "focus" event bound to this same function —
      // without the `state.open` check that refocus would recurse into another paint() forever.
      if (state.open || !suggestionsEnabled || disabled || state.value.trim() === "") return;
      state.open = true;
      paint();
    }

    function selectSuggestion(suggestion) {
      state.value = suggestion;
      closeDropdown();
    }

    function positionList() {
      if (!listWrapEl || !fieldRef) return;
      var rect = fieldRef.getBoundingClientRect();
      listWrapEl.style.top = rect.bottom + "px";
      listWrapEl.style.left = rect.left + "px";
      listWrapEl.style.width = rect.width + "px";
    }

    function removeList() {
      if (listWrapEl) {
        listWrapEl.remove();
        listWrapEl = null;
        listEl = null;
        document.removeEventListener("mousedown", onOutside);
        window.removeEventListener("scroll", positionList, true);
        window.removeEventListener("resize", positionList);
      }
    }

    function onOutside(e) {
      if (fieldRef && fieldRef.contains(e.target)) return;
      if (listWrapEl && listWrapEl.contains(e.target)) return;
      closeDropdown();
    }

    function renderList() {
      removeList();
      if (!showDropdown()) return;

      listWrapEl = document.createElement("div");
      listWrapEl.style.position = "fixed";
      listWrapEl.style.zIndex = "1000";
      positionList();

      listEl = document.createElement("ul");
      listEl.setAttribute("role", "listbox");
      listEl.className =
        "max-h-[300px] overflow-y-auto bg-[var(--component-dropdown-background-default,#FFFFFF)] py-[var(--global-spacing-s4,4px)] shadow-[var(--component-dropdown-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))]";
      listWrapEl.appendChild(listEl);

      var list = filteredSuggestions();
      list.forEach(function (suggestion, index) {
        var li = document.createElement("li");
        li.setAttribute("role", "option");
        var highlighted = index === state.highlighted;
        li.className =
          "type-label-regular-s cursor-pointer px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] text-[color:var(--component-dropdown-text-default,#343438)] " +
          (highlighted ? "bg-[var(--component-dropdown-background-hover,#EDF8FF)]" : "");
        li.textContent = suggestion;
        li.addEventListener("mouseenter", function () {
          state.highlighted = index;
          paint();
        });
        li.addEventListener("mousedown", function (e) { e.preventDefault(); });
        li.addEventListener("click", function () { selectSuggestion(suggestion); });
        listEl.appendChild(li);
      });

      if (list.length === 0) {
        var emptyLi = document.createElement("li");
        emptyLi.className = "flex items-center gap-[var(--global-spacing-s8,8px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)]";
        emptyLi.innerHTML =
          '<span class="shrink-0" style="color:var(--component-dropdown-text-description,#696970);">' +
          ICONS.info +
          '</span><span class="type-label-regular-s min-w-0 flex-1 truncate" style="color:var(--component-dropdown-text-description,#696970);">' +
          noResultsMessage +
          "</span>";
        listEl.appendChild(emptyLi);
      }

      document.body.appendChild(listWrapEl);
      document.addEventListener("mousedown", onOutside);
      window.addEventListener("scroll", positionList, true);
      window.addEventListener("resize", positionList);
    }

    function moveHighlight(delta) {
      var list = filteredSuggestions();
      if (list.length === 0) return;
      var idx = state.highlighted < 0 ? (delta > 0 ? 0 : list.length - 1) : (state.highlighted + delta + list.length) % list.length;
      state.highlighted = idx;
    }

    function handleKeyDown(e) {
      if (disabled) return;
      if (e.key === "Escape" && state.open) {
        e.preventDefault();
        closeDropdown();
        return;
      }
      if (!showDropdown()) {
        if (e.key === "Enter") {
          e.preventDefault();
          // onSearch is a callback-only submit event — nothing to render in this docs page.
        }
        return;
      }
      var list = filteredSuggestions();
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          moveHighlight(1);
          paint();
          break;
        case "ArrowUp":
          e.preventDefault();
          moveHighlight(-1);
          paint();
          break;
        case "Enter":
          e.preventDefault();
          if (state.highlighted >= 0 && list[state.highlighted]) selectSuggestion(list[state.highlighted]);
          break;
      }
    }

    function paint() {
      // Every paint() fully rebuilds the field's innerHTML, which would otherwise silently drop
      // focus/cursor position (and break typing/arrow-key nav mid-interaction, since the browser's
      // focused <input> node gets replaced) — restore both on the freshly-created node afterward.
      var wasFocused = inputRef && document.activeElement === inputRef;
      var cursorPos = wasFocused && inputRef.selectionStart != null ? inputRef.selectionStart : null;

      var hasValue = state.value.trim() !== "";
      var error = !!config.errorText;
      var open = showDropdown();
      var stateKey = disabled ? "disabled" : error ? "error" : open ? "focus" : state.open ? "focusempty" : hasValue ? "filled" : "default";

      var boxClasses = {
        default: "border-[var(--component-search-default-border,#83838C)] hover:border-[var(--component-search-hover-border,#3D3D42)] bg-[var(--component-search-default-background,#FFFFFF)]",
        focusempty: "border-[var(--component-search-focusempty-border,#0174BC)] bg-[var(--component-search-focusempty-background,#FFFFFF)]",
        filled: "border-[var(--component-search-filled-border,#83838C)] hover:border-[var(--component-search-hover-border,#3D3D42)] bg-[var(--component-search-filled-background,#FFFFFF)]",
        focus: "border-[var(--component-search-focus-border,#0174BC)] bg-[var(--component-search-focus-background,#FFFFFF)]",
        disabled: "cursor-not-allowed border-[var(--component-search-disabled-border,#C2C2CA)] bg-[var(--component-search-disabled-background,#EDEDF2)]",
        error: "border-[var(--component-search-error-border,#D63C42)] bg-[var(--component-search-error-background,#FFFFFF)]",
      };
      var textColor = {
        default: "var(--component-search-default-text,#696970)",
        focusempty: "var(--component-search-focusempty-text,#696970)",
        filled: "var(--component-search-filled-text,#343438)",
        focus: "var(--component-search-focus-text,#343438)",
        disabled: "var(--component-search-disabled-text,#A3A3AB)",
        error: "var(--component-search-error-text,#343438)",
      }[stateKey];
      var searchIconColor = {
        default: "var(--component-search-default-searchicon,#696970)",
        focusempty: "var(--component-search-focusempty-searchicon,#696970)",
        filled: "var(--component-search-filled-searchicon,#696970)",
        focus: "var(--component-search-focus-searchicon,#696970)",
        disabled: "var(--component-search-disabled-searchicon,#A3A3AB)",
        error: "var(--component-search-error-searchicon,#696970)",
      }[stateKey];
      var iconColor = {
        default: "var(--component-search-default-icon,#3D3D42)",
        focusempty: "var(--component-search-focusempty-icon,#3D3D42)",
        filled: "var(--component-search-filled-icon,#3D3D42)",
        focus: "var(--component-search-focus-icon,#3D3D42)",
        disabled: "var(--component-search-disabled-icon,#A3A3AB)",
        error: "var(--component-search-error-icon,#3D3D42)",
      }[stateKey];

      var showClear = config.clearable !== false && !disabled && hasValue;

      var html = '<div class="w-full">';
      html +=
        '<div data-search-box class="box-border flex h-[34px] w-full min-w-0 items-center gap-[var(--global-spacing-s8,8px)] border border-solid px-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s6,6px)] ' +
        boxClasses[stateKey] +
        '">';
      html += '<span class="inline-flex shrink-0 items-center justify-center" style="color:' + searchIconColor + ';">' + ICONS.search + "</span>";
      html +=
        '<input data-search-input type="text" role="combobox" aria-expanded="' +
        open +
        '" ' +
        (disabled ? "disabled " : "") +
        'placeholder="' +
        placeholder +
        '" class="type-label-regular-s h-[16px] w-full min-w-0 border-none bg-transparent p-0 outline-none placeholder:italic ' +
        (disabled ? "cursor-not-allowed" : "") +
        '" style="color:' +
        textColor +
        ';" value="' +
        state.value.replace(/"/g, "&quot;") +
        '" />';
      if (showClear || open) {
        html += '<span class="flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)]">';
        if (showClear) {
          html +=
            '<button type="button" data-search-clear aria-label="Clear search" class="inline-flex cursor-pointer items-center justify-center" style="color:' +
            iconColor +
            ';">' +
            ICONS.close +
            "</button>";
        }
        if (open) {
          html +=
            '<button type="button" data-search-hide aria-label="Hide suggestions" class="inline-flex cursor-pointer items-center justify-center" style="color:' +
            iconColor +
            ';">' +
            ICONS.chevronUp +
            "</button>";
        }
        html += "</span>";
      }
      html += "</div>";
      if (config.errorText) {
        html +=
          '<p class="type-label-semibold-xs w-full" style="padding-top:4px;padding-right:24px;color:var(--component-search-error-hinttext,#B82329);">' +
          config.errorText +
          "</p>";
      } else if (config.helperText) {
        html +=
          '<p class="type-label-semibold-xs w-full" style="padding-top:4px;color:var(--component-search-default-hinttext,#696970);">' +
          config.helperText +
          "</p>";
      }
      html += "</div>";

      root.innerHTML = html;
      fieldRef = root.querySelector("[data-search-box]");
      inputRef = root.querySelector("[data-search-input]");

      inputRef.addEventListener("input", function (e) {
        state.value = e.target.value;
        if (suggestionsEnabled && state.value.trim() !== "") {
          state.open = true;
          state.highlighted = -1;
        } else {
          state.open = false;
        }
        paint(); // paint()'s own wasFocused/cursorPos restore handles refocus here — no extra call needed
      });
      inputRef.addEventListener("focus", openDropdown);
      inputRef.addEventListener("keydown", handleKeyDown);

      var clearBtn = root.querySelector("[data-search-clear]");
      if (clearBtn) {
        clearBtn.addEventListener("mousedown", function (e) { e.preventDefault(); });
        clearBtn.addEventListener("click", function () {
          state.value = "";
          closeDropdown();
          inputRef.focus();
        });
      }
      var hideBtn = root.querySelector("[data-search-hide]");
      if (hideBtn) {
        hideBtn.addEventListener("mousedown", function (e) { e.preventDefault(); });
        hideBtn.addEventListener("click", closeDropdown);
      }

      renderList();

      if (wasFocused) {
        inputRef.focus();
        if (cursorPos != null) inputRef.setSelectionRange(cursorPos, cursorPos);
      }
    }

    paint();
  }

  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.forEach.call(document.querySelectorAll("[data-search-demo]"), function (el) {
      createSearch(el, JSON.parse(el.dataset.searchConfig || "{}"));
    });
  });
})();
