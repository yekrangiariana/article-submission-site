// ─────────────────────────────────────────────
//  State
// ─────────────────────────────────────────────
const TOTAL_STEPS = 6;
const MODES = {
  ESSENTIALS: "essentials",
  GENERAL: "general",
};
let currentStep = 1;
let currentMode = MODES.GENERAL;
let quoteCount = 0;
let questionCount = 0;
let mcOptionCounters = {};
let actionModalTimer = null;
const visitedSteps = new Set([1]);

const STEP_NAMES = {
  [MODES.ESSENTIALS]: [
    "Headline & Summary",
    "Country",
    "Article Draft",
    "Highlighted Quotes",
    "Quiz",
    "Review & Send",
  ],
  [MODES.GENERAL]: [
    "Headline & Summary",
    "Country & Taxonomy",
    "Article Draft",
    "Review & Send",
  ],
};

function getFlowSteps() {
  return currentMode === MODES.GENERAL ? [1, 2, 3, 6] : [1, 2, 3, 4, 5, 6];
}

function normalizeTargetForMode(target) {
  if (currentMode !== MODES.GENERAL) return target;
  if (target === 4 || target === 5) return 6;
  if (currentStep === 6 && target === 5) return 3;
  return target;
}

function getLastStep() {
  const steps = getFlowSteps();
  return steps[steps.length - 1];
}

function updateModeText() {
  const siteModeTitle = document.getElementById("site-mode-title");
  const step2Title = document.getElementById("step2-title");
  const step2Desc = document.getElementById("step2-desc");
  const step1NextBtn = document.getElementById("step1-next-btn");
  const step3NextBtn = document.getElementById("step3-next-btn");
  const step6BackBtn = document.getElementById("step6-back-btn");

  if (currentMode === MODES.GENERAL) {
    document.title = "Submission Site";
    if (siteModeTitle) siteModeTitle.textContent = "Submission Site";
    if (step2Title) step2Title.textContent = "Country & Taxonomy";
    if (step2Desc)
      step2Desc.textContent =
        "Confirm whether the story is country-focused, then add categories and tags for accurate discovery.";
    if (step1NextBtn) step1NextBtn.textContent = "Next → Country & Taxonomy";
    if (step3NextBtn) step3NextBtn.textContent = "Next → Review & Send";
    if (step6BackBtn) step6BackBtn.textContent = "← Back";
  } else {
    document.title = "Essentials Stories";
    if (siteModeTitle) siteModeTitle.textContent = "Essentials Stories";
    if (step2Title) step2Title.textContent = "Country";
    if (step2Desc)
      step2Desc.textContent =
        "Tag countries only when they are central to the story, not simply mentioned.";
    if (step1NextBtn) step1NextBtn.textContent = "Next → Country";
    if (step3NextBtn) step3NextBtn.textContent = "Next → Highlighted Quotes";
    if (step6BackBtn) step6BackBtn.textContent = "← Back";
  }
}

function setSubmissionMode(mode) {
  if (!Object.values(MODES).includes(mode)) return;
  currentMode = mode;

  document.body.classList.toggle("mode-general", currentMode === MODES.GENERAL);
  document
    .getElementById("mode-essentials-btn")
    .classList.toggle("active", currentMode === MODES.ESSENTIALS);
  document
    .getElementById("mode-general-btn")
    .classList.toggle("active", currentMode === MODES.GENERAL);

  updateModeText();

  if (
    currentMode === MODES.GENERAL &&
    (currentStep === 4 || currentStep === 5)
  ) {
    goTo(6);
    return;
  }

  renderProgress();
}

function hasDraftData() {
  const fieldIds = [
    "title",
    "description",
    "author",
    "countryName",
    "generalCategories",
    "generalTags",
    "content",
  ];

  const hasFieldValue = fieldIds.some((id) => {
    const el = document.getElementById(id);
    return !!el && !!el.value.trim();
  });

  const hasToggles =
    document.getElementById("hasCountry").checked ||
    document.getElementById("hasQuotes").checked ||
    document.getElementById("hasQuiz").checked;

  const hasQuoteDraft = Array.from(
    document.querySelectorAll(
      '#quoteList textarea, #quoteList input[type="text"]',
    ),
  ).some((el) => el.value.trim());

  const hasQuizDraft = Array.from(
    document.querySelectorAll('#quizList input[type="text"]'),
  ).some((el) => el.value.trim());

  return (
    hasFieldValue ||
    hasToggles ||
    hasQuoteDraft ||
    hasQuizDraft ||
    !!window._generatedMd
  );
}

