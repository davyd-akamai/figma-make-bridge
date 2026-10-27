// Mirrors components/TextArea.tsx's clear-button logic: shows when the field has a value, clears and refocuses.
// The clear button shifts left while the textarea's vertical scrollbar is showing (CDS's scrollbar-spacing).
(function () {
  var DEFAULT_RIGHT = "right-[var(--global-spacing-s8,8px)]";
  var SCROLLBAR_RIGHT = "right-[16px]";

  function setup(root) {
    var input = root.querySelector(".ta-input");
    var clearBtn = root.querySelector(".ta-clear");

    function render() {
      clearBtn.style.display = input.value.length > 0 && !input.disabled ? "flex" : "none";
      var scrollbar = input.scrollHeight > input.clientHeight;
      clearBtn.classList.toggle(DEFAULT_RIGHT, !scrollbar);
      clearBtn.classList.toggle(SCROLLBAR_RIGHT, scrollbar);
    }

    input.addEventListener("input", render);
    if (typeof ResizeObserver !== "undefined") new ResizeObserver(render).observe(input);
    clearBtn.addEventListener("click", function () {
      input.value = "";
      input.focus();
      render();
    });
    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-ta-demo]").forEach(setup);
  });
})();
