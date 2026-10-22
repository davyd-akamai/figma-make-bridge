// Mirrors components/NotificationBanner.tsx's class strings (copied verbatim) — hand-reimplemented in vanilla JS.
// Dismissal is controlled in the real component (the consumer removes the banner); here the demo does that itself.
(function () {
  var ICONS = {
    info: "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M18.3334 9.99984C18.3334 14.6022 14.6025 18.3332 10.0001 18.3332C5.39771 18.3332 1.66675 14.6022 1.66675 9.99984C1.66675 5.39746 5.39771 1.6665 10.0001 1.6665C14.6025 1.6665 18.3334 5.39746 18.3334 9.99984ZM10.0001 4.99984C9.53984 4.99984 9.16675 5.37293 9.16675 5.83317C9.16675 6.29341 9.53984 6.6665 10.0001 6.6665H10.0084C10.4687 6.6665 10.8417 6.29341 10.8417 5.83317C10.8417 5.37293 10.4687 4.99984 10.0084 4.99984H10.0001ZM10.8334 8.74984C10.8334 8.2896 10.4603 7.9165 10.0001 7.9165C9.53984 7.9165 9.16675 8.2896 9.16675 8.74984V14.5832C9.16675 15.0434 9.53984 15.4165 10.0001 15.4165C10.4603 15.4165 10.8334 15.0434 10.8334 14.5832V8.74984Z\"/></svg>",
    warning: "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10.0054 1.66663C9.62345 1.66663 9.24797 1.76506 8.91516 1.95243C8.58235 2.13981 8.30346 2.4098 8.10538 2.73634C8.0969 2.75033 8.08883 2.76456 8.08118 2.77903L1.83214 14.5983C1.64369 14.9306 1.54405 15.306 1.54298 15.6883C1.54189 16.0763 1.64242 16.4578 1.83457 16.7949C2.02673 17.132 2.3038 17.413 2.63822 17.6097C2.97264 17.8065 3.35276 17.9124 3.74077 17.9166L16.2499 17.9167L16.2591 17.9166C16.6471 17.9123 17.0272 17.8065 17.3617 17.6097C17.6961 17.413 17.9732 17.132 18.1653 16.7949C18.3575 16.4578 18.458 16.0763 18.4569 15.6883C18.4558 15.3062 18.3563 14.9309 18.1679 14.5986L11.9299 2.77956C11.9221 2.76491 11.914 2.7505 11.9054 2.73634C11.7073 2.40979 11.4284 2.13981 11.0956 1.95243C10.7628 1.76506 10.3873 1.66663 10.0054 1.66663Z\"/> <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"var(--global-color-neutrals-90, #3D3D42)\" d=\"M10.8333 7.91665C10.8333 7.45641 10.4602 7.08331 9.99996 7.08331C9.53972 7.08331 9.16663 7.45641 9.16663 7.91665V11.25C9.16663 11.7102 9.53972 12.0833 9.99996 12.0833C10.4602 12.0833 10.8333 11.7102 10.8333 11.25V7.91665ZM9.99996 15C10.4602 15 10.8333 14.6269 10.8333 14.1666C10.8333 13.7064 10.4602 13.3333 9.99996 13.3333C9.53972 13.3333 9.16663 13.7064 9.16663 14.1666C9.16663 14.6269 9.53972 15 9.99996 15Z\"/></svg>",
    success: "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M10.0001 18.3332C14.6025 18.3332 18.3334 14.6022 18.3334 9.99984C18.3334 5.39746 14.6025 1.6665 10.0001 1.6665C5.39771 1.6665 1.66675 5.39746 1.66675 9.99984C1.66675 14.6022 5.39771 18.3332 10.0001 18.3332ZM14.0199 7.97514C14.2824 7.59598 14.1879 7.07581 13.8087 6.81332C13.4295 6.55082 12.9094 6.6454 12.6469 7.02456L9.42388 11.68L7.21016 9.78253C6.86002 9.48242 6.33289 9.52297 6.03277 9.8731C5.73265 10.2232 5.7732 10.7504 6.12334 11.0505L9.04 13.5505C9.2195 13.7043 9.4558 13.7749 9.69026 13.7446C9.92473 13.7144 10.1354 13.5862 10.2699 13.3918L14.0199 7.97514Z\"/></svg>",
    error: "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M10.0001 1.66634C14.6025 1.66634 18.3334 5.3973 18.3334 9.99967C18.3334 14.602 14.6025 18.333 10.0001 18.333C5.39771 18.333 1.66675 14.602 1.66675 9.99967C1.66675 5.3973 5.39771 1.66634 10.0001 1.66634ZM6.90967 11.9093C6.58358 12.2354 6.58358 12.7641 6.90967 13.0902C7.23575 13.4162 7.76445 13.4162 8.09053 13.0902L10.0001 11.1806L11.9097 13.0902C12.2358 13.4162 12.7644 13.4162 13.0905 13.0902C13.4166 12.7641 13.4166 12.2354 13.0905 11.9093L11.181 9.99972L13.0905 8.09015C13.4166 7.76406 13.4166 7.23537 13.0905 6.90928C12.7644 6.58319 12.2358 6.58319 11.9097 6.90928L10.0001 8.81885L8.09053 6.90928C7.76445 6.58319 7.23575 6.58319 6.90967 6.90928C6.58358 7.23537 6.58358 7.76406 6.90967 8.09015L8.81923 9.99972L6.90967 11.9093Z\"/></svg>",
    secondary: "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M18.3334 9.99984C18.3334 14.6022 14.6025 18.3332 10.0001 18.3332C5.39771 18.3332 1.66675 14.6022 1.66675 9.99984C1.66675 5.39746 5.39771 1.6665 10.0001 1.6665C14.6025 1.6665 18.3334 5.39746 18.3334 9.99984ZM10.0001 4.99984C9.53984 4.99984 9.16675 5.37293 9.16675 5.83317C9.16675 6.29341 9.53984 6.6665 10.0001 6.6665H10.0084C10.4687 6.6665 10.8417 6.29341 10.8417 5.83317C10.8417 5.37293 10.4687 4.99984 10.0084 4.99984H10.0001ZM10.8334 8.74984C10.8334 8.2896 10.4603 7.9165 10.0001 7.9165C9.53984 7.9165 9.16675 8.2896 9.16675 8.74984V14.5832C9.16675 15.0434 9.53984 15.4165 10.0001 15.4165C10.4603 15.4165 10.8334 15.0434 10.8334 14.5832V8.74984Z\"/></svg>",
  };
  var CLOSE_SVG = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12.4702 4.47023C12.7299 4.21053 12.7299 3.78947 12.4702 3.52977C12.2105 3.27008 11.7895 3.27008 11.5298 3.52977L8 7.05955L4.47023 3.52977C4.21053 3.27008 3.78947 3.27008 3.52977 3.52977C3.27008 3.78947 3.27008 4.21053 3.52977 4.47023L7.05955 8L3.52977 11.5298C3.27008 11.7895 3.27008 12.2105 3.52977 12.4702C3.78947 12.7299 4.21053 12.7299 4.47023 12.4702L8 8.94045L11.5298 12.4702C11.7895 12.7299 12.2105 12.7299 12.4702 12.4702C12.7299 12.2105 12.7299 11.7895 12.4702 11.5298L8.94045 8L12.4702 4.47023Z\"/></svg>";
  var TYPES = {
    info: {
      container: "bg-[var(--component-notificationbanner-informative-background,#E6EDFE)] border-[var(--component-notificationbanner-informative-border,#4067E5)]",
      icon: "text-[color:var(--component-notificationbanner-informative-statusicon,#4067E5)]",
    },
    warning: {
      container: "bg-[var(--component-notificationbanner-warning-background,#FFECBC)] border-[var(--component-notificationbanner-warning-border,#FECB34)]",
      icon: "text-[color:var(--component-notificationbanner-warning-statusicon,#FECB34)]",
    },
    success: {
      container: "bg-[var(--component-notificationbanner-success-background,#DFF3DF)] border-[var(--component-notificationbanner-success-border,#00B050)]",
      icon: "text-[color:var(--component-notificationbanner-success-statusicon,#00B050)]",
    },
    error: {
      container: "bg-[var(--component-notificationbanner-error-background,#FFE5E5)] border-[var(--component-notificationbanner-error-border,#D63C42)]",
      icon: "text-[color:var(--component-notificationbanner-error-statusicon,#D63C42)]",
    },
    secondary: {
      container: "bg-[var(--component-notificationbanner-secondary-background,#E5E5EA)] border-[var(--component-notificationbanner-secondary-border,#A3A3AB)]",
      icon: "text-[color:var(--component-notificationbanner-secondary-statusicon,#696970)]",
    },
  };
  var LINK_BUTTON =
    "relative box-border inline-flex shrink-0 items-center justify-center gap-[var(--global-spacing-s4,4px)] whitespace-nowrap text-center transition-colors h-auto p-0 type-label-semibold-s cursor-pointer border-none bg-transparent text-[color:var(--component-button-link-default-text,#0174BC)] hover:text-[color:var(--component-button-link-hover-text,#009CDE)] active:text-[color:var(--component-button-link-active-text,#0174BC)]";
  var SECONDARY_BUTTON = "relative box-border inline-flex shrink-0 items-center justify-center gap-[var(--global-spacing-s4,4px)] whitespace-nowrap text-center transition-colors h-[34px] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] type-label-semibold-s cursor-pointer border border-solid bg-[var(--component-button-secondary-default-background,#FFFFFF)] border-[var(--component-button-secondary-default-border,#0174BC)] text-[color:var(--component-button-secondary-default-text,#0174BC)] hover:bg-[var(--component-button-secondary-hover-background,#EDF8FF)] hover:border-[var(--component-button-secondary-hover-border,#009CDE)] hover:text-[color:var(--component-button-secondary-hover-text,#0174BC)] active:bg-[var(--component-button-secondary-active-background,#FFFFFF)] active:border-[var(--component-button-secondary-active-border,#0174BC)] active:text-[color:var(--component-button-secondary-active-text,#0174BC)]";
  var DEFAULT_TEXT = "The record is available for all users on all reports.";
  var ORDER = ["info", "warning", "success", "error", "secondary"];

  function banner(type, opts) {
    opts = opts || {};
    var t = TYPES[type];
    var el = document.createElement("div");
    el.setAttribute("role", type === "error" || type === "warning" ? "alert" : "status");
    el.className = "flex w-full min-w-[240px] max-w-[1000px] items-stretch border border-solid pr-[var(--global-spacing-s12,12px)] " + t.container;
    el.innerHTML =
      '<div class="flex shrink-0 items-start pl-[var(--global-spacing-s12,12px)] pt-[10px] ' + t.icon + '" aria-hidden="true">' + ICONS[type] + "</div>" +
      '<div class="flex min-w-px flex-1 items-center gap-[var(--global-spacing-s24,24px)]">' +
      '<p class="type-label-semibold-s m-0 min-w-px flex-1 break-words py-[var(--global-spacing-s12,12px)] pl-[var(--global-spacing-s8,8px)] text-[color:var(--component-notificationbanner-text,#343438)]">' + (opts.text || DEFAULT_TEXT) + "</p>" +
      (opts.action ? '<div class="flex shrink-0 items-center"><button type="button" class="' + LINK_BUTTON + '"><span>Take an action</span></button></div>' : "") +
      "</div>" +
      (opts.dismissible !== false
        ? '<button type="button" aria-label="Dismiss" class="flex shrink-0 cursor-pointer items-start border-none bg-transparent py-[var(--global-spacing-s12,12px)] pl-[var(--global-spacing-s12,12px)] pr-0 text-[color:var(--component-notificationbanner-icon,#3D3D42)]">' + CLOSE_SVG + "</button>"
        : "");
    return el;
  }

  var types = document.getElementById("nb-types");
  if (types) ORDER.forEach(function (t) { types.appendChild(banner(t, { dismissible: false })); });

  var controlled = document.getElementById("nb-controlled");
  if (controlled) {
    var restore = document.createElement("button");
    restore.type = "button";
    restore.className = SECONDARY_BUTTON;
    restore.innerHTML = "<span>Restore banners</span>";
    var paint = function () {
      controlled.innerHTML = "";
      ORDER.forEach(function (t) {
        var el = banner(t, { action: true });
        el.querySelector('button[aria-label="Dismiss"]').addEventListener("click", function () {
          el.remove();
          if (!controlled.querySelector("[role]")) controlled.appendChild(restore);
        });
        controlled.appendChild(el);
      });
    };
    restore.addEventListener("click", paint);
    paint();
  }

  var long = document.getElementById("nb-long");
  if (long) {
    long.appendChild(banner("warning", {
      action: true,
      text: "Your account has reached 90% of its monthly transfer quota. Additional usage is billed at the standard overage rate until the quota resets at the start of the next billing period.",
    }));
  }
})();
