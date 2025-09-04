// ReloadManager.h
#include <vector>
#include <string>
#include <chrono>

std::vector<std::string> recentlyReloadedFiles;
std::chrono::system_clock::time_point lastReloadTime;

// ReloadManager.cpp
{
    std::lock_guard<std::mutex> lock(reloadMutex);
    loader.reloadUnit(pathStr);
    timestamps[pathStr] = currentTime;
    reloaded = true;

    recentlyReloadedFiles.push_back(pathStr);
    lastReloadTime = std::chrono::system_clock::now();
}

// DebugOverlay.cpp
void drawReloadOverlay(const ReloadManager& manager) {
    if (manager.hasReloaded()) {
        ImGui::Begin("Hot Reload Debug");

        ImGui::Text("Last Reload: %s", formatTime(manager.lastReloadTime).c_str());

        ImGui::Text("Reloaded Files:");
        for (const auto& file: manager.recentlyReloadedFiles) {
            ImGui::BulletText("%s", file.c_str());
        }

        ImGui::End();
    }
}

std::string formatTime(std::chrono::system_clock::time_point tp) {
    std::time_t time = std::chrono::system_clock::to_time_t(tp);
    char buffer[26];
    ctime_s(buffer, sizeof(buffer), &time);
    return std::string(buffer);
}

// ReloadManager.h
std::atomic<bool> hotReloadEnabled = true;

void setHotReloadEnabled(bool enabled);
bool isHotReloadEnabled() const;

// ReloadManager.cpp
void ReloadManager::setHotReloadEnabled(bool enabled) {
    hotReloadEnabled = enabled;
}

bool ReloadManager::isHotReloadEnabled() const {
    return hotReloadEnabled;
}

if (!hotReloadEnabled) {
    std::this_thread::sleep_for(2s);
    continue;
}

ImGui::Checkbox("Enable Hot Reloading", &reloadManager.hotReloadEnabled);

