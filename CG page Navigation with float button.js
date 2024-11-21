// ==UserScript==
// @name         CodeGym Page Navigation with Float button
// @author       Sean
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Navigate to the next and previous activities on CodeGym by pressing Ctrl + Space, and float the next and previous buttons
// @match        *://*.codegym.vn/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/CleanCodeCleanLifeThisCodeNotMine/sideProj/refs/heads/main/CG%20page%20Navigation%20with%20float%20button.js
// @downloadURL  https://raw.githubusercontent.com/CleanCodeCleanLifeThisCodeNotMine/sideProj/refs/heads/main/CG%20page%20Navigation%20with%20float%20button.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to add buttons near the Language dropdown in the navbar
    function addButtonsNextToLanguage(buttonIds) {
        const languageElement = document.querySelector('[title="Language"]'); // Find the Language element
        if (!languageElement) {
            console.log('Language element not found');
            return;
        }

        // Create a wrapper for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px'; // Space between buttons
        buttonContainer.style.marginLeft = '15px'; // Space from the Language dropdown

        // Add the buttons
        buttonIds.forEach(({ id, text }) => {
            const button = document.getElementById(id);
            if (button) {
                button.style.position = 'static';
                button.style.display = 'inline-block';
                button.style.margin = '0';
                button.style.padding = '8px 12px';
                button.style.color = '#fff'; // Button text color
                button.style.backgroundColor = '#007bff'; // Bootstrap primary color
                button.style.border = 'none';
                button.style.borderRadius = '4px';
                button.style.cursor = 'pointer';
                button.style.textDecoration = 'none';
                button.textContent = text; // Set button label
                buttonContainer.appendChild(button);
            } else {
                console.log(`Button with ID "${id}" not found`);
            }
        });

        // Insert the buttons next to the Language element
        languageElement.parentNode.insertBefore(buttonContainer, languageElement.nextSibling);
    }

    // Function to attach keyboard navigation
    function attachKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
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
    }

    // Run the navbar button setup
    function initialize() {
        addButtonsNextToLanguage([
            { id: 'prev-activity-link', text: 'Previous Activity' },
            { id: 'next-activity-link', text: 'Next Activity' },
        ]);
    }

    // Attach event listeners
    document.addEventListener('DOMContentLoaded', initialize);
    attachKeyboardNavigation();

    // Observe DOM for dynamically added buttons
    const observer = new MutationObserver(() => {
        if (document.getElementById('next-activity-link') && document.getElementById('prev-activity-link')) {
            initialize();
            observer.disconnect(); // Stop observing after the buttons are set
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
