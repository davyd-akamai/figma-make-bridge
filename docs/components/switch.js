// Hand-mirrors components/Switch.tsx (class strings verbatim; docs/ is outside the Tailwind scan,
// so every arbitrary-value class here must already exist in the compiled styles.css).
(function () {
  var TRACK_SIZE = { large: "h-[24px] w-[48px]", small: "h-[20px] w-[40px]" };
  var KNOB_SIZE = {
    large: { off: "size-[20px] translate-x-0", on: "size-[20px] translate-x-[24px]" },
    small: { off: "size-[16px] translate-x-0", on: "size-[16px] translate-x-[20px]" },
  };
  var CHECK_POS = { large: "left-[8px]", small: "left-[6px]" };
  var LABEL_PAD = { large: "py-[var(--global-spacing-s4,4px)]", small: "py-[var(--global-spacing-s2,2px)]" };
  var TRACK_INT = {
    off: "bg-[var(--component-switch-inactive-default-background,#83838C)] peer-hover:bg-[var(--component-switch-inactive-hover-background,#A3A3AB)] peer-focus-visible:bg-[var(--component-switch-inactive-focus-background,#83838C)] peer-active:bg-[var(--component-switch-inactive-focus-background,#83838C)]",
    on: "bg-[var(--component-switch-active-default-background,#0174BC)] peer-hover:bg-[var(--component-switch-active-hover-background,#009CDE)] peer-focus-visible:bg-[var(--component-switch-active-focus-background,#0174BC)] peer-active:bg-[var(--component-switch-active-focus-background,#0174BC)]",
  };
  var TRACK_DIS = {
    off: "bg-[var(--component-switch-inactive-disabled-background,#E5E5EA)]",
    on: "bg-[var(--component-switch-active-disabled-background,#AFDEF8)]",
  };
  var KNOB_INT = {
    off: "bg-[var(--component-switch-inactive-default-circle,#FFFFFF)] shadow-[var(--component-switch-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))]",
    on: "bg-[var(--component-switch-active-default-circle,#FFFFFF)] shadow-[var(--component-switch-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))]",
  };
  var KNOB_DIS = {
    off: "bg-[var(--component-switch-inactive-disabled-circle,rgba(255,255,255,0.5))]",
    on: "bg-[var(--component-switch-active-disabled-circle,rgba(255,255,255,0.5))]",
  };
  var CHECK_INT = "text-[color:var(--component-switch-active-default-icon,#FFFFFF)]";
  var CHECK_DIS = "text-[color:var(--component-switch-active-disabled-icon,#A3A3AB)]";
  var TEXT = {
    off: "text-[color:var(--component-switch-inactive-default-text,#343438)]",
    on: "text-[color:var(--component-switch-active-default-text,#343438)]",
    offDis: "text-[color:var(--component-switch-inactive-disabled-text,#A3A3AB)]",
    onDis: "text-[color:var(--component-switch-active-disabled-text,#A3A3AB)]",
  };
  // Same path data as CheckIcon in components/icons/index.tsx (12x12).
  var CHECK_SVG =
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="CLS">' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M1.46967 6.06952C1.76256 5.77663 2.23744 5.77663 2.53033 6.06952L4.93032 8.46951C5.22321 8.76241 5.22321 9.23728 4.93032 9.53017C4.63743 9.82307 4.16255 9.82307 3.86966 9.53017L1.46967 7.13018C1.17678 6.83729 1.17678 6.36242 1.46967 6.06952Z"/>' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M10.5303 2.86957C10.8232 3.16247 10.8232 3.63734 10.5303 3.93023L4.93032 9.53017C4.63743 9.82307 4.16255 9.82307 3.86966 9.53017C3.57677 9.23728 3.57669 8.76256 3.86958 8.46966L9.46967 2.86957C9.76256 2.57668 10.2374 2.57668 10.5303 2.86957Z"/></svg>';

  function create(opts) {
    var size = opts.size || "large";
    var disabled = !!opts.disabled;
    var checked = !!opts.checked;
    var label = document.createElement("label");
    label.className =
      "inline-flex items-start gap-[var(--global-spacing-s8,8px)] " + (disabled ? "cursor-not-allowed" : "cursor-pointer");
    label.innerHTML =
      '<span class="relative inline-flex shrink-0 items-center">' +
      '<input type="checkbox" role="switch" class="peer sr-only"' + (disabled ? " disabled" : "") + (opts.ariaLabel ? ' aria-label="' + opts.ariaLabel + '"' : "") + " />" +
      '<span aria-hidden="true" data-track>' + CHECK_SVG.replace("CLS", "") + '<span data-knob></span></span></span>' +
      (opts.label ? '<span data-text class="type-label-regular-s"></span>' : "");
    var input = label.querySelector("input");
    var track = label.querySelector("[data-track]");
    var check = track.querySelector("svg");
    var knob = track.querySelector("[data-knob]");
    var text = label.querySelector("[data-text]");
    if (text) text.textContent = opts.label;
    input.checked = checked;
    function paint() {
      var k = input.checked ? "on" : "off";
      track.className =
        "relative inline-block shrink-0 rounded-full transition-colors duration-150 ease-in-out " + TRACK_SIZE[size] + " " + (disabled ? TRACK_DIS[k] : TRACK_INT[k]);
      check.setAttribute(
        "class",
        "absolute top-1/2 -translate-y-1/2 transition-opacity duration-150 ease-in-out " + CHECK_POS[size] + " " + (input.checked ? "opacity-100" : "opacity-0") + " " + (disabled ? CHECK_DIS : CHECK_INT)
      );
      knob.className =
        "absolute left-[2px] top-[2px] rounded-full transition-[transform,background-color] duration-150 ease-in-out " + KNOB_SIZE[size][k] + " " + (disabled ? KNOB_DIS[k] : KNOB_INT[k]);
      if (text)
        text.className = "type-label-regular-s " + LABEL_PAD[size] + " " + (disabled ? (input.checked ? TEXT.onDis : TEXT.offDis) : TEXT[k]);
    }
    paint();
    // Only class strings change on toggle; no node is ever rebuilt, so focus and the CSS transition survive.
    input.addEventListener("change", function () {
      paint();
      if (opts.onChange) opts.onChange(input.checked);
    });
    return label;
  }

  document.querySelectorAll("[data-switch-row]").forEach(function (row) {
    var size = row.getAttribute("data-size") || "large";
    [
      { label: "Off" },
      { label: "On", checked: true },
      { label: "Disabled off", disabled: true },
      { label: "Disabled on", checked: true, disabled: true },
      { ariaLabel: "No label", checked: true },
    ].forEach(function (o) {
      o.size = size;
      row.appendChild(create(o));
    });
  });

  var ctl = document.getElementById("switch-controlled");
  if (ctl) {
    var state = document.getElementById("switch-controlled-state");
    ctl.appendChild(create({ label: "Enable backups", checked: true, onChange: function (v) { state.textContent = v ? "on" : "off"; } }));
  }
})();
