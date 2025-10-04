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
  CreateDirectory "$INSTDIR\Mods"
  CreateDirectory "$INSTDIR\Dashboards"
  CreateDirectory "$INSTDIR\Codex"
  CreateDirectory "$INSTDIR\Plugins"

  File "TacticalLegendsSettings.reg"
  File "Install.ps1"
  File "modding_dashboard.py"
  File "CodexViewer.exe"

  ExecWait 'regedit /s "$INSTDIR\TacticalLegendsSettings.reg"'

  ${If} ${FileExists} "$INSTDIR\python.exe"
    WriteRegStr HKCU "Software\TacticalLegends" "PythonPath" "$INSTDIR\python.exe"
  ${Else}
    MessageBox MB_ICONEXCLAMATION "Python not found. Please install Python or place it in $INSTDIR."
  ${EndIf}

  FindFirst $R1 $R2 "$INSTDIR\Mods\*.tlmod"
  ${DoWhile} ${Errors} == 0
    ReadINIStr $R3 "$INSTDIR\Mods\$R2" "Metadata" "MOD_VERSION"
    ${If} $R3 == ""
      MessageBox MB_ICONEXCLAMATION "Mod $R2 missing MOD_VERSION tag."
    ${Else}
      WriteRegStr HKCU "Software\TacticalLegends\Mods\$R2" "Version" "$R3"
    ${EndIf}
    FindNext $R1 $R2
  ${Loop}
  FindClose $R1

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
