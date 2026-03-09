(function () {
    function textFromNode(node) {
        return (node?.textContent || "").replace(/\s+/g, " ").trim();
    }

    function findQuestionText(section) {
        const heading = section.querySelector("h1, h2, h3, h4, h5, h6");
        if (heading) return textFromNode(heading);
        const paragraph = section.querySelector("p");
        return paragraph ? textFromNode(paragraph) : "Question";
    }

    function extractExplanation(section) {
        const blockquote = section.querySelector("blockquote");
        if (!blockquote) return null;
        const html = blockquote.innerHTML;
        blockquote.remove();
        return html;
    }

    function extractAnswers(section) {
        // <li><input type="checkbox" disabled checked> Answer text</li>
        const liNodes = Array.from(section.querySelectorAll("li"));
        const answers = [];

        liNodes.forEach((li) => {
            const input = li.querySelector('input[type="checkbox"]');
            if (!input) return;
            const isCorrect = input.checked === true;

            input.remove();

            const label = textFromNode(li);
            if (!label) return;

            answers.push({ label, isCorrect });
        });

        return answers;
    }

    function clearOriginalContent(section) {
        const nodes = section.querySelectorAll("h1, h2, h3, ul, blockquote, p");
        nodes.forEach(n => n.remove());
    }

    function buildQuizUI({ question, answers, explanationHtml }) {
        const root = document.createElement("div");
        root.className = "rq";

        const q = document.createElement("div");
        q.className = "rq-question";
        q.textContent = question;

        const ul = document.createElement("ul");
        ul.className = "rq-answers";

        // one or multiple answers
        const correctCount = answers.filter((a) => a.isCorrect).length;
        const isSingle = correctCount === 1;

        answers.forEach((ans, idx) => {
            const li = document.createElement("li");

            const btn = document.createElement("div");
            btn.className = "rq-answer";
            btn.setAttribute("role", isSingle ? "radio" : "checkbox");
            btn.setAttribute("tabindex", "0");
            btn.dataset.index = String(idx);
            btn.dataset.correct = ans.isCorrect ? "1" : "0";
            btn.dataset.selected = "0";
            btn.textContent = ans.label;

            li.appendChild(btn);
            ul.appendChild(li);
        });

        const footer = document.createElement("div");
        footer.className = "rq-footer";

        const submit = document.createElement("button");
        submit.className = "rq-submit";
        submit.textContent = "Prüfen";
        submit.disabled = true;

        const result = document.createElement("div");
        result.className = "rq-result";
        result.textContent = "";

        footer.appendChild(submit);
        footer.appendChild(result);

        const expl = document.createElement("div");
        expl.className = "rq-expl";
        if (explanationHtml) expl.innerHTML = explanationHtml;

        root.appendChild(q);
        root.appendChild(ul);
        root.appendChild(footer);
        root.appendChild(expl);

        return { root, submit, result, expl, isSingle };
    }

    function setupInteractions(section, ui) {
        const answers = Array.from(section.querySelectorAll(".rq-answer"));

        function anySelected() {
            return answers.some((a) => a.dataset.selected === "1");
        }

        function setSelected(el, selected) {
            el.dataset.selected = selected ? "1" : "0";
            el.classList.toggle("is-selected", selected);
            el.setAttribute("aria-checked", selected ? "true" : "false");
        }

        function onAnswerClick(el) {
            if (section.dataset.quizSubmitted === "1") return;

            if (ui.isSingle) {
                answers.forEach((a) => setSelected(a, false));
                setSelected(el, true);
            } else {
                const now = el.dataset.selected !== "1";
                setSelected(el, now);
            }

            ui.submit.disabled = !anySelected();
        }

        function grade() {
            section.dataset.quizSubmitted = "1";

            let selectedCorrect = 0;
            let selectedWrong = 0;
            const totalCorrect = answers.filter((a) => a.dataset.correct === "1").length;

            answers.forEach((a) => {
                const isSelected = a.dataset.selected === "1";
                const isCorrect = a.dataset.correct === "1";

                a.classList.remove("is-selected");

                if (isSelected && isCorrect) {
                    a.classList.add("is-correct");
                    selectedCorrect++;
                } else if (isSelected && !isCorrect) {
                    a.classList.add("is-wrong");
                    selectedWrong++;
                } else if (!isSelected && isCorrect) {
                    a.classList.add("is-correct");
                }
            });

            const ok = selectedWrong === 0 && selectedCorrect === totalCorrect;
            ui.result.textContent = ok ? "✅ Richtig!" : "❌ Nicht ganz.";
            if (ui.expl.innerHTML.trim().length > 0) {
                ui.expl.classList.add("is-visible");
            }

            ui.submit.disabled = true;
        }
        answers.forEach((el) => {
            el.addEventListener("click", () => onAnswerClick(el));
        });

        ui.submit.addEventListener("click", grade);
    }

    function enhanceQuizSection(section) {
        if (section.dataset.quizEnhanced === "1") return;

        const question = findQuestionText(section);
        const explanationHtml = extractExplanation(section);
        const answers = extractAnswers(section);

        if (!answers.length) {
            console.warn("No task-list answers found in quiz slide.", section);
            return;
        }

        clearOriginalContent(section);

        const ui = buildQuizUI({ question, answers, explanationHtml });
        section.appendChild(ui.root);

        section.dataset.quizEnhanced = "1";
        section.dataset.quizSubmitted = "0";

        setupInteractions(section, ui);
    }

    function enhanceAll(deck) {
        const slides = deck.getRevealElement().querySelectorAll('.slides section[data-quiz]');
        slides.forEach(enhanceQuizSection);
    }

    window.RevealQuizPresentation = {
        id: "quiz-presentation",
        init: (deck) => {
            deck.on("ready", () => {
                enhanceAll(deck);
            });
        },
    };
})();