using UnityEngine;

public class MapLoader : MonoBehaviour
{
    public string[] MapNames = { "MiddleEast_Desert", "Europe_City", "SouthAmerica_Jungle" };

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
            case Region.SouthAmerica:
                mapToLoad = MapNames[2];
                break;
        }
        UnityEngine.SceneManagement.SceneManager.LoadScene(mapToLoad);
    }
}