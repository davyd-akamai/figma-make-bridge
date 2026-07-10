// Mirrors components/Checkbox.tsx's class-selection logic (literal strings copied verbatim).
(function () {
  var BOX_SIZE_CLASSES = {
    large: "size-[20px] p-[var(--global-spacing-s4,4px)]",
    small: "size-[16px] p-[var(--global-spacing-s2,2px)]",
  };
  var BOX_INTERACTIVE_CLASSES = {
    empty:
      "border-[var(--component-checkbox-empty-default-border,#83838C)] bg-[var(--component-checkbox-empty-default-background,#FFFFFF)] peer-hover:border-[var(--component-checkbox-empty-hover-border,#009CDE)] peer-focus-visible:border-[var(--component-checkbox-empty-active-border,#0174BC)]",
    checked:
      "border-[var(--component-checkbox-checked-default-background,#0174BC)] bg-[var(--component-checkbox-checked-default-background,#0174BC)] peer-hover:border-[var(--component-checkbox-checked-hover-background,#009CDE)] peer-hover:bg-[var(--component-checkbox-checked-hover-background,#009CDE)] peer-focus-visible:border-[var(--component-checkbox-checked-active-background,#0174BC)] peer-focus-visible:bg-[var(--component-checkbox-checked-active-background,#0174BC)]",
    indeterminated:
      "border-[var(--component-checkbox-indeterminated-default-background,#0174BC)] bg-[var(--component-checkbox-indeterminated-default-background,#0174BC)] peer-hover:border-[var(--component-checkbox-indeterminated-hover-background,#009CDE)] peer-hover:bg-[var(--component-checkbox-indeterminated-hover-background,#009CDE)] peer-focus-visible:border-[var(--component-checkbox-indeterminated-active-background,#0174BC)] peer-focus-visible:bg-[var(--component-checkbox-indeterminated-active-background,#0174BC)]",
  };
  var BOX_DISABLED_CLASSES = {
    empty: "border-[var(--component-checkbox-empty-disabled-border,#C2C2CA)] bg-[var(--component-checkbox-empty-disabled-background,#E5E5EA)]",
    checked: "border-[var(--component-checkbox-checked-disabled-background,#AFDEF8)] bg-[var(--component-checkbox-checked-disabled-background,#AFDEF8)]",
    indeterminated: "border-[var(--component-checkbox-indeterminated-disabled-background,#AFDEF8)] bg-[var(--component-checkbox-indeterminated-disabled-background,#AFDEF8)]",
  };
  var BOX_READONLY_CLASSES = {
    empty: "border-[var(--component-checkbox-empty-readonly-border,#C2C2CA)] bg-transparent",
    checked: "border-[var(--component-checkbox-checked-readonly-border,#C2C2CA)] bg-transparent",
    indeterminated: "border-[var(--component-checkbox-indeterminated-readonly-border,#C2C2CA)] bg-transparent",
  };
  var ICON_INTERACTIVE_CLASSES = {
    checked: "text-[color:var(--component-checkbox-checked-default-icon,#FFFFFF)]",
    indeterminated: "text-[color:var(--component-checkbox-indeterminated-default-icon,#FFFFFF)]",
  };
  var ICON_DISABLED_CLASSES = {
    checked: "text-[color:var(--component-checkbox-checked-disabled-icon,#FFFFFF)]",
    indeterminated: "text-[color:var(--component-checkbox-indeterminated-disabled-icon,#FFFFFF)]",
  };
  var ICON_READONLY_CLASSES = {
    checked: "text-[color:var(--component-checkbox-checked-readonly-icon,#A3A3AB)]",
    indeterminated: "text-[color:var(--component-checkbox-indeterminated-readonly-icon,#A3A3AB)]",
  };
  var CHECK_SVG =
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.46967 6.06952C1.76256 5.77663 2.23744 5.77663 2.53033 6.06952L4.93032 8.46951C5.22321 8.76241 5.22321 9.23728 4.93032 9.53017C4.63743 9.82307 4.16255 9.82307 3.86966 9.53017L1.46967 7.13018C1.17678 6.83729 1.17678 6.36242 1.46967 6.06952Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5303 2.86957C10.8232 3.16247 10.8232 3.63734 10.5303 3.93023L4.93032 9.53017C4.63743 9.82307 4.16255 9.82307 3.86966 9.53017C3.57677 9.23728 3.57669 8.76256 3.86958 8.46966L9.46967 2.86957C9.76256 2.57668 10.2374 2.57668 10.5303 2.86957Z"/></svg>';
  var MINUS_SVG =
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.75 6C10.75 6.41421 10.4142 6.75 10 6.75L2.00001 6.75C1.5858 6.75 1.25001 6.41421 1.25001 6C1.25001 5.58579 1.5858 5.25 2.00001 5.25L10 5.25C10.4142 5.25 10.75 5.58579 10.75 6Z"/></svg>';

  function render() {
    var size = document.getElementById("cb-size").checked ? "small" : "large";
    var disabled = document.getElementById("cb-disabled").checked;
    var readOnly = document.getElementById("cb-readonly").checked;
    var indeterminate = document.getElementById("cb-indeterminate").checked;
    var checked = document.getElementById("cb-input").checked;

    var kind = indeterminate ? "indeterminated" : checked ? "checked" : "empty";
    var box = document.getElementById("cb-box");
    var boxClasses = readOnly ? BOX_READONLY_CLASSES[kind] : disabled ? BOX_DISABLED_CLASSES[kind] : BOX_INTERACTIVE_CLASSES[kind];
    box.className =
      "box-border flex shrink-0 items-center justify-center border border-solid " + BOX_SIZE_CLASSES[size] + " " + boxClasses;

    var iconClasses = kind !== "empty" ? (readOnly ? ICON_READONLY_CLASSES[kind] : disabled ? ICON_DISABLED_CLASSES[kind] : ICON_INTERACTIVE_CLASSES[kind]) : "";
    var iconHtml = kind === "checked" ? CHECK_SVG : kind === "indeterminated" ? MINUS_SVG : "";
    box.innerHTML = iconHtml;
    if (iconHtml) box.firstElementChild.setAttribute("class", iconClasses);

    var input = document.getElementById("cb-input");
    input.disabled = disabled || readOnly;
    input.indeterminate = indeterminate;

    document.getElementById("cb-code").textContent =
      "<Checkbox\n  label=\"Enable feature\"" +
      (size === "small" ? '\n  size="small"' : "") +
      (indeterminate ? "\n  indeterminate" : "") +
      (checked && !indeterminate ? "\n  defaultChecked" : "") +
      (disabled ? "\n  disabled" : "") +
      (readOnly ? "\n  readOnly" : "") +
      "\n/>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    ["cb-size", "cb-disabled", "cb-readonly", "cb-indeterminate", "cb-input"].forEach(function (id) {
      document.getElementById(id).addEventListener("change", render);
    });
    render();
  });
})();
