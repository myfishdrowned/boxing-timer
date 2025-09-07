# PowerShell script to copy woosh sound file
Write-Host "Copying woosh sound file..." -ForegroundColor Green

# Check if source directory exists
$sourcePath = "C:\Program Files (x86)\Boxing-timer-sound"
if (-not (Test-Path $sourcePath)) {
    Write-Host "Error: Source directory not found at $sourcePath" -ForegroundColor Red
    Write-Host "Please check the path and try again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Create sounds directory if it doesn't exist
$destPath = "public\sounds"
if (-not (Test-Path $destPath)) {
    New-Item -ItemType Directory -Path $destPath -Force
}

# Copy all files from source to destination
Write-Host "Copying files from $sourcePath to $destPath" -ForegroundColor Yellow
Copy-Item "$sourcePath\*.*" $destPath -Force

Write-Host "Files copied successfully!" -ForegroundColor Green
Write-Host "Please restart your development server to use the new sounds." -ForegroundColor Yellow
Read-Host "Press Enter to exit"


