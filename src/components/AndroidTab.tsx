import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Copy,
  Check,
  Code2,
  Terminal,
  FileCode,
  ShieldCheck,
  RotateCcw,
  Upload,
  Layers
} from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidTabProps {
  onOpenResetModal: () => void;
}

export const AndroidTab: React.FC<AndroidTabProps> = ({ onOpenResetModal }) => {
  const { exportData, importData } = useHabits();
  const { isInstallable, isInstalled, install } = usePWAInstall();

  const [activeCodeTab, setActiveCodeTab] = useState<'main' | 'manifest' | 'gradle'>('main');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportBackup = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `istiqama-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importData(content);
        if (ok) {
          setImportStatus('Data imported successfully!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Invalid backup file format.');
          setTimeout(() => setImportStatus(null), 3000);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const mainActivityCode = `package com.istiqama.habittracker

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        webView.webViewClient = WebViewClient()
        // Load bundled offline assets:
        webView.loadUrl("file:///android_asset/www/index.html")
    }
}`;

  const manifestCode = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.istiqama.habittracker">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Istiqama"
        android:theme="@style/Theme.IstiqamaHabitTracker">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const gradleCode = `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.istiqama.habittracker"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.istiqama.habittracker"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"))
        }
    }
}`;

  return (
    <div className="space-y-6 pb-24">
      {/* Overview Card */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 p-5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
            <Smartphone className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Android Application Suite</h2>
            <p className="text-xs text-teal-200">100% Offline &middot; No Accounts &middot; Local Storage</p>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-200">
          Istiqama is ready to install on your Android device. You can download the compiled <strong>release APK</strong> file directly, find it in the Code tab, or install it as a native Android WebAPK.
        </p>

        {/* Primary Action Buttons: Download APK & Direct PWA Install */}
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <a
            href="/istiqama-release.apk"
            download="istiqama-release.apk"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-400 active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>Download Release APK (266 KB)</span>
          </a>

          {isInstalled ? (
            <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/20 px-3.5 py-2 text-xs font-semibold text-emerald-200 backdrop-blur-md">
              <Check className="h-4 w-4" />
              <span>Installed on Device</span>
            </div>
          ) : isInstallable ? (
            <button
              type="button"
              onClick={install}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/30 active:scale-95"
            >
              <Smartphone className="h-4 w-4" />
              <span>Add to Android Home Screen</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* APK Files in Code Tab Highlight Card */}
      <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/70 p-4 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-950/30">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <FileCode className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
              APK File Locations in Code Tab:
            </h3>
            <p className="mt-1 text-[11px] leading-relaxed text-emerald-900/80 dark:text-emerald-300/80">
              You can find and download the APK file directly from any of these paths in the code tree:
            </p>
            <ul className="mt-2 space-y-1.5 font-mono text-[11px] text-emerald-950 dark:text-emerald-200">
              <li className="flex items-center justify-between rounded-lg bg-white/80 px-2.5 py-1 dark:bg-black/40">
                <span>📁 /istiqama-release.apk</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Root folder</span>
              </li>
              <li className="flex items-center justify-between rounded-lg bg-white/80 px-2.5 py-1 dark:bg-black/40">
                <span>📁 /public/istiqama-release.apk</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Public web assets</span>
              </li>
              <li className="flex items-center justify-between rounded-lg bg-white/80 px-2.5 py-1 dark:bg-black/40">
                <span>📁 /android/app/build/outputs/apk/release/istiqama-release.apk</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* APK Compilation Instructions */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            Build Release APK via Gradle
          </h3>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          The project includes the full native Android structure in the <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">/android</code> directory.
        </p>

        {/* Step-by-Step Code Commands */}
        <div className="mt-3 space-y-3">
          <div className="rounded-xl bg-slate-900 p-3.5 text-xs text-slate-100 dark:bg-black/60">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>1. Build web distribution & sync to Android assets</span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    'npm run build && mkdir -p android/app/src/main/assets/www && cp -r dist/* android/app/src/main/assets/www/',
                    'step1'
                  )
                }
                className="hover:text-emerald-400"
              >
                {copiedKey === 'step1' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <pre className="mt-1 font-mono text-[11px] text-emerald-400 whitespace-pre-wrap">
              npm run build
              mkdir -p android/app/src/main/assets/www
              cp -r dist/* android/app/src/main/assets/www/
            </pre>
          </div>

          <div className="rounded-xl bg-slate-900 p-3.5 text-xs text-slate-100 dark:bg-black/60">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>2. Compile Release APK</span>
              <button
                type="button"
                onClick={() => copyToClipboard('cd android && ./gradlew assembleRelease', 'step2')}
                className="hover:text-emerald-400"
              >
                {copiedKey === 'step2' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <pre className="mt-1 font-mono text-[11px] text-emerald-400">
              cd android && ./gradlew assembleRelease
            </pre>
          </div>

          <div className="rounded-xl bg-slate-900 p-3.5 text-xs text-slate-100 dark:bg-black/60">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>3. Install APK directly onto phone</span>
              <button
                type="button"
                onClick={() => copyToClipboard('adb install android/app/build/outputs/apk/release/app-release.apk', 'step3')}
                className="hover:text-emerald-400"
              >
                {copiedKey === 'step3' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <pre className="mt-1 font-mono text-[11px] text-emerald-400 whitespace-pre-wrap">
              adb install android/app/build/outputs/apk/release/app-release.apk
            </pre>
          </div>
        </div>
      </div>

      {/* Android Source Code Viewer */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              Android Source Code
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              const code =
                activeCodeTab === 'main'
                  ? mainActivityCode
                  : activeCodeTab === 'manifest'
                  ? manifestCode
                  : gradleCode;
              copyToClipboard(code, 'tabCode');
            }}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {copiedKey === 'tabCode' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>Copy</span>
          </button>
        </div>

        {/* Code Tabs */}
        <div className="mt-3 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setActiveCodeTab('main')}
            className={`flex-1 rounded-md py-1 text-[11px] font-semibold transition ${
              activeCodeTab === 'main'
                ? 'bg-white text-emerald-700 shadow-xs dark:bg-slate-900 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            MainActivity.kt
          </button>
          <button
            type="button"
            onClick={() => setActiveCodeTab('manifest')}
            className={`flex-1 rounded-md py-1 text-[11px] font-semibold transition ${
              activeCodeTab === 'manifest'
                ? 'bg-white text-emerald-700 shadow-xs dark:bg-slate-900 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            AndroidManifest.xml
          </button>
          <button
            type="button"
            onClick={() => setActiveCodeTab('gradle')}
            className={`flex-1 rounded-md py-1 text-[11px] font-semibold transition ${
              activeCodeTab === 'gradle'
                ? 'bg-white text-emerald-700 shadow-xs dark:bg-slate-900 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            build.gradle.kts
          </button>
        </div>

        {/* Code Block */}
        <div className="mt-3 max-h-60 overflow-y-auto rounded-xl bg-slate-950 p-3.5 font-mono text-[11px] text-slate-200">
          <pre>
            {activeCodeTab === 'main'
              ? mainActivityCode
              : activeCodeTab === 'manifest'
              ? manifestCode
              : gradleCode}
          </pre>
        </div>
      </div>

      {/* Data Management & Offline Persistence */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            Data Storage & Privacy
          </h3>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          All data is saved locally on your device inside <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">localStorage</code>. No telemetry, no accounts, and no internet required.
        </p>

        {importStatus && (
          <div className="mt-3 rounded-lg bg-emerald-50 p-2 text-center text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            {importStatus}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Export Backup (JSON)</span>
          </button>

          <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
            <Upload className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>Import Backup</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>

        {/* Reset All Data Button */}
        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onOpenResetModal}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All Data & Streaks</span>
          </button>
        </div>
      </div>
    </div>
  );
};
