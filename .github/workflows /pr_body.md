```markdown
Title: Add Steam packaging templates + Godot build workflow (steam-ready)

Summary
This PR adds Steam packaging templates, a simple SteamCMD upload script, a README with Godot-specific Steam instructions, and a GitHub Actions workflow that exports the project for Windows, macOS and Linux and uploads zip artifacts for each platform.

Why
- Provides a repeatable CI step to produce export builds from the repository.
- Adds templates and scripts to make packaging and uploading with SteamPipe/steamcmd easier.
- Keeps secrets and credentials out of the repository and documents how to run uploads safely.

What changed
- .github/workflows/godot-build.yml — GitHub Actions workflow to export builds for Windows, macOS, and Linux and upload artifacts.
- README_STEAM.md — instructions for integrating Godot with Steam and packaging builds.
- steam_appid.txt — local test appid (480) for development/testing (replace with your AppID for production).
- app_build_windows.vdf, app_build_linux.vdf, app_build_macos.vdf — SteamPipe manifest templates (placeholders).
- upload_to_steamcmd.sh — small wrapper for steamcmd uploads (reads credentials from env).
- .gitignore appended to ignore exports and Steam secrets.

Checklist (before merging)
- [ ] Replace YOUR_APP_ID in app_build_*.vdf with the real Steam AppID.
- [ ] Replace DEPOT_ID_WINDOWS / DEPOT_ID_LINUX / DEPOT_ID_MACOS with your real Depot IDs.
- [ ] Add export presets to export_presets.cfg (preset names: "Windows Desktop", "Linux/X11", "Mac OSX").
- [ ] Add platform steam_api binaries into a secure path before uploading (or ensure CI has access via secrets/artifact).
- [ ] Add GitHub repository secrets if you want automated uploads:
  - STEAM_USERNAME, STEAM_TOKEN (recommended) or STEAM_PASSWORD
  - (Optional) SIGNING_CERT / SIGNING_KEY for macOS signing (if using CI)
- [ ] Test local export using AppID 480 and run SteamCMD locally using the provided vdf to validate manifests.
- [ ] Confirm macOS notarization/signing steps are handled (if shipping on Mac).
- [ ] Update store assets (capsules, icons, trailers) in Steamworks.
- [ ] Run a manual CI dispatch or push a test commit to verify the workflow runs and artifacts are produced.

How to test locally (short)
1. Ensure export_presets.cfg includes the three export presets (matching names above).
2. Run Godot locally to export for each platform (or use Godot CLI):
   - godot --export "Windows Desktop" build/windows/game.exe
   - godot --export "Linux/X11" build/linux/game.x86_64
   - godot --export "Mac OSX" build/macos/game.dmg
3. Add the correct steam_api binary next to the executable and replace steam_appid.txt with your real AppID (or use 480).
4. Use SteamCMD and the provided app_build_*.vdf files to validate the SteamPipe manifest locally (replace placeholders first).

Notes
- This workflow produces artifacts and does not upload them to Steam. Upload via steamcmd using the included upload_to_steamcmd.sh script or extend the workflow with secure tokens and an automation account.
- macOS builds require code signing and notarization to be ready for distribution — the workflow includes a placeholder for this step but cannot sign without secrets (and a runner that has access to signing certs).

End of PR body.
```
