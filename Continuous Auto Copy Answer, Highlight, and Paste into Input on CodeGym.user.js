// ==UserScript==
// @name         Continuous Auto Copy Answer, Highlight, and Paste into Input on CodeGym
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Continuously search for "Vậy kết quả là:", compare changes in the answer, copy to clipboard, and highlight input box on CodeGym
// @author       Sean
// @match        https://bob.codegym.vn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let previousAnswer = null; // Store the previously found answer

    // Function to recursively scan the DOM and highlight the found text
    function findAndHighlightText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            // Check if the node contains "Vậy kết quả là:"
            let text = node.textContent;
            let resultMatch = text.match(/Vậy kết quả là:\s*(.+)/);

            if (resultMatch && resultMatch[1]) {
                let result = resultMatch[1].trim();

                // Highlight the found text
                let highlightedText = text.replace(/(Vậy kết quả là:\s*)(.+)/, '<span style="background-color: yellow;">$1$2</span>');
                let span = document.createElement('span');
                span.innerHTML = highlightedText;
                node.parentNode.replaceChild(span, node);

                // Return the result to compare and store
                return result;
            }
        }

        // Recurse through child nodes if any
        let result = null;
        node.childNodes.forEach(child => {
            if (!result) {
                result = findAndHighlightText(child);
            }
        });

        return result;
    }

    // Function to highlight the input box if found
    function highlightInputBox(inputBox) {
        inputBox.style.border = "2px solid red"; // Highlight the input box with a red border
        inputBox.style.backgroundColor = "rgba(255, 255, 0, 0.3)"; // Light yellow background
    }

    // Function to handle pasting the answer into the input box on click
    function setupInputClickHandler(inputBox, answer) {
        inputBox.addEventListener('click', function() {
            this.value = answer; // Paste the answer into the input box on click
            console.log('Answer pasted into input box on click: ' + answer);
        });
    }

    // Function to continuously scan the DOM for the text "Vậy kết quả là:" and compare if the answer changes
    function continuouslyFindAndCompareResult() {
        let currentAnswer = findAndHighlightText(document.body);

        if (currentAnswer && currentAnswer !== previousAnswer) {
            // If the answer has changed, copy the new result to clipboard
            navigator.clipboard.writeText(currentAnswer).then(function() {
                console.log('New answer copied to clipboard: ' + currentAnswer);
            }, function(err) {
                console.error('Could not copy text: ', err);
            });

            // Check for an input box and set up the click handler if found
            let inputBox = document.querySelector('input[type="text"], input');
            if (inputBox) {
                highlightInputBox(inputBox); // Highlight the input box
                setupInputClickHandler(inputBox, currentAnswer); // Set up click handler
            }

            previousAnswer = currentAnswer; // Update the previous answer with the new one
        } else if (currentAnswer === previousAnswer) {
            console.log("Answer hasn't changed, continuing search...");
        } else {
            console.log("Still searching for 'Vậy kết quả là:'...");
        }
    }

    // Set an interval to keep searching and comparing the answer every second
    setInterval(continuouslyFindAndCompareResult, 1000); // Check every 1 second

})();
