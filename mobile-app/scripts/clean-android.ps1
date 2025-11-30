# scripts/clean-android.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Cleaning Android project..."

Stop-Process -Name "node" -ErrorAction SilentlyContinue
Stop-Process -Name "gradle" -ErrorAction SilentlyContinue
Stop-Process -Name "java" -ErrorAction SilentlyContinue

$paths = @(
  "node_modules",
  "package-lock.json",
  "android/.cxx",
  "android/build",
  "android/app/build",
  "android/app/build/generated/codegen"
)

foreach ($p in $paths) {
  if (Test-Path $p) {
    Write-Host "Removing $p"
    Remove-Item -Recurse -Force $p
  }
}

Write-Host "Installing npm packages..."
npm install

Write-Host "Installing codegen..."
npm install --save-dev react-native-codegen

Write-Host "Running codegen..."
npx @react-native-community/cli codegen

Write-Host "Cleaning Gradle..."
Push-Location android
./gradlew clean
Pop-Location

Write-Host "Installing Expo SDK..."
npm install expo

Write-Host "Done."
Write-Host "Use: npx expo run:android  or  npx react-native run-android"
