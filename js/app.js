// app.js - Main JavaScript for Hugo Article Submission app

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements for Content Type Selection
  const contentTypeSelection = document.getElementById("content-type-selection");
  const selectArticleBtn = document.getElementById("select-article-btn");
  const selectMagazineBtn = document.getElementById("select-magazine-btn");
  const articleSubmissionForm = document.getElementById("article-submission-form");
  const magazineSubmissionForm = document.getElementById("magazine-submission-form");
  const contentTypeHeader = document.getElementById("content-type-header");
  const progressContainer = document.querySelector(".progress-container");
  const selectArticleTypeBtn = document.getElementById("select-article-type");
  const selectMagazineTypeBtn = document.getElementById("select-magazine-type");
  
  // DOM Elements
  const stepSections = document.querySelectorAll(".step-section");
  const steps = document.querySelectorAll(".step");
  const progressBar = document.getElementById("progress-bar");

  // Front Matter Form Elements
  const frontmatterForm = document.getElementById("frontmatter-form");
  const titleInput = document.getElementById("title");
  const slugInput = document.getElementById("slug");
  const generateSlugBtn = document.getElementById("generate-slug-btn");
  const categoryInput = document.getElementById("category-input");
  const addCategoryBtn = document.getElementById("add-category-btn");
  const categoriesList = document.getElementById("categories-list");
  const categoryAutocomplete = document.getElementById("category-autocomplete");
  const tagInput = document.getElementById("tag-input");
  const addTagBtn = document.getElementById("add-tag-btn");
  const tagsList = document.getElementById("tags-list");
  const tagAutocomplete = document.getElementById("tag-autocomplete");

  // Article Content Elements
  const articleContent = document.getElementById("article-content");
  const markdownHelpBtn = document.getElementById("markdown-help-btn");
  const markdownHelpContent = document.getElementById("markdown-help-content");
  const insertShortcodeBtns = document.querySelectorAll(".insert-shortcode");

  // Article Statistics Elements
  const wordCountElement = document.getElementById("word-count");
  const headingCountElement = document.getElementById("heading-count");
  const linkCountElement = document.getElementById("link-count");

  // Preview Elements
  const markdownPreview = document.getElementById("markdown-preview");
  const copyToClipboardBtn = document.getElementById("copy-to-clipboard-btn");
  const downloadArticleBtn = document.getElementById("download-article-btn");
  const emailToEditorBtn = document.getElementById("email-to-editor-btn");
  const notification = document.getElementById("notification");

  // Navigation Buttons
  const nextToContentBtn = document.getElementById("next-to-content-btn");
  const backToFrontmatterBtn = document.getElementById(
    "back-to-frontmatter-btn"
  );
  const nextToPreviewBtn = document.getElementById("next-to-preview-btn");
  const backToContentBtn = document.getElementById("back-to-content-btn");

  // Photo Modal Elements
  const photoModal = document.getElementById("photo-modal");
  const modalTitle = document.getElementById("modal-title");
  const photoSrc = document.getElementById("photo-src");
  const photoCaption = document.getElementById("photo-caption");
  const photoWidth = document.getElementById("photo-width");
  const customWidthGroup = document.getElementById("custom-width-group");
  const insertPhotoBtn = document.getElementById("insert-photo-btn");
  const closeModal = document.querySelector(".close-modal");

  // Magazine Form Elements
  const magazineFrontMatterForm = document.getElementById("magazine-frontmatter-form");
  const magazineTitleInput = document.getElementById("magazine-title");
  const magazineSlugInput = document.getElementById("magazine-slug");
  const magazineIssueNumber = document.getElementById("magazine-issue-number");
  const magazineDate = document.getElementById("magazine-date");
  const magazineContent = document.getElementById("magazine-content");
  const magazineWordCount = document.getElementById("magazine-word-count");
  const articleInput = document.getElementById("article-input");
  const addArticleBtn = document.getElementById("add-article-btn");
  const articlesList = document.getElementById("articles-list");
  const magazineMarkdownHelpBtn = document.getElementById("magazine-markdown-help-btn");
  const magazineMarkdownHelpContent = document.getElementById("magazine-markdown-help-content");
  const magazineMarkdownPreview = document.getElementById("magazine-markdown-preview");
  
  // Magazine Navigation Buttons
  const magazineNextToContentBtn = document.getElementById("magazine-next-to-content-btn");
  const magazineBackToFrontmatterBtn = document.getElementById("magazine-back-to-frontmatter-btn");
  const magazineNextToPreviewBtn = document.getElementById("magazine-next-to-preview-btn");
  const magazineBackToContentBtn = document.getElementById("magazine-back-to-content-btn");
  const magazineCopyToClipboardBtn = document.getElementById("magazine-copy-to-clipboard-btn");
  const magazineDownloadBtn = document.getElementById("magazine-download-btn");
  const magazineEmailToEditorBtn = document.getElementById("magazine-email-to-editor-btn");

  // State Variables
  const state = {
    contentType: null, // 'article' or 'magazine'
    currentStep: 1,
    categories: [],
    tags: [],
    articles: [], // For magazine issues
    photoType: "normal",
    showAllCategories: false,
    showAllTags: false,
    initialDisplayCount: 8, // Number of items to show initially
    // Predefined options that can be easily modified
    presetCategories: [
  "Animal Rights",
  "Artificial Intelligence",
  "Campaigns",
  "Climate Emergency",
  "Comments",
  "Country Profile",
  "Culture",
  "Economy",
  "Education",
  "Events",
  "Explainer",
  "Gallery",
  "Global Issues",
  "Health",
  "Human Rights",
  "Inside Gordian Magazine",
  "Interview",
  "Investigation",
  "Letters",
  "Lifestyle",
  "News",
  "Obituary",
  "Opportunities",
  "Podcast",
  "Recipes",
  "Religion",
  "Reviews",
  "Science",
  "Social Issues",
  "Sports",
  "Technology",
  "The Gordian Magazine",
  "Un Aligned News",
  "UN in Focus",
  "Utopian Ideas",
  "Videos",
  "Women",
  "World Peace"
]
,
    presetTags: [
  "700 Years of Dante",
  "A Picture Story",
  "Afghanistan",
  "Agm",
  "Animal Rights",
  "Armenia",
  "Art",
  "At School in 70S England",
  "Australia",
  "Azerbaijan",
  "Bangladesh",
  "Belarus",
  "Books",
  "Campaign Updates",
  "Canada",
  "Capitalism",
  "Caravaggio",
  "Celebrity Islands With the United Nations",
  "China",
  "Conversion Therapy",
  "Courses",
  "Covid 19",
  "Csw",
  "Cyprus",
  "Democracy",
  "Diaries From Refugee Camps",
  "Disease",
  "Drc",
  "Drugs",
  "Editorial",
  "Environment Report",
  "European Union",
  "Federalism",
  "Finland",
  "Following a Successful Agm",
  "Football",
  "Fundraising",
  "Gaza",
  "Germany",
  "Get to Know Our Members",
  "Global Justice",
  "Global Pandemic",
  "Haiti",
  "Happiness",
  "Human Rights",
  "Hungary",
  "Icc",
  "Immigration",
  "India",
  "Iran",
  "Israel",
  "Italy",
  "Japan",
  "John Donne",
  "Journalism",
  "Kenya",
  "Kosovo",
  "Kurdistan",
  "Labour Day",
  "Lgbtq",
  "Linguistics",
  "Literature",
  "London",
  "Long Read",
  "Malta",
  "Manifesto",
  "Mexico",
  "Michelangelo",
  "Middle East",
  "Moldova",
  "Monthly Recap",
  "Music",
  "Myanmar",
  "Nagorno Karabakh",
  "Nation Building",
  "Nepal",
  "Net Zero",
  "New Series",
  "New Solutions With Omar",
  "Nicaragua",
  "Nobel Prize",
  "North Korea",
  "Nuclear Weapons",
  "Oceans",
  "Orthodoxy",
  "Person of the Year",
  "Photo Contest",
  "Poems for a Better World",
  "Poland",
  "Poverty",
  "Psychology",
  "Qatar",
  "Quotes",
  "Refugees",
  "Rohingya",
  "Romania",
  "Russia",
  "Sdg",
  "Security Council",
  "Social Issues",
  "Social Media",
  "South Korea",
  "Sri Lanka",
  "Syria",
  "Taiwan",
  "The Gordian in Audio",
  "Tibet",
  "Tourism",
  "Turkey",
  "Uganda",
  "Ukraine",
  "Un Aligned",
  "Un Likely Agony Aunt Letters",
  "Unanimous Verdict",
  "Unesco",
  "Unhcr",
  "Unhrc",
  "United Kingdom",
  "United Nations",
  "United States",
  "Unravelling the Un",
  "Unsc",
  "Uzbekistan",
  "Vegan Recipes",
  "Veganuary",
  "Voluntary Positions",
  "Water",
  "Wfp",
  "Who",
  "Yugoslavia",
  "Ywf"
],
  };

  // ====================
  // Content Type Selection Functions
  // ====================

  function selectContentType(type) {
    state.contentType = type;
    state.currentStep = 1;
    
    // Hide selection screen
    contentTypeSelection.style.display = "none";
    
    // Check if there's data in each form
    const hasArticleData = titleInput && titleInput.value.trim() !== '';
    const hasMagazineData = magazineTitleInput && magazineTitleInput.value.trim() !== '';
    
    // Update header to show content type buttons and progress
    contentTypeHeader.innerHTML = `
      <div class="content-type-selection">
        <button id="select-article-type" class="content-type-btn ${type === 'article' ? 'active' : ''} ${hasArticleData ? 'has-data' : ''}">Article</button>
        <button id="select-magazine-type" class="content-type-btn ${type === 'magazine' ? 'active' : ''} ${hasMagazineData ? 'has-data' : ''}">Magazine Issue</button>
      </div>
    `;
    
    // Show progress container
    progressContainer.style.display = "block";
    
    // Show appropriate form
    if (type === 'article') {
      articleSubmissionForm.style.display = "block";
      magazineSubmissionForm.style.display = "none";
      
      // Reset and activate first step
      const articleSteps = articleSubmissionForm.querySelectorAll(".step-section");
      articleSteps.forEach((section, index) => {
        if (index === 0) {
          section.classList.add("active");
        } else {
          section.classList.remove("active");
        }
      });
      
    } else if (type === 'magazine') {
      articleSubmissionForm.style.display = "none";
      magazineSubmissionForm.style.display = "block";
      
      // Reset and activate first step
      const magazineSteps = magazineSubmissionForm.querySelectorAll(".step-section");
      magazineSteps.forEach((section, index) => {
        if (index === 0) {
          section.classList.add("active");
        } else {
          section.classList.remove("active");
        }
      });
      
      // Set default date to today if not already set
      if (!magazineDate.value) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        magazineDate.value = `${year}-${month}-${day}`;
      }
      
      // Set up issue number and slug auto-generation if needed
      if (magazineIssueNumber.value) {
        updateMagazineSlug();
      }
    }
    
    // Add event listeners to content type buttons
    document.getElementById("select-article-type").addEventListener("click", () => selectContentType('article'));
    document.getElementById("select-magazine-type").addEventListener("click", () => selectContentType('magazine'));
    
    // Update progress indicators
    updateStepDisplay();
  }
  
  function resetToContentSelection() {
    state.contentType = null;
    state.currentStep = 1;
    
    // Hide forms
    articleSubmissionForm.style.display = "none";
    magazineSubmissionForm.style.display = "none";
    
    // Check if there's data in each form
    const hasArticleData = titleInput && titleInput.value.trim() !== '';
    const hasMagazineData = magazineTitleInput && magazineTitleInput.value.trim() !== '';
    
    // Reset header
    contentTypeHeader.innerHTML = `
      <div class="content-type-selection">
        <button id="select-article-type" class="content-type-btn ${hasArticleData ? 'has-data' : ''}">Submit Article</button>
        <button id="select-magazine-type" class="content-type-btn ${hasMagazineData ? 'has-data' : ''}">Submit Gordian Magazine Issue</button>
      </div>
    `;
    
    // Hide progress container
    progressContainer.style.display = "none";
    
    // Show selection screen
    contentTypeSelection.style.display = "block";
    contentTypeSelection.classList.add("active");
    
    // Update card selection status
    const articleCard = document.getElementById("article-type-card");
    const magazineCard = document.getElementById("magazine-type-card");
    
    if (hasArticleData) {
      articleCard.classList.add("has-data");
    } else {
      articleCard.classList.remove("has-data");
    }
    
    if (hasMagazineData) {
      magazineCard.classList.add("has-data");
    } else {
      magazineCard.classList.remove("has-data");
    }
    
    // Add event listeners to content type buttons
    document.getElementById("select-article-type").addEventListener("click", () => selectContentType('article'));
    document.getElementById("select-magazine-type").addEventListener("click", () => selectContentType('magazine'));
  }

  // ====================
  // Navigation Functions
  // ====================

  function updateStepDisplay() {
    // Update progress indicators
    steps.forEach((step) => {
      const stepNum = parseInt(step.dataset.step);
      if (stepNum <= state.currentStep) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });

    // Update progress bar - fix the percentage calculation
    const progressPercentage =
      ((state.currentStep - 1) / (steps.length - 1)) * 100;
    progressBar.style.width = `${progressPercentage}%`;

    // Show current section, hide others
    if (state.contentType === 'article') {
      const articleSteps = articleSubmissionForm.querySelectorAll(".step-section");
      articleSteps.forEach((section, index) => {
        if (index + 1 === state.currentStep) {
          section.classList.add("active");
        } else {
          section.classList.remove("active");
        }
      });
    } else if (state.contentType === 'magazine') {
      const magazineSteps = magazineSubmissionForm.querySelectorAll(".step-section");
      magazineSteps.forEach((section, index) => {
        if (index + 1 === state.currentStep) {
          section.classList.add("active");
        } else {
          section.classList.remove("active");
        }
      });
    }
  }

  function goToStep(stepNumber) {
    if (state.contentType === 'article') {
      if (stepNumber === 2 && !validateFrontMatter()) {
        return false;
      }

      if (stepNumber === 3) {
        if (!validateArticleContent()) {
          return false;
        }
        generatePreview();
      }
    } else if (state.contentType === 'magazine') {
      if (stepNumber === 2 && !validateMagazineFrontMatter()) {
        return false;
      }

      if (stepNumber === 3) {
        if (!validateMagazineContent()) {
          return false;
        }
        generateMagazinePreview();
      }
    }

    state.currentStep = stepNumber;
    updateStepDisplay();
    return true;
  }

  // ====================
  // Helper Functions
  // ====================

  // Helper function to show notifications
  function showNotification(message, timeout = 3000) {
    notification.textContent = message;
    notification.style.display = "block";

    setTimeout(() => {
      notification.style.display = "none";
    }, timeout);
  }

  // Helper function to update visual highlighting of selected presets
  function updatePresetSelectionHighlights() {
    // Highlight selected category presets
    document
      .querySelectorAll("#preset-categories .preset-option")
      .forEach((option) => {
        if (state.categories.includes(option.textContent)) {
          option.classList.add("selected");
        } else {
          option.classList.remove("selected");
        }
      });

    // Highlight selected tag presets
    document
      .querySelectorAll("#preset-tags .preset-option")
      .forEach((option) => {
        if (state.tags.includes(option.textContent)) {
          option.classList.add("selected");
        } else {
          option.classList.remove("selected");
        }
      });
  }

  // ====================
  // Initialization Functions
  // ====================

  function initializeApp() {
    // Set up content type selection
    setupContentTypeSelection();
    
    // Render the preset options
    renderPresetOptions();

    // Initialize article statistics
    updateArticleStats();
    
    // Set up magazine form events
    setupMagazineEvents();
  }
  
  function setupContentTypeSelection() {
    // Add event listeners to content type buttons on the first screen
    selectArticleBtn.addEventListener("click", () => {
      document.getElementById("article-type-card").classList.add("selected");
      document.getElementById("magazine-type-card").classList.remove("selected");
      selectContentType('article');
    });
    
    selectMagazineBtn.addEventListener("click", () => {
      document.getElementById("magazine-type-card").classList.add("selected");
      document.getElementById("article-type-card").classList.remove("selected");
      selectContentType('magazine');
    });
    
    // Add hover effects to make selection clearer
    document.getElementById("article-type-card").addEventListener("mouseenter", () => {
      document.getElementById("article-type-card").classList.add("hover-effect");
    });
    
    document.getElementById("article-type-card").addEventListener("mouseleave", () => {
      document.getElementById("article-type-card").classList.remove("hover-effect");
    });
    
    document.getElementById("magazine-type-card").addEventListener("mouseenter", () => {
      document.getElementById("magazine-type-card").classList.add("hover-effect");
    });
    
    document.getElementById("magazine-type-card").addEventListener("mouseleave", () => {
      document.getElementById("magazine-type-card").classList.remove("hover-effect");
    });
    
    // Add event listeners to the header content type buttons
    if (selectArticleTypeBtn) {
      selectArticleTypeBtn.addEventListener("click", () => selectContentType('article'));
    }
    if (selectMagazineTypeBtn) {
      selectMagazineTypeBtn.addEventListener("click", () => selectContentType('magazine'));
    }
    
    // Add data change listeners to update indicators
    titleInput.addEventListener("input", updateDataIndicators);
    magazineTitleInput.addEventListener("input", updateDataIndicators);
  }
  
  function updateDataIndicators() {
    const hasArticleData = titleInput.value.trim() !== '';
    const hasMagazineData = magazineTitleInput.value.trim() !== '';
    
    // Update buttons if they exist
    const articleTypeBtn = document.getElementById("select-article-type");
    const magazineTypeBtn = document.getElementById("select-magazine-type");
    
    if (articleTypeBtn) {
      if (hasArticleData) {
        articleTypeBtn.classList.add("has-data");
      } else {
        articleTypeBtn.classList.remove("has-data");
      }
    }
    
    if (magazineTypeBtn) {
      if (hasMagazineData) {
        magazineTypeBtn.classList.add("has-data");
      } else {
        magazineTypeBtn.classList.remove("has-data");
      }
    }
    
    // Update cards if on selection screen
    const articleCard = document.getElementById("article-type-card");
    const magazineCard = document.getElementById("magazine-type-card");
    
    if (articleCard) {
      if (hasArticleData) {
        articleCard.classList.add("has-data");
      } else {
        articleCard.classList.remove("has-data");
      }
    }
    
    if (magazineCard) {
      if (hasMagazineData) {
        magazineCard.classList.add("has-data");
      } else {
        magazineCard.classList.remove("has-data");
      }
    }
  }
  
  function setupMagazineEvents() {
    // Set up article list functionality
    addArticleBtn.addEventListener("click", addArticle);
    articleInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addArticle();
      }
    });
    
    // Set up issue number change to update slug automatically
    magazineIssueNumber.addEventListener("input", updateMagazineSlug);
    
    // Set up magazine markdown help
    magazineMarkdownHelpBtn.addEventListener("click", toggleMagazineMarkdownHelp);
    
    // Set up magazine content stats
    magazineContent.addEventListener("input", updateMagazineStats);
    magazineContent.addEventListener("paste", () => {
      setTimeout(updateMagazineStats, 10);
    });
    
    // Set up magazine navigation
    magazineNextToContentBtn.addEventListener("click", () => goToStep(2));
    magazineBackToFrontmatterBtn.addEventListener("click", () => goToStep(1));
    magazineNextToPreviewBtn.addEventListener("click", () => goToStep(3));
    magazineBackToContentBtn.addEventListener("click", () => goToStep(2));
    
    // Set up magazine final actions
    magazineCopyToClipboardBtn.addEventListener("click", copyMagazineToClipboard);
    magazineDownloadBtn.addEventListener("click", downloadMagazine);
    magazineEmailToEditorBtn.addEventListener("click", emailMagazineToEditor);
  }

  function renderPresetOptions() {
    const presetCategoriesContainer = document.getElementById("preset-categories");
    const presetTagsContainer = document.getElementById("preset-tags");

    // Render preset categories
    presetCategoriesContainer.innerHTML = "";
    
    // Determine which categories to display
    let displayedCategories = state.presetCategories;
    if (!state.showAllCategories) {
      displayedCategories = state.presetCategories.slice(0, state.initialDisplayCount);
    }
    
    // Create and add the category elements
    displayedCategories.forEach((category) => {
      const element = document.createElement("span");
      element.className = "preset-option";
      element.textContent = category;
      element.addEventListener("click", () => {
        if (!state.categories.includes(category)) {
          state.categories.push(category);
          renderCategories();
        }
      });
      presetCategoriesContainer.appendChild(element);
    });
    
    // Add "Show All" / "Show Less" button for categories
    const showAllCategoriesBtn = document.createElement("button");
    showAllCategoriesBtn.className = "show-all-btn";
    showAllCategoriesBtn.textContent = state.showAllCategories ? "Show Less" : "Show All";
    showAllCategoriesBtn.addEventListener("click", () => {
      state.showAllCategories = !state.showAllCategories;
      renderPresetOptions();
    });
    presetCategoriesContainer.appendChild(showAllCategoriesBtn);

    // Render preset tags
    presetTagsContainer.innerHTML = "";
    
    // Determine which tags to display
    let displayedTags = state.presetTags;
    if (!state.showAllTags) {
      displayedTags = state.presetTags.slice(0, state.initialDisplayCount);
    }
    
    // Create and add the tag elements
    displayedTags.forEach((tag) => {
      const element = document.createElement("span");
      element.className = "preset-option";
      element.textContent = tag;
      element.addEventListener("click", () => {
        if (!state.tags.includes(tag)) {
          state.tags.push(tag);
          renderTags();
        }
      });
      presetTagsContainer.appendChild(element);
    });
    
    // Add "Show All" / "Show Less" button for tags
    const showAllTagsBtn = document.createElement("button");
    showAllTagsBtn.className = "show-all-btn";
    showAllTagsBtn.textContent = state.showAllTags ? "Show Less" : "Show All";
    showAllTagsBtn.addEventListener("click", () => {
      state.showAllTags = !state.showAllTags;
      renderPresetOptions();
    });
    presetTagsContainer.appendChild(showAllTagsBtn);
  }

  // ====================
  // Validation Functions
  // ====================

  function validateFrontMatter() {
    // Check required fields
    const requiredFields = [
      { field: titleInput, name: "Title" },
      { field: document.getElementById("author"), name: "Author" },
      { field: slugInput, name: "Slug" },
      { field: document.getElementById("description"), name: "Description" },
    ];

    for (const { field, name } of requiredFields) {
      if (!field.value.trim()) {
        showNotification(
          `${name} is required. Please fill in this field before continuing.`,
          5000
        );
        field.focus();
        return false;
      }
    }

    return true;
  }

  function validateArticleContent() {
    if (!articleContent.value.trim()) {
      showNotification(
        "Article content is required. Please write some content before continuing.",
        5000
      );
      articleContent.focus();
      return false;
    }
    return true;
  }
  
  function validateMagazineFrontMatter() {
    // Check required fields
    const requiredFields = [
      { field: magazineTitleInput, name: "Title" },
      { field: magazineDate, name: "Date" },
      { field: magazineIssueNumber, name: "Issue Number" },
      { field: magazineSlugInput, name: "Slug" },
      { field: document.getElementById("magazine-description"), name: "Description" },
    ];

    for (const { field, name } of requiredFields) {
      if (!field.value.trim()) {
        showNotification(
          `${name} is required. Please fill in this field before continuing.`,
          5000
        );
        field.focus();
        return false;
      }
    }

    return true;
  }

  function validateMagazineContent() {
    if (!magazineContent.value.trim()) {
      showNotification(
        "Editor's note is required. Please write some content before continuing.",
        5000
      );
      magazineContent.focus();
      return false;
    }
    return true;
  }

  // ====================
  // Front Matter Functions
  // ====================

  function generateSlug() {
    const title = titleInput.value.trim();
    if (!title) {
      alert("Please enter a title first.");
      titleInput.focus();
      return;
    }

    // Convert title to slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .substring(0, 50); // Limit length

    slugInput.value = slug;
  }

  function addCategory() {
    const category = categoryInput.value.trim();
    if (!category) return;

    if (!state.categories.includes(category)) {
      state.categories.push(category);
      renderCategories();
    }

    categoryInput.value = "";
    categoryInput.focus();
  }

  function removeCategory(category) {
    state.categories = state.categories.filter((cat) => cat !== category);
    renderCategories();
  }

  function renderCategories() {
    categoriesList.innerHTML = "";
    state.categories.forEach((category) => {
      const tagElement = document.createElement("div");
      tagElement.className = "tag tag-selected";
      tagElement.innerHTML = `
                <span class="tag-text">${category}</span>
                <span class="tag-remove" data-category="${category}">&times;</span>
            `;
      categoriesList.appendChild(tagElement);
    });

    // Add event listeners to remove buttons
    document.querySelectorAll(".tag-remove[data-category]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const category = e.target.getAttribute("data-category");
        removeCategory(category);
      });
    });

    // Update preset options to show selected state
    updatePresetSelectionHighlights();
  }

  function addTag() {
    const tag = tagInput.value.trim();
    if (!tag) return;

    if (!state.tags.includes(tag)) {
      state.tags.push(tag);
      renderTags();
    }

    tagInput.value = "";
    tagInput.focus();
  }

  function removeTag(tag) {
    state.tags = state.tags.filter((t) => t !== tag);
    renderTags();
  }

  function renderTags() {
    tagsList.innerHTML = "";
    state.tags.forEach((tag) => {
      const tagElement = document.createElement("div");
      tagElement.className = "tag tag-selected";
      tagElement.innerHTML = `
                <span class="tag-text">${tag}</span>
                <span class="tag-remove" data-tag="${tag}">&times;</span>
            `;
      tagsList.appendChild(tagElement);
    });

    // Add event listeners to remove buttons
    document.querySelectorAll(".tag-remove[data-tag]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tag = e.target.getAttribute("data-tag");
        removeTag(tag);
      });
    });

    // Update preset options to show selected state
    updatePresetSelectionHighlights();
  }

  // ====================
  // Autocomplete Functions
  // ====================

  function setupAutocomplete() {
    // Set up category autocomplete
    categoryInput.addEventListener("input", () => {
      const inputValue = categoryInput.value.trim().toLowerCase();

      if (inputValue.length < 1) {
        categoryAutocomplete.classList.remove("active");
        return;
      }

      // Filter suggestions based on input - search through ALL categories regardless of display state
      const suggestions = state.presetCategories.filter(
        (item) =>
          item.toLowerCase().includes(inputValue) &&
          !state.categories.includes(item)
      );

      if (suggestions.length > 0) {
        renderAutocompleteOptions(
          categoryAutocomplete,
          suggestions,
          "category"
        );
        categoryAutocomplete.classList.add("active");
      } else {
        categoryAutocomplete.classList.remove("active");
      }
      
      // If we find matching items that aren't currently displayed, show a hint
      const hiddenMatches = !state.showAllCategories && suggestions.length > 0 && 
                            suggestions.some(item => state.presetCategories.indexOf(item) >= state.initialDisplayCount);
      if (hiddenMatches) {
        // Show all categories if there are matches in the hidden items
        state.showAllCategories = true;
        renderPresetOptions();
      }
    });

    // Set up tag autocomplete
    tagInput.addEventListener("input", () => {
      const inputValue = tagInput.value.trim().toLowerCase();

      if (inputValue.length < 1) {
        tagAutocomplete.classList.remove("active");
        return;
      }

      // Filter suggestions based on input - search through ALL tags regardless of display state
      const suggestions = state.presetTags.filter(
        (item) =>
          item.toLowerCase().includes(inputValue) && !state.tags.includes(item)
      );

      if (suggestions.length > 0) {
        renderAutocompleteOptions(tagAutocomplete, suggestions, "tag");
        tagAutocomplete.classList.add("active");
      } else {
        tagAutocomplete.classList.remove("active");
      }
      
      // If we find matching items that aren't currently displayed, show a hint
      const hiddenMatches = !state.showAllTags && suggestions.length > 0 && 
                            suggestions.some(item => state.presetTags.indexOf(item) >= state.initialDisplayCount);
      if (hiddenMatches) {
        // Show all tags if there are matches in the hidden items
        state.showAllTags = true;
        renderPresetOptions();
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".tag-input-container")) {
        categoryAutocomplete.classList.remove("active");
        tagAutocomplete.classList.remove("active");
      }
    });
  }

  function renderAutocompleteOptions(container, items, type) {
    container.innerHTML = "";

    items.forEach((item) => {
      const element = document.createElement("div");
      element.className = "autocomplete-item";
      element.textContent = item;

      element.addEventListener("click", () => {
        if (type === "category") {
          categoryInput.value = item;
          addCategory();
          categoryAutocomplete.classList.remove("active");
        } else if (type === "tag") {
          tagInput.value = item;
          addTag();
          tagAutocomplete.classList.remove("active");
        }
      });

      container.appendChild(element);
    });
  }

  // ====================
  // Magazine Functions
  // ====================

  function updateMagazineSlug() {
    const issueNumber = magazineIssueNumber.value.trim();
    if (issueNumber) {
      magazineSlugInput.value = `issue-${issueNumber}`;
    } else {
      magazineSlugInput.value = "";
    }
  }

  function addArticle() {
    const article = articleInput.value.trim();
    if (!article) return;

    if (!state.articles.includes(article)) {
      state.articles.push(article);
      renderArticles();
    }

    articleInput.value = "";
    articleInput.focus();
  }

  function removeArticle(article) {
    state.articles = state.articles.filter((a) => a !== article);
    renderArticles();
  }

  function renderArticles() {
    articlesList.innerHTML = "";
    state.articles.forEach((article) => {
      const tagElement = document.createElement("div");
      tagElement.className = "tag tag-selected";
      tagElement.innerHTML = `
        <span class="tag-text">${article}</span>
        <span class="tag-remove" data-article="${article}">&times;</span>
      `;
      articlesList.appendChild(tagElement);
    });

    // Add event listeners to remove buttons
    document.querySelectorAll(".tag-remove[data-article]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const article = e.target.getAttribute("data-article");
        removeArticle(article);
      });
    });
  }

  function toggleMagazineMarkdownHelp() {
    magazineMarkdownHelpContent.classList.toggle("active");
  }

  function updateMagazineStats() {
    const content = magazineContent.value;

    // Count words (excluding shortcodes and empty lines)
    const cleanContent = content
      .replace(/\{\{<\/*.*?\*\/>\}\}/g, "") // Remove Hugo shortcodes
      .replace(/#+\s*/g, "") // Remove heading markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Extract link text only
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold markers
      .replace(/\*([^*]+)\*/g, "$1") // Remove italic markers
      .trim();

    const words =
      cleanContent.length > 0
        ? cleanContent.split(/\s+/).filter((word) => word.length > 0).length
        : 0;

    // Update the display
    magazineWordCount.textContent = words;
  }

  function generateMagazinePreview() {
    // Format date in YYYY-MM-DD format
    let dateStr = magazineDate.value;
    
    // If date is already in correct format, use it, otherwise format it
    if (!dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dateStr = `${year}-${month}-${day}`;
    }

    // Build front matter
    let frontMatter = "---\n";
    frontMatter += `title: "${magazineTitleInput.value.trim()}"\n`;
    frontMatter += `date: ${dateStr}\n`;
    frontMatter += `slug: "${magazineSlugInput.value.trim()}"\n`;
    frontMatter += `description: "${document
      .getElementById("magazine-description")
      .value.trim()}"\n`;
    frontMatter += `issueNumber: ${magazineIssueNumber.value.trim()}\n`;
    
    // Add tagline if present
    const tagline = document.getElementById("magazine-tagline").value.trim();
    if (tagline) {
      frontMatter += `tagline: "${tagline}"\n`;
    }

    // Article List
    frontMatter += "articleList:\n";
    if (state.articles.length > 0) {
      state.articles.forEach((article) => {
        frontMatter += `  - "${article}"\n`;
      });
    } else {
      frontMatter += '  - ""\n';
    }

    // Featured image
    const image = document.getElementById("magazine-image").value.trim();
    if (image) {
      frontMatter += `image: "${image}"\n`;
    }

    // Close front matter
    frontMatter += "---\n\n";

    // Combine with magazine content
    const fullMarkdown = frontMatter + magazineContent.value;

    // Update preview
    magazineMarkdownPreview.textContent = fullMarkdown;
  }

  function copyMagazineToClipboard() {
    const content = magazineMarkdownPreview.textContent;
    navigator.clipboard
      .writeText(content)
      .then(() => {
        showNotification("Magazine issue copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        showNotification(
          "Failed to copy to clipboard. Please try again.",
          5000
        );
      });
  }

  function downloadMagazine() {
    const content = magazineMarkdownPreview.textContent;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    // Generate filename from slug
    const slug = magazineSlugInput.value.trim();
    const filename = slug ? `${slug}.md` : "magazine-issue.md";

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification("Magazine issue downloaded successfully!");
    }, 100);
  }

  function emailMagazineToEditor() {
    const content = magazineMarkdownPreview.textContent;
    const title = magazineTitleInput.value.trim();
    const issueNumber = magazineIssueNumber.value.trim();

    // Create email link with content
    const emailAddress = "ariana.yekrangi@un-aligned.org";
    const subject = `New Gordian Magazine Issue: ${title} (Issue ${issueNumber})`;
    const body = encodeURIComponent(content);

    // Create and open mailto link
    const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;

    // Check if the encoded URI might be too long for some email clients
    if (mailtoLink.length > 2000) {
      showNotification(
        'The magazine issue may be too long to send via email link. Consider using the "Copy to Clipboard" button instead and pasting into your email client.',
        8000
      );
    }

    // Open the email client
    window.location.href = mailtoLink;

    showNotification("Opening email client...");
  }

  // ====================
  // Article Content Functions
  // ====================

  function updateArticleStats() {
    const content = articleContent.value;

    // Count words (excluding shortcodes and empty lines)
    const cleanContent = content
      .replace(/\{\{<\/*.*?\*\/>\}\}/g, "") // Remove Hugo shortcodes
      .replace(/#+\s*/g, "") // Remove heading markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Extract link text only
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold markers
      .replace(/\*([^*]+)\*/g, "$1") // Remove italic markers
      .trim();

    const words =
      cleanContent.length > 0
        ? cleanContent.split(/\s+/).filter((word) => word.length > 0).length
        : 0;

    // Count headings (lines starting with #)
    const headings = (content.match(/^#{1,6}\s+.+$/gm) || []).length;

    // Count embedded links [text](url)
    const links = (content.match(/\[([^\]]+)\]\([^)]+\)/g) || []).length;

    // Update the display
    wordCountElement.textContent = words;
    headingCountElement.textContent = headings;
    linkCountElement.textContent = links;
  }

  function toggleMarkdownHelp() {
    markdownHelpContent.classList.toggle("active");
  }

  function openPhotoModal(type) {
    state.photoType = type;

    // Set modal title based on photo type
    const typeTitles = {
      normal: "Insert Normal Photo",
      large: "Insert Large Photo",
      xlarge: "Insert X-Large Photo",
      custom: "Insert Custom Photo",
    };

    modalTitle.textContent = typeTitles[type] || "Insert Photo";

    // Show/hide custom width field
    if (type === "custom") {
      customWidthGroup.style.display = "block";
    } else {
      customWidthGroup.style.display = "none";
    }

    // Clear previous values
    photoSrc.value = "";
    photoCaption.value = "";
    photoWidth.value = "40";

    // Show modal
    photoModal.style.display = "block";
  }

  function closePhotoModal() {
    photoModal.style.display = "none";
  }

  function insertPhotoShortcode() {
    const src = photoSrc.value.trim();
    const caption = photoCaption.value.trim();

    if (!src) {
      alert("Image path is required. Please enter a valid path.");
      photoSrc.focus();
      return;
    }

    let shortcode = "";

    switch (state.photoType) {
      case "normal":
        shortcode = `{{</* photo-normal src="${src}" caption="${caption}" */>}}`;
        break;
      case "large":
        shortcode = `{{</* photo-large src="${src}" caption="${caption}" */>}}`;
        break;
      case "xlarge":
        shortcode = `{{</* photo-xlarge src="${src}" caption="${caption}" */>}}`;
        break;
      case "custom":
        const width = photoWidth.value.trim() || "40";
        shortcode = `{{</* photo-custom src="${src}" caption="${caption}" width="${width}" */>}}`;
        break;
      default:
        shortcode = `{{</* photo-normal src="${src}" caption="${caption}" */>}}`;
    }

    // Insert at cursor position or append to end
    const textarea = articleContent;

    // Get cursor position or default to end
    let position = textarea.selectionStart;
    if (position === undefined) position = textarea.value.length;

    const before = textarea.value.substring(0, position);
    const after = textarea.value.substring(position);

    // Add a newline if not at beginning
    const prefix = position > 0 && !before.endsWith("\n\n") ? "\n\n" : "";
    const suffix = !after.startsWith("\n\n") ? "\n\n" : "";

    textarea.value = before + prefix + shortcode + suffix + after;

    // Close modal
    closePhotoModal();

    // Focus back to textarea and place cursor after inserted shortcode
    textarea.focus();
    const newPosition =
      position + prefix.length + shortcode.length + suffix.length;
    textarea.selectionStart = newPosition;
    textarea.selectionEnd = newPosition;

    // Update article statistics
    updateArticleStats();
  }

  // ====================
  // Preview & Generation Functions
  // ====================

  function generatePreview() {
    // Get current date in ISO format
    const now = new Date();
    const isoDate = now.toISOString().replace(/\.\d+Z$/, "+0000");

    // Build front matter
    let frontMatter = "---\n";
    frontMatter += `title: "${titleInput.value.trim()}"\n`;
    frontMatter += `date: ${isoDate}\n`;
    frontMatter += `author: "${document
      .getElementById("author")
      .value.trim()}"\n`;
    frontMatter += `slug: "${slugInput.value.trim()}"\n`;
    frontMatter += `description: "${document
      .getElementById("description")
      .value.trim()}"\n`;

    // Categories
    frontMatter += "categories:\n";
    if (state.categories.length > 0) {
      state.categories.forEach((category) => {
        frontMatter += `- "${category}"\n`;
      });
    } else {
      frontMatter += '- ""\n';
    }

    // Tags
    frontMatter += "tags:\n";
    if (state.tags.length > 0) {
      state.tags.forEach((tag) => {
        frontMatter += `- "${tag}"\n`;
      });
    } else {
      frontMatter += '- ""\n';
    }

    // Featured image
    const image = document.getElementById("image").value.trim();
    frontMatter += `image: "${image}"\n`;

    // Style
    const styleValue = document.querySelector(
      'input[name="style"]:checked'
    ).value;
    frontMatter += `style: "${styleValue}"\n`;

    // Close front matter
    frontMatter += "---\n\n";

    // Combine with article content
    const fullMarkdown = frontMatter + articleContent.value;

    // Update preview
    markdownPreview.textContent = fullMarkdown;
  }

  function copyToClipboard() {
    const content = markdownPreview.textContent;
    navigator.clipboard
      .writeText(content)
      .then(() => {
        showNotification("Article copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        showNotification(
          "Failed to copy to clipboard. Please try again.",
          5000
        );
      });
  }

  function downloadArticle() {
    const content = markdownPreview.textContent;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    // Generate filename from title
    const title = titleInput.value.trim();
    let filename = "article.md"; // fallback filename

    if (title) {
      // Convert title to filename format
      const cleanTitle = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
        .substring(0, 50); // Limit length

      filename = cleanTitle ? `${cleanTitle}.md` : "article.md";
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification("Article downloaded successfully!");
    }, 100);
  }

  function emailToEditor() {
    const content = markdownPreview.textContent;
    const title = titleInput.value.trim();

    // Create email link with content
    const emailAddress = "ariana.yekrangi@un-aligned.org";
    const subject = `New pitch: ${title}`;
    const body = encodeURIComponent(content);

    // Create and open mailto link
    const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;

    // Check if the encoded URI might be too long for some email clients
    if (mailtoLink.length > 2000) {
      showNotification(
        'The article may be too long to send via email link. Consider using the "Copy to Clipboard" button instead and pasting into your email client.',
        8000
      );
    }

    // Open the email client
    window.location.href = mailtoLink;

    showNotification("Opening email client...");
  }

  // ====================
  // Event Listeners
  // ====================

  // Front Matter
  generateSlugBtn.addEventListener("click", generateSlug);
  addCategoryBtn.addEventListener("click", addCategory);
  categoryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCategory();
    }
  });

  addTagBtn.addEventListener("click", addTag);
  tagInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  });

  // Markdown Help
  markdownHelpBtn.addEventListener("click", toggleMarkdownHelp);

  // Article Statistics - Update on content change
  articleContent.addEventListener("input", updateArticleStats);
  articleContent.addEventListener("paste", () => {
    // Use setTimeout to allow paste content to be processed
    setTimeout(updateArticleStats, 10);
  });

  // Photo Shortcode
  insertShortcodeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      openPhotoModal(btn.dataset.type);
    });
  });

  closeModal.addEventListener("click", closePhotoModal);
  window.addEventListener("click", (e) => {
    if (e.target === photoModal) {
      closePhotoModal();
    }
  });

  insertPhotoBtn.addEventListener("click", insertPhotoShortcode);

  // Navigation
  nextToContentBtn.addEventListener("click", () => goToStep(2));
  backToFrontmatterBtn.addEventListener("click", () => goToStep(1));
  nextToPreviewBtn.addEventListener("click", () => goToStep(3));
  backToContentBtn.addEventListener("click", () => goToStep(2));

  // Final Actions
  copyToClipboardBtn.addEventListener("click", copyToClipboard);
  downloadArticleBtn.addEventListener("click", downloadArticle);
  emailToEditorBtn.addEventListener("click", emailToEditor);

  // Initialize the app
  initializeApp();
  
  // Display the content type selection screen initially
  contentTypeSelection.classList.add("active");
});
