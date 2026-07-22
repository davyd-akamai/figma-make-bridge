// Mirrors components/Select.tsx: always type-to-filter, a real <input> (clear button + chevron as
// flex siblings, not nested children), a fixed-position "portal" dropdown appended to document.body
// (same technique as table.js's row action menu / the real component's shared Popover), keyboard nav
// (ArrowDown/Up, Home/End, Enter, Escape), and Create/empty-state rows for a no-match query.
(function () {
  var ICONS = {
    chevronDown:
      '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.53 5.5297C3.789 5.27 4.21 5.27 4.47 5.5297L8 9.0595L11.53 5.5297C11.789 5.27 12.21 5.27 12.47 5.5297C12.73 5.7894 12.73 6.2105 12.47 6.4702L8.47 10.4702C8.21 10.7299 7.789 10.7299 7.53 10.4702L3.53 6.4702C3.27 6.2105 3.27 5.7894 3.53 5.5297Z"/></svg>',
    chevronUp:
      '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.53 5.5297C7.789 5.27 8.21 5.27 8.47 5.5297L12.47 9.5297C12.73 9.7894 12.73 10.2105 12.47 10.4702C12.21 10.7299 11.789 10.7299 11.53 10.4702L8 6.9404L4.47 10.4702C4.21 10.7299 3.789 10.7299 3.53 10.4702C3.27 10.2105 3.27 9.7894 3.53 9.5297L7.53 5.5297Z"/></svg>',
    close:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.4702 4.47023C12.7299 4.21053 12.7299 3.78947 12.4702 3.52977C12.2105 3.27008 11.7895 3.27008 11.5298 3.52977L8 7.05955L4.47023 3.52977C4.21053 3.27008 3.78947 3.27008 3.52977 3.52977C3.27008 3.78947 3.27008 4.21053 3.52977 4.47023L7.05955 8L3.52977 11.5298C3.27008 11.7895 3.27008 12.2105 3.52977 12.4702C3.78947 12.7299 4.21053 12.7299 4.47023 12.4702L8 8.94045L11.5298 12.4702C11.7895 12.7299 12.2105 12.7299 12.4702 12.4702C12.7299 12.2105 12.7299 11.7895 12.4702 11.5298L8.94045 8L12.4702 4.47023Z"/></svg>',
    info:
      '<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 3.33333C6.3181 3.33333 3.33333 6.3181 3.33333 10C3.33333 13.6819 6.3181 16.6667 10 16.6667C13.6819 16.6667 16.6667 13.6819 16.6667 10C16.6667 6.3181 13.6819 3.33333 10 3.33333ZM1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10ZM9.16667 5.83333C9.16667 5.3731 9.53976 5 10 5H10.0083C10.4686 5 10.8417 5.3731 10.8417 5.83333C10.8417 6.29357 10.4686 6.66667 10.0083 6.66667H10C9.53976 6.66667 9.16667 6.29357 9.16667 5.83333ZM10 7.91667C10.4602 7.91667 10.8333 8.28976 10.8333 8.75V14.1667C10.8333 14.6269 10.4602 15 10 15C9.53976 15 9.16667 14.6269 9.16667 14.1667V8.75C9.16667 8.28976 9.53976 7.91667 10 7.91667Z"/></svg>',
    server:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 3C3 2.4477 3.4477 2 4 2H20C20.5523 2 21 2.4477 21 3V21C21 21.5523 20.5523 22 20 22H4C3.4477 22 3 21.5523 3 21V3ZM5 4V20H19V4H5Z"/><path d="M18 6C18 6.5523 17.5523 7 17 7C16.4477 7 16 6.5523 16 6C16 5.4477 16.4477 5 17 5C17.5523 5 18 5.4477 18 6Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3 9C3 8.4477 3.4477 8 4 8H20C20.5523 8 21 8.4477 21 9C21 9.5523 20.5523 10 20 10H4C3.4477 10 3 9.5523 3 9ZM3 15C3 14.4477 3.4477 14 4 14H20C20.5523 14 21 14.4477 21 15C21 15.5523 20.5523 16 20 16H4C3.4477 16 3 15.5523 3 15Z"/><path d="M18 12C18 12.5523 17.5523 13 17 13C16.4477 13 16 12.5523 16 12C16 11.4477 16.4477 11 17 11C17.5523 11 18 11.4477 18 12Z"/><path d="M18 18C18 18.5523 17.5523 19 17 19C16.4477 19 16 18.5523 16 18C16 17.4477 16.4477 17 17 17C17.5523 17 18 17.4477 18 18Z"/><path d="M15 6C15 6.5523 14.5523 7 14 7C13.4477 7 13 6.5523 13 6C13 5.4477 13.4477 5 14 5C14.5523 5 15 5.4477 15 6Z"/><path d="M15 12C15 12.5523 14.5523 13 14 13C13.4477 13 13 12.5523 13 12C13 11.4477 13.4477 11 14 11C14.5523 11 15 11.4477 15 12Z"/><path d="M15 18C15 18.5523 14.5523 19 14 19C13.4477 19 13 18.5523 13 18C13 17.4477 13.4477 17 14 17C14.5523 17 15 17.4477 15 18Z"/></svg>',
    network:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 4C16.9477 4 16.5 4.4477 16.5 5C16.5 5.5523 16.9477 6 17.5 6C18.0523 6 18.5 5.5523 18.5 5C18.5 4.4477 18.0523 4 17.5 4ZM14.5 5C14.5 3.3431 15.8431 2 17.5 2C19.1569 2 20.5 3.3431 20.5 5C20.5 6.3062 19.6652 7.4175 18.5 7.8293V10.1115C20.504 10.5662 22 12.3584 22 14.5C22 16.9853 19.9853 19 17.5 19C15.8004 19 14.3208 18.0577 13.5552 16.6671L7.9891 18.2574C7.8586 19.7938 6.5701 21 5 21C3.3431 21 2 19.6569 2 18C2 16.3431 3.3431 15 5 15C6.0348 15 6.9472 15.5239 7.4865 16.321L13.0065 14.7438C13.0022 14.6631 13 14.5818 13 14.5C13 14.0365 13.0701 13.5894 13.2002 13.1686L7.678 9.4872C7.1991 9.8109 6.6216 10 6 10C4.3431 10 3 8.6569 3 7C3 5.3431 4.3431 4 6 4C7.6569 4 9 5.3431 9 7C9 7.3054 8.9544 7.6002 8.8695 7.8778L14.2052 11.435C14.8098 10.7854 15.6041 10.3148 16.5 10.1115V7.8293C15.3348 7.4175 14.5 6.3062 14.5 5ZM6 6C5.4477 6 5 6.4477 5 7C5 7.5523 5.4477 8 6 8C6.5523 8 7 7.5523 7 7C7 6.4477 6.5523 6 6 6ZM17.5 12C16.1193 12 15 13.1193 15 14.5C15 15.8807 16.1193 17 17.5 17C18.8807 17 20 15.8807 20 14.5C20 13.1193 18.8807 12 17.5 12ZM5 17C4.4477 17 4 17.4477 4 18C4 18.5523 4.4477 19 5 19C5.5523 19 6 18.5523 6 18C6 17.4477 5.5523 17 5 17Z"/></svg>',
  };

  function matches(option, query) {
    return option.label.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  }

  function createSelect(root, config) {
    var options = config.options || [];
    var labelPosition = config.labelPosition || "top";
    var placeholder = config.placeholder || "Select";
    var creatable = !!config.creatable;
    var emptyMessage = config.emptyMessage || "No options available";
    var disabled = !!config.disabled;

    var state = {
      value: config.value !== undefined ? config.value : null,
      open: false,
      query: "",
      highlighted: -1,
      created: [],
    };

    function allOptions() {
      return options.concat(state.created);
    }

    function selectedOption() {
      var all = allOptions();
      for (var i = 0; i < all.length; i++) if (all[i].value === state.value) return all[i];
      return null;
    }

    function filteredOptions() {
      var q = state.query.trim();
      if (!q) return allOptions();
      return allOptions().filter(function (o) { return matches(o, q); });
    }

    var fieldRef, inputRef, listEl, listWrapEl;

    function closeDropdown() {
      state.open = false;
      state.query = "";
      state.highlighted = -1;
      paint();
    }

    function openDropdown() {
      if (disabled) return;
      state.query = "";
      var all = allOptions();
      var idx = -1;
      for (var i = 0; i < all.length; i++) if (all[i].value === state.value) idx = i;
      state.highlighted = idx;
      state.open = true;
      paint();
    }

    function selectOption(option) {
      if (option.disabled) return;
      state.value = option.value;
      closeDropdown();
    }

    function handleCreate() {
      var q = state.query.trim();
      if (!q) return;
      var opt = { value: q, label: q };
      state.created.push(opt);
      state.value = q;
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
      if (!state.open) return;

      listWrapEl = document.createElement("div");
      listWrapEl.style.position = "fixed";
      listWrapEl.style.zIndex = "1000";
      positionList();

      listEl = document.createElement("ul");
      listEl.setAttribute("role", "listbox");
      listEl.className =
        "max-h-[300px] overflow-y-auto bg-[var(--component-dropdown-background-default,#FFFFFF)] py-[var(--global-spacing-s4,4px)] shadow-[var(--component-dropdown-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))]";
      listWrapEl.appendChild(listEl);

      var list = filteredOptions();
      var query = state.query.trim();
      var showCreate = creatable && query !== "" && list.length === 0;
      var showEmpty = !creatable && query !== "" && list.length === 0;

      list.forEach(function (option, index) {
        var li = document.createElement("li");
        li.setAttribute("role", "option");
        li.dataset.index = index;
        var isDisabled = !!option.disabled;
        var highlighted = index === state.highlighted;
        li.className =
          "type-label-regular-s flex items-center gap-[var(--global-spacing-s8,8px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] " +
          (isDisabled
            ? "cursor-not-allowed text-[color:var(--component-dropdown-text-disabled,#A3A3AB)]"
            : "cursor-pointer text-[color:var(--component-dropdown-text-default,#343438)] " +
              (highlighted ? "bg-[var(--component-dropdown-background-hover,#EDF8FF)]" : ""));
        if (option.icon && ICONS[option.icon]) {
          var iconSpan = document.createElement("span");
          iconSpan.className = "inline-flex size-4 shrink-0 items-center justify-center";
          iconSpan.innerHTML = ICONS[option.icon];
          li.appendChild(iconSpan);
        }
        var labelSpan = document.createElement("span");
        labelSpan.className = "min-w-0 flex-1 truncate";
        labelSpan.textContent = option.label;
        li.appendChild(labelSpan);
        li.addEventListener("mouseenter", function () {
          if (isDisabled) return;
          state.highlighted = index;
          paint();
        });
        li.addEventListener("mousedown", function (e) { e.preventDefault(); });
        li.addEventListener("click", function () { selectOption(option); });
        listEl.appendChild(li);
      });

      if (showCreate) {
        var createLi = document.createElement("li");
        createLi.className =
          "flex cursor-pointer items-center gap-[var(--global-spacing-s4,4px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] hover:bg-[var(--component-dropdown-background-hover,#EDF8FF)]";
        createLi.innerHTML =
          '<span class="type-label-semibold-s" style="color:var(--component-dropdown-text-default,#343438);">Create</span>' +
          '<span class="type-label-regular-s min-w-0 flex-1 truncate" style="color:var(--component-dropdown-text-default,#343438); font-style:italic;">&ldquo;' +
          query +
          "&rdquo;</span>";
        createLi.addEventListener("mousedown", function (e) { e.preventDefault(); });
        createLi.addEventListener("click", handleCreate);
        listEl.appendChild(createLi);
      }
      if (showEmpty) {
        var emptyLi = document.createElement("li");
        emptyLi.className = "flex items-center gap-[var(--global-spacing-s8,8px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)]";
        emptyLi.innerHTML =
          '<span class="shrink-0" style="color:var(--component-dropdown-text-description,#696970);">' +
          ICONS.info +
          '</span><span class="type-label-regular-s min-w-0 flex-1 truncate" style="color:var(--component-dropdown-text-description,#696970);">' +
          emptyMessage +
          "</span>";
        listEl.appendChild(emptyLi);
      }

      document.body.appendChild(listWrapEl);
      document.addEventListener("mousedown", onOutside);
      window.addEventListener("scroll", positionList, true);
      window.addEventListener("resize", positionList);
    }

    function moveHighlight(delta) {
      var list = filteredOptions();
      if (list.length === 0) return;
      var idx = state.highlighted;
      for (var step = 0; step < list.length; step++) {
        idx = ((idx < 0 ? (delta > 0 ? -1 : 0) : idx) + delta + list.length) % list.length;
        if (!list[idx].disabled) {
          state.highlighted = idx;
          return;
        }
      }
    }

    function handleKeyDown(e) {
      if (disabled) return;
      if (!state.open) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
          e.preventDefault();
          openDropdown();
        }
        return;
      }
      var list = filteredOptions();
      var query = state.query.trim();
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
          if (list.length > 0 && state.highlighted >= 0) {
            selectOption(list[state.highlighted]);
          } else if (creatable && query !== "" && list.length === 0) {
            handleCreate();
          }
          break;
        case "Escape":
          e.preventDefault();
          closeDropdown();
          break;
      }
    }

    function paint() {
      // Every paint() fully rebuilds the field's innerHTML, which would otherwise silently drop
      // focus/cursor position (and break typing/arrow-key nav mid-interaction, since the browser's
      // focused <input> node gets replaced) — restore both on the freshly-created node afterward.
      var wasFocused = inputRef && document.activeElement === inputRef;
      var cursorPos = wasFocused && inputRef.selectionStart != null ? inputRef.selectionStart : null;

      var selected = selectedOption();
      var hasValue = !!selected;
      var error = !!config.errorText;
      var stateKey = disabled ? "disabled" : error ? "error" : state.open ? "focus" : hasValue ? "filled" : "default";

      var boxClasses = {
        default: "border-[var(--component-select-default-border,#83838C)] hover:border-[var(--component-select-hover-border,#3D3D42)]",
        filled: "border-[var(--component-select-default-border,#83838C)] hover:border-[var(--component-select-hover-border,#3D3D42)]",
        focus: "border-[var(--component-select-focus-border,#0174BC)]",
        disabled: "cursor-not-allowed border-[var(--component-select-disabled-border,#C2C2CA)] bg-[var(--component-select-disabled-background,#EDEDF2)]",
        error: "border-[var(--component-select-error-border,#D63C42)]",
      };
      var textColor = disabled
        ? "var(--component-select-disabled-text,#A3A3AB)"
        : hasValue && !state.open
          ? "var(--component-select-filled-text,#343438)"
          : "var(--component-select-default-text,#696970)";

      var html = "";
      var rowGap = labelPosition === "left" ? "gap-[var(--global-spacing-s12,12px)]" : "flex-col";
      html += '<div class="flex w-full items-start ' + rowGap + '">';
      if (config.label) {
        html +=
          '<label class="type-label-bold-s shrink-0" style="color:var(--component-select-label,#343438);' +
          (labelPosition === "left" ? "display:flex;height:34px;align-items:center;" : "display:block;padding-bottom:8px;") +
          '">' +
          config.label +
          "</label>";
      }
      html += '<div class="' + (labelPosition === "left" ? "min-w-0 flex-1" : "w-full") + '">';
      html += '<div class="flex w-full items-start">';
      html +=
        '<div data-select-box class="box-border flex h-[34px] w-full min-w-0 items-center gap-[var(--global-spacing-s16,16px)] border border-solid pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s6,6px)] bg-[var(--component-select-default-background,#FFFFFF)] ' +
        boxClasses[stateKey] +
        (disabled ? "" : state.open ? " cursor-text" : " cursor-pointer") +
        '">';
      html += '<span class="relative flex min-w-0 flex-1 items-center">';
      html +=
        '<input data-select-input type="text" role="combobox" aria-expanded="' +
        state.open +
        '" ' +
        (disabled ? "disabled " : "") +
        'placeholder="' +
        placeholder +
        '" class="type-label-regular-s h-[16px] w-full min-w-0 border-none bg-transparent p-0 outline-none placeholder:italic ' +
        (disabled ? "cursor-not-allowed " : state.open ? "cursor-text " : "cursor-pointer ") +
        '" style="color:' +
        (hasValue && !state.open && selected && selected.icon ? "transparent" : textColor) +
        ';" value="' +
        (state.open ? state.query : hasValue ? selected.label : "") +
        '" />';
      if (!state.open && selected && selected.icon && ICONS[selected.icon]) {
        html +=
          '<span class="pointer-events-none absolute inset-0 flex items-center gap-[var(--global-spacing-s8,8px)]"><span class="inline-flex size-4 shrink-0 items-center justify-center">' +
          ICONS[selected.icon] +
          '</span><span class="type-label-regular-s min-w-0 flex-1 truncate" style="color:' +
          textColor +
          ';">' +
          selected.label +
          "</span></span>";
      }
      html += "</span>";
      html += '<span class="flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)]">';
      if (config.clearable !== false && hasValue && !disabled) {
        html +=
          '<button type="button" data-select-clear aria-label="Clear selection" class="inline-flex cursor-pointer items-center justify-center" style="color:' +
          (disabled ? "var(--component-select-disabled-icon,#A3A3AB)" : "var(--component-select-default-icon,#3D3D42)") +
          ';">' +
          ICONS.close +
          "</button>";
      }
      html +=
        '<button type="button" data-select-toggle aria-label="' +
        (state.open ? "Close options" : "Open options") +
        '" class="inline-flex items-center justify-center ' +
        (disabled ? "cursor-not-allowed" : "cursor-pointer") +
        '" style="color:' +
        (disabled ? "var(--component-select-disabled-icon,#A3A3AB)" : "var(--component-select-default-icon,#3D3D42)") +
        ';">' +
        (state.open ? ICONS.chevronUp : ICONS.chevronDown) +
        "</button></span></div>";
      if (config.infoIcon) {
        html +=
          '<button type="button" data-select-info title="' +
          (config.infoText || "") +
          '" aria-label="More information" class="flex h-[34px] shrink-0 cursor-pointer items-center justify-center px-[var(--global-spacing-s8,8px)]" style="color:var(--component-select-default-infoicon,#696970);">' +
          ICONS.info +
          "</button>";
      }
      html += "</div>";
      if (config.errorText) {
        html +=
          '<p class="type-label-semibold-xs w-full" style="padding-top:4px;padding-right:24px;color:var(--component-select-error-hinttext,#B82329);">' +
          config.errorText +
          "</p>";
      } else if (config.helperText) {
        html +=
          '<p class="type-label-semibold-xs w-full" style="padding-top:4px;padding-right:24px;color:var(--component-select-default-hinttext,#696970);">' +
          config.helperText +
          "</p>";
      }
      html += "</div></div>";

      root.innerHTML = html;
      fieldRef = root.querySelector("[data-select-box]");
      inputRef = root.querySelector("[data-select-input]");

      inputRef.addEventListener("input", function (e) {
        state.query = e.target.value;
        state.open = true;
        state.highlighted = -1;
        paint(); // paint()'s own wasFocused/cursorPos restore handles refocus here — no extra call needed
      });
      inputRef.addEventListener("click", function () {
        if (!state.open) openDropdown();
      });
      inputRef.addEventListener("keydown", handleKeyDown);

      var clearBtn = root.querySelector("[data-select-clear]");
      if (clearBtn) {
        clearBtn.addEventListener("mousedown", function (e) { e.preventDefault(); });
        clearBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          state.value = null;
          paint();
        });
      }
      var toggleBtn = root.querySelector("[data-select-toggle]");
      toggleBtn.addEventListener("mousedown", function (e) { e.preventDefault(); });
      toggleBtn.addEventListener("click", function () {
        if (state.open) closeDropdown();
        else openDropdown();
        inputRef.focus();
      });

      renderList();

      if (wasFocused) {
        inputRef.focus();
        if (cursorPos != null) inputRef.setSelectionRange(cursorPos, cursorPos);
      }
    }

    paint();
  }

  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.forEach.call(document.querySelectorAll("[data-select-demo]"), function (el) {
      createSelect(el, JSON.parse(el.dataset.selectConfig || "{}"));
    });
  });
})();