function attemptModeSwitch(nextMode) {
  if (nextMode === currentMode) return;

  if (hasDraftData()) {
    const ok = window.confirm(
      "Switching mode will clear your current draft and generated output. Continue?",
    );
    if (!ok) return;
  }

  setSubmissionMode(nextMode);
  resetForm();
}

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function refreshDate() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const localDT = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  document.getElementById("dateField").value = localDT;
}

// ─────────────────────────────────────────────
//  Init
// ─────────────────────────────────────────────
(function init() {
  refreshDate();

  // Slug auto-generation from title
  document.getElementById("title").addEventListener("input", function () {
    const slug = this.value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
    document.getElementById("slug").value = slug;
  });

  document
    .getElementById("mode-essentials-btn")
    .addEventListener("click", () => attemptModeSwitch(MODES.ESSENTIALS));
  document
    .getElementById("mode-general-btn")
    .addEventListener("click", () => attemptModeSwitch(MODES.GENERAL));

  ["title", "description", "author", "countryName", "content"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", renderProgress);
  });

  renderProgress();
  addQuote(); // start with one quote card
  addQuestion(); // start with one question card
  setSubmissionMode(MODES.GENERAL);
})();

// ─────────────────────────────────────────────
//  Progress
// ─────────────────────────────────────────────
function renderProgress() {
  const labels = document.getElementById("progressLabels");
  const flowSteps = getFlowSteps();
  const stepNames = STEP_NAMES[currentMode];
  const activeIndex = flowSteps.indexOf(currentStep);

  labels.innerHTML = flowSteps
    .map((stepNumber, i) => {
      const n = stepNames[i];
      const complete = isStepComplete(stepNumber);
      const touched = visitedSteps.has(stepNumber) || i < activeIndex;
      const done = complete && touched;
      const pending = !complete && touched;
      const isActive = stepNumber === currentStep;

      const cls = [
        done ? "done" : "",
        pending ? "pending" : "",
        isActive ? "active" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const prefix = done ? "✅ " : "";
      return `<button type="button" class="progress-label ${cls}" onclick="goTo(${stepNumber})">${prefix}${n}</button>`;
    })
    .join("");

  ensureActiveProgressVisible();
}

function ensureActiveProgressVisible() {
  if (!window.matchMedia("(max-width: 1100px)").matches) return;

  const progressWrap = document.querySelector(".progress-wrap");
  const activeLabel = document.querySelector(
    "#progressLabels .progress-label.active",
  );
  if (!progressWrap || !activeLabel) return;

  const activeStart = activeLabel.offsetLeft;
  const activeEnd = activeStart + activeLabel.offsetWidth;
  const viewportStart = progressWrap.scrollLeft;
  const viewportEnd = viewportStart + progressWrap.clientWidth;
  const edgePadding = 12;

  if (
    activeStart >= viewportStart + edgePadding &&
    activeEnd <= viewportEnd - edgePadding
  ) {
    return;
  }

  const centeredLeft =
    activeStart - (progressWrap.clientWidth - activeLabel.offsetWidth) / 2;

  progressWrap.scrollTo({
    left: Math.max(0, centeredLeft),
    behavior: "smooth",
  });
}

function isStepComplete(step) {
  if (currentMode === MODES.GENERAL && (step === 4 || step === 5)) {
    return true;
  }

  if (step === 1) {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    if (currentMode === MODES.GENERAL) {
      const author = document.getElementById("author").value.trim();
      return !!title && !!description && !!author;
    }
    return !!title && !!description;
  }

  if (step === 2) {
    const countrySelect = document.getElementById("countrySelect");
    const selectedButton = countrySelect?.querySelector(".yes-no-btn.active");
    if (!selectedButton) return false;

    const hasCountry = document.getElementById("hasCountry").checked;
    if (!hasCountry) return true;
    return !!document.getElementById("countryName").value.trim();
  }

  if (step === 3) {
    return !!document.getElementById("content").value.trim();
  }

  if (step === 4) {
    const quotesSelect = document.getElementById("quotesSelect");
    const selectedButton = quotesSelect?.querySelector(".yes-no-btn.active");
    if (!selectedButton) return false;

    const hasQuotes = document.getElementById("hasQuotes").checked;
    if (!hasQuotes) return true;
    let hasAtLeastOneQuote = false;
    document
      .getElementById("quoteList")
      .querySelectorAll(".item-card")
      .forEach((card) => {
        const m = card.id.match(/quote-card-(\d+)/);
        if (!m) return;
        const idx = m[1];
        const sentence =
          (document.getElementById(`q-sentence-${idx}`) || {}).value || "";
        if (sentence.trim()) hasAtLeastOneQuote = true;
      });
    return hasAtLeastOneQuote;
  }

  if (step === 5) {
    const quizSelect = document.getElementById("quizSelect");
    const selectedButton = quizSelect?.querySelector(".yes-no-btn.active");
    if (!selectedButton) return false;

    const hasQuiz = document.getElementById("hasQuiz").checked;
    if (!hasQuiz) return true;
    let hasAtLeastOneQuestion = false;
    document
      .getElementById("quizList")
      .querySelectorAll(".item-card")
      .forEach((card) => {
        const m = card.id.match(/quiz-card-(\d+)/);
        if (!m) return;
        const idx = m[1];
        const questionEl = document.getElementById(`qz-q-${idx}`);
        if (questionEl && questionEl.value.trim()) hasAtLeastOneQuestion = true;
      });
    return hasAtLeastOneQuestion;
  }

  return false;
}

// ─────────────────────────────────────────────
//  Navigation
// ─────────────────────────────────────────────
function goTo(target) {
  const normalizedTarget = normalizeTargetForMode(target);
  const flowSteps = getFlowSteps();
  if (normalizedTarget < 1 || normalizedTarget > TOTAL_STEPS) return;
  if (!flowSteps.includes(normalizedTarget)) return;

  const currentIndex = flowSteps.indexOf(currentStep);
  const targetIndex = flowSteps.indexOf(normalizedTarget);

  if (targetIndex > currentIndex && !validateStep(currentStep)) return;

  if (normalizedTarget === 1) refreshDate();
  if (normalizedTarget === getLastStep()) buildOutput();

  const currentEl = document.getElementById(`step-${currentStep}`);
  const targetEl = document.getElementById(`step-${normalizedTarget}`);
  if (!targetEl) return;

  if (currentEl) currentEl.classList.remove("active");
  currentStep = normalizedTarget;
  visitedSteps.add(normalizedTarget);
  targetEl.classList.add("active");
  renderProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("slug").value = "";
  const authorInput = document.getElementById("author");
  if (authorInput) authorInput.value = "";
  document.getElementById("countryName").value = "";
  const generalCategories = document.getElementById("generalCategories");
  if (generalCategories) generalCategories.value = "";
  const generalTags = document.getElementById("generalTags");
  if (generalTags) generalTags.value = "";
  document.getElementById("content").value = "";

  document.getElementById("hasCountry").checked = false;
  document.getElementById("hasQuotes").checked = false;
  document.getElementById("hasQuiz").checked = false;

  const countrySelect = document.getElementById("countrySelect");
  if (countrySelect) {
    countrySelect
      .querySelectorAll(".yes-no-btn")
      .forEach((btn) => btn.classList.remove("active"));
  }

  const quotesSelect = document.getElementById("quotesSelect");
  const quizSelect = document.getElementById("quizSelect");
  if (quizSelect) {
    quizSelect
      .querySelectorAll(".yes-no-btn")
      .forEach((btn) => btn.classList.remove("active"));
  }

  if (quotesSelect) {
    quotesSelect
      .querySelectorAll(".yes-no-btn")
      .forEach((btn) => btn.classList.remove("active"));
  }

  toggleCountry();
  toggleQuotes();
  toggleQuiz();

  document.getElementById("quoteList").innerHTML = "";
  document.getElementById("quizList").innerHTML = "";
  quoteCount = 0;
  questionCount = 0;
  mcOptionCounters = {};
  addQuote();
  addQuestion();

  document
    .querySelectorAll(".invalid")
    .forEach((el) => el.classList.remove("invalid"));
  document
    .querySelectorAll(".field-error.visible")
    .forEach((el) => el.classList.remove("visible"));

  const currentEl = document.getElementById(`step-${currentStep}`);
  if (currentEl) currentEl.classList.remove("active");
  currentStep = 1;
  visitedSteps.clear();
  visitedSteps.add(1);
  const firstStep = document.getElementById("step-1");
  if (firstStep) firstStep.classList.add("active");

  window._generatedMd = "";
  window._generatedData = null;
  const outputBlock = document.getElementById("outputBlock");
  if (outputBlock) outputBlock.textContent = "";

  refreshDate();
  renderProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ─────────────────────────────────────────────
//  Validation
// ─────────────────────────────────────────────
function validateStep(step) {
  let ok = true;

  const clear = (id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("invalid");
    const err = document.getElementById(id + "-err");
    if (err) err.classList.remove("visible");
  };

  const fail = (fieldId, errId) => {
    ok = false;
    const el = document.getElementById(fieldId);
    if (el) el.classList.add("invalid");
    const err = document.getElementById(errId);
    if (err) err.classList.add("visible");
  };

  if (step === 1) {
    clear("title");
    clear("description");
    clear("author");
    if (!document.getElementById("title").value.trim())
      fail("title", "title-err");
    if (!document.getElementById("description").value.trim())
      fail("description", "desc-err");
    if (
      currentMode === MODES.GENERAL &&
      !document.getElementById("author").value.trim()
    ) {
      fail("author", "author-err");
    }
  }
  if (step === 2) {
    clear("countryName");
    if (document.getElementById("hasCountry").checked) {
      if (!document.getElementById("countryName").value.trim())
        fail("countryName", "country-err");
    }
  }
  if (step === 3) {
    clear("content");
    if (!document.getElementById("content").value.trim())
      fail("content", "content-err");
  }

  return ok;
}

// ─────────────────────────────────────────────
//  Toggle sections
// ─────────────────────────────────────────────
function toggleCountry() {
  document
    .getElementById("countrySection")
    .classList.toggle("open", document.getElementById("hasCountry").checked);
}

function toggleQuotes() {
  document
    .getElementById("quotesSection")
    .classList.toggle("open", document.getElementById("hasQuotes").checked);
}

function toggleQuiz() {
  document
    .getElementById("quizSection")
    .classList.toggle("open", document.getElementById("hasQuiz").checked);
}

function setHasCountry(value) {
  document.getElementById("hasCountry").checked = value;
  const wrapper = document.getElementById("countrySelect");
  wrapper
    .querySelectorAll(".yes-no-btn")
    .forEach((btn) => btn.classList.remove("active"));
  const buttons = wrapper.querySelectorAll(".yes-no-btn");
  if (value) {
    buttons[0].classList.add("active");
  } else {
    buttons[1].classList.add("active");
  }
  toggleCountry();
  renderProgress();
  if (!value && currentMode === MODES.ESSENTIALS) goTo(3);
}

function setHasQuotes(value) {
  document.getElementById("hasQuotes").checked = value;
  const wrapper = document.getElementById("quotesSelect");
  wrapper
    .querySelectorAll(".yes-no-btn")
    .forEach((btn) => btn.classList.remove("active"));
  const buttons = wrapper.querySelectorAll(".yes-no-btn");
  if (value) {
    buttons[0].classList.add("active");
  } else {
    buttons[1].classList.add("active");
  }
  toggleQuotes();
  renderProgress();
  if (!value) goTo(5);
}

function setHasQuiz(value) {
  document.getElementById("hasQuiz").checked = value;
  const wrapper = document.getElementById("quizSelect");
  wrapper
    .querySelectorAll(".yes-no-btn")
    .forEach((btn) => btn.classList.remove("active"));
  const buttons = wrapper.querySelectorAll(".yes-no-btn");
  if (value) {
    buttons[0].classList.add("active");
  } else {
    buttons[1].classList.add("active");
  }
  toggleQuiz();
  renderProgress();
  if (!value) goTo(6);
}

// ─────────────────────────────────────────────
//  Quotes
// ─────────────────────────────────────────────
function addQuote() {
  quoteCount++;
  const id = quoteCount;
  const list = document.getElementById("quoteList");
  const card = document.createElement("div");
  card.className = "item-card";
  card.id = `quote-card-${id}`;
  card.innerHTML = `
    <div class="item-num">Quote ${id}</div>
    <button type="button" class="remove-btn" onclick="removeItem('quote-card-${id}')" title="Remove">×</button>
    <div class="field">
      <label>Sentence / Highlighted text</label>
      <textarea id="q-sentence-${id}" placeholder="The exact sentence to highlight…" style="min-height:80px"></textarea>
    </div>
    <div class="field" style="margin-bottom:0">
      <label>Attribution <span style="font-weight:400;color:var(--muted)">(optional)</span></label>
      <input type="text" id="q-attr-${id}" placeholder="e.g. António Guterres, UN Secretary-General" />
    </div>
  `;
  list.appendChild(card);
  renumberItems("quoteList", "Quote");
}

function renumberItems(listId, prefix) {
  document
    .getElementById(listId)
    .querySelectorAll(".item-card")
    .forEach((c, i) => {
      const num = c.querySelector(".item-num");
      if (num) num.textContent = `${prefix} ${i + 1}`;
    });
}

// ─────────────────────────────────────────────
//  Quiz
// ─────────────────────────────────────────────
function addQuestion() {
  questionCount++;
  const id = questionCount;
  const list = document.getElementById("quizList");
  const card = document.createElement("div");
  card.className = "item-card";
  card.id = `quiz-card-${id}`;
  card.dataset.answerType = "single";
  card.innerHTML = `
    <div class="item-num">Question ${id}</div>
    <button type="button" class="remove-btn" onclick="removeItem('quiz-card-${id}')" title="Remove">×</button>
    <div class="field">
      <label>Question text (self-contained)</label>
      <input type="text" id="qz-q-${id}" placeholder="e.g. How many people were displaced in Sudan in 2025?" />
    </div>
    <div class="answer-type-wrap">
      <button type="button" class="answer-type-btn selected" id="qz-btn-single-${id}" onclick="setAnswerType(${id},'single')">
        ✏️ Single answer
      </button>
      <button type="button" class="answer-type-btn" id="qz-btn-mc-${id}" onclick="setAnswerType(${id},'mc')">
        ☑️ Multiple choice
      </button>
    </div>
    <div id="qz-single-${id}">
      <div class="field" style="margin-bottom:0">
        <label>Correct answer</label>
        <input type="text" id="qz-ans-${id}" placeholder="e.g. 2.3 million people" />
      </div>
    </div>
    <div id="qz-mc-${id}" style="display:none">
      <div class="mc-note">Use complete answer options; mark the correct one with the radio button.</div>
      <div id="qz-opts-${id}"></div>
      <button type="button" class="add-btn" style="margin-top:4px" onclick="addMcOption(${id})">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add option
      </button>
    </div>
  `;
  list.appendChild(card);
  // Seed with two default MC options
  addMcOption(id);
  addMcOption(id);
  renumberItems("quizList", "Question");
}

function addMcOption(qid) {
  if (!mcOptionCounters[qid]) mcOptionCounters[qid] = 0;
  mcOptionCounters[qid]++;
  const oid = mcOptionCounters[qid];
  const opts = document.getElementById(`qz-opts-${qid}`);
  const row = document.createElement("div");
  row.className = "mc-option-row";
  row.id = `mc-row-${qid}-${oid}`;
  row.innerHTML = `
    <input type="radio" name="mc-correct-${qid}" value="${oid}" id="mc-radio-${qid}-${oid}" />
    <input type="text" id="mc-opt-${qid}-${oid}" placeholder="Option ${oid} (complete answer text)" />
    <button type="button" class="rm-opt" onclick="removeMcOption('mc-row-${qid}-${oid}')" title="Remove option">×</button>
  `;
  opts.appendChild(row);
}

function removeMcOption(rowId) {
  const el = document.getElementById(rowId);
  if (el) el.remove();
}

function setAnswerType(qid, type) {
  document
    .getElementById(`qz-btn-single-${qid}`)
    .classList.toggle("selected", type === "single");
  document
    .getElementById(`qz-btn-mc-${qid}`)
    .classList.toggle("selected", type === "mc");
  document.getElementById(`qz-single-${qid}`).style.display =
    type === "single" ? "" : "none";
  document.getElementById(`qz-mc-${qid}`).style.display =
    type === "mc" ? "" : "none";
  // Persist type on the card element for reliable retrieval in collectData()
  const card = document.getElementById(`quiz-card-${qid}`);
  if (card) card.dataset.answerType = type;
}

function removeItem(cardId) {
  const el = document.getElementById(cardId);
  if (el) el.remove();
  renumberItems("quoteList", "Quote");
  renumberItems("quizList", "Question");
}

// ─────────────────────────────────────────────
//  Collect form data
// ─────────────────────────────────────────────
function collectData() {
  const splitCsv = (value) =>
    String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const title = document.getElementById("title").value.trim();
  const slug = document.getElementById("slug").value.trim();

  // datetime-local → ISO string with +0300 offset
  const dtRaw = document.getElementById("dateField").value; // "2026-02-21T06:00"
  const date = dtRaw ? dtRaw + ":00+0300" : "";

  const description = document.getElementById("description").value.trim();
  const rawAuthors =
    currentMode === MODES.GENERAL
      ? (document.getElementById("author")?.value || "").trim()
      : "UN-aligned";
  const authors = splitCsv(rawAuthors);

  // Tags — country tags come first, then any additional tags
  const tags = [];
  const categories = [];
  const countryTags = document.getElementById("hasCountry").checked
    ? splitCsv(document.getElementById("countryName").value)
    : [];

  if (currentMode === MODES.GENERAL) {
    categories.push(
      ...splitCsv((document.getElementById("generalCategories") || {}).value),
    );
    const additionalTags = splitCsv(
      (document.getElementById("generalTags") || {}).value,
    );
    tags.push(...countryTags);
    additionalTags.forEach((tag) => {
      if (!tags.includes(tag)) tags.push(tag);
    });
  } else {
    tags.push(...countryTags);
  }

  const content = document.getElementById("content").value.trim();

  // Quotes
  const quotes = [];
  if (document.getElementById("hasQuotes").checked) {
    document
      .getElementById("quoteList")
      .querySelectorAll(".item-card")
      .forEach((card) => {
        const m = card.id.match(/quote-card-(\d+)/);
        if (!m) return;
        const i = m[1];
        const sentence =
          (document.getElementById(`q-sentence-${i}`) || {}).value || "";
        const attr = (document.getElementById(`q-attr-${i}`) || {}).value || "";
        if (sentence.trim())
          quotes.push({ sentence: sentence.trim(), attribute: attr.trim() });
      });
  }

  // Quiz
  const quiz = [];
  if (document.getElementById("hasQuiz").checked) {
    document
      .getElementById("quizList")
      .querySelectorAll(".item-card")
      .forEach((card) => {
        const m = card.id.match(/quiz-card-(\d+)/);
        if (!m) return;
        const i = m[1];
        const qEl = document.getElementById(`qz-q-${i}`);
        if (!qEl) return;
        const question = qEl.value.trim();
        if (!question) return;

        const isMC = card.dataset.answerType === "mc";

        if (!isMC) {
          const ans =
            (document.getElementById(`qz-ans-${i}`) || {}).value || "";
          quiz.push({ question, answer: ans.trim() });
        } else {
          const opts = [];
          let correctIndex = -1;
          document
            .getElementById(`qz-opts-${i}`)
            .querySelectorAll(".mc-option-row")
            .forEach((row) => {
              const m2 = row.id.match(/mc-row-(\d+)-(\d+)/);
              if (!m2) return;
              const oid = m2[2];
              const radio = document.getElementById(`mc-radio-${i}-${oid}`);
              const optEl = document.getElementById(`mc-opt-${i}-${oid}`);
              const val = optEl ? optEl.value.trim() : "";
              if (val) {
                opts.push(val);
                if (radio && radio.checked) correctIndex = opts.length - 1;
              }
            });
          quiz.push({ question, answer: opts, correctIndex });
        }
      });
  }

  return {
    mode: currentMode,
    title,
    slug,
    date,
    description,
    authors,
    categories,
    tags,
    content,
    quotes,
    quiz,
  };
}

// ─────────────────────────────────────────────
//  Build YAML front matter + markdown
// ─────────────────────────────────────────────
function yamlStr(s) {
  return '"' + String(s).replace(/"/g, '\\"') + '"';
}

function buildMarkdown(d) {
  if (d.mode === MODES.GENERAL) {
    const authorArray = d.authors.length
      ? d.authors.map((a) => yamlStr(a)).join(", ")
      : '""';

    let fm = "---\n";
    fm += `title: ${yamlStr(d.title)}\n`;
    fm += `date: ${d.date}\n`;
    fm += `authors: [${authorArray}]\n`;
    fm += `slug: ${yamlStr(d.slug)}\n`;
    fm += `description: ${yamlStr(d.description)}\n`;
    fm += "categories:\n";
    if (d.categories.length) {
      d.categories.forEach((category) => {
        fm += ` - ${yamlStr(category)}\n`;
      });
    } else {
      fm += ' - ""\n';
    }

    fm += "tags:\n";
    if (d.tags.length) {
      d.tags.forEach((tag) => {
        fm += ` - ${yamlStr(tag)}\n`;
      });
    } else {
      fm += ' - ""\n';
    }

    fm += `image: ""\n`;
    fm += `imageCaption: "Graphic: Ariana Yekrangi"\n`;
    fm += `style: "1"\n`;

    fm += "---\n\n";
    return fm + d.content;
  }

  let fm = "---\n";
  fm += `title: ${yamlStr(d.title)}\n`;
  fm += `date: ${yamlStr(d.date)}\n`;
  fm += `authors: [${d.authors.map((a) => yamlStr(a)).join(", ")}]\n`;
  fm += `slug: ${yamlStr(d.slug)}\n`;
  fm += `description: ${yamlStr(d.description)}\n`;
  fm += `categories:\n - "Essential Stories of the Week"\n`;

  if (d.tags.length) {
    fm += `tags:\n`;
    d.tags.forEach((t) => {
      fm += ` - ${yamlStr(t)}\n`;
    });
  } else {
    fm += `tags:\n - ""\n`;
  }

  fm += `image: ""\n`;
  fm += `imageCaption: "Graphic: Ariana Yekrangi"\n`;
  fm += `style: "1"\n`;

  if (d.quiz.length) {
    fm += `quiz:\n`;
    d.quiz.forEach((q) => {
      fm += `  - question: ${yamlStr(q.question)}\n`;
      if (Array.isArray(q.answer)) {
        // Move the correct answer to index 0 (app convention)
        const ordered = [...q.answer];
        if (q.correctIndex >= 0 && q.correctIndex < ordered.length) {
          const [correct] = ordered.splice(q.correctIndex, 1);
          ordered.unshift(correct);
        }
        fm += `    answer: [${ordered.map((a) => yamlStr(a)).join(", ")}]\n`;
      } else {
        fm += `    answer: ${yamlStr(q.answer)}\n`;
      }
    });
  } else {
    fm += `quiz:\n  - question: ""\n    answer: ""\n`;
  }

  if (d.quotes.length) {
    fm += `quotes:\n`;
    d.quotes.forEach((q) => {
      fm += `  - sentence: ${yamlStr(q.sentence)}\n`;
      fm += `    attribute: ${yamlStr(q.attribute)}\n`;
    });
  } else {
    fm += `quotes:\n  - sentence: ""\n    attribute: ""\n`;
  }

  fm += `---\n`;
  return fm + "\n" + d.content;
}

// ─────────────────────────────────────────────
//  Build & render the review step
// ─────────────────────────────────────────────
function buildOutput() {
  const d = collectData();
  const md = buildMarkdown(d);

  window._generatedMd = md;
  window._generatedData = d;

  // HTML-escape for safe display
  const escaped = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  document.getElementById("outputBlock").innerHTML = escaped;
}

function openActionModal(message, title = "System Message", timeout = 2500) {
  if (actionModalTimer) {
    clearTimeout(actionModalTimer);
    actionModalTimer = null;
  }

  const screen = document.querySelector(".tv-screen");
  const titleEl = document.getElementById("actionModalTitle");
  const bodyEl = document.querySelector("#actionModalBody .tv-action-message");

  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.textContent = message;

  screen.classList.add("channel-change");

  setTimeout(() => {
    document.getElementById("actionModal").style.display = "block";
    screen.classList.remove("channel-change");
  }, 400);

  if (timeout > 0) {
    actionModalTimer = setTimeout(() => {
      closeActionModal();
    }, timeout + 400);
  }
}

function closeActionModal() {
  if (actionModalTimer) {
    clearTimeout(actionModalTimer);
    actionModalTimer = null;
  }

  const screen = document.querySelector(".tv-screen");
  screen.classList.add("channel-change");

  setTimeout(() => {
    document.getElementById("actionModal").style.display = "none";
    screen.classList.remove("channel-change");
  }, 400);
}

// ─────────────────────────────────────────────
//  Copy & Email
// ─────────────────────────────────────────────
function copyOutput() {
  if (!window._generatedMd) {
    openActionModal("No generated output yet.", "Clipboard", 2800);
    return;
  }

  navigator.clipboard
    .writeText(window._generatedMd)
    .then(() => {
      openActionModal("Link copied to clipboard.", "Clipboard", 2600);
    })
    .catch(() => {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = window._generatedMd;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      openActionModal("Link copied to clipboard.", "Clipboard", 2600);
    });
}

function sendEmail() {
  if (!window._generatedMd) {
    openActionModal("No generated output yet.", "Email", 2800);
    return;
  }

  const d = window._generatedData;
  const to = "ariana.yekrangi@un-aligned.org";
  const prefix = d.mode === MODES.GENERAL ? "General Article" : "ESW Post";
  const subject = encodeURIComponent(`[${prefix}] ${d.title}`);
  const body = encodeURIComponent(
    `Hi Ariana,\n\nHere is the new post submission:\n\nSlug: ${d.slug}\nDate: ${d.date}\n\n--- MARKDOWN FILE ---\n\n${window._generatedMd}\n\n--- END OF FILE ---\n`,
  );
  openActionModal("Your email client is being opened.", "Email", 2200);
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

// ─────────────────────────────────────────────
//  Toast
// ─────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

// ─────────────────────────────────────────────
//  GitHub Submission Configuration
// ─────────────────────────────────────────────
const GITHUB_CONFIG = {
  // Repository information - update these for your site
  owner: "yekrangiariana",
  repo: "un-aligned-hugo",

  // Content paths in the Hugo site
  contentPaths: {
    general: "content/posts",
    essentials: "content/essentials",
  },

  // Labels for GitHub issues
  labels: {
    pending: "submission:pending",
    general: "type:article",
    essentials: "type:essentials",
  },
};

// ─────────────────────────────────────────────
//  Submit Modal
// ─────────────────────────────────────────────
function openSubmitModal() {
  if (!window._generatedMd) {
    openActionModal(
      "Please complete all steps before submitting.",
      "Submit",
      2800,
    );
    return;
  }

  document.getElementById("submitModal").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeSubmitModal() {
  document.getElementById("submitModal").style.display = "none";
  document.body.style.overflow = "";
}

// ─────────────────────────────────────────────
//  Success Modal
// ─────────────────────────────────────────────
function showSuccessModal(issueUrl, message) {
  closeSubmitModal();

  const detailEl = document.getElementById("success-detail");
  if (detailEl) detailEl.textContent = message || "";

  const linkEl = document.getElementById("view-submission-link");
  if (linkEl) {
    if (issueUrl) {
      linkEl.href = issueUrl;
      linkEl.style.display = "";
    } else {
      linkEl.style.display = "none";
    }
  }

  document.getElementById("successModal").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeSuccessModal() {
  document.getElementById("successModal").style.display = "none";
  document.body.style.overflow = "";
  resetForm();
}

// ─────────────────────────────────────────────
//  GitHub Issue Submission
// ─────────────────────────────────────────────
function buildIssueBody(d) {
  const mode =
    d.mode === MODES.GENERAL ? "General Article" : "Essentials Story";
  const date = new Date().toISOString().split("T")[0];

  let body = `## Article Submission\n\n`;
  body += `| Field | Value |\n`;
  body += `|-------|-------|\n`;
  body += `| **Type** | ${mode} |\n`;
  body += `| **Title** | ${d.title} |\n`;
  body += `| **Slug** | ${d.slug} |\n`;
  body += `| **Publication Date** | ${d.date} |\n`;
  body += `| **Authors** | ${d.authors.join(", ")} |\n`;

  if (d.categories.length) {
    body += `| **Categories** | ${d.categories.join(", ")} |\n`;
  }
  if (d.tags.length) {
    body += `| **Tags** | ${d.tags.join(", ")} |\n`;
  }

  body += `| **Submission Date** | ${date} |\n`;

  body += `\n### Summary\n\n${d.description}\n\n`;

  body += `---\n\n`;
  body += `<details>\n<summary>📄 Click to expand Markdown file content</summary>\n\n`;
  body += "```markdown\n";
  body += window._generatedMd;
  body += "\n```\n\n";
  body += `</details>\n\n`;

  body += `---\n\n`;
  body += `### For Editors\n\n`;
  body += `To approve this submission, use the GitHub Action workflow or manually:\n\n`;
  body += `1. Copy the markdown content above\n`;
  body += `2. Create a new file at \`${GITHUB_CONFIG.contentPaths[d.mode === MODES.GENERAL ? "general" : "essentials"]}/${d.slug}.md\`\n`;
  body += `3. Commit and close this issue\n`;

  return body;
}

function submitViaGitHub() {
  if (!window._generatedMd || !window._generatedData) {
    openActionModal(
      "No generated content. Please complete the form.",
      "Error",
      2800,
    );
    return;
  }

  const d = window._generatedData;
  const prefix = d.mode === MODES.GENERAL ? "Article" : "Essentials";
  const labels = [
    GITHUB_CONFIG.labels.pending,
    d.mode === MODES.GENERAL
      ? GITHUB_CONFIG.labels.general
      : GITHUB_CONFIG.labels.essentials,
  ].join(",");

  const title = `[${prefix}] ${d.title}`;
  const body = buildIssueBody(d);

  const url =
    `https://github.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues/new?` +
    `title=${encodeURIComponent(title)}&` +
    `body=${encodeURIComponent(body)}&` +
    `labels=${encodeURIComponent(labels)}`;

  closeSubmitModal();
  openActionModal("Opening GitHub...", "Submit", 1500);

  // Open in new tab
  window.open(url, "_blank");
}

// Close modals on escape key or background click
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSubmitModal();
    closeSuccessModal();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    closeSubmitModal();
    closeSuccessModal();
  }
});
