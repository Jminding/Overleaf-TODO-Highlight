// ==UserScript==
// @name         Highlight TODO in Overleaf LaTeX Editor
// @namespace    http://tampermonkey.net/
// @version      2024-11-24
// @description  Highlight the word "TODO" in comments inside a contenteditable LaTeX editor
// @author       Jaymin Ding
// @match        https://www.overleaf.com/project/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=overleaf.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function highlightTODO() {
        const editorElement = document.querySelector('.cm-content');
        if (editorElement) {
            const comments = editorElement.querySelectorAll('.cm-line .tok-comment');
            const editorTop = editorElement.scrollTop;
            const editorBottom = editorTop + editorElement.clientHeight;

            comments.forEach(comment => {
                const commentTop = comment.getBoundingClientRect().top + editorElement.scrollTop;
                const commentBottom = commentTop + comment.offsetHeight;

                // Only highlight if the comment is within the visible area
                if (
                    (commentTop >= editorTop && commentBottom <= editorBottom) &&
                    comment.textContent.includes('TODO') &&
                    !comment.classList.contains('highlight-todo')
                ) {
                    comment.classList.add('highlight-todo');
                }
            });
        } else {
            console.log('Editor element not found');
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        .highlight-todo {
            background-color: yellow !important;  /* Use !important to override other styles */
        }
    `;
    document.head.appendChild(style);

    function startReapplyingHighlighting() {
        highlightTODO();
        setInterval(highlightTODO, 0.01);  // Reapply every 0.01 ms (if this slows down the browser, change to something slower)
    }

    function observeEditor() {
        const observer = new MutationObserver((mutationsList, observer) => {
            const editorElement = document.querySelector('.cm-content');
            if (editorElement) {
                console.log('Editor found, starting to highlight TODOs...');
                startReapplyingHighlighting();
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        observeEditor();
    });
})();
