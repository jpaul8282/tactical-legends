Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\MyApp]
"Username"="Jpaul"
"EnableFeatureX"=dword:00000001
"WindowWidth"=dword:00000320
"WindowHeight"=dword:00000258

[HKEY_LOCAL_MACHINE\Software\MyApp\Settings]
"InstallPath"="C:\\Program Files\\MyApp"
"Version"="1.0.0"
# Define condition: Check if a specific registry key exists
$keyPath = "HKCU:\Software\MyApp"
if (-not (Test-Path $keyPath)) {
    Write-Host "Registry key not found. Importing settings..."

    # Import the .reg file
    Start-Process regedit.exe -ArgumentList "/s", "MyAppSettings.reg" -Wait
} else {
    Write-Host "Registry key already exists. Skipping import."
}
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\MyApp]
"Username"="Jpaul"
"EnableFeatureX"=dword:00000001
New-Item -Path "HKCU:\Software\MyApp" -Force
Set-ItemProperty -Path "HKCU:\Software\MyApp" -Name "Username" -Value "Jpaul"
Set-ItemProperty -Path "HKCU:\Software\MyApp" -Name "EnableFeatureX" -Value 1
# Tactical Legends Installer Script
# Author: Jpaul
# Purpose: Set up registry, modding folders, and Python integration

$logPath = "$env:USERPROFILE\TacticalLegends\install_log.txt"
New-Item -ItemType Directory -Path (Split-Path $logPath) -Force | Out-Null
Start-Transcript -Path $logPath -Append

Write-Host "`n=== Tactical Legends Setup ===`n"

# 1. Registry Setup
$regKey = "HKCU:\Software\TacticalLegends"
if (-not (Test-Path $regKey)) {
    Write-Host "Registry key not found. Importing settings..."
    Start-Process regedit.exe -ArgumentList "/s", "TacticalLegendsSettings.reg" -Wait
} else {
    Write-Host "Registry key already exists. Skipping import."
}

# 2. Modding Folder Structure
$modPath = "$env:USERPROFILE\TacticalLegends\Mods"
$dashPath = "$env:USERPROFILE\TacticalLegends\Dashboards"
$codexPath = "$env:USERPROFILE\TacticalLegends\Codex"

foreach ($path in @($modPath, $dashPath, $codexPath)) {
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Created: $path"
    } else {
        Write-Host "Exists: $path"
    }
}

# 3. Python Integration
$pythonPath = Get-Command python | Select-Object -ExpandProperty Source
if ($pythonPath) {
    Write-Host "Python found at: $pythonPath"
    Set-ItemProperty -Path $regKey -Name "PythonPath" -Value $pythonPath
} else {
    Write-Host "Python not found. Please install Python and re-run this script."
}

# 4. Modding Dashboard Stub
$dashboardStub = @"
# Tactical Legends Modding Dashboard Stub
# Auto-generated on install
import os

MOD_PATH = os.path.expanduser('~\\TacticalLegends\\Mods')
print(f"Modding path initialized: {MOD_PATH}")
"@
$stubFile = "$dashPath\modding_dashboard.py"
Set-Content -Path $stubFile -Value $dashboardStub
Write-Host "Dashboard stub created: $stubFile"

Stop-Transcript
Write-Host "`nSetup complete. Log saved to: $logPath"
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\TacticalLegends]
"Username"="Jpaul"
"EnableModding"=dword:00000001
"CodexPath"="%USERPROFILE%\\TacticalLegends\\Codex"
"PythonPath"=""
; Tactical Legends Installer - Inno Setup Script
[Setup]
AppName=Tactical Legends
AppVersion=1.0
DefaultDirName={userappdata}\TacticalLegends
DefaultGroupName=Tactical Legends
OutputDir=.\InstallerOutput
OutputBaseFilename=TacticalLegendsInstaller
Compression=lzma
SolidCompression=yes

[Files]
Source: "TacticalLegendsSettings.reg"; DestDir: "{app}"; Flags: ignoreversion
Source: "Install.ps1"; DestDir: "{app}"; Flags: ignoreversion
Source: "modding_dashboard.py"; DestDir: "{app}\Dashboards"; Flags: ignoreversion
Source: "CodexViewer.exe"; DestDir: "{app}\Codex"; Flags: ignoreversion

