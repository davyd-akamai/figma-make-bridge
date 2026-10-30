// Demo wiring for the Tooltip docs page. The tooltip itself comes from ../assets/tooltip.js (a vanilla mirror of
// components/Tooltip.tsx, driven by data-fmb-* attributes); the triggers use the same secondary-Button and info-icon
// classes as src/App.tsx's demo, copied verbatim so they exist in the compiled styles.css.
(function () {
  var BTN = "relative box-border inline-flex shrink-0 items-center justify-center gap-[var(--global-spacing-s4,4px)] whitespace-nowrap text-center transition-colors h-[34px] px-[var(--global-spacing-s12,12px)] py-[var(--global-spacing-s8,8px)] type-label-semibold-s cursor-pointer border border-solid bg-[var(--component-button-secondary-default-background,#FFFFFF)] border-[var(--component-button-secondary-default-border,#0174BC)] text-[color:var(--component-button-secondary-default-text,#0174BC)] hover:bg-[var(--component-button-secondary-hover-background,#EDF8FF)] hover:border-[var(--component-button-secondary-hover-border,#009CDE)] hover:text-[color:var(--component-button-secondary-hover-text,#0174BC)] active:bg-[var(--component-button-secondary-active-background,#FFFFFF)] active:border-[var(--component-button-secondary-active-border,#0174BC)] active:text-[color:var(--component-button-secondary-active-text,#0174BC)]";
  var INFO = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 3.33333C6.3181 3.33333 3.33333 6.3181 3.33333 10C3.33333 13.6819 6.3181 16.6667 10 16.6667C13.6819 16.6667 16.6667 13.6819 16.6667 10C16.6667 6.3181 13.6819 3.33333 10 3.33333ZM1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10ZM9.16667 5.83333C9.16667 5.3731 9.53976 5 10 5H10.0083C10.4686 5 10.8417 5.3731 10.8417 5.83333C10.8417 6.29357 10.4686 6.66667 10.0083 6.66667H10C9.53976 6.66667 9.16667 6.29357 9.16667 5.83333ZM10 7.91667C10.4602 7.91667 10.8333 8.28976 10.8333 8.75V14.1667C10.8333 14.6269 10.4602 15 10 15C9.53976 15 9.16667 14.6269 9.16667 14.1667V8.75C9.16667 8.28976 9.53976 7.91667 10 7.91667Z"/></svg>';

  function button(label, text, attrs) {
    return '<span class="inline-flex"><button type="button" class="' + BTN + '" data-fmb-tooltip="' + text + '" ' + (attrs || "") + ">" + label + "</button></span>";
  }

  document.getElementById("tooltip-placements").innerHTML =
    button("top", "Tooltip", 'data-fmb-placement="top"') +
    button("bottom", "Tooltip", 'data-fmb-placement="bottom"') +
    button("left", "Tooltip", 'data-fmb-placement="left"') +
    button("right", "Tooltip", 'data-fmb-placement="right"') +
    button("no arrow", "Tooltip", 'data-fmb-arrow="false"');

  document.getElementById("tooltip-more").innerHTML =
    button("long text", "Longer help text wraps once it reaches the 240px maximum width of the bubble.", 'data-fmb-placement="right"') +
    '<span class="inline-flex"><button type="button" aria-label="More information" data-fmb-tooltip="More information" data-fmb-placement="bottom" class="inline-flex cursor-pointer border-0 bg-transparent p-0 text-[#696970]">' + INFO + "</button></span>" +
    button("top (flips when no room)", "Flips below when there is no room above", 'data-fmb-placement="top"');
})();
