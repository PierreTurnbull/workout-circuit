# Google Play release guide

This project ships to Google Play as a Capacitor Android app. The web app is bundled inside the APK/AAB, so the Play Store build does not depend on GitHub Pages.

## What is already set up

- Capacitor Android project in `android/`
- App ID: `com.pierreturnbull.workoutcircuit`
- Launcher icons and splash screens generated from `assets/icon.png`
- Privacy policy page at `public/privacy-policy.html`
- Release signing hook in `android/app/build.gradle`

## One-time accounts and tools

1. Pay the **$25 one-time** Google Play developer fee at [Google Play Console](https://play.google.com/console).
2. Install **Java 21** (required by Capacitor 8):

   ```bash
   brew install --cask temurin@21
   export JAVA_HOME=$(/usr/libexec/java_home -v 21)
   ```

3. Install **Android Studio** (includes the Android SDK and build tools).
4. Open the project once with Android Studio if Gradle sync fails from the command line.

## Build a release bundle (AAB)

### 1. Create a release keystore (once)

```bash
keytool -genkeypair -v \
  -keystore android/workout-circuit-release.keystore \
  -alias workout-circuit \
  -keyalg RSA -keysize 2048 -validity 10000
```

Keep that keystore safe. Google requires the same signing key for all future updates.

### 2. Configure signing

```bash
cp android/keystore.properties.example android/keystore.properties
```

Edit `android/keystore.properties` with your real passwords.

### 3. Build the Android bundle

```bash
npm run build:android
cd android
./gradlew bundleRelease
```

The upload file will be at:

`android/app/build/outputs/bundle/release/app-release.aab`

### 4. Test locally first (optional)

```bash
npm run android:run
```

Or open Android Studio:

```bash
npm run android:open
```

## Play Console checklist

Create a new app in Play Console, then provide:

| Item | Suggested value |
|---|---|
| App name | Workout Circuit |
| Package name | `com.pierreturnbull.workoutcircuit` |
| Category | Health & Fitness |
| Privacy policy URL | `https://pierreturnbull.github.io/workout-circuit/privacy-policy.html` |
| Data safety | No data collected, stored locally on device |
| Target audience | General audience / 13+ |
| Release format | Android App Bundle (`.aab`) |

You will also need:

- Short description (80 chars)
- Full description
- Phone screenshots (at least 2)
- Feature graphic (1024 x 500)
- High-res icon (512 x 512) — use `public/pwa-512.png`

## Updating the app later

1. Bump `versionCode` and `versionName` in `android/app/build.gradle`
2. Run `npm run build:android`
3. Build a new bundle with `./gradlew bundleRelease`
4. Upload the new `.aab` to Play Console

## Useful commands

```bash
npm run build:android      # build web app + sync into android/
npm run android:open       # open project in Android Studio
npm run android:bundle     # build signed release AAB
npx capacitor-assets generate --android   # regenerate launcher icons
```

## Notes

- GitHub Pages deploy is unchanged and still uses `BASE_PATH=/workout-circuit/`.
- Android builds use the default web base path `/`.
- Workout history stays on-device via `localStorage`; mention that in Play Console data safety.
