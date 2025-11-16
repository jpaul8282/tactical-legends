using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

/// <summary>
/// Defines the regions for which maps can be loaded.
/// </summary>
public enum Region
{
    MiddleEast,
    Europe,
    South America,
    Gaza,
    Israel
}

/// <summary>
/// A serializable class to store a region and its corresponding map name.
/// This allows for easy configuration in the Unity Inspector.
/// </summary>
[Serializable]
public class MapEntry
{
    public Region region;
    public string mapName;
}

/// <summary>
/// Manages the loading of different maps based on a specified region.
/// </summary>
public class MapLoader: MonoBehaviour
{
    [Tooltip("A list of map entries, linking a region to a specific scene name.")]
    [SerializeField]
    private List<MapEntry> mapEntries = new List<MapEntry>();

    private Dictionary<Region, string> mapDictionary;

    private void Awake()
    {
        // Populate the dictionary from the list for fast lookups at runtime.
        mapDictionary = new Dictionary<Region, string>();
        foreach (var entry in mapEntries)
        {
            mapDictionary[entry.region] = entry.mapName;
        }
    }

    /// <summary>
    /// Loads the map associated with the given region.
    /// </summary>
    /// <param name="region">The region for which to load the map.</param>
    public void LoadMap(Region region)
    {
        if (mapDictionary.TryGetValue(region, out string mapToLoad))
        {
            SceneManager.LoadScene(mapToLoad);
            Debug.Log($"Loading map for region: {region}. Scene: {mapToLoad}");
        }
        else
        {
            Debug.LogError($"No map found for region: {region}. Please check the map entries in the Inspector.");
        }
    }
}


using UnityEngine;

public class MapLoader: MonoBehaviour
{
    public string[] MapNames = { "MiddleEast_Desert", "Europe_City", "SouthAmerica_Jungle", "Gaza_Urban", "Israel_Ops" };

    public void LoadMap(Region region)
    {
        string mapToLoad = "";
        switch(region)
        {
            case Region.MiddleEast:
                mapToLoad = MapNames[0];
                break;
            case Region.Europe:
                mapToLoad = MapNames[1];
                break;
            case Region.South America:
                mapToLoad = MapNames[2];
                break;
            case Region.Gaza:
                mapToLoad = MapNames[3];
                break;
            case Region.Israel:
                mapToLoad = MapNames[4];
                break;
        }
        UnityEngine.SceneManagement.SceneManager.LoadScene(mapToLoad);
    }
}
