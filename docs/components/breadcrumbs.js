// Mirrors components/Breadcrumbs.tsx's markup and class strings (copied verbatim from the TSX so
// Tailwind's scan of components/ has already generated every class used here).
(function () {
  var ITEM_TEXT = "type-label-semibold-l leading-[20px] text-[color:var(--component-breadcrumb-normal-text-default,#696970)]";
  var LAST_TEXT = "type-label-bold-l leading-[20px] text-[color:var(--component-breadcrumb-lastitem-text-default,#343438)]";
  var ICON_BUTTON = "flex size-[20px] shrink-0 cursor-pointer items-center justify-center text-[color:var(--component-breadcrumb-lastitem-icon-default,#3D3D42)]";
  var FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alias-interaction-border-focus,#0174BC)]";
  var PENCIL_REVEAL = "ml-0 w-0 overflow-hidden opacity-0 group-hover:ml-[var(--global-spacing-s4,4px)] group-hover:w-[20px] group-hover:opacity-100 group-focus-within:ml-[var(--global-spacing-s4,4px)] group-focus-within:w-[20px] group-focus-within:opacity-100";
  var BOX = "box-border flex h-[34px] min-w-0 flex-1 items-center border border-solid bg-[var(--component-textfield-background,#FFFFFF)] gap-[var(--global-spacing-s12,12px)] pl-[var(--global-spacing-s12,12px)] pr-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s8,8px)] border-[var(--component-textfield-border-default,#83838C)] [&:hover:not(:focus-within)]:border-[var(--component-textfield-border-hover,#3D3D42)] focus-within:border-[var(--component-textfield-border-focus,#0174BC)]";
  var INPUT = "type-label-regular-s h-[16px] min-w-0 flex-1 border-none bg-transparent p-0 text-[color:var(--component-textfield-text,#343438)] outline-none";
  var BADGE = "inline-flex shrink-0 items-center rounded px-[var(--global-spacing-s4,4px)] py-[var(--global-spacing-s2,2px)] text-[11px] font-extrabold uppercase tracking-[0.22px] text-[color:var(--component-systembadge-text,#FFFFFF)]";
  var BADGE_BG = {
    beta: "bg-[var(--component-systembadge-beta-background,#696970)]",
    new: "bg-[var(--component-systembadge-new-background,#7259D6)]",
  };
  var ICON_PENCIL =
    '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0001 3.47798C14.8002 3.47798 14.6023 3.51735 14.4176 3.59384C14.2329 3.67033 14.0652 3.78244 13.9238 3.92377L4.49729 13.3504L3.69012 16.31L6.64976 15.5028L16.0763 6.07624C16.2176 5.93491 16.3297 5.76712 16.4062 5.58246C16.4827 5.3978 16.5221 5.19988 16.5221 5.00001C16.5221 4.80013 16.4827 4.60221 16.4062 4.41755C16.3297 4.23289 16.2176 4.06511 16.0763 3.92377C15.935 3.78244 15.7672 3.67033 15.5825 3.59384C15.3979 3.51735 15.1999 3.47798 15.0001 3.47798ZM13.7785 2.05096C14.1658 1.89055 14.5809 1.80798 15.0001 1.80798C15.4192 1.80798 15.8343 1.89055 16.2216 2.05096C16.6089 2.21138 16.9608 2.4465 17.2572 2.74291C17.5536 3.03931 17.7887 3.3912 17.9491 3.77847C18.1095 4.16575 18.1921 4.58083 18.1921 5.00001C18.1921 5.41919 18.1095 5.83426 17.9491 6.22154C17.7887 6.60882 17.5536 6.9607 17.2572 7.25711L7.67383 16.8405C7.57108 16.9432 7.44329 17.0174 7.30309 17.0556L2.71976 18.3056C2.43067 18.3845 2.12151 18.3024 1.90962 18.0905C1.69774 17.8786 1.61564 17.5694 1.69448 17.2803L2.94448 12.697C2.98271 12.5568 3.05687 12.429 3.15962 12.3263L12.743 2.74291L13.3334 3.33334L12.743 2.74291C13.0394 2.4465 13.3913 2.21138 13.7785 2.05096Z"/></svg>';
  var ICON_CHECK =
    '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.2559 4.41076C17.5814 4.7362 17.5814 5.26384 17.2559 5.58928L8.08926 14.7559C7.76382 15.0814 7.23618 15.0814 6.91074 14.7559L2.74408 10.5893C2.41864 10.2638 2.41864 9.7362 2.74408 9.41076C3.06951 9.08533 3.59715 9.08533 3.92259 9.41076L7.5 12.9882L16.0774 4.41076C16.4028 4.08533 16.9305 4.08533 17.2559 4.41076Z"/></svg>';
  var ICON_CLOSE =
    '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.4702 4.47023C12.7299 4.21053 12.7299 3.78947 12.4702 3.52977C12.2105 3.27008 11.7895 3.27008 11.5298 3.52977L8 7.05955L4.47023 3.52977C4.21053 3.27008 3.78947 3.27008 3.52977 3.52977C3.27008 3.78947 3.27008 4.21053 3.52977 4.47023L7.05955 8L3.52977 11.5298C3.27008 11.7895 3.27008 12.2105 3.52977 12.4702C3.78947 12.7299 4.21053 12.7299 4.47023 12.4702L8 8.94045L11.5298 12.4702C11.7895 12.7299 12.2105 12.7299 12.4702 12.4702C12.7299 12.2105 12.7299 11.7895 12.4702 11.5298L8.94045 8L12.4702 4.47023Z"/></svg>';

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }

  function badgeHtml(item) {
    return item.badge ? '<span class="' + BADGE + " " + BADGE_BG[item.badge] + '">' + item.badge.toUpperCase() + "</span>" : "";
  }

  // opts: { editable, editing, onNavigate(item, i), onStartEdit(), onConfirm(title), onCancel() }
  function render(root, items, opts) {
    var last = items.length - 1;
    var html = '<nav aria-label="Breadcrumb"><ol class="m-0 flex min-h-[34px] list-none flex-wrap items-center gap-[var(--global-spacing-s4,4px)] p-0">';
    items.forEach(function (item, i) {
      if (i < last) {
        html +=
          '<li class="flex items-center gap-[var(--global-spacing-s4,4px)]">' +
          '<button type="button" data-nav="' + i + '" class="' + ITEM_TEXT + " cursor-pointer whitespace-nowrap no-underline hover:underline hover:decoration-[6%] " + FOCUS_RING + ' border-none bg-transparent p-0">' + esc(item.label) + "</button>" +
          badgeHtml(item) +
          '<span aria-hidden="true" class="type-label-semibold-l shrink-0 leading-[20px] text-[color:var(--component-breadcrumb-separator-text-default,#696970)]">/</span></li>';
      } else if (opts.editing) {
        html +=
          '<li class="flex items-center gap-[var(--global-spacing-s8,8px)]"><div class="w-[240px]"><div class="flex w-full items-start"><div class="' + BOX + '">' +
          '<input data-edit-input aria-label="Rename current page" type="text" value="' + esc(item.label) + '" class="' + INPUT + '"/></div></div></div>' +
          '<button type="button" data-confirm aria-label="Confirm rename" class="' + ICON_BUTTON + " " + FOCUS_RING + '">' + ICON_CHECK + "</button>" +
          '<button type="button" data-cancel aria-label="Cancel rename" class="' + ICON_BUTTON + " " + FOCUS_RING + '">' + ICON_CLOSE + "</button></li>";
      } else {
        html +=
          '<li class="group flex items-center gap-[var(--global-spacing-s4,4px)]"><span aria-current="page" class="' + LAST_TEXT + ' whitespace-nowrap">' + esc(item.label) + "</span>" +
          badgeHtml(item) +
          (opts.editable
            ? '<button type="button" data-edit aria-label="Rename current page" class="' + ICON_BUTTON + " " + FOCUS_RING + " " + PENCIL_REVEAL + '">' + ICON_PENCIL + "</button>"
            : "") +
          "</li>";
      }
    });
    root.innerHTML = html + "</ol></nav>";

    root.querySelectorAll("[data-nav]").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = Number(b.dataset.nav);
        if (opts.onNavigate) opts.onNavigate(items[i], i);
      });
    });
    var edit = root.querySelector("[data-edit]");
    if (edit) edit.addEventListener("click", opts.onStartEdit);
    var input = root.querySelector("[data-edit-input]");
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); opts.onConfirm(input.value); }
        else if (e.key === "Escape") { e.preventDefault(); opts.onCancel(); }
      });
      root.querySelector("[data-confirm]").addEventListener("click", function () { opts.onConfirm(input.value); });
      root.querySelector("[data-cancel]").addEventListener("click", opts.onCancel);
    }
  }

  // Trail lengths
  var lengths = document.getElementById("bc-lengths");
  for (var n = 1; n <= 5; n++) {
    var items = [];
    for (var k = 0; k < n - 1; k++) items.push({ label: "Breadcrumb" });
    items.push({ label: "Last Item Title" });
    var holder = document.createElement("div");
    lengths.appendChild(holder);
    render(holder, items, {});
  }

  // Interactive
  var state = { items: [{ label: "Compute" }, { label: "Instances", badge: "beta" }, { label: "web-server-01" }], editing: false, nav: "none", renamed: "none" };
  var root = document.getElementById("bc-interactive");
  var status = document.getElementById("bc-state");
  function paint() {
    render(root, state.items, {
      editable: true,
      editing: state.editing,
      onNavigate: function (item) { state.nav = item.label; paint(); },
      onStartEdit: function () { state.editing = true; paint(); },
      onCancel: function () { state.editing = false; paint(); },
      onConfirm: function (value) {
        var next = value.trim();
        var current = state.items[state.items.length - 1];
        state.editing = false;
        if (next && next !== current.label) { current.label = next; state.renamed = next; }
        paint();
      },
    });
    status.textContent = "Last navigated: " + state.nav + " · Renamed to: " + state.renamed;
  }
  paint();
})();
