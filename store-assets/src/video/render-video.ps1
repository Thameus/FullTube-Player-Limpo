# Regenerates fulltube-demo-pt/en.mp4 (store-assets\video) and demo.gif / demo-en.gif (store-assets).
# Usage: powershell -File render-video.ps1 [pt|en]
node (Join-Path $PSScriptRoot 'render-video.mjs') @args