[Run]
Filename: "powershell.exe"; Parameters: "-ExecutionPolicy Bypass -File ""{app}\Install.ps1"""; Flags: runhidden
Filename: "{app}\Dashboards\modding_dashboard.py"; Description: "Launch Modding Dashboard"; Flags: postinstall shellexec
Filename: "{app}\Codex\CodexViewer.exe"; Description: "Launch Codex Viewer"; Flags: postinstall shellexec

[Icons]
Name: "{group}\Tactical Legends Dashboard"; Filename: "{app}\Dashboards\modding_dashboard.py"
Name: "{group}\Codex Viewer"; Filename: "{app}\Codex\CodexViewer.exe"
# 5. Mod Validation
$modFiles = Get-ChildItem "$modPath" -Filter *.tlmod
foreach ($file in $modFiles) {
    $content = Get-Content $file.FullName
    if ($content -notmatch "MOD_VERSION") {
        Write-Warning "Invalid mod file: $($file.Name)"
    } else {
        Write-Host "Validated mod: $($file.Name)"
    }
}

# 6. Plugin Scanning
$pluginDir = "$env:USERPROFILE\TacticalLegends\Plugins"
if (Test-Path $pluginDir) {
    $plugins = Get-ChildItem $pluginDir -Filter *.dll
    foreach ($plugin in $plugins) {
        Write-Host "Plugin detected: $($plugin.Name)"
        # Optional: Load and inspect metadata via reflection or CLI
    }
} else {
    Write-Host "No plugin directory found. Skipping scan."
}
; Tactical Legends NSIS Installer
Name "Tactical Legends"
OutFile "TacticalLegendsInstaller.exe"
InstallDir "$APPDATA\TacticalLegends"
RequestExecutionLevel admin
SetCompress auto
SetCompressor lzma

!include "LogicLib.nsh"
!include "FileFunc.nsh"
!include "WinReg.nsh"

Section "Install"

  ; Create directories
  CreateDirectory "$INSTDIR\Mods"
  CreateDirectory "$INSTDIR\Dashboards"
  CreateDirectory "$INSTDIR\Codex"
  CreateDirectory "$INSTDIR\Plugins"

  ; Install files
  File "TacticalLegendsSettings.reg"
  File "modding_dashboard.py"
  File "CodexViewer.exe"
  File "Install.ps1"

  ; Import registry
  ExecWait 'regedit /s "$INSTDIR\TacticalLegendsSettings.reg"'

  ; Validate Python
  ${If} ${FileExists} "$INSTDIR\python.exe"
    WriteRegStr HKCU "Software\TacticalLegends" "PythonPath" "$INSTDIR\python.exe"
  ${Else}
    MessageBox MB_ICONEXCLAMATION "Python not found. Please install Python or place it in $INSTDIR."
  ${EndIf}

  ; Mod version compatibility check
  ${GetParameters} $R0
  ClearErrors
  FindFirst $R1 $R2 "$INSTDIR\Mods\*.tlmod"
  ${DoWhile} ${Errors} == 0
    ReadINIStr $R3 "$INSTDIR\Mods\$R2" "Metadata" "MOD_VERSION"
    ${If} $R3 == ""
      MessageBox MB_ICONEXCLAMATION "Mod $R2 is missing MOD_VERSION tag. Skipping."
    ${Else}
      WriteRegStr HKCU "Software\TacticalLegends\Mods\$R2" "Version" "$R3"
    ${EndIf}
    FindNext $R1 $R2
  ${Loop}
  FindClose $R1

  ; Plugin scan
  ClearErrors
  FindFirst $R1 $R2 "$INSTDIR\Plugins\*.dll"
  ${DoWhile} ${Errors} == 0
    WriteRegStr HKCU "Software\TacticalLegends\Plugins" "$R2" "Installed"
    FindNext $R1 $R2
  ${Loop}
  FindClose $R1

SectionEnd

Section "Launch Dashboard"
  Exec '"$INSTDIR\modding_dashboard.py" --scan --codex "$INSTDIR\Codex"'
SectionEnd

Section "Launch Codex Viewer"
  Exec '"$INSTDIR\CodexViewer.exe"'
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\modding_dashboard.py"
  Delete "$INSTDIR\CodexViewer.exe"
  Delete "$INSTDIR\Install.ps1"
  Delete "$INSTDIR\TacticalLegendsSettings.reg"
  RMDir /r "$INSTDIR\Mods"
  RMDir /r "$INSTDIR\Dashboards"
  RMDir /r "$INSTDIR\Codex"
  RMDir /r "$INSTDIR\Plugins"
  DeleteRegKey HKCU "Software\TacticalLegends"
SectionEnd
