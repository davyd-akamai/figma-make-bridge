// Mirrors components/TextField.tsx's controlled-value / clear-button / error-vs-helper logic.
(function () {
  var CLOSE_SVG =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.4702 4.47023C12.7299 4.21053 12.7299 3.78947 12.4702 3.52977C12.2105 3.27008 11.7895 3.27008 11.5298 3.52977L8 7.05955L4.47023 3.52977C4.21053 3.27008 3.78947 3.27008 3.52977 3.52977C3.27008 3.78947 3.27008 4.21053 3.52977 4.47023L7.05955 8L3.52977 11.5298C3.27008 11.7895 3.27008 12.2105 3.52977 12.4702C3.78947 12.7299 4.21053 12.7299 4.47023 12.4702L8 8.94045L11.5298 12.4702C11.7895 12.7299 12.2105 12.7299 12.4702 12.4702C12.7299 12.2105 12.7299 11.7895 12.4702 11.5298L8.94045 8L12.4702 4.47023Z"/></svg>';

  function setup(root) {
    var input = root.querySelector(".tf-input");
    var clearBtn = root.querySelector(".tf-clear");
    var box = root.querySelector(".tf-box");

    function render() {
      var hasValue = input.value.length > 0;
      clearBtn.style.display = hasValue && !input.disabled ? "flex" : "none";
    }

    input.addEventListener("input", render);
    clearBtn.addEventListener("click", function () {
      input.value = "";
      input.focus();
      render();
    });
    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-tf-demo]").forEach(setup);
  });
})();
