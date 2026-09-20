#!/usr/bin/env bash
# Construit l'APK Android (WebView embarquant l'app web) sans Gradle.
# Prérequis : JDK 17 + SDK Android (platform 34, build-tools 34.0.0) dans ~/android-build.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
TOOLS="$HOME/android-build"
export JAVA_HOME="$TOOLS/jdk"
export PATH="$JAVA_HOME/bin:$PATH"
BT="$TOOLS/sdk/build-tools/34.0.0"
ANDROID_JAR="$TOOLS/sdk/platforms/android-34/android.jar"
KEYSTORE="$TOOLS/gor.keystore"
read -r VERSION_NAME VERSION_CODE < "$ROOT/android/version"

BUILD="$ROOT/android/build"
OUT="$ROOT/dist"
rm -rf "$BUILD"
mkdir -p "$BUILD/assets/www" "$BUILD/classes" "$BUILD/dex" "$OUT"

cp "$ROOT"/index.html "$ROOT"/app.js "$ROOT"/episodes.js "$ROOT"/progress-io.js "$ROOT"/style.css "$ROOT"/manifest.json "$BUILD/assets/www/"
cp -r "$ROOT/icons" "$BUILD/assets/www/icons"

"$BT/aapt2" compile --dir "$ROOT/android/res" -o "$BUILD/res.zip"
"$BT/aapt2" link -o "$BUILD/base.apk" -I "$ANDROID_JAR" \
  --manifest "$ROOT/android/AndroidManifest.xml" \
  --min-sdk-version 24 --target-sdk-version 34 \
  --version-code "$VERSION_CODE" --version-name "$VERSION_NAME" \
  -A "$BUILD/assets" "$BUILD/res.zip"

javac -source 11 -target 11 -classpath "$ANDROID_JAR" -d "$BUILD/classes" \
  "$ROOT"/android/src/fr/nauno/gameofroles/*.java 2>&1 | grep -v "^Note:\|warning:" || true
"$BT/d8" --lib "$ANDROID_JAR" --min-api 24 --output "$BUILD/dex" $(find "$BUILD/classes" -name '*.class')

python3 - "$BUILD" << 'PY'
import sys, zipfile
b = sys.argv[1]
with zipfile.ZipFile(f"{b}/base.apk", "a", zipfile.ZIP_DEFLATED) as z:
    z.write(f"{b}/dex/classes.dex", "classes.dex")
PY

"$BT/zipalign" -f -p 4 "$BUILD/base.apk" "$BUILD/aligned.apk"

if [ ! -f "$KEYSTORE" ]; then
  keytool -genkeypair -keystore "$KEYSTORE" -alias gor -keyalg RSA -keysize 2048 -validity 36500 \
    -storepass gorstore -keypass gorstore -dname "CN=Game Of Roles" >/dev/null 2>&1
fi
"$BT/apksigner" sign --ks "$KEYSTORE" --ks-key-alias gor --ks-pass pass:gorstore --key-pass pass:gorstore \
  --out "$OUT/GameOfRoles.apk" "$BUILD/aligned.apk"
"$BT/apksigner" verify "$OUT/GameOfRoles.apk"

echo "v$VERSION_NAME — APK prêt : $OUT/GameOfRoles.apk ($(du -h "$OUT/GameOfRoles.apk" | cut -f1))"
