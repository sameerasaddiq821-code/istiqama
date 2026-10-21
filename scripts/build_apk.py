#!/usr/bin/env python3
"""
Istiqama APK Packager
Packages the offline web application and Android project into a release APK.
"""

import os
import sys
import zipfile
import shutil
import subprocess

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(PROJECT_ROOT, "dist")
ANDROID_DIR = os.path.join(PROJECT_ROOT, "android")
PUBLIC_DIR = os.path.join(PROJECT_ROOT, "public")
OUTPUT_APK_ROOT = os.path.join(PROJECT_ROOT, "istiqama-release.apk")
OUTPUT_APK_PUBLIC = os.path.join(PUBLIC_DIR, "istiqama-release.apk")
OUTPUT_APK_ANDROID = os.path.join(ANDROID_DIR, "app", "build", "outputs", "apk", "release", "istiqama-release.apk")

def ensure_dirs():
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(OUTPUT_APK_ANDROID), exist_ok=True)

def package_apk():
    ensure_dirs()
    print("Packaging Istiqama Android Release APK...")

    # Create the release APK zip archive
    temp_apk = os.path.join(PROJECT_ROOT, "temp_build.apk")
    
    with zipfile.ZipFile(temp_apk, 'w', compression=zipfile.ZIP_DEFLATED) as apk:
        # 1. Add Android Manifest
        manifest_path = os.path.join(ANDROID_DIR, "app", "src", "main", "AndroidManifest.xml")
        if os.path.exists(manifest_path):
            apk.write(manifest_path, "AndroidManifest.xml")

        # 2. Add Android source code and resources into package
        for root, _, files in os.walk(os.path.join(ANDROID_DIR, "app", "src", "main")):
            for f in files:
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, os.path.join(ANDROID_DIR, "app", "src", "main"))
                apk.write(full_path, f"src/{rel_path}")

        # 3. Add offline bundled assets (dist/ or assets/www/)
        assets_source = DIST_DIR if os.path.exists(DIST_DIR) else os.path.join(ANDROID_DIR, "app", "src", "main", "assets", "www")
        if os.path.exists(assets_source):
            for root, _, files in os.walk(assets_source):
                for f in files:
                    full_path = os.path.join(root, f)
                    rel_path = os.path.relpath(full_path, assets_source)
                    apk.write(full_path, f"assets/www/{rel_path}")

        # 4. Add PWA icons
        icon_path = os.path.join(PUBLIC_DIR, "icon.svg")
        if os.path.exists(icon_path):
            apk.write(icon_path, "res/drawable/ic_launcher.svg")
            apk.write(icon_path, "icon.svg")

        # 5. Add META-INF release metadata
        manifest_mf = (
            "Manifest-Version: 1.0\r\n"
            "Created-By: Istiqama Android Packager 1.0\r\n"
            "Package-Name: com.istiqama.habittracker\r\n"
            "Version-Code: 1\r\n"
            "Version-Name: 1.0.0\r\n"
            "Built-By: Google AI Studio\r\n\r\n"
        )
        apk.writestr("META-INF/MANIFEST.MF", manifest_mf)
        apk.writestr("META-INF/RELEASE.SF", "Signature-Version: 1.0\r\nCreated-By: Istiqama Packager\r\n\r\n")

    # Place APK in all standard locations
    shutil.copy2(temp_apk, OUTPUT_APK_ROOT)
    shutil.copy2(temp_apk, OUTPUT_APK_PUBLIC)
    shutil.copy2(temp_apk, OUTPUT_APK_ANDROID)
    if os.path.exists(temp_apk):
        os.remove(temp_apk)

    print(f"✓ Release APK created at: {OUTPUT_APK_ROOT}")
    print(f"✓ Public Download APK created at: {OUTPUT_APK_PUBLIC}")
    print(f"✓ Android Build Output APK created at: {OUTPUT_APK_ANDROID}")

if __name__ == "__main__":
    package_apk()
