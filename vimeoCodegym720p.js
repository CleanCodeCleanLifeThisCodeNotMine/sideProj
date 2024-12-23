// ==UserScript==
// @name         Vimeo Auto Quality 720p for Embedded Videos
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically set Vimeo video quality to 720p for embedded videos
// @author       Your Name
// @match        *://james.codegym.vn/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Function to wait for an element to be available in the DOM
    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                console.warn(`Element with selector "${selector}" not found within timeout.`);
            }
        }, 100);
    }

    // Function to select 720p quality from the menu
    function selectQuality720p() {
        waitForElement('.vp-menu[data-menu="prefs"]', (menu) => {
            const qualityOption = Array.from(menu.querySelectorAll('.MenuOption_module_option__828f05b2'))
                .find(option => option.textContent.includes('720p'));
            if (qualityOption) {
                qualityOption.click();
                console.log('Set video quality to 720p.');
            } else {
                console.warn('720p quality option not found.');
            }
        });
    }

    // Observer to monitor when the video player menu becomes visible
    const observer = new MutationObserver(() => {
        const menu = document.querySelector('.vp-menu[data-menu="prefs"]');
        if (menu && menu.style.opacity === '1') {
            selectQuality720p();
            observer.disconnect(); // Stop observing after quality is set
        }
    });

    // Start observing for changes in the document body
    observer.observe(document.body, { childList: true, subtree: true });

    // Ensure the menu is triggered to open
    waitForElement('iframe[src*="player.vimeo.com"]', (iframe) => {
        iframe.contentWindow.postMessage({ method: 'getSettingsMenu' }, '*');
    });
})();
