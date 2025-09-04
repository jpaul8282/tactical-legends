#pragma once
#include "Unit.h"
#include <string>
#include <unordered_map>

class UnitLoader {
public:
    bool loadAllUnits(const std::string& modDirectory);
    bool reloadUnit(const std::string& unitFile);
    const std::unordered_map<std::string, Unit>& getUnits() const;

private:
    std::unordered_map<std::string, Unit> units;
};
#include <filesystem>
#include <chrono>
#include <unordered_map>

std::unordered_map<std::string, std::filesystem::file_time_type> fileTimestamps;

void checkForUnitUpdates(const std::string& modDirectory, UnitLoader& loader) {
    for (const auto& entry : std::filesystem::directory_iterator(modDirectory)) {
        if (entry.path().extension() == ".json") {
            auto currentTime = std::filesystem::last_write_time(entry.path());
            std::string pathStr = entry.path().string();

            if (!fileTimestamps.contains(pathStr) || fileTimestamps[pathStr] != currentTime) {
                loader.reloadUnit(pathStr);
                fileTimestamps[pathStr] = currentTime;
                std::cout << "Hot-reloaded: " << pathStr << "\n";
            }
        }
    }
}
// ReloadManager.h
#pragma once
#include <thread>
#include <atomic>
#include <mutex>
#include <unordered_map>
#include <filesystem>
#include <chrono>
#include "UnitLoader.h"

class ReloadManager {
public:
    ReloadManager(UnitLoader& loader, const std::string& modPath);
    ~ReloadManager();

    void start();
    void stop();
    bool hasReloaded() const;

private:
    void watchLoop();

    UnitLoader& loader;
    std::string modPath;
    std::thread watcherThread;
    std::atomic<bool> running = false;
    std::atomic<bool> reloaded = false;
    std::unordered_map<std::string, std::filesystem::file_time_type> timestamps;
    std::mutex reloadMutex;
};

// ReloadManager.cpp
#include "ReloadManager.h"

ReloadManager::ReloadManager(UnitLoader& loader, const std::string& modPath)
    : loader(loader), modPath(modPath) {}

ReloadManager::~ReloadManager() {
    stop();
}

void ReloadManager::start() {
    running = true;
    watcherThread = std::thread(&ReloadManager::watchLoop, this);
}

void ReloadManager::stop() {
    running = false;
    if (watcherThread.joinable()) watcherThread.join();
}

bool ReloadManager::hasReloaded() const {
    return reloaded;
}

void ReloadManager::watchLoop() {
    using namespace std::chrono_literals;
    while (running) {
        for (const auto& entry : std::filesystem::directory_iterator(modPath)) {
            if (entry.path().extension() == ".json") {
                auto pathStr = entry.path().string();
                auto currentTime = std::filesystem::last_write_time(entry.path());

                if (!timestamps.contains(pathStr) || timestamps[pathStr] != currentTime) {
                    {
                        std::lock_guard<std::mutex> lock(reloadMutex);
                        loader.reloadUnit(pathStr);
                        timestamps[pathStr] = currentTime;
                        reloaded = true;
                    }
                }
            }
        }
        std::this_thread::sleep_for(2s);
    }
}

if (reloadManager.hasReloaded()) {
    // Refresh UI, re-evaluate AI, or log reload
    std::cout << "Units hot-reloaded!\n";
    // Optionally reset the flag
    reloadManager.reloaded = false;
}

