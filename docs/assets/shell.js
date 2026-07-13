// Shared sidebar nav, injected on every page into <div id="site-nav"></div>.
// Each page sets document.body.dataset.page to its own nav id so the matching
// link gets highlighted. Paths are relative to docs/ root; ROOT is computed
// from data-root on <body> ("" at docs/index.html, "../" one level down).
(function () {
  var ROOT = document.body.dataset.root || "";

  var COMPONENTS = [
    { id: "global-header", label: "GlobalHeader", href: "components/global-header.html" },
    { id: "side-navigation", label: "SideNavigation", href: "components/side-navigation.html" },
    { id: "global-footer", label: "GlobalFooter", href: "components/global-footer.html" },
    { id: "badge", label: "Badge", href: "components/badge.html" },
    { id: "system-badge", label: "SystemBadge", href: "components/system-badge.html" },
    { id: "button", label: "Button", href: "components/button.html" },
    { id: "container", label: "Container", href: "components/container.html" },
    { id: "text-field", label: "TextField", href: "components/text-field.html" },
    { id: "checkbox", label: "Checkbox", href: "components/checkbox.html" },
    { id: "radio-button", label: "RadioButton", href: "components/radio-button.html" },
    { id: "tabs-horizontal", label: "TabsHorizontal", href: "components/tabs-horizontal.html" },
    { id: "icons", label: "Icons", href: "components/icons.html" },
  ];

  var TEMPLATES = [{ id: "default-cm-page-template", label: "DefaultCmPageTemplate", href: "templates/default-cm-page-template.html" }];

  function link(item) {
    var a = document.createElement("a");
    a.href = ROOT + item.href;
    a.textContent = item.label;
    a.className = "docs-nav-link" + (document.body.dataset.page === item.id ? " is-active" : "");
    return a;
  }

  var nav = document.getElementById("site-nav");
  if (!nav) return;

  var brand = document.createElement("a");
  brand.href = ROOT + "index.html";
  brand.className = "docs-nav-brand";
  brand.innerHTML = "figma-make-bridge<span>Component preview</span>";
  nav.appendChild(brand);

  var componentsTitle = document.createElement("div");
  componentsTitle.className = "docs-nav-group-title";
  componentsTitle.textContent = "Components";
  nav.appendChild(componentsTitle);
  COMPONENTS.forEach(function (item) {
    nav.appendChild(link(item));
  });

  var templatesTitle = document.createElement("div");
  templatesTitle.className = "docs-nav-group-title";
  templatesTitle.textContent = "Templates";
  nav.appendChild(templatesTitle);
  TEMPLATES.forEach(function (item) {
    nav.appendChild(link(item));
  });

  var footer = document.createElement("div");
  footer.className = "docs-nav-footer";
  footer.innerHTML =
    '<a href="https://github.com/' +
    (document.body.dataset.repo || "") +
    '" target="_blank" rel="noopener noreferrer">View on GitHub ↗</a>';
  nav.appendChild(footer);
})();
