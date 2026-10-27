// Hand-mirrors components/Tag.tsx + components/TagInput.tsx in vanilla JS (the docs site can't import the
// React components). Class strings are copied verbatim from the .tsx sources — docs/ is outside the Tailwind
// scan, so an invented class would silently render unstyled. The shell (box, label, message) is built once;
// only the tag elements and icon buttons are rebuilt on a tag change, and the typing input is never replaced
// (a full innerHTML rebuild would drop focus on every keystroke). The dropdown is a fixed-position element on
// document.body (like Popover) and its highlight is toggled via classList, never by rebuilding the rows.
(function () {
  var ICONS = {
    close12:
      '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.65533 2.34967C9.94822 2.64256 9.94822 3.11744 9.65533 3.41033L3.40533 9.66033C3.11244 9.95322 2.63756 9.95322 2.34467 9.66033C2.05178 9.36744 2.05178 8.89256 2.34467 8.59967L8.59467 2.34967C8.88756 2.05678 9.36244 2.05678 9.65533 2.34967Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2.34467 2.34967C2.63756 2.05678 3.11244 2.05678 3.40533 2.34967L9.65533 8.59967C9.94822 8.89256 9.94822 9.36744 9.65533 9.66033C9.36244 9.95322 8.88756 9.95322 8.59467 9.66033L2.34467 3.41033C2.05178 3.11744 2.05178 2.64256 2.34467 2.34967Z"/></svg>',
    lock12:
      '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.58493 2.58492C4.96024 2.20961 5.46927 1.99877 6.00003 1.99877C6.5308 1.99877 7.03982 2.20961 7.41513 2.58492C7.79044 2.96023 8.00128 3.46925 8.00128 4.00002V5.00125H3.99878V4.00002C3.99878 3.46925 4.20963 2.96023 4.58493 2.58492ZM3.49612 5.99875C3.49742 5.99876 3.49873 5.99877 3.50003 5.99877C3.50134 5.99877 3.50264 5.99876 3.50394 5.99875H8.49612C8.49742 5.99876 8.49873 5.99877 8.50003 5.99877C8.50134 5.99877 8.50264 5.99876 8.50394 5.99875H9.49997C9.7768 5.99875 10.0012 6.22317 10.0012 6.5V9.5C10.0012 9.77683 9.7768 10.0013 9.49997 10.0013H2.49997C2.22314 10.0013 1.99872 9.77683 1.99872 9.5V6.5C1.99872 6.22317 2.22314 5.99875 2.49997 5.99875H3.49612ZM3.00128 5.00125V4.00002C3.00128 3.2047 3.31722 2.44195 3.8796 1.87958C4.44197 1.31721 5.20471 1.00127 6.00003 1.00127C6.79535 1.00127 7.55809 1.31721 8.12047 1.87958C8.68284 2.44195 8.99878 3.2047 8.99878 4.00002V5.00125H9.49997C10.3277 5.00125 10.9987 5.67226 10.9987 6.5V9.5C10.9987 10.3277 10.3277 10.9988 9.49997 10.9988H2.49997C1.67223 10.9988 1.00122 10.3277 1.00122 9.5V6.5C1.00122 5.67226 1.67223 5.00125 2.49997 5.00125H3.00128Z"/></svg>',
    close16:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.4702 4.47023C12.7299 4.21053 12.7299 3.78947 12.4702 3.52977C12.2105 3.27008 11.7895 3.27008 11.5298 3.52977L8 7.05955L4.47023 3.52977C4.21053 3.27008 3.78947 3.27008 3.52977 3.52977C3.27008 3.78947 3.27008 4.21053 3.52977 4.47023L7.05955 8L3.52977 11.5298C3.27008 11.7895 3.27008 12.2105 3.52977 12.4702C3.78947 12.7299 4.21053 12.7299 4.47023 12.4702L8 8.94045L11.5298 12.4702C11.7895 12.7299 12.2105 12.7299 12.4702 12.4702C12.7299 12.2105 12.7299 11.7895 12.4702 11.5298L8.94045 8L12.4702 4.47023Z"/></svg>',
    plus16:
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.665 3.33331C8.665 2.96604 8.36727 2.66831 8 2.66831C7.63273 2.66831 7.335 2.96604 7.335 3.33331V7.335H3.33325C2.96598 7.335 2.66825 7.63273 2.66825 8C2.66825 8.36727 2.96598 8.665 3.33325 8.665H7.335V12.6666C7.335 13.0339 7.63273 13.3316 8 13.3316C8.36727 13.3316 8.665 13.0339 8.665 12.6666V8.665H12.6666C13.0339 8.665 13.3316 8.36727 13.3316 8C13.3316 7.63273 13.0339 7.335 12.6666 7.335H8.665V3.33331Z"/></svg>',
    chevronDown20:
      '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.53 5.5297C3.789 5.27 4.21 5.27 4.47 5.5297L8 9.0595L11.53 5.5297C11.789 5.27 12.21 5.27 12.47 5.5297C12.73 5.7894 12.73 6.2105 12.47 6.4702L8.47 10.4702C8.21 10.7299 7.789 10.7299 7.53 10.4702L3.53 6.4702C3.27 6.2105 3.27 5.7894 3.53 5.5297Z"/></svg>',
    chevronUp20:
      '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.53 5.5297C7.789 5.27 8.21 5.27 8.47 5.5297L12.47 9.5297C12.73 9.7894 12.73 10.2105 12.47 10.4702C12.21 10.7299 11.789 10.7299 11.53 10.4702L8 6.9404L4.47 10.4702C4.21 10.7299 3.789 10.7299 3.53 10.4702C3.27 10.2105 3.27 9.7894 3.53 9.5297L7.53 5.5297Z"/></svg>',
    info16:
      '<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 3.33333C6.3181 3.33333 3.33333 6.3181 3.33333 10C3.33333 13.6819 6.3181 16.6667 10 16.6667C13.6819 16.6667 16.6667 13.6819 16.6667 10C16.6667 6.3181 13.6819 3.33333 10 3.33333ZM1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10ZM9.16667 5.83333C9.16667 5.3731 9.53976 5 10 5H10.0083C10.4686 5 10.8417 5.3731 10.8417 5.83333C10.8417 6.29357 10.4686 6.66667 10.0083 6.66667H10C9.53976 6.66667 9.16667 6.29357 9.16667 5.83333ZM10 7.91667C10.4602 7.91667 10.8333 8.28976 10.8333 8.75V14.1667C10.8333 14.6269 10.4602 15 10 15C9.53976 15 9.16667 14.6269 9.16667 14.1667V8.75C9.16667 8.28976 9.53976 7.91667 10 7.91667Z"/></svg>',
  };

  // --- Tag.tsx class strings (verbatim) ---
  var TAG_BASE =
    "type-label-semibold-xs box-border inline-flex h-[24px] max-w-full shrink-0 items-center gap-[var(--global-spacing-s4,4px)] whitespace-nowrap rounded-[12px] border border-solid px-[var(--global-spacing-s8,8px)] py-px outline-none";
  var TAG_STATE = {
    default:
      "border-[var(--component-tag-default-border,#83838C)] bg-[var(--component-tag-default-background,#F7F7FA)] text-[color:var(--component-tag-default-text,#343438)] [&:hover:not(:focus-visible)]:border-[var(--component-tag-hover-border,#3D3D42)] focus-visible:border-[var(--component-tag-focus-border,#0174BC)] focus-visible:bg-[var(--component-tag-focus-background,#EDF8FF)]",
    invalid:
      "border-[var(--component-tag-error-border,#D63C42)] bg-[var(--component-tag-error-background,#FFE5E5)] text-[color:var(--component-tag-error-text,#343438)] focus-visible:border-[var(--component-tag-focus-border,#0174BC)]",
    disabled:
      "cursor-not-allowed border-[var(--component-tag-disabled-border,#C2C2CA)] bg-[var(--component-tag-disabled-background,#EDEDF2)] text-[color:var(--component-tag-disabled-text,#A3A3AB)]",
    readOnly: "border-[var(--component-tag-readonly-border,#C2C2CA)] text-[color:var(--component-tag-readonly-text,#343438)]",
  };
  var TAG_ICON = {
    default:
      "text-[color:var(--component-tag-default-icon-default,#3D3D42)] hover:text-[color:var(--component-tag-default-icon-hover,#009CDE)] active:text-[color:var(--component-tag-default-icon-active,#0174BC)]",
    invalid:
      "text-[color:var(--component-tag-error-icon-default,#3D3D42)] hover:text-[color:var(--component-tag-error-icon-hover,#009CDE)] active:text-[color:var(--component-tag-error-icon-active,#0174BC)]",
  };

  // --- TagInput.tsx class strings (verbatim) ---
  var PAD_EMPTY =
    "gap-[var(--global-spacing-s12,12px)] pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s6,6px)]";
  var PAD_TAGS =
    "gap-[var(--global-spacing-s12,12px)] pl-[var(--global-spacing-s4,4px)] pr-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s4,4px)]";
  var BOX_INTERACTIVE =
    "border-[var(--component-taginput-default-border,#83838C)] [&:hover:not(:focus-within)]:border-[var(--component-taginput-hover-border,#3D3D42)] focus-within:border-[var(--component-taginput-focus-border,#0174BC)]";
  var BOX_OPEN = "border-[var(--component-taginput-focus-border,#0174BC)]";
  var BOX_ERROR = "border-[var(--component-taginput-error-border,#D63C42)]";
  var BOX_DISABLED =
    "cursor-not-allowed border-[var(--component-taginput-disabled-border,#C2C2CA)] bg-[var(--component-taginput-disabled-background,#EDEDF2)] p-[var(--global-spacing-s4,4px)]";
  var ICON_COLOR = "text-[color:var(--component-taginput-filled-icon,#3D3D42)]";
  var ROW_BASE =
    "type-label-regular-s flex items-center gap-[var(--global-spacing-s8,8px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)]";
  var ROW_HL = "bg-[var(--component-dropdown-background-hover,#EDF8FF)]";
  var uid = 0;

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function same(a, b) {
    return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
  }
  function labelOf(t) {
    return t.label != null ? t.label : t.value;
  }

  // Mirrors Tag.tsx. opts: label, icon ("lock"), removable, invalid, disabled, readOnly, more, onRemove, index
  function createTag(opts) {
    var interactive = !opts.disabled && !opts.readOnly && !opts.more;
    var showRemove = interactive && opts.removable !== false;
    var state = opts.disabled ? "disabled" : opts.readOnly ? "readOnly" : opts.invalid && !opts.more ? "invalid" : "default";
    var span = el("span", TAG_BASE + " " + TAG_STATE[state]);
    if (opts.invalid) span.setAttribute("aria-invalid", "true");
    if (opts.disabled) span.setAttribute("aria-disabled", "true");
    if (opts.index != null) span.setAttribute("data-tag-index", opts.index);
    if (opts.tabIndex != null) span.tabIndex = opts.tabIndex;
    else if (showRemove) span.tabIndex = 0;
    if (opts.icon && !opts.more) span.appendChild(el("span", "inline-flex size-3 shrink-0 items-center justify-center", ICONS.lock12));
    span.appendChild(el("span", "min-w-0 truncate", esc(opts.label)));
    if (showRemove) {
      var btn = el("button", "inline-flex size-3 shrink-0 cursor-pointer items-center justify-center " + TAG_ICON[state === "invalid" ? "invalid" : "default"], ICONS.close12);
      btn.type = "button";
      btn.tabIndex = -1;
      btn.setAttribute("aria-label", "Remove " + opts.label);
      btn.addEventListener("mousedown", function (e) { e.preventDefault(); });
      btn.addEventListener("click", function (e) { e.stopPropagation(); if (opts.onRemove) opts.onRemove(); });
      span.appendChild(btn);
    }
    span.addEventListener("keydown", function (e) {
      if (e.target !== span) return;
      if (showRemove && (e.key === "Backspace" || e.key === "Delete")) {
        e.preventDefault();
        if (opts.onRemove) opts.onRemove();
      }
    });
    return span;
  }

  function createTagInput(root, cfg) {
    var id = "docs-tag-input-" + ++uid;
    var listboxId = id + "-listbox";
    var tags = (cfg.tags || []).map(function (t) { return Object.assign({}, t); });
    var options = cfg.options || [];
    var creatable = cfg.creatable !== false;
    var clearable = cfg.clearable !== false;
    var left = cfg.label && cfg.labelPosition === "left";
    var error = !!cfg.errorText;
    var search = "";
    var open = false;
    var hl = -1;
    var dropdown = null;

    function emit() {
      if (cfg.onChange) cfg.onChange(tags);
    }

    // ----- read-only: plain tags, no box -----
    if (cfg.readOnly) {
      var roWrap = el("div", "flex w-full items-start " + (left ? "gap-[var(--global-spacing-s12,12px)]" : "flex-col"));
      if (cfg.label) roWrap.appendChild(el("span", labelClass(), esc(cfg.label)));
      var roCol = el("div", left ? "min-w-0 flex-1" : "w-full");
      var roRow = el("div", "flex min-h-[34px] w-full flex-wrap items-center gap-[var(--global-spacing-s4,4px)] px-[var(--global-spacing-s4,4px)] py-[5px]");
      tags.forEach(function (t) {
        roRow.appendChild(createTag({ label: labelOf(t), icon: t.icon, readOnly: true }));
      });
      roCol.appendChild(roRow);
      roWrap.appendChild(roCol);
      root.appendChild(roWrap);
      return;
    }

    function labelClass() {
      return "type-label-bold-s flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)] text-[color:var(--component-taginput-label,#343438)] " + (left ? "h-[34px]" : "pb-[var(--global-spacing-s8,8px)]");
    }

    var wrap = el("div", "flex w-full items-start " + (left ? "gap-[var(--global-spacing-s12,12px)]" : "flex-col"));
    if (cfg.label) {
      var lab = el("label", labelClass(), esc(cfg.label));
      lab.htmlFor = id;
      if (cfg.labelInfoIcon) {
        var info = el("span", "inline-flex text-[color:var(--component-taginput-labelinfoicon,#696970)]", ICONS.info16);
        info.title = cfg.labelInfoText || "";
        info.setAttribute("aria-hidden", "true");
        lab.appendChild(info);
      }
      wrap.appendChild(lab);
    }
    var col = el("div", left ? "min-w-0 flex-1" : "w-full");
    var box = el("div", "");
    var tagsWrap = el("div", "flex min-h-0 min-w-0 flex-1 flex-wrap content-start items-center gap-[var(--global-spacing-s4,4px)] self-stretch overflow-y-auto");
    var input = el("input", "");
    var icons = el("span", "");
    var msg = null;

    input.id = id;
    input.type = "text";
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-haspopup", "listbox");
    input.setAttribute("aria-controls", listboxId);
    input.setAttribute("aria-autocomplete", "list");
    if (!cfg.label) input.setAttribute("aria-label", cfg.placeholder || "Add tag");
    if (error) input.setAttribute("aria-invalid", "true");

    if (cfg.disabled) {
      box.className = "box-border flex max-h-[100px] w-full min-w-0 items-start border border-solid bg-[var(--component-taginput-default-background,#FFFFFF)] " + BOX_DISABLED;
      var dWrap = el("div", "flex min-w-0 flex-1 flex-wrap items-center gap-[var(--global-spacing-s4,4px)]");
      if (tags.length) tags.forEach(function (t) { dWrap.appendChild(createTag({ label: labelOf(t), icon: t.icon, disabled: true })); });
      else dWrap.appendChild(el("span", "type-label-regular-placeholder px-[var(--global-spacing-s8,8px)] italic text-[color:var(--component-tag-disabled-text,#A3A3AB)]", esc(cfg.placeholder || "Add tag")));
      box.appendChild(dWrap);
    } else {
      box.appendChild(tagsWrap);
      box.appendChild(icons);
      tagsWrap.appendChild(input);
    }
    col.appendChild(box);

    if (error || cfg.helperText) {
      msg = el(
        "p",
        "type-label-semibold-xs w-full pt-[var(--global-spacing-s4,4px)] pr-[var(--global-spacing-s24,24px)] " +
          (error ? "text-[color:var(--component-taginput-error-hinttext,#B82329)]" : "text-[color:var(--component-taginput-default-hinttext,#696970)]"),
        esc(error ? cfg.errorText : cfg.helperText)
      );
      msg.id = id + "-message";
      input.setAttribute("aria-describedby", msg.id);
      col.appendChild(msg);
    }
    wrap.appendChild(col);
    root.appendChild(wrap);

    // ----- derived lists -----
    function available() {
      return options.filter(function (o) { return !tags.some(function (t) { return same(t.value, o.value); }); });
    }
    function filtered() {
      var q = search.trim().toLowerCase();
      return q ? available().filter(function (o) { return o.label.toLowerCase().indexOf(q) !== -1; }) : available();
    }
    function showCreate() {
      var q = search.trim();
      if (!creatable || !q) return false;
      var known = tags.some(function (t) { return same(labelOf(t), q) || same(t.value, q); }) || options.some(function (o) { return same(o.label, q); });
      return !known;
    }
    function rowCount() {
      return filtered().length + (showCreate() ? 1 : 0);
    }

    // ----- mutations -----
    function closeDropdown() {
      open = false;
      hl = -1;
      renderDropdown();
      renderChrome();
    }
    function resetQuery() {
      search = "";
      input.value = "";
      closeDropdown();
    }
    function addTag(t) {
      if (!tags.some(function (x) { return same(x.value, t.value); })) {
        tags.push(t);
        renderTags();
        emit();
      }
      resetQuery();
    }
    function addOption(o) {
      if (o.disabled) return;
      addTag({ value: o.value, label: o.label });
    }
    function addTyped(text) {
      var typed = text.trim();
      if (!typed) return;
      var match = options.filter(function (o) { return same(o.label, typed) && !o.disabled; })[0];
      if (match) addOption(match);
      else if (creatable) addTag({ value: typed });
      else resetQuery();
    }
    function removeAt(i) {
      tags.splice(i, 1);
      renderTags();
      emit();
      input.focus();
    }
    function commitDelimited(text, keepTail) {
      var parts = text.split(/[,;\n]/);
      var tail = keepTail ? parts.pop() || "" : "";
      var changed = false;
      parts.forEach(function (part) {
        var typed = part.trim();
        if (!typed || tags.some(function (t) { return same(t.value, typed) || same(labelOf(t), typed); })) return;
        var match = options.filter(function (o) { return same(o.label, typed) && !o.disabled; })[0];
        if (match) { tags.push({ value: match.value, label: match.label }); changed = true; }
        else if (creatable) { tags.push({ value: typed }); changed = true; }
      });
      if (changed) { renderTags(); emit(); }
      search = tail;
      input.value = tail;
      hl = tail.trim() ? 0 : -1;
      if (!tail.trim()) open = false;
      renderDropdown();
      renderChrome();
    }
    function focusTag(i) {
      var n = tagsWrap.querySelector('[data-tag-index="' + i + '"]');
      if (n) n.focus();
    }
    function activateRow(i) {
      var f = filtered();
      if (i < f.length) addOption(f[i]);
      else if (showCreate()) addTag({ value: search.trim() });
    }

    // ----- rendering -----
    function dropdownOpen() {
      return open && rowCount() > 0;
    }
    function renderChrome() {
      if (cfg.disabled) return;
      var hasTags = tags.length > 0;
      var dd = dropdownOpen();
      box.className =
        "box-border flex max-h-[100px] w-full min-w-0 items-start border border-solid bg-[var(--component-taginput-default-background,#FFFFFF)] cursor-text " +
        (hasTags ? PAD_TAGS : PAD_EMPTY) + " " + (error ? BOX_ERROR : dd ? BOX_OPEN : BOX_INTERACTIVE);
      input.className =
        "type-label-regular-s min-w-[48px] flex-1 basis-[48px] border-none bg-transparent p-0 text-[color:var(--component-taginput-focus-text,#343438)] outline-none placeholder:italic placeholder:text-[color:var(--component-taginput-placeholder-text,#696970)] " +
        (hasTags ? "h-[24px] pl-[var(--global-spacing-s4,4px)]" : "h-[16px]");
      input.placeholder = hasTags ? "" : cfg.placeholder || "Add tag";
      input.setAttribute("aria-expanded", dd ? "true" : "false");
      if (dd && hl >= 0) input.setAttribute("aria-activedescendant", listboxId + "-option-" + hl);
      else input.removeAttribute("aria-activedescendant");

      icons.className = "flex shrink-0 items-center gap-[var(--global-spacing-s4,4px)] " + (hasTags ? "pt-[var(--global-spacing-s2,2px)]" : "") + " " + ICON_COLOR;
      icons.innerHTML = "";
      if (clearable && hasTags) {
        var clr = el("button", "inline-flex cursor-pointer items-center justify-center", ICONS.close16);
        clr.type = "button";
        clr.tabIndex = -1;
        clr.setAttribute("aria-label", "Clear all tags");
        clr.addEventListener("mousedown", function (e) { e.preventDefault(); });
        clr.addEventListener("click", function (e) {
          e.stopPropagation();
          tags = [];
          renderTags();
          emit();
          resetQuery();
          input.focus();
        });
        icons.appendChild(clr);
      }
      var chev = el("button", "inline-flex cursor-pointer items-center justify-center", dd ? ICONS.chevronUp20 : ICONS.chevronDown20);
      chev.type = "button";
      chev.tabIndex = -1;
      chev.setAttribute("aria-label", dd ? "Close options" : "Open options");
      chev.addEventListener("mousedown", function (e) { e.preventDefault(); });
      chev.addEventListener("click", function () {
        if (open) closeDropdown();
        else { open = true; renderDropdown(); renderChrome(); }
        input.focus();
      });
      icons.appendChild(chev);
    }

    function renderTags() {
      Array.prototype.slice.call(tagsWrap.querySelectorAll("[data-tag-index]")).forEach(function (n) { n.remove(); });
      tags.forEach(function (t, i) {
        tagsWrap.insertBefore(
          createTag({
            label: labelOf(t), icon: t.icon, invalid: t.invalid, removable: t.removable, index: i, tabIndex: -1,
            onRemove: function () { removeAt(i); },
          }),
          input
        );
      });
      renderChrome();
      renderDropdown();
    }

    function position() {
      if (!dropdown) return;
      var r = box.getBoundingClientRect();
      dropdown.style.top = r.bottom + "px";
      dropdown.style.left = r.left + "px";
      dropdown.style.width = r.width + "px";
    }
    function setHighlight(i) {
      hl = i;
      if (!dropdown) return;
      Array.prototype.forEach.call(dropdown.querySelectorAll("[data-index]"), function (li) {
        var on = Number(li.getAttribute("data-index")) === hl;
        ROW_HL.split(" ").forEach(function (c) { li.classList.toggle(c, on); });
        if (on) li.scrollIntoView({ block: "nearest" });
      });
      if (hl >= 0) input.setAttribute("aria-activedescendant", listboxId + "-option-" + hl);
    }
    function renderDropdown() {
      if (!dropdownOpen()) {
        if (dropdown) { dropdown.remove(); dropdown = null; }
        return;
      }
      if (!dropdown) {
        dropdown = el("div", "");
        dropdown.style.position = "fixed";
        dropdown.style.zIndex = "1000";
        document.body.appendChild(dropdown);
      }
      var ul = el("ul", "max-h-[300px] overflow-y-auto bg-[var(--component-dropdown-background-default,#FFFFFF)] py-[var(--global-spacing-s4,4px)] shadow-[var(--component-dropdown-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))]");
      ul.id = listboxId;
      ul.setAttribute("role", "listbox");
      var f = filtered();
      f.forEach(function (o, i) {
        var li = el("li", ROW_BASE + " cursor-pointer text-[color:var(--component-dropdown-text-default,#343438)]" + (i === hl ? " " + ROW_HL : ""));
        li.id = listboxId + "-option-" + i;
        li.setAttribute("data-index", i);
        li.setAttribute("role", "option");
        li.appendChild(el("span", "min-w-0 flex-1 truncate", esc(o.label)));
        li.addEventListener("mouseenter", function () { setHighlight(i); });
        li.addEventListener("mousedown", function (e) { e.preventDefault(); });
        li.addEventListener("click", function () { addOption(o); });
        ul.appendChild(li);
      });
      if (showCreate()) {
        var ci = f.length;
        var cli = el("li", ROW_BASE + " cursor-pointer text-[color:var(--component-dropdown-text-default,#343438)]" + (ci === hl ? " " + ROW_HL : ""));
        cli.id = listboxId + "-option-" + ci;
        cli.setAttribute("data-index", ci);
        cli.setAttribute("role", "option");
        cli.appendChild(el("span", "inline-flex size-4 shrink-0 items-center justify-center text-[color:var(--component-taginput-filled-icon,#3D3D42)]", ICONS.plus16));
        cli.appendChild(el("span", "min-w-0 flex-1 truncate", "“" + esc(search.trim()) + "”"));
        cli.addEventListener("mouseenter", function () { setHighlight(ci); });
        cli.addEventListener("mousedown", function (e) { e.preventDefault(); });
        cli.addEventListener("click", function () { addTag({ value: search.trim() }); });
        ul.appendChild(cli);
      }
      dropdown.innerHTML = "";
      dropdown.appendChild(ul);
      position();
    }

    // ----- events -----
    if (!cfg.disabled) {
      box.addEventListener("click", function (e) {
        if (e.target.closest("button, [data-tag-index]")) return;
        input.focus();
        if (options.length > 0 && !open) { open = true; renderDropdown(); renderChrome(); }
      });
      box.addEventListener("keydown", function (e) {
        var t = e.target.closest ? e.target.closest("[data-tag-index]") : null;
        if (!t || e.target !== t) return;
        var i = Number(t.getAttribute("data-tag-index"));
        if (e.key === "ArrowLeft" && i > 0) { e.preventDefault(); focusTag(i - 1); }
        else if (e.key === "ArrowRight") {
          e.preventDefault();
          if (i < tags.length - 1) focusTag(i + 1);
          else input.focus();
        }
      });
      input.addEventListener("input", function () {
        var next = input.value;
        if (/[,;]/.test(next)) { commitDelimited(next, true); return; }
        search = next;
        open = true;
        hl = next.trim() ? 0 : -1;
        renderDropdown();
        renderChrome();
      });
      input.addEventListener("paste", function (e) {
        var text = (e.clipboardData || window.clipboardData).getData("text");
        if (!/[,;\n]/.test(text)) return;
        e.preventDefault();
        commitDelimited(search + text, false);
      });
      input.addEventListener("keydown", function (e) {
        var n = rowCount();
        switch (e.key) {
          case "ArrowDown":
          case "ArrowUp": {
            e.preventDefault();
            if (n === 0) break;
            var d = e.key === "ArrowDown" ? 1 : -1;
            var wasOpen = dropdownOpen();
            open = true;
            var nextI = hl < 0 ? (d > 0 ? 0 : n - 1) : (hl + d + n) % n;
            hl = nextI;
            if (!wasOpen) { renderDropdown(); renderChrome(); }
            else { setHighlight(nextI); }
            break;
          }
          case "Enter":
            e.preventDefault();
            if (dropdownOpen() && hl >= 0) activateRow(hl);
            else addTyped(input.value);
            break;
          case "Escape":
            if (open) { e.preventDefault(); closeDropdown(); }
            break;
          case "Tab":
            closeDropdown();
            break;
          case "Backspace":
            if (input.value === "" && tags.length && tags[tags.length - 1].removable !== false) {
              e.preventDefault();
              tags.pop();
              renderTags();
              emit();
            }
            break;
          case "ArrowLeft":
            if (input.value === "" && tags.length && input.selectionStart === 0) { e.preventDefault(); focusTag(tags.length - 1); }
            break;
        }
      });
      document.addEventListener("mousedown", function (e) {
        if (!open) return;
        if (box.contains(e.target) || (dropdown && dropdown.contains(e.target))) return;
        closeDropdown();
      });
      window.addEventListener("scroll", position, true);
      window.addEventListener("resize", position);
      renderTags();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-tag-input]").forEach(function (root) {
      var cfg = JSON.parse(root.getAttribute("data-config") || "{}");
      var out = root.closest(".docs-demo").querySelector("[data-tag-input-state]");
      if (out) {
        cfg.onChange = function (tags) {
          out.textContent = tags.map(function (t) { return t.value; }).join(", ") || "(none)";
        };
        out.textContent = (cfg.tags || []).map(function (t) { return t.value; }).join(", ") || "(none)";
      }
      createTagInput(root, cfg);
    });

    // Standalone Tag states
    document.querySelectorAll("[data-tag-row]").forEach(function (row) {
      var defs = [
        { label: "Tag label", demo: "removable" },
        { label: "Tag label", icon: "lock", removable: true },
        { label: "Tag label", invalid: true },
        { label: "Tag label", disabled: true },
        { label: "Tag label", readOnly: true },
        { label: "Tag label", removable: false },
        { label: "+7", more: true },
      ];
      defs.forEach(function (d) {
        var node = createTag({
          label: d.label, icon: d.icon, invalid: d.invalid, disabled: d.disabled, readOnly: d.readOnly, more: d.more, removable: d.removable,
          onRemove: function () { node.remove(); },
        });
        row.appendChild(node);
      });
    });
  });
})();
