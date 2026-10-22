// Mirrors components/Toast.tsx's class strings (copied verbatim) and its behavior — hand-reimplemented in vanilla JS.
// Fixed bottom-right, auto-dismiss after 5000ms (duration=0 disables), × dismisses. Visibility is controlled in the
// real component (the consumer sets `open`); here each demo toast plays that role itself.
(function () {
  var ICONS = {"info": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11 7C11 6.44772 11.4477 6 12 6H12.01C12.5623 6 13.01 6.44772 13.01 7C13.01 7.55228 12.5623 8 12.01 8H12C11.4477 8 11 7.55228 11 7ZM12 9.5C12.5523 9.5 13 9.94772 13 10.5V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V10.5C11 9.94772 11.4477 9.5 12 9.5Z\"/></svg>", "warning": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12 8.49804C12.5534 8.49804 13.002 8.94665 13.002 9.50004V13.5C13.002 14.0534 12.5534 14.502 12 14.502C11.4466 14.502 10.998 14.0534 10.998 13.5V9.50004C10.998 8.94665 11.4466 8.49804 12 8.49804Z\"/><path d=\"M13 17.0001C13 17.5523 12.5523 18.0001 12 18.0001C11.4477 18.0001 11 17.5523 11 17.0001C11 16.4478 11.4477 16.0001 12 16.0001C12.5523 16.0001 13 16.4478 13 17.0001Z\"/><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M10.6973 2.34127C11.0969 2.11626 11.5478 1.99805 12.0065 1.99805C12.4652 1.99805 12.9161 2.11626 13.3157 2.34127C13.7154 2.56629 14.0503 2.89052 14.2882 3.28267C14.2985 3.29969 14.3084 3.31702 14.3177 3.33463L21.8033 17.5175C22.0295 17.9165 22.149 18.3671 22.1503 18.826C22.1516 19.292 22.0309 19.7502 21.8001 20.155C21.5694 20.5598 21.2367 20.8972 20.8351 21.1335C20.4334 21.3698 19.977 21.4969 19.511 21.502L19.5 21.5021L4.48895 21.502C4.02299 21.4969 3.5665 21.3698 3.1649 21.1335C2.76329 20.8972 2.43055 20.5598 2.1998 20.155C1.96905 19.7502 1.84832 19.292 1.84962 18.826C1.85091 18.367 1.97056 17.9162 2.19686 17.5171L9.69569 3.33399C9.70489 3.3166 9.71459 3.29949 9.72479 3.28267C9.96266 2.89052 10.2976 2.56629 10.6973 2.34127ZM12.0065 4.00205C11.8923 4.00205 11.78 4.03149 11.6804 4.08753C11.5875 4.13983 11.5087 4.21365 11.4504 4.30266L3.96077 18.4684C3.95494 18.4794 3.94891 18.4903 3.94268 18.5011C3.88464 18.6016 3.85394 18.7156 3.85361 18.8316C3.85329 18.9477 3.88336 19.0618 3.94083 19.1626C3.9983 19.2635 4.08117 19.3475 4.1812 19.4063C4.28 19.4645 4.39214 19.4961 4.5067 19.498H19.4932C19.6078 19.4961 19.7199 19.4645 19.8187 19.4063C19.9188 19.3475 20.0016 19.2635 20.0591 19.1626C20.1166 19.0618 20.1467 18.9477 20.1463 18.8316C20.146 18.7156 20.1153 18.6016 20.0573 18.5011C20.0509 18.4901 20.0448 18.479 20.0388 18.4678L12.5625 4.30244C12.5042 4.21353 12.4254 4.13979 12.3326 4.08753C12.233 4.03149 12.1207 4.00205 12.0065 4.00205Z\"/></svg>", "error": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4.00205 12C4.00205 16.4171 7.58287 19.998 12 19.998C16.4172 19.998 19.998 16.4171 19.998 12C19.998 7.58278 16.4172 4.00196 12 4.00196C7.58287 4.00196 4.00205 7.58278 4.00205 12ZM12 22.002C6.47609 22.002 1.99805 17.5239 1.99805 12C1.99805 6.476 6.47609 1.99795 12 1.99795C17.524 1.99795 22.002 6.476 22.002 12C22.002 17.5239 17.524 22.002 12 22.002ZM8.29153 15.7085C7.90022 15.3172 7.90022 14.6827 8.29153 14.2914L10.583 12L8.29153 9.70848C7.90022 9.31717 7.90022 8.68274 8.29153 8.29143C8.68283 7.90013 9.31726 7.90013 9.70857 8.29143L12 10.5829L14.2915 8.29143C14.6828 7.90013 15.3173 7.90013 15.7086 8.29143C16.0999 8.68274 16.0999 9.31717 15.7086 9.70848L13.4171 12L15.7086 14.2914C16.0999 14.6827 16.0999 15.3172 15.7086 15.7085C15.3173 16.0998 14.6828 16.0998 14.2915 15.7085L12 13.417L9.70857 15.7085C9.31726 16.0998 8.68283 16.0998 8.29153 15.7085Z\"/></svg>", "success": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12 4.00205C7.58287 4.00205 4.00205 7.58287 4.00205 12C4.00205 16.4172 7.58287 19.998 12 19.998C16.4172 19.998 19.998 16.4172 19.998 12C19.998 7.58287 16.4172 4.00205 12 4.00205ZM1.99805 12C1.99805 6.47609 6.47609 1.99805 12 1.99805C17.524 1.99805 22.002 6.47609 22.002 12C22.002 17.524 17.524 22.002 12 22.002C6.47609 22.002 1.99805 17.524 1.99805 12ZM16.5704 8.17621C17.0254 8.4912 17.1389 9.1154 16.8239 9.57039L12.3239 16.0704C12.1624 16.3036 11.9096 16.4575 11.6283 16.4938C11.3469 16.5301 11.0634 16.4454 10.848 16.2608L7.34798 13.2608C6.92781 12.9007 6.87915 12.2681 7.2393 11.848C7.59944 11.4278 8.232 11.3791 8.65216 11.7393L11.3086 14.0162L15.1762 8.4297C15.4912 7.97471 16.1154 7.86122 16.5704 8.17621Z\"/></svg>"};
  var CLOSE_SVG = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12.4702 4.47023C12.7299 4.21053 12.7299 3.78947 12.4702 3.52977C12.2105 3.27008 11.7895 3.27008 11.5298 3.52977L8 7.05955L4.47023 3.52977C4.21053 3.27008 3.78947 3.27008 3.52977 3.52977C3.27008 3.78947 3.27008 4.21053 3.52977 4.47023L7.05955 8L3.52977 11.5298C3.27008 11.7895 3.27008 12.2105 3.52977 12.4702C3.78947 12.7299 4.21053 12.7299 4.47023 12.4702L8 8.94045L11.5298 12.4702C11.7895 12.7299 12.2105 12.7299 12.4702 12.4702C12.7299 12.2105 12.7299 11.7895 12.4702 11.5298L8.94045 8L12.4702 4.47023Z\"/></svg>";
  var TYPES = {
    info: {
      container: "bg-[var(--component-notificationtoast-informative-background,#E6EDFE)]",
      indicator: "bg-[var(--component-notificationtoast-informative-iconbackground,#4067E5)] text-[color:var(--component-notificationtoast-informative-statusicon,#FFFFFF)]",
    },
    warning: {
      container: "bg-[var(--component-notificationtoast-warning-background,#FFECBC)]",
      indicator: "bg-[var(--component-notificationtoast-warning-iconbackground,#FECB34)] text-[color:var(--component-notificationtoast-warning-statusicon,#3D3D42)]",
    },
    error: {
      container: "bg-[var(--component-notificationtoast-error-background,#FFE5E5)]",
      indicator: "bg-[var(--component-notificationtoast-error-iconbackground,#D63C42)] text-[color:var(--component-notificationtoast-error-statusicon,#FFFFFF)]",
    },
    success: {
      container: "bg-[var(--component-notificationtoast-success-background,#DFF3DF)]",
      indicator: "bg-[var(--component-notificationtoast-success-iconbackground,#00B050)] text-[color:var(--component-notificationtoast-success-statusicon,#FFFFFF)]",
    },
  };
  var SECONDARY_BUTTON = "relative box-border inline-flex shrink-0 items-center justify-center gap-[var(--global-spacing-s4,4px)] whitespace-nowrap text-center transition-colors h-[34px] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] type-label-semibold-s cursor-pointer border border-solid bg-[var(--component-button-secondary-default-background,#FFFFFF)] border-[var(--component-button-secondary-default-border,#0174BC)] text-[color:var(--component-button-secondary-default-text,#0174BC)] hover:bg-[var(--component-button-secondary-hover-background,#EDF8FF)] hover:border-[var(--component-button-secondary-hover-border,#009CDE)] hover:text-[color:var(--component-button-secondary-hover-text,#0174BC)] active:bg-[var(--component-button-secondary-active-background,#FFFFFF)] active:border-[var(--component-button-secondary-active-border,#0174BC)] active:text-[color:var(--component-button-secondary-active-text,#0174BC)]";
  var OPEN = "visible translate-x-0 opacity-100 duration-300 ease-out";
  var CLOSED = "pointer-events-none invisible translate-x-6 opacity-0 duration-[250ms] ease-in";
  var TEXT = { info: "The record is available for all users.", warning: "The record is temporary unavailable.", error: "The record is unavailable for all users.", success: "The record is available for all users." };

  // Same markup as Toast.tsx. Never rendered until first open; stays mounted afterwards so close can transition.
  function createToast(type, text, duration) {
    var t = TYPES[type];
    var el = null;
    var timer = null;
    function setOpen(open) {
      if (open && !el) {
        el = document.createElement("div");
        el.setAttribute("role", type === "error" || type === "warning" ? "alert" : "status");
        el.innerHTML =
          '<div class="flex shrink-0 items-start justify-center self-stretch p-[var(--global-spacing-s12,12px)] ' + t.indicator + '" aria-hidden="true">' + ICONS[type] + "</div>" +
          '<div class="flex min-w-px flex-1 items-start gap-[var(--global-spacing-s12,12px)] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s16,16px)]">' +
          '<p class="type-label-semibold-s m-0 min-w-[100px] max-w-[300px] flex-1 break-words text-[color:var(--component-notificationtoast-text,#343438)]">' + text + "</p>" +
          '<button type="button" aria-label="Close" class="flex shrink-0 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-[color:var(--component-notificationtoast-icon,#3D3D42)]">' + CLOSE_SVG + "</button></div>";
        el.querySelector("button").addEventListener("click", function () { setOpen(false); });
        el.className = base(t) + " " + CLOSED; // construct closed first so the slide-in transitions
        document.body.appendChild(el);
        void el.offsetWidth;
      }
      if (!el) return;
      el.className = base(t) + " " + (open ? OPEN : CLOSED);
      if (open) el.removeAttribute("aria-hidden"); else el.setAttribute("aria-hidden", "true");
      el.querySelector("button").tabIndex = open ? 0 : -1;
      clearTimeout(timer);
      if (open && duration > 0) timer = setTimeout(function () { setOpen(false); }, duration);
    }
    return { open: function () { setOpen(true); } };
  }
  function base(t) {
    return "fixed bottom-[var(--global-spacing-s24,24px)] right-[var(--global-spacing-s24,24px)] z-[1100] flex max-w-[400px] min-w-[200px] items-start shadow-[var(--component-notificationtoast-elevation-s,0px_2px_8px_0px_rgba(58,59,63,0.18))] transition-[transform,opacity,visibility] " + t.container;
  }

  function button(label, onClick) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = SECONDARY_BUTTON;
    b.innerHTML = "<span>" + label + "</span>";
    b.addEventListener("click", onClick);
    return b;
  }

  var types = document.getElementById("toast-types");
  if (types) {
    ["info", "warning", "error", "success"].forEach(function (type) {
      var toast = createToast(type, TEXT[type], 5000);
      types.appendChild(button("Show " + type + " toast", function () { toast.open(); }));
    });
  }
  var persistent = document.getElementById("toast-persistent");
  if (persistent) {
    var p = createToast("info", "This toast stays until you click \u00d7.", 0);
    persistent.appendChild(button("Show toast (duration=0)", function () { p.open(); }));
  }
})();
