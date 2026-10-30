// Docs-site mirror of components/Tooltip.tsx (vanilla, no React). Any element with a
// `data-fmb-tooltip="text"` attribute gets the tooltip on hover and keyboard focus; listeners are
// delegated on `document`, so elements created or re-rendered later (innerHTML rebuilds) work too.
// Class strings are copied verbatim from Tooltip.tsx so they exist in the compiled styles.css.
(function () {
  var FADE_MS = 250, MARGIN = 4, BUBBLE_GAP = 8, ARROW_H = 4, ARROW_INSET = 8;
  var OPP = { top: "bottom", bottom: "top", left: "right", right: "left" };
  var ROOT = { top: "flex-col", bottom: "flex-col-reverse", left: "flex-row", right: "flex-row-reverse" };
  var ROT = { top: "rotate-180", bottom: "", left: "rotate-90", right: "-rotate-90" };
  var ARROW_PATH = "M12.7071 0.707107L16 4L8 4L11.2929 0.707107C11.6834 0.316583 12.3166 0.316582 12.7071 0.707107Z";
  var uid = 0, cur = null, hoverEl = null, focusEl = null;

  function noArrow(a) { return a.getAttribute("data-fmb-arrow") === "false"; }
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  function layout(a, w, h, preferred, noArrow) {
    var vw = window.innerWidth, vh = window.innerHeight, gap = noArrow ? BUBBLE_GAP : BUBBLE_GAP - ARROW_H;
    var fits = {
      top: a.top >= h + gap + MARGIN, bottom: vh - a.bottom >= h + gap + MARGIN,
      left: a.left >= w + gap + MARGIN, right: vw - a.right >= w + gap + MARGIN,
    };
    var cand = preferred === "top" || preferred === "bottom" ? [preferred, OPP[preferred], "right", "left"] : [preferred, OPP[preferred], "bottom", "top"];
    var p = cand.filter(function (c) { return fits[c]; })[0] || preferred;
    var cx = a.left + a.width / 2, cy = a.top + a.height / 2, x, y, shift;
    if (p === "top" || p === "bottom") {
      y = p === "top" ? a.top - h - gap : a.bottom + gap;
      x = Math.max(MARGIN, Math.min(cx - w / 2, vw - w - MARGIN));
      var m = Math.max(0, w / 2 - ARROW_INSET);
      shift = Math.max(-m, Math.min(cx - (x + w / 2), m));
    } else {
      x = p === "left" ? a.left - w - gap : a.right + gap;
      y = Math.max(MARGIN, Math.min(cy - h / 2, vh - h - MARGIN));
      var m2 = Math.max(0, h / 2 - ARROW_INSET);
      shift = Math.max(-m2, Math.min(cy - (y + h / 2), m2));
    }
    return { x: x, y: y, p: p, shift: shift };
  }

  function show(anchor) {
    var text = anchor.getAttribute("data-fmb-tooltip");
    if (!text) return;
    if (cur && cur.anchor === anchor) { clearTimeout(cur.timer); cur.timer = null; }
    else { if (cur) remove(); build(anchor, text); }
    var place = cur;
    var pref = anchor.getAttribute("data-fmb-placement") || "top";
    // Measure at the preferred side's orientation (row for left/right, column for top/bottom), as the React component does.
    place.l = { x: 0, y: 0, p: pref, shift: 0 };
    apply(place);
    var l = layout(anchor.getBoundingClientRect(), place.el.offsetWidth, place.el.offsetHeight, anchor.getAttribute("data-fmb-placement") || "top", noArrow(anchor));
    place.l = l;
    apply(place);
    // The flip can change orientation (and so the measured size): place once more with the final size.
    place.l = layout(anchor.getBoundingClientRect(), place.el.offsetWidth, place.el.offsetHeight, l.p, noArrow(anchor));
    apply(place);
    place.el.style.visibility = "visible";
    requestAnimationFrame(function () { if (cur === place && !place.closing) place.el.className = place.el.className.replace("opacity-0", "opacity-100"); });
  }

  function build(anchor, text) {
    var el = document.createElement("div");
    el.id = "fmb-tooltip-" + ++uid;
    el.setAttribute("role", "tooltip");
    el.style.cssText = "position:fixed;left:0;top:0;visibility:hidden;";
    el.innerHTML = '<div class="type-label-semibold-xs max-w-[240px] rounded-[2px] bg-[var(--component-tooltip-background,#343438)] p-[6px] text-[color:var(--component-tooltip-text,#FFFFFF)] [overflow-wrap:break-word]">' + esc(text) + "</div>" +
      (noArrow(anchor) ? "" : '<div class="flex shrink-0 items-center justify-center text-[color:var(--component-tooltip-background,#343438)]"><svg width="24" height="4" viewBox="0 0 24 4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="flex-none" aria-hidden="true"><path d="' + ARROW_PATH + '"/></svg></div>');
    document.body.appendChild(el);
    var prev = anchor.getAttribute("aria-describedby");
    anchor.setAttribute("aria-describedby", prev ? prev + " " + el.id : el.id);
    cur = { anchor: anchor, el: el, prev: prev, timer: null, closing: false, l: null };
    el.className = "pointer-events-none z-[1200] flex w-max items-center transition-opacity duration-[250ms] ease-in-out flex-col opacity-0";
  }

  function apply(t) {
    var l = t.l, vertical = l.p === "left" || l.p === "right";
    t.el.style.left = l.x + "px";
    t.el.style.top = l.y + "px";
    var op = t.el.className.indexOf("opacity-100") >= 0 ? "opacity-100" : "opacity-0";
    t.el.className = "pointer-events-none z-[1200] flex w-max items-center transition-opacity duration-[250ms] ease-in-out " + ROOT[l.p] + " " + op;
    var arrow = t.el.children[1];
    if (!arrow) return;
    arrow.className = "flex shrink-0 items-center justify-center text-[color:var(--component-tooltip-background,#343438)] " + (vertical ? "h-[24px] w-[4px]" : "h-[4px] w-[24px]");
    arrow.style.transform = vertical ? "translateY(" + l.shift + "px)" : "translateX(" + l.shift + "px)";
    arrow.firstChild.setAttribute("class", "flex-none " + ROT[l.p]);
  }

  function remove() {
    if (!cur) return;
    clearTimeout(cur.timer);
    if (cur.prev) cur.anchor.setAttribute("aria-describedby", cur.prev); else cur.anchor.removeAttribute("aria-describedby");
    cur.el.remove();
    cur = null;
  }

  function hide() {
    if (!cur || cur.closing) return;
    var t = cur;
    t.closing = true;
    t.el.className = t.el.className.replace("opacity-100", "opacity-0");
    if (t.prev) t.anchor.setAttribute("aria-describedby", t.prev); else t.anchor.removeAttribute("aria-describedby");
    t.timer = setTimeout(function () { if (cur === t) { t.el.remove(); cur = null; } }, FADE_MS);
  }

  function sync() {
    var a = hoverEl || focusEl;
    if (a && a.isConnected) { if (cur && cur.anchor === a) cur.closing = false; show(a); }
    else hide();
  }

  function find(n) { return n && n.closest ? n.closest("[data-fmb-tooltip]") : null; }

  document.addEventListener("mouseover", function (e) {
    var a = find(e.target);
    if (a && a !== hoverEl) { hoverEl = a; sync(); }
  });
  document.addEventListener("mouseout", function (e) {
    var a = find(e.target);
    if (a && a === hoverEl && !(e.relatedTarget && a.contains(e.relatedTarget))) { hoverEl = null; sync(); }
  });
  document.addEventListener("focusin", function (e) {
    var a = find(e.target);
    if (a && e.target.matches(":focus-visible")) { focusEl = a; sync(); }
  });
  document.addEventListener("focusout", function (e) {
    if (find(e.target) && find(e.target) === focusEl) { focusEl = null; sync(); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && cur) { hoverEl = null; focusEl = null; hide(); }
  });
  function reposition() {
    if (cur && !cur.closing && cur.anchor.isConnected) { cur.l = layout(cur.anchor.getBoundingClientRect(), cur.el.offsetWidth, cur.el.offsetHeight, cur.anchor.getAttribute("data-fmb-placement") || "top", noArrow(cur.anchor)); apply(cur); }
  }
  window.addEventListener("scroll", reposition, true);
  window.addEventListener("resize", reposition);
})();
