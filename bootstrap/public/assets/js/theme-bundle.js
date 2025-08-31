/*!
 * SimpleSAMLphp Bootstrap Theme
 * Version 0.4.0
 *
 * SimpleSAMLphp Bootstrap Theme is a child theme for SimpleSAMLphp that outputs certain visitor facing
 * pages via Bootstrap front-end framework. Intended to deliver a seamless look and feel when the
 * visitor already comes from a project based on a Bootstrap layout.
 *
 * Documentation: https://github.com/disisto/simplesamlphp-bootstrap-theme
 *
 *
 * Licensed under MIT (https://github.com/disisto/simplesamlphp-bootstrap-theme/blob/main/LICENSE)
 *
 * Copyright (c) 2023-2025 Roberto Di Sisto
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    'use strict';

    /**
     * Clipboard Module
     * Handles copy-to-clipboard functionality with Bootstrap tooltips
     */
    const Clipboard = {
        tooltips: new Map(),
        
        init() {
            const copyButtons = document.querySelectorAll('[data-copy-text]');
            if (!copyButtons.length) return;
            
            copyButtons.forEach(button => {
                // Initialize tooltip once for each button
                const tooltip = new bootstrap.Tooltip(button, {
                    placement: 'top',
                    title: 'Copy to clipboard',
                    trigger: 'hover'
                });
                this.tooltips.set(button, tooltip);
                
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.copyToClipboard(button);
                });
            });
        },
        
        copyToClipboard(element) {
            const copyText = element.getAttribute('data-copy-text');
            const existingTooltip = this.tooltips.get(element);
            
            // Copy to clipboard
            const listener = (e) => {
                e.clipboardData.setData('text/html', copyText);
                e.clipboardData.setData('text/plain', copyText);
                e.preventDefault();
            };
            
            document.addEventListener('copy', listener);
            document.execCommand('copy');
            document.removeEventListener('copy', listener);
            
            // Hide existing tooltip
            if (existingTooltip) {
                existingTooltip.hide();
            }
            
            // Show success tooltip
            const successTooltip = new bootstrap.Tooltip(element, {
                placement: 'top',
                title: 'Copied!',
                animation: true
            });
            successTooltip.show();
            
            // Update icon if exists
            const copyIcon = document.getElementById('copyIcon');
            if (copyIcon) {
                const originalIcon = copyIcon.innerHTML;
                copyIcon.innerHTML = '<use href="#check2"></use>';
                
                setTimeout(() => {
                    copyIcon.innerHTML = originalIcon;
                    successTooltip.dispose();
                }, 1200);
            } else {
                setTimeout(() => {
                    successTooltip.dispose();
                }, 1200);
            }
        }
    };

    /**
     * Password Toggle Module
     * Handles password visibility toggle with eye icon
     */
    const PasswordToggle = {
        init() {
            const passwordWrapper = document.querySelector('.password-wrapper');
            if (!passwordWrapper) return;
            
            const passwordInput = passwordWrapper.querySelector('#password');
            const toggleElement = passwordWrapper.querySelector('.password-toggle');
            
            if (!passwordInput || !toggleElement) return;
            
            // Click event for the span element
            toggleElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle(passwordInput, toggleElement);
            });
            
            // Keyboard accessibility
            toggleElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggle(passwordInput, toggleElement);
                }
            });
        },
        
        toggle(input, element) {
            const icon = element.querySelector('.eye-icon use');
            if (!icon) return;
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('href', '#eye-slash');
                element.setAttribute('aria-label', 'Hide password');
                element.setAttribute('aria-pressed', 'true');
            } else {
                input.type = 'password';
                icon.setAttribute('href', '#eye');
                element.setAttribute('aria-label', 'Show password');
                element.setAttribute('aria-pressed', 'false');
            }
            
            // Keep focus on input for better UX
            input.focus();
            
            // Restore cursor position
            const length = input.value.length;
            input.setSelectionRange(length, length);
        }
    };

    /**
     * Theme Toggle Module
     * Handles dark/light theme switching with localStorage persistence
     */
    const ThemeToggle = {
        storageKey: 'theme',
        defaultTheme: 'dark',
        
        init() {
            // Set initial theme
            const currentTheme = this.getStoredTheme();
            this.setTheme(currentTheme);
            
            // Setup toggle button
            const toggleBtn = document.querySelector('#bd-theme-toggle');
            if (!toggleBtn) return;
            
            toggleBtn.addEventListener('click', () => {
                const current = this.getStoredTheme();
                const newTheme = current === 'dark' ? 'light' : 'dark';
                this.setStoredTheme(newTheme);
                this.setTheme(newTheme);
            });
        },
        
        getStoredTheme() {
            return localStorage.getItem(this.storageKey) || this.defaultTheme;
        },
        
        setStoredTheme(theme) {
            localStorage.setItem(this.storageKey, theme);
        },
        
        setTheme(theme) {
            document.documentElement.setAttribute('data-bs-theme', theme);
            
            const toggleBtn = document.querySelector('#bd-theme-toggle');
            if (!toggleBtn) return;
            
            const iconUse = toggleBtn.querySelector('.theme-icon-active use');
            if (iconUse) {
                iconUse.setAttribute('href', theme === 'dark' ? '#moon-stars-fill' : '#sun-fill');
            }
            
            toggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
        }
    };

    /**
     * Language Selector Module
     * Handles language switching via dropdown
     */
    const LanguageSelector = {
        init() {
            const languageLinks = document.querySelectorAll('[data-language-select]');
            if (!languageLinks.length) return;
            
            languageLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.selectLanguage(link);
                });
            });
        },
        
        selectLanguage(link) {
            const languageCode = link.getAttribute('data-language-select');
            const selector = document.getElementById('language-selector');
            const form = link.closest('form');
            
            if (selector && form) {
                selector.value = languageCode;
                form.submit();
            }
        }
    };

    /**
     * Form Utilities Module
     * Handles form enhancements and validations
     */
    const FormUtils = {
        init() {
            // Disable submit button on form submission to prevent double-submit
            const forms = document.querySelectorAll('form.needs-validation');
            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    if (!form.checkValidity()) {
                        e.preventDefault();
                        e.stopPropagation();
                    } else {
                        // Disable submit button
                        const submitBtn = form.querySelector('[type="submit"]');
                        if (submitBtn) {
                            const processingText = submitBtn.getAttribute('data-processing');
                            if (processingText) {
                                submitBtn.textContent = processingText;
                            }
                            submitBtn.disabled = true;
                        }
                    }
                    form.classList.add('was-validated');
                });
            });
            
            // Auto-dismiss alerts after 10 seconds
            const alerts = document.querySelectorAll('.alert-dismissible');
            alerts.forEach(alert => {
                setTimeout(() => {
                    const bsAlert = new bootstrap.Alert(alert);
                    bsAlert.close();
                }, 10000);
            });
        }
    };

    /**
     * Initialize all modules when DOM is ready
     */
    const init = () => {
        // Core modules
        ThemeToggle.init();
        LanguageSelector.init();
        
        // Feature modules
        Clipboard.init();
        PasswordToggle.init();
        FormUtils.init();
        
        // Log initialization in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('SimpleSAMLphp Bootstrap Theme initialized');
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already ready
        init();
    }

    // Export modules for potential external use
    window.SimpleSAMLTheme = {
        Clipboard,
        PasswordToggle,
        ThemeToggle,
        LanguageSelector,
        FormUtils,
        version: '0.4.0'
    };

})();
