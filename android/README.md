# Istiqama - Android Application Build Guide

This directory contains the complete source code for packaging the **Istiqama Offline Habit Tracker** into a standalone Android APK.

---

## Method 1: Instant Direct Install (Recommended, No Dev Tools Required)

Because Istiqama is built as a Progressive Web App (PWA) with a valid Service Worker and Manifest:
1. Open the app in **Google Chrome** or **Brave** on your Android device.
2. Tap the **"Install App"** button inside the app header or tap the Chrome menu (⋮) -> **"Install app"** / **"Add to Home screen"**.
3. Android will generate a native **WebAPK** package and place the app icon on your home screen and app drawer.
4. The app runs in **fullscreen standalone mode**, completely offline, with local storage persistence.

---

## Method 2: Build Native Android APK with Android Studio

### Prerequisites
- Android Studio Hedgehog (2023.1.1) or newer
- JDK 17
- Android SDK 34 (API 34)

### Steps to Build
1. Open **Android Studio**.
2. Select **Open an existing project** and choose the `android/` directory.
3. Allow Gradle to sync.
4. Copy your web app distribution build (`dist/`) into `android/app/src/main/assets/www/`:
   ```bash
   npm run build
   mkdir -p android/app/src/main/assets/www
   cp -r dist/* android/app/src/main/assets/www/
   ```
5. In `MainActivity.kt`, switch the loader URL to:
   ```kotlin
   webView.loadUrl("file:///android_asset/www/index.html")
   ```
6. Build Debug APK:
   - Click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
   - Or run in terminal:
     ```bash
     ./gradlew assembleDebug
     ```
   - APK output location: `android/app/build/outputs/apk/debug/app-debug.apk`
7. Build Release APK:
   - Click **Build** > **Generate Signed Bundle / APK**.
   - Or run:
     ```bash
     ./gradlew assembleRelease
     ```
   - APK output location: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## Method 3: Install APK to Android Phone

Once built:
1. Connect your Android phone via USB and enable **USB Debugging** in Developer Options.
2. Run:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```
3. Or transfer the `.apk` file directly to your phone via Google Drive, Bluetooth, or USB cable, tap it in your phone's File Manager, and choose **Install**.
