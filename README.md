

# 🌥️ Cloud Notes App

**A modern cloud-based note-taking web app with Firebase Authentication, Firestore storage, tags, colors, search, and dark mode.**

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-blue" />
  <img src="https://img.shields.io/badge/Backend-Firebase-orange" />
  <img src="https://img.shields.io/badge/Database-Firestore-yellow" />
  <img src="https://img.shields.io/badge/Status-Completed-brightgreen" />
</p>

---

## 🚀 Live Demo

👉 **Coming soon** (GitHub Pages / Firebase Hosting)
(Ask me if you want to deploy it—I will guide you.)

---

## ✨ Features

### 🔐 **Authentication**

* Firebase login & signup
* Each user has **private notes**

### 📝 **Notes Management**

* Create, edit, delete notes
* Notes stored in Firestore
* Cloud-synced across devices
* Instant UI updates

### 🎨 **Note Colors**

* 5 pastel theme colors
* Notes stay colorful even in dark mode

### 🏷️ **Tags System**

* Add multiple tags (comma-separated)
* Tags shown as badges
* Tags included in search

### 🔍 **Smart Search**

Search notes by:

* Title
* Content
* Tags

### 🌙 **Dark Mode**

* Fully themed dark interface
* Preserves colorful notes
* Toggle switch in navbar

### ⏱️ **Timestamps**

* Created time
* Last updated time

### 💾 **Cloud Database**

* Secure Firestore rules
* Each note linked to the authenticated user

---

## 🛠️ Tech Stack

| Layer        | Technology                                 |
| ------------ | ------------------------------------------ |
| **Frontend** | HTML, CSS, JavaScript, Bootstrap 5         |
| **Backend**  | Firebase Auth, Firestore                   |
| **Hosting**  | GitHub Pages / Firebase Hosting (optional) |
| **Tools**    | Git, GitHub, VS Code                       |

---

## 📸 Screenshots

### 🔆 Light Mode

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c9f96972-ebe6-497d-ba0c-85c7058f12e3" />


### 🌙 Dark Mode

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/54693171-9984-4055-be18-8d9c65a0c2ef" />


---

## 📁 Folder Structure

```
cloud-notes-app/
│
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js
│   └── firebase-config.js
│
├── index.html
├── notes.html
└── README.md
```

---

## 🔧 How to Run the Project Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/cloud-notes-app.git
```

### 2️⃣ Open folder

```
cd cloud-notes-app
```

### 3️⃣ Configure Firebase

Open:

```
js/firebase-config.js
```

Fill in your Firebase credentials.

### 4️⃣ Start app

Simply open:

* `index.html` → login page
* `notes.html` → main app page

No server needed (pure frontend).

---

## 🔒 Firestore Security Rules (IMPORTANT)

These are the secure rules used in this app:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /notes/{noteId} {
      allow create: if request.auth != null &&
                     request.auth.uid == request.resource.data.userId;

      allow read, update, delete: if request.auth != null &&
                                  request.auth.uid == resource.data.userId;
    }
  }
}
```

✔ Protects database
✔ Only the owner can access their notes


## 🚀 Deployment (Optional)

### ★ GitHub Pages

You can host this static app directly on GitHub Pages.

### ★ Firebase Hosting

Professional hosting with CDN & HTTPS.
Ask me and I’ll guide you through it.



## 📌 Future Enhancements

* ⭐ Pin important notes
* 📁 Note folders / categories
* 🔄 Undo / version history
* 📱 Improved mobile UI
* 🔔 Notification reminders
* 📤 Export notes to PDF / TXT
* 📎 Attach images





## ⭐ Support the Project

If you like this project, please ⭐ **star the repository** on GitHub!

