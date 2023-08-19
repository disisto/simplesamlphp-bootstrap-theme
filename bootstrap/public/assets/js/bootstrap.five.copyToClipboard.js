/*!
*    SimpleSAMLphp Bootstrap Theme
*    Version 0.2.0
*
*    SimpleSAMLphp Bootstrap Theme is a child theme for SimpleSAMLphp that outputs certain visitor facing
*    pages via Bootstrap front-end framework. Intended to deliver a seamless look and feel when the
*    visitor already comes from a project based on a Bootstrap layout.
*
*    Documentation: https://github.com/disisto/simplesamlphp-bootstrap-theme
*
*
*    Licensed under MIT (https://github.com/disisto/simplesamlphp-bootstrap-theme/blob/main/LICENSE)
*
*    Copyright (c) 2023 Roberto Di Sisto
*
*    Permission is hereby granted, free of charge, to any person obtaining a copy
*    of this software and associated documentation files (the "Software"), to deal
*    in the Software without restriction, including without limitation the rights
*    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*    copies of the Software, and to permit persons to whom the Software is
*    furnished to do so, subject to the following conditions:
*
*    The above copyright notice and this permission notice shall be included in all
*    copies or substantial portions of the Software.
*
*    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*    SOFTWARE.
*/

document.addEventListener("DOMContentLoaded", function() {
    var copyButtons = document.querySelectorAll("[data-copy-text]");
    copyButtons.forEach(function(copyButton) {
        var tooltip = new bootstrap.Tooltip(copyButton, {
            placement: 'top',
            title: 'Copy to clipboard',
            trigger: 'hover',
        });

        copyButton.addEventListener("click", function() {
            CopyToClip(copyButton);
            tooltip.hide(); // Verstecke das Tooltip, nachdem der Button geklickt wurde
        });
    });
});

function CopyToClip(element) {
    var copyText = element.getAttribute("data-copy-text");

    var listener = function(e) {
        e.clipboardData.setData("text/html", copyText);
        e.clipboardData.setData("text/plain", copyText);
        e.preventDefault();
    };

    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);

    // Show "copied" tooltip with fade for 3000ms
    var tooltip = new bootstrap.Tooltip(element, {
        placement: 'top',
        title: 'Copied!',
        animation: true, // Enable fade effect
    });
    tooltip.show();

    // Replace icon with check2 SVG for 1200ms
    var copyIcon = document.getElementById("copyIcon");
    copyIcon.innerHTML = '<use href="#check2"></use>';

    setTimeout(function() {
        // Restore original clipboard icon
        copyIcon.innerHTML = '<use href="#clipboard"></use>';

        // Destroy the tooltip instance
        tooltip.dispose();

    }, 1200);
}

document.addEventListener("DOMContentLoaded", function() {
    var copyButtons = document.querySelectorAll("[data-copy-text]");
    copyButtons.forEach(function(copyButton) {
        copyButton.addEventListener("click", function() {
            CopyToClip(copyButton);
        });
    });
});
