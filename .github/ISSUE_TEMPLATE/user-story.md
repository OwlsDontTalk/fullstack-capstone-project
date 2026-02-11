# User Stories

> Labels referenced below: `new`, `icebox`, `technical debt`, `backlog`

## Story 1 — Label: `new`
- **Title:** Allow guests to browse public gift listings
- **As a** guest user browsing the site
- **I want** to view available gift listings without logging in
- **So that** I can decide whether I should create an account
- **Acceptance Criteria:**
  - The landing page shows a paginated list of public gifts
  - Each card displays name, category, condition, and thumbnail
  - Clicking a card prompts sign-up/login to view full details

## Story 2 — Label: `new`
- **Title:** Enable authenticated users to publish new gifts
- **As a** registered giver
- **I want** to create a gift listing with photos and description
- **So that** others can discover items I am offering
- **Acceptance Criteria:**
  - Form collects title, description, category, condition, age, and upload
  - Required fields prevent submission when empty
  - Successful submission confirms and adds the gift to the catalog

## Story 3 — Label: `icebox`
- **Title:** Save favorite gifts for later
- **As a** registered seeker
- **I want** to bookmark gifts I like
- **So that** I can review them later without searching again
- **Acceptance Criteria:**
  - Each gift card shows a bookmark toggle when logged in
  - Favorites list is accessible from the profile menu
  - Removing a bookmark updates the list in real time

## Story 4 — Label: `icebox`
- **Title:** Suggest gifts based on interests
- **As a** returning seeker
- **I want** personalized recommendations
- **So that** I quickly find gifts matching my preferences
- **Acceptance Criteria:**
  - Preferences are captured via optional onboarding survey
  - Recommendations refresh when new gifts are added
  - Users can dismiss a recommendation to improve future results

## Story 5 — Label: `technical debt`
- **Title:** Refactor MongoDB connection handling
- **As a** developer maintaining the backend
- **I want** a shared, resilient MongoDB connection utility
- **So that** we avoid duplicate connections and improve reliability
- **Acceptance Criteria:**
  - Single reusable module exports connection instance with caching
  - Handles reconnection logic when topology drops
  - Includes unit tests covering success and failure scenarios

## Story 6 — Label: `technical debt`
- **Title:** Upgrade frontend state management for authentication
- **As a** frontend engineer
- **I want** to centralize auth/token logic in context
- **So that** all components react consistently to login/logout events
- **Acceptance Criteria:**
  - Auth context persists token, user name, and email across reloads
  - Logout clears sensitive data and redirects appropriately
  - Existing pages consume the context instead of duplicating logic

## Story 7 — Label: `backlog`
- **Title:** Add in-app messaging between givers and seekers
- **As a** seeker interested in an item
- **I want** to contact the giver without leaving the platform
- **So that** I can arrange pickup securely
- **Acceptance Criteria:**
  - Conversation thread is tied to a specific gift
  - Messages trigger email/push notifications
  - Users can report or block abusive conversations

## Story 8 — Label: `backlog`
- **Title:** Provide analytics dashboard for admins
- **As a** platform administrator
- **I want** to monitor key engagement metrics
- **So that** I can track growth and identify issues early
- **Acceptance Criteria:**
  - Dashboard shows daily active users, gifts posted, and successful matches
  - Supports date range filtering and CSV export
  - Access restricted to admin accounts only
