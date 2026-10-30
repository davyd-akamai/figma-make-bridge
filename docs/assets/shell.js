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
    { id: "table", label: "Table", href: "components/table.html" },
    { id: "container", label: "Container", href: "components/container.html" },
    { id: "text-field", label: "TextField", href: "components/text-field.html" },
    { id: "text-area", label: "TextArea", href: "components/text-area.html" },
    { id: "tag-input", label: "TagInput", href: "components/tag-input.html" },
    { id: "select", label: "Select", href: "components/select.html" },
    { id: "search", label: "Search", href: "components/search.html" },
    { id: "checkbox", label: "Checkbox", href: "components/checkbox.html" },
    { id: "content-panel", label: "ContentPanel", href: "components/content-panel.html" },
    { id: "pagination", label: "Pagination", href: "components/pagination.html" },
    { id: "radio-button", label: "RadioButton", href: "components/radio-button.html" },
    { id: "switch", label: "Switch", href: "components/switch.html" },
    { id: "breadcrumbs", label: "Breadcrumbs", href: "components/breadcrumbs.html" },
    { id: "tabs-horizontal", label: "TabsHorizontal", href: "components/tabs-horizontal.html" },
    { id: "drawer", label: "Drawer", href: "components/drawer.html" },
    { id: "modal", label: "Modal", href: "components/modal.html" },
    { id: "notification-banner", label: "NotificationBanner", href: "components/notification-banner.html" },
    { id: "toast", label: "Toast", href: "components/toast.html" },
    { id: "tooltip", label: "Tooltip", href: "components/tooltip.html" },
    { id: "icons", label: "Icons", href: "components/icons.html" },
  ];

  // Components are listed alphabetically (case-insensitive) so they are easy to find; sorting at runtime
  // means a newly added entry lands in the right place no matter where it is appended above.
  COMPONENTS.sort(function (a, b) {
    return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
  });

  var LIBRARY = [
    { id: "library-progress", label: "Built & planned", href: "library-progress.html" },
    { id: "release-notes", label: "Release notes", href: "release-notes.html" },
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

  var libraryTitle = document.createElement("div");
  libraryTitle.className = "docs-nav-group-title";
  libraryTitle.textContent = "Library progress";
  nav.appendChild(libraryTitle);
  LIBRARY.forEach(function (item) {
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
