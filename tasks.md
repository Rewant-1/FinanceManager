

**App Name:** "Couple's Expense Hub"

**Core Purpose:**
Build a simple finance-tracking website with two modes: a **Personal Mode** for individual expense tracking and a **Couple Mode** where two linked users can track both shared and personal expenses.

---

### **Key Features & Pages:**

**1. User Accounts & Modes:**
* Users must be able to sign up and log in.
* **Default Mode:** Every user starts in **Personal Mode**. They can only add and see their own private expenses.
* **Couple Mode (Activation):** A user must be able to "invite" a partner (e.g., via email or a unique code). Once the partner accepts, their accounts are linked, and they both enter **Couple Mode**.

**2. Add Transaction (Core Function):**
Create a form (or pop-up) to add a new transaction with the following fields:
* **Amount:** (Number)
* **Description:** (Text)
* **Date:** (Date Picker)
* **Category:** (A dropdown list. See Feature #3)

**3. Custom Categories:**
* Create a simple **"Categories" settings page**.
* On this page, a user can **add**, **delete**, or **rename** their own expense categories (e.g., "Rent," "Groceries," "Date Night," "Coffee").
* These custom categories must appear in the "Category" dropdown when adding a new transaction.

**4. "Couple Mode" - Special Fields:**
When a user is in **Couple Mode**, the "Add Transaction" form must have **two additional fields**:
1.  **Expense Type (Toggle):**
    * **"Personal"** (This is *my* personal expense, not shared. My partner should not see this in the shared total).
    * **"Shared"** (This is a shared expense for the couple).
2.  **If "Shared" is selected, show this field:**
    * **"Who Paid?":** (Dropdown)
        * [My Name]
        * [Partner's Name]
        * "Split 50/50" (if we paid from a joint account or want to track it as evenly split)

**5. The Dashboard (Main Page):**
This is the main page users see after logging in. It should show:

* **A List of Transactions:** A running list of all transactions, with the most recent at the top.
* **The "Filter" (Your Key Requirement):** A dropdown or buttons to filter the transaction list.
    * **If in Personal Mode:** Filter by "Category" or "Date Range."
    * **If in Couple Mode:** The filter MUST have these options:
        1.  **View: All** (Show my personal expenses + all shared expenses)
        2.  **View: Shared Only** (Show *only* the shared expenses)
        3.  **View: My Personal Only** (Show *only* my personal expenses)

**6. (Enhancement) Simple "Who Owes Who" Summary:**
* **For Couple Mode Only:** On the dashboard, show a simple summary box.
* **Logic:**
    * Calculate the total shared expenses.
    * Calculate how much each person contributed (based on the "Who Paid" field).
    * Display a simple message like: "**[User 1's Name] owes [User 2's Name] $XX.XX**" to make things even.
* **"Settle Up" Button:** A button that, when clicked, resets this balance to $0 (and ideally archives the settled transactions).

---

### **Summary of Pages to Create:**

1.  **Login/Sign Up Page:** For user authentication.
2.  **Dashboard Page:** The main view with the transaction list, filters, and the "Who Owes Who" summary (for couples).
3.  **"Add Transaction" Form:** (This can be a pop-up/modal on the Dashboard).
4.  **Categories Page:** (A settings page to manage custom categories).
5.  **Profile/Settings Page:** A simple page to show user info and the "Invite Partner" button.

---

### Implementation Roadmap

#### Phase 0 – Discovery & UX Definition

* **Step 0.1 – Align on user journeys**
    * Task: Sketch quick flows for sign up, switching modes, adding transactions, and settling balances.
    * Task: List minimum UI components for each page (forms, tables, summaries).
* **Step 0.2 – Data model outline**
    * Task: Define entities (User, PartnerLink, Category, Transaction, Settlement) and their core fields.
    * Task: Map Personal vs Couple mode data ownership rules (visibility, permissions).

#### Phase 1 – Project Foundations

* **Step 1.1 – Environment & tooling**
    * Task: Audit `package.json` for needed dependencies (auth, database client, UI kit) and install the minimal set.
    * Task: Configure ESLint, Prettier, TypeScript paths, and commit base config.
* **Step 1.2 – Authentication scaffold**
    * Task: Pick auth provider (NextAuth, Supabase auth, etc.) and wire basic email/password flow.
    * Task: Create protected route layout and redirect logic for unauthenticated users.

#### Phase 2 – Personal Mode MVP

* **Step 2.1 – Data layer setup**
    * Task: Configure database access (Prisma schema or direct client) for users, categories, and transactions.
    * Task: Seed default categories for new users.
* **Step 2.2 – Personal dashboard basics**
    * Task: Implement personal transaction creation form with amount, description, date, and category.
    * Task: Render personal transaction list with category and date range filters.
* **Step 2.3 – Categories management**
    * Task: Build categories settings page (CRUD for user-scoped categories).
    * Task: Ensure category updates propagate to forms without reload.

#### Phase 3 – Couple Mode Enablement

* **Step 3.1 – Partner linking flow**
    * Task: Implement invite-by-email or code generation, including acceptance handling.
    * Task: Persist a `PartnerLink` record and expose couple mode status in the UI.
* **Step 3.2 – Couple transaction fields**
    * Task: Extend transaction form with expense type toggle and conditional "Who Paid" selector.
    * Task: Update storage logic to capture payer, split type, and visibility rules.
* **Step 3.3 – Couple filters**
    * Task: Add shared/personal filter controls on the dashboard for linked users.
    * Task: Ensure personal expenses remain private while shared expenses sync for both partners.

#### Phase 4 – Shared Insights & Settlements

* **Step 4.1 – "Who owes who" summary**
    * Task: Calculate shared expense totals per user and derive the net balance.
    * Task: Surface summary card on dashboard with owed amount messaging.
* **Step 4.2 – Settle up workflow**
    * Task: Add "Settle Up" action that archives or marks included transactions and resets balance.
    * Task: Log settlements for historical reference (optional table or tag on transactions).

#### Phase 5 – Polish & Must-Haves

* **Step 5.1 – UX refinement**
    * Task: Add responsive layout tweaks, primary/secondary button hierarchy, and empty states.
    * Task: Provide inline feedback (toasts or banners) for form success/failure.
* **Step 5.2 – Quality & maintenance**
    * Task: Add unit tests for helpers (filters, balance calculation) and integration tests for key flows.
    * Task: Document setup steps, environment variables, and deploy checklist in `README.md`.

---

### Future Enhancements (Post-MVP Must-Haves)

* Shared budget targets with progress indicators per category.
* Recurring transactions with reminders for bills or subscriptions.
* CSV export/import for historical data migration.
* Simple analytics view (monthly spend trends, top categories).
* Mobile-friendly quick add (PWA shortcut or share target).
