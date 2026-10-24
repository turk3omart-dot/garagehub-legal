# GarageHub website

The public website for the GarageHub iPhone app: a homepage, a Privacy Policy and a Support page, in Arabic and English. It's plain HTML, CSS and a little JavaScript, so it runs free on GitHub Pages with no server, database, cookies or analytics.

| Page | Address after publishing |
|---|---|
| Homepage | `https://USERNAME.github.io/garagehub-legal/` |
| Privacy Policy | `https://USERNAME.github.io/garagehub-legal/privacy/` |
| Support | `https://USERNAME.github.io/garagehub-legal/support/` |

`USERNAME` is your GitHub username. If you name the repository something other than `garagehub-legal`, that name replaces it in the addresses. Every link inside the site is relative, so it works under any repository name.

## Files

```
garagehub-legal/
├── index.html            Homepage
├── privacy/index.html    Privacy Policy  (clean URL: /privacy/)
├── support/index.html    Support         (clean URL: /support/)
├── 404.html              Shown for any missing page
├── .nojekyll             Tells GitHub Pages to serve the files as they are
├── assets/
│   ├── site.css          All styles (colors from the app's Theme.swift)
│   ├── site.js           Language switch, gentle animations, draft warning
│   └── img/              Logo, wordmark, app icon, favicon, a real app screen
└── tools/fill-details.py Fills in your email, name and date, then checks
```

Each page holds both languages. The site picks Arabic or English from the visitor's device language, and the عربي / EN switch at the top changes it (the choice is remembered in that browser). Adding `?lang=ar` or `?lang=en` to an address forces a language.

## 1. Fill in your details (required)

Three details aren't in the app project, so the pages show them as `{{SUPPORT_EMAIL}}`, `{{DEVELOPER_NAME}}` and `{{EFFECTIVE_DATE_…}}`. While any remain, every page shows a yellow **Draft** banner and highlights them, so a placeholder can't slip through unnoticed.

In Terminal:

```bash
cd ~/Desktop/"Car app"/garagehub-legal
```

```bash
python3 tools/fill-details.py
```

It asks for the support email, the developer name to show publicly (your name, or your registered business name if you have one, written exactly as on your Apple Developer account) and the effective date. It fills both languages and finishes with "All details are filled in" only when nothing is left. Run `python3 tools/fill-details.py --check` at any time to check again.

Open `index.html` in Safari afterwards: the yellow banner should be gone.

## 2. Create a free GitHub repository

