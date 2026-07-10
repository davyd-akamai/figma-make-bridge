// Mirrors components/Button.tsx's class-selection logic exactly (literal strings copied
// verbatim from the TSX source) so the playground button below renders pixel-identical to
// the real React component for every variant/size/state combination.
(function () {
  var BASE_CLASSES =
    "relative box-border inline-flex shrink-0 items-center justify-center gap-[var(--global-spacing-s4,4px)] whitespace-nowrap text-center transition-colors";

  var SIZE_CLASSES = {
    large: "h-[34px] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] type-label-semibold-s",
    small: "h-[26px] px-[var(--global-spacing-s8,8px)] py-[var(--global-spacing-s4,4px)] type-label-semibold-xs",
  };

  var LINK_SIZE_CLASSES = {
    large: "h-auto p-0 type-label-semibold-s",
    small: "h-auto p-0 type-label-semibold-xs",
  };

  var VARIANT_STATE_CLASSES = {
    primary: {
      default:
        "cursor-pointer border border-solid bg-[var(--component-button-primary-default-background,#0174BC)] border-[var(--component-button-primary-default-border,#0174BC)] text-[color:var(--component-button-primary-default-text,#FFFFFF)] hover:bg-[var(--component-button-primary-hover-background,#009CDE)] hover:border-[var(--component-button-primary-hover-border,#009CDE)] hover:text-[color:var(--component-button-primary-hover-text,#FFFFFF)] active:bg-[var(--component-button-primary-active-background,#0174BC)] active:border-[var(--component-button-primary-active-border,#0174BC)] active:text-[color:var(--component-button-primary-active-text,#FFFFFF)]",
      loading:
        "cursor-not-allowed border border-solid text-transparent bg-[var(--component-button-primary-loading-background,#0174BC)] border-[var(--component-button-primary-loading-border,#0174BC)]",
      disabled:
        "cursor-not-allowed border border-solid bg-[var(--component-button-primary-disabled-background,#E5E5EA)] border-[var(--component-button-primary-disabled-border,#E5E5EA)] text-[color:var(--component-button-primary-disabled-text,#A3A3AB)]",
    },
    secondary: {
      default:
        "cursor-pointer border border-solid bg-[var(--component-button-secondary-default-background,#FFFFFF)] border-[var(--component-button-secondary-default-border,#0174BC)] text-[color:var(--component-button-secondary-default-text,#0174BC)] hover:bg-[var(--component-button-secondary-hover-background,#EDF8FF)] hover:border-[var(--component-button-secondary-hover-border,#009CDE)] hover:text-[color:var(--component-button-secondary-hover-text,#0174BC)] active:bg-[var(--component-button-secondary-active-background,#FFFFFF)] active:border-[var(--component-button-secondary-active-border,#0174BC)] active:text-[color:var(--component-button-secondary-active-text,#0174BC)]",
      loading:
        "cursor-not-allowed border border-solid text-transparent bg-[var(--component-button-secondary-loading-background,#FFFFFF)] border-[var(--component-button-secondary-loading-border,#0174BC)]",
      disabled:
        "cursor-not-allowed border border-solid bg-[var(--component-button-secondary-disabled-background,#FFFFFF)] border-[var(--component-button-secondary-disabled-border,#C2C2CA)] text-[color:var(--component-button-secondary-disabled-text,#A3A3AB)]",
    },
    link: {
      default:
        "cursor-pointer border-none bg-transparent text-[color:var(--component-button-link-default-text,#0174BC)] hover:text-[color:var(--component-button-link-hover-text,#009CDE)] active:text-[color:var(--component-button-link-active-text,#0174BC)]",
      loading: "cursor-not-allowed border-none bg-transparent text-transparent",
      disabled: "cursor-not-allowed border-none bg-transparent text-[color:var(--component-button-link-disabled-text,#A3A3AB)]",
    },
    danger: {
      default:
        "cursor-pointer border border-solid bg-[var(--component-button-danger-default-background,#B82329)] border-[var(--component-button-danger-default-border,#B82329)] text-[color:var(--component-button-danger-default-text,#FFFFFF)] hover:bg-[var(--component-button-danger-hover-background,#D63C42)] hover:border-[var(--component-button-danger-hover-border,#D63C42)] hover:text-[color:var(--component-button-danger-hover-text,#FFFFFF)] active:bg-[var(--component-button-danger-active-background,#B82329)] active:border-[var(--component-button-danger-active-border,#B82329)] active:text-[color:var(--component-button-danger-active-text,#FFFFFF)]",
      loading:
        "cursor-not-allowed border border-solid text-transparent bg-[var(--component-button-danger-loading-background,#B82329)] border-[var(--component-button-danger-loading-border,#B82329)]",
      disabled:
        "cursor-not-allowed border border-solid bg-[var(--component-button-danger-disabled-background,#F9C6C6)] border-[var(--component-button-danger-disabled-border,#F9C6C6)] text-[color:var(--component-button-danger-disabled-text,#A3A3AB)]",
    },
  };

  var SPINNER_SVG_WHITE =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-spin"><path d="M8 2C4.6863 2 2 4.6863 2 8C2 11.3137 4.6863 14 8 14C8.9414 14 9.8321 13.7832 10.625 13.3968" stroke="url(#pb-spinner-white-a)" stroke-width="1.33" stroke-linecap="round"/><path d="M14 8C14 4.6863 11.3137 2 8 2C4.6863 2 2 4.6863 2 8C2 9.7159 2.7203 11.2636 3.875 12.3571" stroke="url(#pb-spinner-white-b)" stroke-width="1.33" stroke-linecap="round"/><defs><radialGradient id="pb-spinner-white-a" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.125 12.625) rotate(2.24575) scale(6.3799)"><stop stop-color="#FFFFFF"/><stop offset="0.812835" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient><radialGradient id="pb-spinner-white-b" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(13.375 5.375) rotate(158.671) scale(14.0901)"><stop offset="0.546875" stop-color="#FFFFFF"/><stop offset="0.854167" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient></defs></svg>';
  var SPINNER_SVG_GRADIENT =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-spin"><path d="M8 2C4.6863 2 2 4.6863 2 8C2 11.3137 4.6863 14 8 14C8.9414 14 9.8321 13.7832 10.625 13.3968" stroke="url(#pb-spinner-grad-a)" stroke-width="1.33" stroke-linecap="round"/><path d="M14 8C14 4.6863 11.3137 2 8 2C4.6863 2 2 4.6863 2 8C2 9.7159 2.7203 11.2636 3.875 12.3571" stroke="url(#pb-spinner-grad-b)" stroke-width="1.33" stroke-linecap="round"/><defs><radialGradient id="pb-spinner-grad-a" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.125 12.625) rotate(2.24575) scale(6.3799)"><stop stop-color="#00B050"/><stop offset="0.812835" stop-color="#00B050" stop-opacity="0"/></radialGradient><radialGradient id="pb-spinner-grad-b" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.6562 6.1042) rotate(158.924) scale(12.224)"><stop stop-color="#5BB3EA" stop-opacity="0"/><stop offset="0.328125" stop-color="#108AD6"/><stop offset="0.682292" stop-color="#00B050"/></radialGradient></defs></svg>';
  var SPINNER_VARIANT = { primary: "white", danger: "white", secondary: "gradient", link: "gradient" };
  var PLUS_ICON_16 =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.665 3.33331C8.665 2.96604 8.36727 2.66831 8 2.66831C7.63273 2.66831 7.335 2.96604 7.335 3.33331V7.335H3.33325C2.96598 7.335 2.66825 7.63273 2.66825 8C2.66825 8.36727 2.96598 8.665 3.33325 8.665H7.335V12.6666C7.335 13.0339 7.63273 13.3316 8 13.3316C8.36727 13.3316 8.665 13.0339 8.665 12.6666V8.665H12.6666C13.0339 8.665 13.3316 8.36727 13.3316 8C13.3316 7.63273 13.0339 7.335 12.6666 7.335H8.665V3.33331Z"/></svg>';

  function render() {
    var variant = document.querySelector('[data-pb-group="variant"] .is-active').dataset.value;
    var size = document.querySelector('[data-pb-group="size"] .is-active').dataset.value;
    var loading = document.getElementById("pb-loading").checked;
    var disabled = document.getElementById("pb-disabled").checked;
    var withIcon = document.getElementById("pb-icon").checked;

    var state = disabled ? "disabled" : loading ? "loading" : "default";
    var sizeClasses = variant === "link" ? LINK_SIZE_CLASSES[size] : SIZE_CLASSES[size];
    var btn = document.getElementById("pb-preview");
    btn.className = BASE_CLASSES + " " + sizeClasses + " " + VARIANT_STATE_CLASSES[variant][state];
    btn.disabled = disabled || loading;

    var iconSize = size === "small" ? 12 : 16;
    var startIconHtml = withIcon
      ? '<span aria-hidden="true" class="inline-flex shrink-0 items-center justify-center" style="width:' +
        iconSize +
        "px;height:" +
        iconSize +
        'px">' +
        PLUS_ICON_16 +
        "</span>"
      : "";
    var spinnerHtml = loading
      ? '<span aria-hidden="true" class="absolute inset-0 m-auto flex items-center justify-center">' +
        (SPINNER_VARIANT[variant] === "white" ? SPINNER_SVG_WHITE : SPINNER_SVG_GRADIENT) +
        "</span>"
      : "";
    btn.innerHTML = startIconHtml + "<span>Create resource</span>" + spinnerHtml;

    document.getElementById("pb-code").textContent =
      "<Button" +
      (variant !== "primary" ? ' variant="' + variant + '"' : "") +
      (size !== "large" ? ' size="' + size + '"' : "") +
      (withIcon ? " startIcon={<PlusIcon />}" : "") +
      (loading ? " loading" : "") +
      (disabled ? " disabled" : "") +
      ">\n  Create resource\n</Button>";
  }

  function bindGroup(name) {
    var group = document.querySelector('[data-pb-group="' + name + '"]');
    group.querySelectorAll(".docs-toolbar-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        group.querySelectorAll(".docs-toolbar-btn").forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        render();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindGroup("variant");
    bindGroup("size");
    ["pb-loading", "pb-disabled", "pb-icon"].forEach(function (id) {
      document.getElementById(id).addEventListener("change", render);
    });
    render();
  });
})();
