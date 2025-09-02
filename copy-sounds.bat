@echo off
echo Copying boxing timer sounds...
echo.

REM Check if source directory exists
if not exist "C:\Program Files (x86)\Boxing-timer-sound" (
    echo Error: Source directory not found at C:\Program Files (x86)\Boxing-timer-sound
    echo Please check the path and try again.
    pause
    exit /b 1
)

REM Create sounds directory if it doesn't exist
if not exist "public\sounds" mkdir "public\sounds"

REM Copy all sound files
echo Copying files from C:\Program Files (x86)\Boxing-timer-sound to public\sounds\
xcopy "C:\Program Files (x86)\Boxing-timer-sound\*.*" "public\sounds\" /Y

echo.
echo Sound files copied successfully!
echo Please restart your development server to use the new sounds.
echo.
pause

