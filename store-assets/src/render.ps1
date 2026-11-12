# Regenerates every PNG in store-assets from the HTML templates in this folder.
# Usage: powershell -File render.ps1
$ErrorActionPreference = 'Stop'
$src = $PSScriptRoot
$out = Split-Path $src -Parent
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
if (-not (Test-Path $edge)) { $edge = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe' }
$jobs = @()
foreach ($l in @(@('pt','pt-BR'), @('en','en'))) {
  New-Item -ItemType Directory -Force "$out\screenshots\$($l[1])" | Out-Null
  $names = @{ '01'='01-janela-limpa'; '02'='02-um-clique'; '03'='03-modo-teatro'; '04'='04-multitarefa'; '05'='05-privacidade' }
  foreach ($k in $names.Keys) { $jobs += ,@("$k.html?lang=$($l[0])", "$out\screenshots\$($l[1])\$($names[$k]).png", 1280, 800) }
}
New-Item -ItemType Directory -Force "$out\promo" | Out-Null
$jobs += ,@('small.html?lang=en', "$out\promo\small-440x280.png", 440, 280)
$jobs += ,@('marquee.html?lang=en', "$out\promo\marquee-1400x560.png", 1400, 560)
$jobs += ,@('hero.html?lang=pt', "$out\hero.png", 1280, 640)
foreach ($j in $jobs) {
  $url = 'file:///' + $src.Replace('\','/') + '/' + $j[0]
  & $edge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 "--window-size=$($j[2]),$($j[3])" "--screenshot=$($j[1])" $url | Out-Null
  Add-Type -AssemblyName System.Drawing
  $img = [System.Drawing.Image]::FromFile($j[1]); "$($j[1]) $($img.Width)x$($img.Height)"; $img.Dispose()
}
