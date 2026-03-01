# Article Submission System

A lightweight, open-source content submission system that allows contributors from anywhere in the world to submit articles without needing technical knowledge, Git, or repository access.

## Overview

This system extends an existing Hugo static site by providing:

- **Web-based submission interface** - Contributors fill out a form like any publishing platform
- **Automatic markdown generation** - Content is formatted with correct Hugo front matter
- **GitHub-based workflow** - Submissions become GitHub issues, providing transparency and version control
- **Automated processing** - GitHub Actions convert approved submissions to Pull Requests
- **Editorial control** - Editors review submissions before publication

## Architecture

```
┌─────────────────────┐     ┌──────────────────────┐
│   Submission Form   │────▶│   GitHub Issue       │
│   (Static HTML/JS)  │     │   (Pending Review)   │
└─────────────────────┘     └──────────────────────┘
                                      │
                            ┌─────────▼─────────┐
                            │  Editor Reviews   │
                            │  Adds Label       │
                            └─────────┬─────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                                   ▼
        ┌───────────────────┐               ┌───────────────────┐
        │ submission:approved│               │ submission:rejected│
        └─────────┬─────────┘               └─────────┬─────────┘
                  │                                   │
        ┌─────────▼─────────┐               ┌─────────▼─────────┐
        │ GitHub Action     │               │ Auto-close issue  │
        │ Creates PR        │               │ with message      │
        └─────────┬─────────┘               └───────────────────┘
                  │
        ┌─────────▼─────────┐
        │ Editor merges PR  │
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │ Cloudflare builds │
        │ & deploys site    │
        └───────────────────┘
```

## Features

### For Contributors
- Simple form interface that feels like submitting to any publication
- Real-time markdown preview
- Two submission modes:
  - **General Articles** - Standard posts with title, author, content
  - **Essentials Stories** - Weekly essentials with quotes and quizzes

### For Editors
- Submissions appear as GitHub issues for easy review
- Label-based workflow (`submission:approved` / `submission:rejected`)
- Automatic PR creation from approved submissions
- Full Git history and version control
- Transparent, auditable process

## Setup Instructions

### 1. Repository Setup

Create the required labels in your GitHub repository:

```bash
# Using GitHub CLI
gh label create "submission:pending" --color "FEF2C0" --description "Awaiting editorial review"
gh label create "submission:approved" --color "0E8A16" --description "Approved for publication"
gh label create "submission:rejected" --color "D73A4A" --description "Not accepted"
gh label create "submission:processing" --color "0052CC" --description "PR being created"
gh label create "type:article" --color "C5DEF5" --description "General article submission"
gh label create "type:essentials" --color "E4E669" --description "Essentials story submission"
```

### 2. Configure the Submission Form

Edit `app.js` and update the `GITHUB_CONFIG` object:

```javascript
const GITHUB_CONFIG = {
  owner: "your-username",        // GitHub username or org
  repo: "your-hugo-repo",        // Repository name
  contentPaths: {
    general: "content/posts",    // Hugo content path for articles
    essentials: "content/essentials",
  },
  labels: {
    pending: "submission:pending",
    general: "type:article",
    essentials: "type:essentials",
  },
};
```

### 3. Deploy GitHub Actions Workflow

Copy `.github/workflows/process-submission.yml` to your Hugo site repository.

The workflow requires these permissions (already configured):
- `contents: write` - To create branches and commit files
- `pull-requests: write` - To create PRs
- `issues: write` - To comment on and label issues

## How It Works

### Submission Flow

1. **Contributor visits the submission page**
   - Fills out the multi-step form
   - Reviews generated markdown
   - Clicks "Submit"

2. **Submission is created**
   - Opens pre-filled GitHub issue creation page

3. **Issue appears in repository**
   - Labeled with `submission:pending`
   - Contains all article metadata and content
   - Editors receive notification

4. **Editor reviews submission**
   - Reads content in the issue
   - Adds `submission:approved` or `submission:rejected` label

5. **Automatic processing**
   - Approved: GitHub Action creates branch and PR
   - Rejected: Issue is closed with feedback

6. **Publication**
   - Editor reviews and merges PR
   - Cloudflare rebuilds site automatically

### Content Structure

Submitted articles are formatted as Hugo-compatible markdown:

```markdown
---
title: "Article Title"
date: 2026-02-28T12:00:00+0300
authors: ["Author Name"]
slug: "article-slug"
description: "Article summary"
categories:
  - "Category"
tags:
  - "Tag"
image: ""
imageCaption: "Graphic: Ariana Yekrangi"
style: "1"
---

Article content here...
```

## File Structure

```
article-submission-site/
├── index.html              # Main submission form
├── app.js                  # Form logic and GitHub integration
├── styles.css              # Styling
├── .github/
│   └── workflows/
│       └── process-submission.yml  # GitHub Actions workflow
└── README.md               # This file
```

## Configuration Options

### GitHub Config (`app.js`)

| Option | Description |
|--------|-------------|
| `owner` | GitHub username or organization |
| `repo` | Repository name |
| `contentPaths.general` | Hugo path for regular articles |
| `contentPaths.essentials` | Hugo path for essentials stories |
| `labels.pending` | Label for new submissions |
| `labels.general` | Label for article type |
| `labels.essentials` | Label for essentials type |

## Security Considerations

1. **Content Validation**: All submissions require editorial review before publication

## Troubleshooting

### Issue not being processed

1. Check that the `submission:approved` label was added
2. Verify GitHub Actions is enabled on the repository
3. Check the Actions tab for workflow run errors

### PR creation failing

1. Ensure the branch doesn't already exist
2. Check the content path exists in the repository
3. Verify the markdown block in the issue is properly formatted

## Contributing

This project is open source. Contributions are welcome!

## License

MIT License - See LICENSE file for details.
