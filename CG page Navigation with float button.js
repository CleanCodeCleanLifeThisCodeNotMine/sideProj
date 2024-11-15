// ==UserScript==
// @name         CodeGym Page Navigation with Float button
// @author       Sean
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Navigate to the next and previous activities on CodeGym by pressing Ctrl + Space, and float the next and previous buttons
// @match        *://*.codegym.vn/*
// @grant        none
// // @updateURL    https://raw.githubusercontent.com/CleanCodeCleanLifeThisCodeNotMine/sideProj/refs/heads/main/CG%20page%20Navigation%20with%20float%20button.js
// // @downloadURL  https://raw.githubusercontent.com/CleanCodeCleanLifeThisCodeNotMine/sideProj/refs/heads/main/CG%20page%20Navigation%20with%20float%20button.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to float the next-activity-link in the bottom right
    function floatNextButton() {
        const nextButton = document.getElementById('next-activity-link');
        if (nextButton) {
            // Create a wrapper div to contain the button
            const wrapper = document.createElement('div');
            wrapper.style.position = 'fixed';
            wrapper.style.bottom = '60px'; // Adjusted higher
            wrapper.style.right = '85px'; // Adjusted to the left
            wrapper.style.zIndex = '9999';
            wrapper.style.padding = '10px';
            wrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // Optional: add background for better visibility
            wrapper.style.borderRadius = '5px';

            // Move the nextButton into the wrapper
            nextButton.parentNode.insertBefore(wrapper, nextButton);
            wrapper.appendChild(nextButton);

            // Reset any conflicting styles on the button
            nextButton.style.position = 'static';
            nextButton.style.margin = '0';
            nextButton.style.padding = '0';
            nextButton.style.width = 'auto';
            nextButton.style.height = 'auto';
            nextButton.style.display = 'block';
            nextButton.style.border = 'none';

            // Ensure the button is fully clickable
            nextButton.style.pointerEvents = 'auto';
            wrapper.style.pointerEvents = 'auto';

            // Optional: Add a box shadow for better visibility
            wrapper.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        } else {
            console.log('No "next-activity-link" button found to float');
        }
    }

    // Function to float the prev-activity-link in the bottom left
    function floatPrevButton() {
        const prevButton = document.getElementById('prev-activity-link');
        if (prevButton) {
            // Create a wrapper div to contain the button
            const wrapper = document.createElement('div');
            wrapper.style.position = 'fixed';
            wrapper.style.bottom = '60px'; // Match the height of the next button
            wrapper.style.left = '145px'; // Position on the left
            wrapper.style.zIndex = '9999';
            wrapper.style.padding = '10px';
            wrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // Optional: add background for better visibility
            wrapper.style.borderRadius = '5px';

            // Move the prevButton into the wrapper
            prevButton.parentNode.insertBefore(wrapper, prevButton);
            wrapper.appendChild(prevButton);

            // Reset any conflicting styles on the button
            prevButton.style.position = 'static';
            prevButton.style.margin = '0';
            prevButton.style.padding = '0';
            prevButton.style.width = 'auto';
            prevButton.style.height = 'auto';
            prevButton.style.display = 'block';
            prevButton.style.border = 'none';

            // Ensure the button is fully clickable
            prevButton.style.pointerEvents = 'auto';
            wrapper.style.pointerEvents = 'auto';

            // Optional: Add a box shadow for better visibility
            wrapper.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        } else {
            console.log('No "prev-activity-link" button found to float');
        }
    }

    // Run the functions when the DOM content is loaded
    document.addEventListener('DOMContentLoaded', () => {
        floatNextButton();
        floatPrevButton();
    });

    // Also, in case the elements are added dynamically after DOMContentLoaded
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (document.getElementById('next-activity-link') && document.getElementById('prev-activity-link')) {
                    floatNextButton();
                    floatPrevButton();
                    observer.disconnect();
                    break;
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('keydown', (e) => {
        // Check if Ctrl + Space is pressed
        if (e.code === 'Space' && e.ctrlKey) {
            const nextButton = document.getElementById('next-activity-link');
            if (nextButton) {
                nextButton.click();
                console.log('Navigated to the next activity');
            } else {
                console.log('No "next-activity-link" button found');
            }
        }
    });
})();
