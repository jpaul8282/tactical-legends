using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections.Generic;

public class MultiplayerManager : MonoBehaviour
{
    public enum Mode
    {
        Offline,
        Online,
        Splitscreen
    }

    public Mode CurrentMode { get; private set; }
    private List<PlayerController> players = new List<PlayerController>();

    public void StartOffline()
    {
        CurrentMode = Mode.Offline;
        SetupSinglePlayer();
    }

    public void StartOnline()
    {
        CurrentMode = Mode.Online;
        SetupNetworkPlayers();
    }

    public void StartSplitscreen(int playerCount)
    {
        CurrentMode = Mode.Splitscreen;
        SetupSplitscreenPlayers(playerCount);
    }

    private void SetupSinglePlayer()
    {
        // Spawn one player, set up camera
        players.Clear();
        PlayerController player = InstantiatePlayer(0);
        players.Add(player);
        SetupCamera(player, 0, 1);
    }

    private void SetupNetworkPlayers()
    {
        // Network spawn logic (stubbed)
        players.Clear();
        int networkPlayerCount = GetNetworkPlayerCount();
        for (int i = 0; i < networkPlayerCount; i++)
        {
            PlayerController player = InstantiatePlayer(i);
            players.Add(player);
            SetupCamera(player, i, networkPlayerCount);
        }
    }

    private void SetupSplitscreenPlayers(int playerCount)
    {
        players.Clear();
        for (int i = 0; i < playerCount; i++)
        {
            PlayerController player = InstantiatePlayer(i);
            players.Add(player);
            SetupCamera(player, i, playerCount);
        }
    }

    private PlayerController InstantiatePlayer(int index)
    {
        // Instantiate player prefab logic here
        GameObject playerObj = new GameObject("Player" + index);
        PlayerController controller = playerObj.AddComponent<PlayerController>();
        controller.PlayerIndex = index;
        return controller;
    }

    private void SetupCamera(PlayerController player, int index, int totalPlayers)
    {
        // Example splitscreen setup (horizontal split for 2 players)
        Camera cam = player.gameObject.AddComponent<Camera>();
        if (totalPlayers == 1)
        {
            cam.rect = new Rect(0, 0, 1, 1);
        }
        else if (totalPlayers == 2)
        {
            cam.rect = new Rect(0, index * 0.5f, 1, 0.5f);
        }
        // Extend for more players or vertical split logic
    }

    private int GetNetworkPlayerCount()
    {
        // Stub: replace with actual network logic
        return 2;
    }
}
