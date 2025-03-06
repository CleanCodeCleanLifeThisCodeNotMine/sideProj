// ==UserScript==
// @name         CodeGym Page Navigation with Float button
// @author       Sean
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Navigate to the next and previous activities on CodeGym by pressing Ctrl + Space, and float the next and previous buttons
// @match        *://*.codegym.vn/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/CleanCodeCleanLifeThisCodeNotMine/sideProj/refs/heads/main/CG%20page%20Navigation%20with%20float%20button.js
// @downloadURL  https://raw.githubusercontent.com/CleanCodeCleanLifeThisCodeNotMine/sideProj/refs/heads/main/CG%20page%20Navigation%20with%20float%20button.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to find navigation links more flexibly
    function findNavigationLinks() {
        // Try multiple selectors to find navigation links
        const links = {
            next: null,
            prev: null
        };

        // Method 1: Try finding by ID
        links.next = document.getElementById('next-activity-link');
        links.prev = document.getElementById('prev-activity-link');

        // Method 2: Try finding by activity list if Method 1 failed
        if (!links.next || !links.prev) {
            const currentActivity = document.querySelector('.activity.active');
            if (currentActivity) {
                const allActivities = Array.from(document.querySelectorAll('.activity'));
                const currentIndex = allActivities.indexOf(currentActivity);
                
                if (currentIndex > 0) {
                    links.prev = allActivities[currentIndex - 1].querySelector('a');
                }
                if (currentIndex < allActivities.length - 1) {
                    links.next = allActivities[currentIndex + 1].querySelector('a');
                }
            }
        }

        return links;
    }

    // Function to add buttons near the Language dropdown in the navbar
    function addButtonsNextToLanguage() {
        // Try to find the navbar first
        const navbar = document.querySelector('.navbar');
        if (!navbar) {
            console.log('Navbar not found');
            return false;
        }

        // Check if we've already added our container
        const existingContainer = document.getElementById('codegym-nav-buttons');
        if (existingContainer) {
            return true;
        }

        const links = findNavigationLinks();
        if (!links.next && !links.prev) {
            console.log('No navigation links found');
            return false;
        }

        // Create a wrapper for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'codegym-nav-buttons';
        buttonContainer.style.cssText = `
            display: flex;
            gap: 15px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            height: 100%;
            align-items: center;
        `;

        // Add the buttons if links exist
        const buttonConfigs = [
            { link: links.prev, icon: 'fa-chevron-left', ariaLabel: 'Previous Activity' },
            { link: links.next, icon: 'fa-chevron-right', ariaLabel: 'Next Activity' }
        ];

        buttonConfigs.forEach(config => {
            if (config.link) {
                const button = document.createElement('button');
                button.setAttribute('aria-label', config.ariaLabel);
                button.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    color: #fff;
                    background-color: #007bff;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    text-decoration: none;
                    transition: background-color 0.2s;
                `;

                // Create icon element
                const icon = document.createElement('i');
                icon.className = `fa ${config.icon}`;
                icon.style.cssText = `
                    font-size: 18px;
                `;
                
                button.appendChild(icon);

                // Add hover effect
                button.addEventListener('mouseover', () => {
                    button.style.backgroundColor = '#0056b3';
                });
                button.addEventListener('mouseout', () => {
                    button.style.backgroundColor = '#007bff';
                });

                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    config.link.click();
                });

                buttonContainer.appendChild(button);
            }
        });

        // Insert the buttons into the navbar
        navbar.appendChild(buttonContainer);
        return true;
    }

    // Function to attach keyboard navigation
    function attachKeyboardNavigation() {
        document.removeEventListener('keydown', handleKeyDown);
        document.addEventListener('keydown', handleKeyDown);
    }

    function handleKeyDown(e) {
        if (e.code === 'Space' && e.ctrlKey) {
            e.preventDefault();
            const links = findNavigationLinks();
            if (links.next) {
                links.next.click();
                console.log('Navigated to the next activity');
            } else {
                console.log('No next activity link found');
            }
        }
    }

    // Initialize with retry mechanism
    function initialize() {
        const buttonsAdded = addButtonsNextToLanguage();
        if (buttonsAdded) {
            if (observer) {
                observer.disconnect();
                console.log('Navigation buttons added successfully');
            }
        }
    }

    // Initial setup with delays
    setTimeout(initialize, 1000);
    attachKeyboardNavigation();

    // Observer setup
    const observer = new MutationObserver(() => {
        const links = findNavigationLinks();
        if (links.next || links.prev) {
            initialize();
        }
    });

    setTimeout(() => {
        observer.observe(document.body, { childList: true, subtree: true });
    }, 500);

    setTimeout(() => {
        if (observer) {
            observer.disconnect();
            console.log('Observer timed out after 10 seconds');
        }
    }, 10000);
})();