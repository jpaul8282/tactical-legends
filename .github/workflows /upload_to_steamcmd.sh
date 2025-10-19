#!/usr/bin/env bash
# Upload a platform build to Steam using steamcmd and an app_build_*.vdf manifest.
# Usage: ./upload_to_steamcmd.sh app_build_windows.vdf
# Requires: steamcmd installed and available as `steamcmd` (or set STEAMCMD_BIN)
set -euo pipefail

VDF="$1"
STEAMCMD_BIN="${STEAMCMD_BIN:-steamcmd}"

if [ -z "${STEAM_USERNAME:-}" ]; then
  echo "Please set STEAM_USERNAME and STEAM_PASSWORD or STEAM_TOKEN in the environment."
  exit 1
fi

if [ -z "${STEAM_PASSWORD:-}" ] && [ -z "${STEAM_TOKEN:-}" ]; then
  echo "Set STEAM_PASSWORD or STEAM_TOKEN (recommended token) as environment variable."
  exit 1
fi

# Login command: prefer token for automation
if [ -n "${STEAM_TOKEN:-}" ]; then
  LOGIN_CMD="+login ${STEAM_USERNAME} ${STEAM_TOKEN}"
else
  LOGIN_CMD="+login ${STEAM_USERNAME} ${STEAM_PASSWORD}"
fi

echo "Running steamcmd with manifest ${VDF}"
"${STEAMCMD_BIN}" ${LOGIN_CMD} +run_app_build "${VDF}" +quit
echo "Steam upload started (check steamcmd output)."
