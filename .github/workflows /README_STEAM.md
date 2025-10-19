```markdown
# Steam packaging & upload (Godot)

This document explains how to prepare Godot builds for Steam (SteamPipe), integrate Steamworks via GodotSteam (or alternative), and upload using steamcmd.

Important notes
- You need a Steamworks partner account and an AppID. Replace the placeholders in the manifests with your real AppID and Depot IDs.
- Steam uploads and publishing require Steam Guard/2FA. For automation, create a build-bot account or use Steam Guard tokens set as secrets.
- This guide assumes you export runnable Godot binaries (standalone executables or exported folders) and then package platform-specific content into depots.

Quick checklist
1. Integrate Steamworks:
   - Recommended: GodotSteam module or GDNative bindings (for achievements, cloud, stats, matchmaking, DRM).
   - Make sure your project calls SteamAPI.Init() at startup (or equivalent for the binding).
2. Test locally:
   - Place `steam_appid.txt` with your AppID (or 480 for testing) in the game executable folder or repo root.
   - Put the correct platform steam_api binary alongside the executable:
     - Windows: steam_api.dll / steam_api64.dll
     - Linux: libsteam_api.so / libsteam_api64.so
     - macOS: libsteam_api.dylib
3. Export with Godot:
   - Exports should produce the executable plus any required data files.
   - Example (CLI):
     - Linux: `godot --export "Linux/X11" build/linux/game.x86_64`
     - Windows: `godot --export "Windows Desktop" build/windows/game.exe`
     - macOS: `godot --export "Mac OSX" build/macos/game.dmg` (or .app)
   - Copy steam_api binaries into the exported folder.
4. Package for Steam:
   - Create one depot per platform in Steamworks.
   - Use app_build_*.vdf manifests to point at contentroots (see templates in the repo).
   - Test the manifest locally first (ensure paths are correct).
5. Upload:
   - Use SteamCMD with `+run_app_build` and the vdf manifest, or use an upload bot.
   - Use internal branch testing before making builds public.
6. Store assets:
   - Prepare capsules, header images, icons, trailers, and screenshots per Steam image guidelines.
   - Place them on Steamworks > Store when ready.

Security
- Do not commit Steam usernames, passwords, guard codes, or tokens.
- Use environment variables or GitHub Secrets for CI.

If you want, I can:
- Add these files to a branch (steam-ready) and open a PR if you grant push access.
- Add a GitHub Actions workflow for building and packaging (requires a runner with Godot or a self-hosted runner).
- Replace placeholders in manifests if you provide AppID and Depot IDs.

Replace placeholders in VDF files:
- YOUR_APP_ID → your numeric AppID
- DEPOT_ID_WINDOWS / DEPOT_ID_LINUX / DEPOT_ID_MACOS → depot numeric IDs

End of README_STEAM.md
