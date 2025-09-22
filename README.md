# medReminder

A simple, privacy‑friendly mobile app to **add medicines**, set **reminders**, **track daily progress**, and **manage (create / read / update / delete)** your medication schedule. Built with **React Native + Expo**, **Firebase**, and **Clerk** authentication.

---

## 📦 Demo & Downloads

- **APK (Android)**: 👉 _Add your Google Drive link here_ → **[Drive APK Link](https://drive.google.com/drive/folders/1UHFrpF7-9rL5wZh7g4iyds9Cjur6v-qX?usp=sharing)**
- **YouTube Demo**: 👉 **[Watch the video](https://youtu.be/your-video-id)**

---

## ✨ Features

- 👤 **Authentication with Clerk** (secure sign in/out)
- 💊 **Medicines CRUD** – add, read, update, delete
- ⏰ **Local reminders** for medication times (Expo Notifications)
- 📅 **Today’s schedule** and **daily progress tracking** (e.g., doses taken)
- ☁️ **Firebase Firestore** for persistent storage
- 🔔 **Push/Local Notifications** with channels on Android
- 📱 Modern UI with modals, date/time pickers, and clean layout

---

## 🧰 Tech Stack & Libraries

- **App**: React Native (Expo Router)
- **Auth**: Clerk (\`@clerk/clerk-expo\`)
- **DB**: Firebase (Firestore)
- **State**: Zustand
- **UI / Utils**:
  - \`react-native-modal\`
  - \`@react-native-community/datetimepicker\`
  - \`react-native-svg\`
  - \`expo-secure-store\` (secure token storage for Clerk)
  - \`expo-web-browser\` (Clerk OAuth)
  - \`expo-crypto\` (Clerk PKCE)
  - \`expo-notifications\`

---

## 🚀 Getting Started

### 1) Clone or Create Project

If you have the repository:

```bash
git clone <your-repo-url>
cd medReminder
```

Otherwise create a fresh Expo app and copy sources in:

```bash
npx create-expo-app medReminder --template
cd medReminder
```

### 2) Install Dependencies

```bash
npm install
# or: yarn
```

### 3) Configure Clerk

Create a `.env` file in project root:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_********************************
```

Wrap your app with **ClerkProvider** (already done in code) and ensure you pass the publishable key via env.

### 4) Configure Firebase

Create `firebase.ts` (or update your existing file) with your config:

```ts
// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "... ",
	authDomain: "... ",
	projectId: "... ",
	storageBucket: "... ",
	messagingSenderId: "... ",
	appId: "... ",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 5) Firestore Security Rules (minimum)

> Allow users to read/write only their own meds (documents must include `userId`).

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /medications/{doc} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

Deploy via Firebase Console or CLI.

### 6) Notifications (Android)

In `app.json`/`app.config`, add permissions and notification channel if needed, and in code ensure:

```ts
import * as Notifications from "expo-notifications";
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowAlert: true,
	}),
});
```

Create a default channel on Android before scheduling notifications.

### 7) Run the App (Dev)

```bash
npm run start       # start dev server
npm run android     # run on Android (device/emulator)
```
