// Mirrors components/NumericSpinner.tsx's step/clamp/sanitize logic. Only the input value and
// the (disabled) chevron state are touched; no nodes are rebuilt, so focus survives typing.
(function () {
  var REPEAT_DELAY_MS = 500;
  var REPEAT_INTERVAL_MS = 100;

  function decimalsOf(n) {
    var s = String(n);
    return s.indexOf("e") >= 0 ? 0 : (s.split(".")[1] || "").length;
  }
  function sanitize(raw) {
    var out = raw.replace(/[^0-9.-]/g, "");
    var negative = out.charAt(0) === "-";
    out = out.replace(/-/g, "");
    var dot = out.indexOf(".");
    if (dot >= 0) out = out.slice(0, dot + 1) + out.slice(dot + 1).replace(/\./g, "");
    if (out.charAt(0) === ".") out = "0" + out;
    return negative ? "-" + out : out;
  }
  function parse(raw) {
    if (raw === "") return null;
    var n = Number(raw);
    return isNaN(n) ? null : n;
  }

  function setup(root) {
    var input = root.querySelector(".ns-input");
    var up = root.querySelector(".ns-up");
    var down = root.querySelector(".ns-down");
    var step = parseFloat(root.getAttribute("data-step")) || 1;
    if (!(step > 0)) step = 1;
    var min = root.hasAttribute("data-min") ? parseFloat(root.getAttribute("data-min")) : null;
    var max = root.hasAttribute("data-max") ? parseFloat(root.getAttribute("data-max")) : null;
    var value = parse(input.value);
    var timer = null;
    var interval = null;

    function format(v) {
      if (v == null) return "";
      return v.toFixed(Math.max(decimalsOf(step), decimalsOf(v)));
    }
    function clamp(n) {
      if (min != null) n = Math.max(min, n);
      if (max != null) n = Math.min(max, n);
      return n;
    }
    function stepBy(dir) {
      if (input.disabled) return;
      var next = value;
      if (value == null) next = clamp(0);
      else if (dir === 1 && min != null && min > value) next = min;
      else if (dir === -1 && max != null && max < value) next = max;
      else {
        var d = Math.max(decimalsOf(step), decimalsOf(value));
        var cand = Number((value + dir * step).toFixed(d));
        if (dir === 1 ? max == null || cand <= max : min == null || cand >= min) next = cand;
      }
      if (next !== value) {
        value = next;
        input.value = format(value);
      }
    }
    function stop() {
      clearTimeout(timer);
      clearInterval(interval);
      timer = interval = null;
    }
    function start(dir) {
      if (input.disabled) return;
      stepBy(dir);
      timer = setTimeout(function () {
        interval = setInterval(function () { stepBy(dir); }, REPEAT_INTERVAL_MS);
      }, REPEAT_DELAY_MS);
    }
    [[up, 1], [down, -1]].forEach(function (pair) {
      var btn = pair[0];
      btn.addEventListener("pointerdown", function (e) { e.preventDefault(); start(pair[1]); });
      btn.addEventListener("pointerup", stop);
      btn.addEventListener("pointerleave", stop);
      btn.addEventListener("pointercancel", stop);
    });
    input.addEventListener("input", function () {
      var s = sanitize(input.value);
      if (s !== input.value) input.value = s;
      value = parse(s);
    });
    input.addEventListener("blur", function () { input.value = format(value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        stepBy(e.key === "ArrowUp" ? 1 : -1);
      } else if (e.key === "Home" && min != null) {
        e.preventDefault();
        value = min;
        input.value = format(value);
      } else if (e.key === "End" && max != null) {
        e.preventDefault();
        value = max;
        input.value = format(value);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-ns]").forEach(setup);
  });
})();
