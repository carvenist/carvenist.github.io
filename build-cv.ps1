# cv.html -> assets/cv.pdf
# 내용은 cv.html 만 고치면 됩니다. 이 스크립트를 실행하면 PDF가 다시 만들어집니다.
#   powershell -ExecutionPolicy Bypass -File build-cv.ps1

$ErrorActionPreference = "Stop"

$chrome = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $chrome) { throw "Chrome 을 찾을 수 없습니다." }

$dir = $PSScriptRoot
$out = Join-Path $dir "assets\cv.pdf"
$src = "file:///" + ($dir -replace '\\','/') + "/cv.html"

$p = Start-Process -FilePath $chrome -NoNewWindow -Wait -PassThru -ArgumentList @(
  "--headless=new"
  "--disable-gpu"
  "--no-pdf-header-footer"
  "--run-all-compositor-stages-before-draw"
  "--virtual-time-budget=10000"
  "--print-to-pdf=$out"
  $src
)

if ($p.ExitCode -ne 0) { throw "PDF 생성 실패 (exit $($p.ExitCode))" }

$kb = [math]::Round((Get-Item $out).Length / 1KB)
Write-Host "assets/cv.pdf 생성 완료 ($kb KB)"
