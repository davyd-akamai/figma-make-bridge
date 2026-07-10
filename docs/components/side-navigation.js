// Reimplements components/SideNavigation.tsx's interaction model in vanilla JS: unpinned
// defaults collapsed (48px) and expands to 232px on hover; pinned locks to `pinnedExpanded`
// and ignores hover; sections are an independent accordion (Set of open ids); page rows only
// render while expanded && open (mirrors the "gaps between collapsed sections" gotcha logged
// in GUIDELINES.md); the pin icon's filled state tracks `pinned`, not transient hover.
(function () {
  var ICONS = {
    compute:
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M11.5098 2.1284C11.8142 1.9572 12.1859 1.9572 12.4903 2.1284L20.4903 6.6284C20.8051 6.8055 21 7.1387 21 7.5V16.5C21 16.8613 20.8051 17.1945 20.4903 17.3716L12.4903 21.8716C12.1859 22.0428 11.8142 22.0428 11.5098 21.8716L3.5097 17.3716C3.1949 17.1945 3 16.8613 3 16.5V7.5C3 7.1387 3.1949 6.8055 3.5097 6.6284L11.5098 2.1284ZM5 8.0848V15.9152L12 19.8527L19 15.9152V8.0848L12 4.1473L5 8.0848Z"/>',
    storage:
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M4.0053 10.1059L4.005 10.1034C4.0026 10.0839 3.9995 10.0579 3.9961 10.0256C3.9894 9.961 3.9813 9.8714 3.9745 9.7603C3.9609 9.5386 3.9522 9.2284 3.9698 8.8587C4.0048 8.1253 4.1446 7.1239 4.5808 6.1061C5.0214 5.078 5.7662 4.0316 6.9943 3.2501C8.2191 2.4707 9.8531 2 12 2C14.1468 2 15.7809 2.4707 17.0056 3.2501C18.2337 4.0316 18.9785 5.078 19.4191 6.1061C19.8553 7.1239 19.9951 8.1253 20.0301 8.8587C20.0477 9.2284 20.039 9.5386 20.0254 9.7603C20.0186 9.8714 20.0106 9.961 20.0038 10.0256C20.0004 10.0579 19.9973 10.0839 19.9949 10.1034L19.9946 10.1059C19.9935 10.1166 19.9923 10.1275 19.9909 10.1386L18.9964 19.5852C18.9948 19.6053 18.9926 19.6266 18.9896 19.649C18.982 19.7062 18.9694 19.7701 18.9497 19.8391C18.9098 19.9786 18.843 20.1318 18.7382 20.289C18.5273 20.6054 18.1908 20.8976 17.6971 21.1444C16.7382 21.6239 15.051 22 12 22C8.9489 22 7.2617 21.6239 6.3027 21.1444C5.8091 20.8976 5.4725 20.6055 5.2616 20.2891C5.1568 20.1319 5.09 19.9787 5.0501 19.8392C5.0304 19.7702 5.0178 19.7063 5.0101 19.6491C5.0071 19.6267 5.0049 19.6054 5.0033 19.5852L4.009 10.1387C4.0076 10.1275 4.0064 10.1166 4.0053 10.1059ZM6.2081 11.925L6.9762 19.2221C7.0184 19.2547 7.088 19.301 7.1971 19.3556C7.7382 19.6261 9.051 20 12 20C14.9489 20 16.2617 19.6261 16.8027 19.3556C16.9118 19.301 16.9814 19.2547 17.0236 19.2222L17.7918 11.925C16.6445 12.2573 14.8488 12.5 11.9999 12.5C9.1511 12.5 7.3553 12.2574 6.2081 11.925ZM17.9399 8.1195C17.8708 7.7282 17.7585 7.3084 17.5808 6.8939C17.2714 6.172 16.7662 5.4684 15.9318 4.9374C15.094 4.4043 13.8531 4 12 4C10.1468 4 8.9059 4.4043 8.0681 4.9374C7.2337 5.4684 6.7285 6.172 6.4191 6.8939C6.2415 7.3084 6.1291 7.7282 6.06 8.1195C7.1989 7.7645 9.0254 7.5 11.9999 7.5C14.9745 7.5 16.801 7.7645 17.9399 8.1195ZM17.2498 10C16.3918 9.7488 14.817 9.5 11.9999 9.5C9.1828 9.5 7.608 9.7488 6.75 10C7.608 10.2512 9.1828 10.5 11.9999 10.5C14.817 10.5 16.3918 10.2512 17.2498 10ZM17.079 19.1727C17.0796 19.172 17.0799 19.1716 17.0799 19.1716L17.079 19.1727Z"/>',
    networking:
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 4C16.9477 4 16.5 4.4477 16.5 5C16.5 5.5523 16.9477 6 17.5 6C18.0523 6 18.5 5.5523 18.5 5C18.5 4.4477 18.0523 4 17.5 4ZM14.5 5C14.5 3.3431 15.8431 2 17.5 2C19.1569 2 20.5 3.3431 20.5 5C20.5 6.3062 19.6652 7.4175 18.5 7.8293V10.1115C20.504 10.5662 22 12.3584 22 14.5C22 16.9853 19.9853 19 17.5 19C15.8004 19 14.3208 18.0577 13.5552 16.6671L7.9891 18.2574C7.8586 19.7938 6.5701 21 5 21C3.3431 21 2 19.6569 2 18C2 16.3431 3.3431 15 5 15C6.0348 15 6.9472 15.5239 7.4865 16.321L13.0065 14.7438C13.0022 14.6631 13 14.5818 13 14.5C13 14.0365 13.0701 13.5894 13.2002 13.1686L7.678 9.4872C7.1991 9.8109 6.6216 10 6 10C4.3431 10 3 8.6569 3 7C3 5.3431 4.3431 4 6 4C7.6569 4 9 5.3431 9 7C9 7.3054 8.9544 7.6002 8.8695 7.8778L14.2052 11.435C14.8098 10.7854 15.6041 10.3148 16.5 10.1115V7.8293C15.3348 7.4175 14.5 6.3062 14.5 5ZM6 6C5.4477 6 5 6.4477 5 7C5 7.5523 5.4477 8 6 8C6.5523 8 7 7.5523 7 7C7 6.4477 6.5523 6 6 6ZM17.5 12C16.1193 12 15 13.1193 15 14.5C15 15.8807 16.1193 17 17.5 17C18.8807 17 20 15.8807 20 14.5C20 13.1193 18.8807 12 17.5 12ZM5 17C4.4477 17 4 17.4477 4 18C4 18.5523 4.4477 19 5 19C5.5523 19 6 18.5523 6 18C6 17.4477 5.5523 17 5 17Z"/>',
    databases:
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M3 3C3 2.4477 3.4477 2 4 2H20C20.5523 2 21 2.4477 21 3V21C21 21.5523 20.5523 22 20 22H4C3.4477 22 3 21.5523 3 21V3ZM5 4V20H19V4H5Z"/><path d="M18 6C18 6.5523 17.5523 7 17 7C16.4477 7 16 6.5523 16 6C16 5.4477 16.4477 5 17 5C17.5523 5 18 5.4477 18 6Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3 9C3 8.4477 3.4477 8 4 8H20C20.5523 8 21 8.4477 21 9C21 9.5523 20.5523 10 20 10H4C3.4477 10 3 9.5523 3 9ZM3 15C3 14.4477 3.4477 14 4 14H20C20.5523 14 21 14.4477 21 15C21 15.5523 20.5523 16 20 16H4C3.4477 16 3 15.5523 3 15Z"/><path d="M18 12C18 12.5523 17.5523 13 17 13C16.4477 13 16 12.5523 16 12C16 11.4477 16.4477 11 17 11C17.5523 11 18 11.4477 18 12Z"/><path d="M18 18C18 18.5523 17.5523 19 17 19C16.4477 19 16 18.5523 16 18C16 17.4477 16.4477 17 17 17C17.5523 17 18 17.4477 18 18Z"/><path d="M15 6C15 6.5523 14.5523 7 14 7C13.4477 7 13 6.5523 13 6C13 5.4477 13.4477 5 14 5C14.5523 5 15 5.4477 15 6Z"/><path d="M15 12C15 12.5523 14.5523 13 14 13C13.4477 13 13 12.5523 13 12C13 11.4477 13.4477 11 14 11C14.5523 11 15 11.4477 15 12Z"/><path d="M15 18C15 18.5523 14.5523 19 14 19C13.4477 19 13 18.5523 13 18C13 17.4477 13.4477 17 14 17C14.5523 17 15 17.4477 15 18Z"/>',
    monitor:
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M4 5C4 4.4477 4.4477 4 5 4H19C19.5523 4 20 4.4477 20 5V15C20 15.5523 19.5523 16 19 16H12H5C4.4477 16 4 15.5523 4 15V5ZM19 18H13V20H16C16.5523 20 17 20.4477 17 21C17 21.5523 16.5523 22 16 22H12H8C7.4477 22 7 21.5523 7 21C7 20.4477 7.4477 20 8 20H11V18H5C3.3431 18 2 16.6569 2 15V5C2 3.3431 3.3431 2 5 2H19C20.6569 2 22 3.3431 22 5V15C22 16.6569 20.6569 18 19 18ZM14.3056 5.7803C14.2032 5.4049 13.855 5.1499 13.4662 5.1657C13.0774 5.1814 12.751 5.4636 12.6793 5.8461L11.7417 10.8464L10.7847 8.2146C10.6633 7.8808 10.3439 7.6603 9.9887 7.6651C9.6335 7.6699 9.3202 7.8989 9.2078 8.2359L8.3982 10.665H7C6.5388 10.665 6.165 11.0388 6.165 11.5C6.165 11.9612 6.5388 12.335 7 12.335H9C9.3594 12.335 9.6785 12.105 9.7922 11.764L10.0343 11.0376L11.2153 14.2854C11.3439 14.639 11.6931 14.8629 12.0682 14.8322C12.4432 14.8015 12.7514 14.5237 12.8207 14.1539L13.6508 9.7265L14.1944 11.7197C14.2935 12.083 14.6235 12.335 15 12.335H17C17.4612 12.335 17.835 11.9612 17.835 11.5C17.835 11.0388 17.4612 10.665 17 10.665H15.6378L14.3056 5.7803Z"/>',
    administration:
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M4.9645 14.4645C5.9021 13.5268 7.1739 13 8.5 13H15.5C16.8261 13 18.0979 13.5268 19.0355 14.4645C19.9732 15.4021 20.5 16.6739 20.5 18V20C20.5 20.5523 20.0523 21 19.5 21C18.9477 21 18.5 20.5523 18.5 20V18C18.5 17.2044 18.1839 16.4413 17.6213 15.8787C17.0587 15.3161 16.2956 15 15.5 15H8.5C7.7044 15 6.9413 15.3161 6.3787 15.8787C5.8161 16.4413 5.5 17.2044 5.5 18V20C5.5 20.5523 5.0523 21 4.5 21C3.9477 21 3.5 20.5523 3.5 20V18C3.5 16.6739 4.0268 15.4021 4.9645 14.4645Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 5C10.6193 5 9.5 6.1193 9.5 7.5C9.5 8.8807 10.6193 10 12 10C13.3807 10 14.5 8.8807 14.5 7.5C14.5 6.1193 13.3807 5 12 5ZM7.5 7.5C7.5 5.0147 9.5147 3 12 3C14.4853 3 16.5 5.0147 16.5 7.5C16.5 9.9853 14.4853 12 12 12C9.5147 12 7.5 9.9853 7.5 7.5Z"/>',
    more:
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M5 10C3.8954 10 3 10.8954 3 12C3 13.1046 3.8954 14 5 14C6.1046 14 7 13.1046 7 12C7 10.8954 6.1046 10 5 10ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z"/>',
  };
  var CHEVRON_UP = '<path fill-rule="evenodd" clip-rule="evenodd" d="M7.53 5.5297C7.789 5.27 8.21 5.27 8.47 5.5297L12.47 9.5297C12.73 9.7894 12.73 10.2105 12.47 10.4702C12.21 10.7299 11.789 10.7299 11.53 10.4702L8 6.9404L4.47 10.4702C4.21 10.7299 3.789 10.7299 3.53 10.4702C3.27 10.2105 3.27 9.7894 3.53 9.5297L7.53 5.5297Z"/>';
  var CHEVRON_DOWN = '<path fill-rule="evenodd" clip-rule="evenodd" d="M3.53 5.5297C3.789 5.27 4.21 5.27 4.47 5.5297L8 9.0595L11.53 5.5297C11.789 5.27 12.21 5.27 12.47 5.5297C12.73 5.7894 12.73 6.2105 12.47 6.4702L8.47 10.4702C8.21 10.7299 7.789 10.7299 7.53 10.4702L3.53 6.4702C3.27 6.2105 3.27 5.7894 3.53 5.5297Z"/>';
  var PIN_OUTLINE = '<path fill-rule="evenodd" clip-rule="evenodd" d="M10.1378 1.5329C12.0739 2.985 13.0616 3.9727 14.5138 5.9089C14.7128 6.1743 14.6864 6.5457 14.4518 6.7803C13.9123 7.3198 12.8365 8.0084 11.9664 8.5304C11.5174 8.7999 11.099 9.0389 10.7932 9.2105C10.7429 9.2387 10.6957 9.2651 10.6518 9.2895C10.6518 9.3245 10.6516 9.3613 10.6512 9.3996C10.6472 9.7211 10.6235 10.1632 10.5421 10.6353C10.3902 11.5159 9.9876 12.786 8.8219 13.2856C8.5713 13.393 8.2806 13.337 8.0879 13.1442L2.9024 7.9588C2.7097 7.766 2.6537 7.4753 2.7611 7.2248C3.2607 6.059 4.5307 5.6564 5.4113 5.5046C5.8834 5.4232 6.3256 5.3995 6.647 5.3955C6.6854 5.395 6.7221 5.3948 6.7572 5.3949C6.7816 5.351 6.808 5.3037 6.8362 5.2535C7.0078 4.9476 7.2468 4.5293 7.5162 4.0803C8.0382 3.2102 8.7268 2.1344 9.2664 1.5948C9.501 1.3602 9.8724 1.3338 10.1378 1.5329ZM7.0939 6.7379L7.091 6.7377L7.0715 6.7365C7.0532 6.7354 7.0245 6.7339 6.9868 6.7325C6.9113 6.7296 6.8 6.7271 6.6635 6.7287C6.3883 6.7321 6.0202 6.7526 5.6379 6.8185C5.0284 6.9236 4.5341 7.1162 4.2328 7.4036L8.6429 11.8136C8.9302 11.5124 9.123 11.0182 9.2281 10.4088C9.294 10.0264 9.3145 9.6584 9.3179 9.3832C9.3196 9.2466 9.3171 9.1354 9.3142 9.0598C9.3128 9.0221 9.3113 8.9935 9.3102 8.9751L9.3088 8.9527L9.6574 8.3146L9.6899 8.297C9.7119 8.2851 9.7445 8.2673 9.7864 8.2443C9.8704 8.1983 9.9919 8.1312 10.1408 8.0476C10.4389 7.8804 10.8455 7.648 11.2804 7.3871C11.9308 6.9969 12.5968 6.5704 13.0678 6.2117C12.0153 4.8576 11.189 4.0314 9.835 2.9788C9.4763 3.4498 9.0497 4.1159 8.6595 4.7662C8.3986 5.2011 8.1663 5.6077 7.999 5.9058C7.9155 6.0547 7.8484 6.1762 7.8023 6.2602C7.7793 6.3022 7.7616 6.3348 7.7497 6.3567L7.7363 6.3815L7.7322 6.3889C7.7322 6.3889 7.5365 6.7379 7.0939 6.7379Z"/><path d="M6.4379 9.6087C6.6983 9.8691 6.6983 10.2912 6.4379 10.5515L3.1381 13.8514C2.8777 14.1117 2.4556 14.1117 2.1953 13.8514C1.9349 13.591 1.9349 13.1689 2.1953 12.9086L5.4951 9.6087C5.7554 9.3484 6.1776 9.3484 6.4379 9.6087Z"/>';
  var PIN_FILLED =
    '<path d="M6 6.6667C6 6.6667 4.9999 3.3333 5 2C7.3333 1.6667 8.6666 1.6667 11 2C10.9999 3.3333 10 6.6667 10 6.6667C10 6.6667 12.3333 8 11.6666 9.6667H4.3333C3.6666 8 6 6.6667 6 6.6667Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.9059 1.3416C7.3016 0.9994 8.6983 0.9994 11.094 1.3416C11.4216 1.3885 11.665 1.669 11.6649 2C11.6649 2.7628 11.3912 4.0102 11.1451 4.9946C11.0181 5.5026 10.8913 5.9674 10.7964 6.305C10.7887 6.3322 10.7812 6.3586 10.774 6.3842C11.0014 6.5511 11.2952 6.7908 11.5719 7.0906C12.1249 7.6896 12.7645 8.7124 12.2841 9.9136C12.1831 10.1661 11.9385 10.3316 11.6666 10.3316H4.3333C4.0614 10.3316 3.8168 10.1661 3.7158 9.9136C3.2354 8.7124 3.875 7.6896 4.428 7.0906C4.7047 6.7908 4.9985 6.5511 5.2259 6.3842C5.2186 6.3586 5.2112 6.3322 5.2035 6.305C5.1086 5.9674 4.9818 5.5026 4.8548 4.9946C4.6087 4.0102 4.3349 2.7628 4.3349 2C4.335 1.669 4.5783 1.3885 4.9059 1.3416ZM6.6369 6.4756C6.7257 6.7715 6.5989 7.0895 6.3311 7.2433L6.3164 7.252C6.2049 7.3219 6.1278 7.3729 6.0361 7.4394C5.8505 7.5739 5.6163 7.764 5.4053 7.9927C5.0911 8.333 4.9021 8.6699 4.8821 9.0016H11.1178C11.0978 8.6699 10.9088 8.333 10.5946 7.9927C10.3835 7.764 10.1494 7.5739 9.9638 7.4394C9.8721 7.3729 9.795 7.3219 9.7423 7.2884L9.363 6.4756Z"/><path d="M8 9.0016C8.3672 9.0016 8.665 9.2994 8.665 9.6666V14C8.665 14.3673 8.3672 14.665 8 14.665C7.6327 14.665 7.335 14.3673 7.335 14V9.6666C7.335 9.2994 7.6327 9.0016 8 9.0016Z"/>';

  var SECTIONS = [
    { id: "compute", label: "Compute", icon: "compute", pages: [
      { id: "linodes", label: "Linodes" }, { id: "images", label: "Images" }, { id: "kubernetes", label: "Kubernetes" },
      { id: "stackscripts", label: "StackScripts" }, { id: "placement-groups", label: "Placement Groups" },
      { id: "quick-deploy-apps", label: "Quick Deploy Apps" }, { id: "partner-referrals", label: "Partner Referrals", badge: "beta" },
    ]},
    { id: "storage", label: "Storage", icon: "storage", pages: [
      { id: "object-storage", label: "Object Storage" }, { id: "volumes", label: "Volumes" },
    ]},
    { id: "networking", label: "Networking", icon: "networking", pages: [
      { id: "vpc", label: "VPC" }, { id: "firewalls", label: "Firewalls" }, { id: "nodebalancers", label: "NodeBalancers" },
      { id: "reserved-ips", label: "Reserved IPs" }, { id: "domains", label: "Domains" },
    ]},
    { id: "databases", label: "Databases", icon: "databases", pages: [{ id: "databases", label: "Databases" }] },
    { id: "monitor", label: "Monitor", icon: "monitor", pages: [
      { id: "metrics", label: "Metrics", badge: "new" }, { id: "alerts", label: "Alerts", badge: "beta" },
      { id: "logs", label: "Logs" }, { id: "longview", label: "Longview" },
    ]},
    { id: "administration", label: "Administration", icon: "administration", pages: [
      { id: "billing", label: "Billing" }, { id: "identity-access", label: "Identity & Access", badge: "new" },
      { id: "quotas", label: "Quotas" }, { id: "login-history", label: "Login History" },
      { id: "service-transfers", label: "Service Transfers" }, { id: "maintenance", label: "Maintenance" },
      { id: "account-settings", label: "Account Settings" },
    ]},
    { id: "more", label: "More", icon: "more", pages: [
      { id: "betas", label: "Betas" }, { id: "help-support", label: "Help & Support" },
    ]},
  ];

  function badgeHtml(type) {
    var isNew = type === "new";
    return (
      '<span class="inline-flex shrink-0 items-center rounded px-[var(--global-spacing-s4,4px)] py-[var(--global-spacing-s2,2px)] text-[11px] font-extrabold uppercase tracking-[0.22px] text-[color:var(--component-systembadge-text,#FFFFFF)] ' +
      (isNew ? "bg-[var(--component-systembadge-new-background,#7259D6)]" : "bg-[var(--component-systembadge-beta-background,#696970)]") +
      '">' +
      (isNew ? "NEW" : "BETA") +
      "</span>"
    );
  }

  function createSideNav(root, opts) {
    opts = opts || {};
    var sections = opts.sections || SECTIONS;
    var openSectionIds = new Set(opts.defaultOpenSectionIds || ["compute"]);
    var selectedPageId = opts.defaultSelectedPageId || undefined;
    var pinned = !!opts.defaultPinned;
    var pinnedExpanded = opts.pinnedExpanded !== false;
    var isHovered = false;
    var forcedMenu = opts.menu; // "full" | "mini" | undefined

    var nav = document.createElement("nav");
    var scrollArea = document.createElement("div");
    scrollArea.className = "side-nav-scroll min-w-0 flex-1 overflow-y-auto overflow-x-hidden";
    var footer = document.createElement("div");
    footer.className = "flex h-[24px] w-full shrink-0 items-center justify-end bg-[var(--global-color-neutrals-90,#3D3D42)] py-[4px] pr-[16px]";
    var pinBtn = document.createElement("button");
    pinBtn.type = "button";
    pinBtn.className = "flex size-4 items-center justify-center text-[color:var(--component-sidenavigation-pin-icon-default,#D6D6DD)] hover:text-[color:var(--component-sidenavigation-pin-icon-hover,#FFFFFF)]";
    footer.appendChild(pinBtn);
    nav.appendChild(scrollArea);
    nav.appendChild(footer);
    root.appendChild(nav);

    function expanded() {
      if (forcedMenu) return forcedMenu === "full";
      return pinned ? pinnedExpanded : isHovered;
    }

    function render() {
      var exp = expanded();
      nav.style.width = exp ? "232px" : "48px";
      nav.className =
        "flex h-full flex-col overflow-hidden bg-[var(--global-color-neutrals-90,#3D3D42)] transition-[width] duration-200 ease-in-out" +
        (!exp ? " border-r border-solid border-[var(--global-color-neutrals-80,#515157)]" : "");

      scrollArea.innerHTML = "";
      sections.forEach(function (section) {
        var open = openSectionIds.has(section.id);
        var sectionSelected = section.pages.some(function (p) { return p.id === selectedPageId; });
        var wrap = document.createElement("div");

        var textIconColor = sectionSelected
          ? "var(--component-sidenavigation-sectionheader-text-selected,#5BB3EA)"
          : "var(--component-sidenavigation-sectionheader-text-default,#FFFFFF)";

        var headerBtn = document.createElement("button");
        headerBtn.type = "button";
        headerBtn.setAttribute("aria-expanded", open);
        headerBtn.className =
          "flex h-[48px] w-[232px] shrink-0 cursor-pointer items-center gap-[12px] bg-[var(--component-sidenavigation-sectionheader-background-default,#3D3D42)] pl-[12px] pr-[8px] hover:bg-[var(--component-sidenavigation-sectionheader-background-hover,#343438)]";
        headerBtn.innerHTML =
          '<span class="size-6 shrink-0" style="color:' + textIconColor + '"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' + ICONS[section.icon] + "</svg></span>" +
          '<span class="type-heading-overline min-w-px flex-1 text-left uppercase tracking-[0.36px]" style="color:' + textIconColor + '">' + section.label + "</span>" +
          '<span class="shrink-0" style="color:' + textIconColor + '"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' + (open ? CHEVRON_UP : CHEVRON_DOWN) + "</svg></span>";
        headerBtn.addEventListener("click", function () {
          if (openSectionIds.has(section.id)) openSectionIds.delete(section.id);
          else openSectionIds.add(section.id);
          render();
        });
        wrap.appendChild(headerBtn);

        if (exp && open) {
          section.pages.forEach(function (page) {
            var selected = page.id === selectedPageId;
            var row = document.createElement("button");
            row.type = "button";
            if (selected) row.setAttribute("aria-current", "page");
            row.className =
              "flex h-8 w-[232px] shrink-0 items-center gap-[12px] bg-[var(--global-color-neutrals-90,#3D3D42)] pl-[48px] pr-[8px] hover:bg-[var(--global-color-neutrals-100,#343438)]";
            row.innerHTML =
              '<span class="type-label-semibold-s min-w-0 truncate text-left" style="color:' +
              (selected ? "var(--component-sidenavigation-pagetext-selected,#5BB3EA)" : "var(--component-sidenavigation-pagetext-default,#FFFFFF)") +
              ";font-weight:" + (selected ? 700 : 600) + '">' + page.label + "</span>" +
              (page.badge ? badgeHtml(page.badge) : "");
            row.addEventListener("click", function () {
              selectedPageId = page.id;
              render();
            });
            wrap.appendChild(row);
          });
          var divider = document.createElement("div");
          divider.className = "h-2 w-[232px] shrink-0 bg-[var(--component-sidenavigation-divider-background,#3D3D42)]";
          wrap.appendChild(divider);
        }

        scrollArea.appendChild(wrap);
      });

      pinBtn.setAttribute("aria-pressed", pinned);
      pinBtn.setAttribute("aria-label", pinned ? "Unpin navigation" : "Pin navigation");
      pinBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' + (pinned ? PIN_FILLED : PIN_OUTLINE) + "</svg>";

      if (opts.onStateChange) opts.onStateChange({ pinned: pinned, expanded: exp });
    }

    pinBtn.addEventListener("click", function () {
      pinned = !pinned;
      render();
    });

    if (!forcedMenu) {
      nav.addEventListener("mouseenter", function () {
        isHovered = true;
        render();
      });
      nav.addEventListener("mouseleave", function () {
        isHovered = false;
        render();
      });
    }

    render();
    return { render: render, setForcedMenu: function (m) { forcedMenu = m; render(); } };
  }

  window.SideNavDemo = { create: createSideNav, SECTIONS: SECTIONS };
})();