1. Go to [github.com/signup](https://github.com/signup) and create a free account (skip if you have one). Your username becomes part of the web address.
2. Click **+** (top right), then **New repository**.
3. **Repository name:** `garagehub-legal`
4. Choose **Public**. GitHub Pages is free only for public repositories, and everything in this folder is meant to be public anyway.
5. Leave "Add a README" unticked, then click **Create repository**.

## 3. Upload the website files

1. On the new repository's page, click **uploading an existing file** (or **Add file**, then **Upload files**).
2. In Finder, open the `garagehub-legal` folder, select **everything inside it** (`index.html`, `privacy`, `support`, `assets`, `tools`, `404.html`, `README.md`) and drag it onto the GitHub page. Drag the contents, not the `garagehub-legal` folder itself, so `index.html` ends up at the top level of the repository.
3. Wait until every file is listed, then click **Commit changes**.
4. Check the repository's file list shows `index.html`, `privacy/`, `support/` and `assets/` at the top level.

`.nojekyll` is a hidden file and Finder may not drag it. The site works without it; to add it anyway, click **Add file**, **Create new file**, name it `.nojekyll`, leave it empty and commit.

## 4. Turn on GitHub Pages

1. In the repository, open **Settings**, then **Pages** (left sidebar).
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Set **Branch** to **main** and the folder to **/ (root)**, then click **Save**.
4. Wait one to three minutes. The **Actions** tab shows a "pages build and deployment" run; when it has a green tick, the site is live.

## 5. Find your live addresses

Back in **Settings, Pages**, the top of the page says "Your site is live at `https://USERNAME.github.io/garagehub-legal/`". Add `privacy/` and `support/` to it for the other two pages.

## 6. Test without signing in

1. Open a **Private** window in Safari (File, New Private Window), where you aren't signed in to GitHub.
2. Open each address: the homepage, `…/privacy/` and `…/support/`. Each must load with no login, no yellow Draft banner, and the right email and date.
3. Tap **عربي** and **EN** on each page to check both languages.
4. Open them on your iPhone too (cellular, not just Wi‑Fi, if you can).
5. Tap the support email link and check it opens Mail with your address.

## 7. Paste the addresses into App Store Connect

In [App Store Connect](https://appstoreconnect.apple.com), open **Apps**, then **GarageHub**:

| Field | Where | Paste |
|---|---|---|
| **Privacy Policy URL** (required) | Left sidebar, **App Privacy**, then **Edit** next to Privacy Policy | `https://USERNAME.github.io/garagehub-legal/privacy/` |
| **Support URL** (required) | **App Store** tab, your iOS version page, **Support URL** field (under the description) | `https://USERNAME.github.io/garagehub-legal/support/` |
| **Marketing URL** (optional) | Same version page, **Marketing URL** | `https://USERNAME.github.io/garagehub-legal/` |

If you add both Arabic and English listings, these fields appear for each language. Use the same addresses for both; the pages already contain both languages.

Apple's layout changes from time to time. If a field isn't where the table says, use the search in [App Store Connect Help](https://developer.apple.com/help/app-store-connect/) for "privacy policy URL" or "support URL".

## 8. Link the privacy policy inside the app (required by App Review)

App Review guideline 5.1.1(i) asks for the privacy policy to be reachable **inside the app** as well. GarageHub is already built for this: the Help and questions screen (Settings, Help and questions) shows "Privacy policy" and "Support" links as soon as the addresses are set, and hides them until then. In Xcode, open `GarageBuddy/Services/DataEraser.swift` and replace:

```swift
enum AppLinks {
    static let privacyPolicy: URL? = nil
    static let support: URL? = nil
}
```

with (using your real username):

```swift
enum AppLinks {
    static let privacyPolicy = URL(string: "https://USERNAME.github.io/garagehub-legal/privacy/")
    static let support = URL(string: "https://USERNAME.github.io/garagehub-legal/support/")
}
```

Build, open Settings, Help and questions, and tap both links to check them before archiving.

## 9. Update the site later (free)

- **Small text change:** on github.com, open the file (for example `privacy/index.html`), click the pencil icon, edit, then **Commit changes**. The live site updates in a minute or two.
- **Several files:** **Add file**, **Upload files**, and drag the changed files into the same folders; files with the same name are replaced.
- **When the app's data use changes** (a new permission, a new Apple service, any third-party SDK, analytics, accounts), update the Privacy Policy *before* releasing that app version, run `fill-details.py` again only if you reset the date fields, and update the effective date. Also update your App Privacy answers in App Store Connect.
- Browsers may keep the old style sheet for up to about 10 minutes after an update; a refresh fixes it.

GitHub Pages, public repositories and these updates cost nothing.

## What the pages say, and where it comes from

The Privacy Policy and Support content was written from the app's code on branch `cloudkit-readiness` (24 October 2026), not from assumptions:

- Data models: `GarageBuddy/Models/Models.swift` (Car, OilChange, MileageLog, Issue, Trip, Reminder). There is no expense, cost-tracking, plate or VIN field.
- Storage and sync: `Services/DataStore.swift` (SwiftData with the CloudKit **private** database, or local only), `Content/RemoteContentStore.swift` (CloudKit **public** database, read only), `Services/SyncMonitor.swift` (one-way hash of the CloudKit user ID, kept on device).
- Permissions: `project.pbxproj` usage strings (location when in use, location always, motion), `Services/TripTracker.swift` (no route stored, trips under 500 m dropped), `Services/NotificationService.swift` (local notifications only).
- Maps: `Features/Shops/ShopFinder.swift` (MapKit local search). AI: `Features/Diagnosis/DiagnosisService.swift` (on-device Foundation Models, built-in guide fallback).
- Deletion: `Services/DataEraser.swift`. No accounts: `Services/WelcomeState.swift` (Sign in with Apple removed).
- No third-party packages, analytics or tracking: no Swift packages in the project; `PrivacyInfo.xcprivacy` declares no collected data and no tracking.

If you change any of these, re-read the Privacy Policy against the change.
