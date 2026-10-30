// Hand-mirrors components/ProgressBar.tsx (class strings verbatim; docs/ is outside the Tailwind scan,
// so every arbitrary-value class here must already exist in the compiled styles.css).
(function () {
  var LINE_H = { large: "h-[var(--global-spacing-s8,8px)]", small: "h-[var(--global-spacing-s4,4px)]" };
  var GRADIENT = "[background:var(--component-progressbar-statusline-inprogress,linear-gradient(270deg,#00B050_0%,#12A594_51%,#009CDE_100%))]";
  var FILL = {
    empty: GRADIENT,
    "in-progress": GRADIENT,
    success: "[background:var(--component-progressbar-statusline-success,#00B050)]",
    error: "[background:var(--component-progressbar-statusline-error,#D63C42)]",
  };

  function esc(t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  function derive(value, max) {
    if (value <= 0) return "empty";
    if (value >= max) return "success";
    return "in-progress";
  }

  // opts: { value, max, state, size, title, meta, description, linkText, ariaLabel }
  function html(opts) {
    var max = opts.max > 0 ? opts.max : 100;
    var value = Math.min(Math.max(opts.value || 0, 0), max);
    var size = opts.size || "large";
    var state = opts.state || derive(value, max);
    var percent = state === "success" || state === "error" ? 100 : state === "empty" ? 0 : (value / max) * 100;
    var showMeta = !!opts.meta && (state === "empty" || state === "in-progress");
    var hasTitleRow = !!opts.title || showMeta;
    var withContent = hasTitleRow || !!opts.description || !!opts.linkText;
    var name = opts.ariaLabel || opts.title || "";

    var line =
      '<div class="w-full bg-[var(--component-progressbar-statusline-default,#E5E5EA)] ' + LINE_H[size] + '">' +
      '<div class="relative h-full overflow-hidden transition-[width,background] duration-[250ms] ease-out ' + FILL[state] + '" style="width:' + percent + '%">' +
      (state === "in-progress" ? '<span class="fmb-progress-shimmer" aria-hidden="true"></span>' : "") +
      "</div></div>";

    var inner = line;
    if (withContent) {
      inner =
        '<div class="flex w-full flex-col gap-[var(--global-spacing-s8,8px)]">' + line +
        (hasTitleRow
          ? '<div class="flex w-full items-start gap-[var(--global-spacing-s12,12px)] text-[color:var(--component-progressbar-text-default,#343438)]">' +
            '<p class="type-label-bold-s min-w-0 flex-1 truncate">' + esc(opts.title || "") + "</p>" +
            (showMeta ? '<p class="type-label-regular-s shrink-0 text-right">' + esc(opts.meta) + "</p>" : "") +
            "</div>"
          : "") +
        (opts.description
          ? '<p class="type-body-regular w-full text-[color:var(--component-progressbar-text-default,#343438)]">' + esc(opts.description) + "</p>"
          : "") +
        "</div>" +
        (opts.linkText
          ? '<div class="type-body-regular w-full text-[color:var(--component-progressbar-text-link-default,#0174BC)] hover:text-[color:var(--component-progressbar-text-link-hover,#009CDE)] [&_a]:text-inherit [&_button]:cursor-pointer [&_button]:text-inherit [&_a]:no-underline"><a href="#">' + esc(opts.linkText) + "</a></div>"
          : "");
    }

    return (
      '<div role="progressbar" aria-valuemin="0" aria-valuemax="' + max + '" aria-valuenow="' + value + '"' +
      (name ? ' aria-label="' + esc(name) + '"' : "") +
      ' class="flex w-full flex-col ' + (withContent ? "gap-[var(--global-spacing-s12,12px)]" : "h-[16px] justify-center") + '">' +
      inner + "</div>"
    );
  }

  var STATES = [
    { state: "empty", value: 0, title: "Property deploying...", meta: "Est. 1 minute left" },
    { state: "in-progress", value: 56, title: "Property deploying...", meta: "Est. 1 minute left" },
    { state: "success", value: 100, title: "Property successfully deployed!" },
    { state: "error", value: 40, title: "Error deploying property!" },
  ];

  var lines = document.querySelector("[data-pb-lines]");
  var titles = document.querySelector("[data-pb-titles]");
  var out1 = "";
  var out2 = "";
  ["large", "small"].forEach(function (size) {
    STATES.forEach(function (s) {
      out1 += html({ size: size, state: s.state, value: s.value, ariaLabel: s.state + " (" + size + ")" });
      out2 += html({ size: size, state: s.state, value: s.value, title: s.title, meta: s.meta, description: "Optional text lorem ipsum", linkText: "Optional link" });
    });
  });
  lines.innerHTML = out1;
  titles.innerHTML = out2;

  var value = 30;
  var host = document.getElementById("pb-controlled");
  var readout = document.getElementById("pb-controlled-state");
  var LABELS = { empty: "empty", "in-progress": "in progress", success: "success" };
  function paint() {
    var state = derive(value, 100);
    var done = state === "success";
    // Only the fill width/classes and text change: rebuild just the bar, the buttons stay put.
    host.innerHTML = html({ value: value, title: done ? "Property successfully deployed!" : "Property deploying...", meta: "Est. 1 minute left" });
    readout.textContent = value + "% (" + LABELS[state] + ")";
  }
  document.getElementById("pb-minus").addEventListener("click", function () {
    value = Math.max(0, value - 25);
    paint();
  });
  document.getElementById("pb-plus").addEventListener("click", function () {
    value = Math.min(100, value + 25);
    paint();
  });
  paint();
})();
