using UnityEngine;

public class CinematicManager: MonoBehaviour
{
    public void PlayCinematic(string cinematicName)
    {
        // Integrate Unity Timeline or custom cutscene logic
        Debug.Log("Playing cinematic: " + cinematicName);
        // Example: TimelineDirector.Play(cinematicName);
    }
}
using UnityEngine.Playables;

public class CinematicManager: MonoBehaviour
{
    public PlayableDirector director;

    public void PlayCinematic(PlayableAsset cinematicAsset)
    {
        if (director != null && cinematicAsset != null)
        {
            director.playableAsset = cinematicAsset;
            director.Play();
            Debug.Log("Playing cinematic: " + cinematicAsset.name);
        }
        else
        {
            Debug.LogWarning("PlayableDirector or cinematic asset is missing.");
        }
    }
}
if (string.IsNullOrEmpty(cinematicName))
{
    Debug.LogWarning("Cinematic name is null or empty.");
    return;
}
private Dictionary<string, Action> cinematicRegistry;

private void Awake()
{
    cinematicRegistry = new Dictionary<string, Action>
    {
        { "Intro", PlayIntroCutscene },
        { "BossFight", PlayBossFightCutscene }
    };
}

public void PlayCinematic(string cinematicName)
{
    if (cinematicRegistry.TryGetValue(cinematicName, out var action))
    {
        action.Invoke();
        Debug.Log("Playing cinematic: " + cinematicName);
    }
    else
    {
        Debug.LogWarning("Cinematic not found: " + cinematicName);
    }
}
public interface ICutscene
{
    string Name { get; }
    void Play();
    void Stop();
}
using UnityEngine.Playables;

public class TimelineCutscene: ICutscene
{
    public string Name { get; private set; }
    private PlayableDirector director;
    private PlayableAsset asset;

    public TimelineCutscene(string name, PlayableDirector director, PlayableAsset asset)
    {
        Name = name;
        this.director = director;
        this.asset = asset;
    }

    public void Play()
    {
        director.playableAsset = asset;
        director.Play();
    }

    public void Stop()
    {
        director.Stop();
    }
}
public class ScriptedCutscene: ICutscene
{
    public string Name { get; private set; }
    private Action playAction;
    private Action stopAction;

    public ScriptedCutscene(string name, Action play, Action stop = null)
    {
        Name = name;
        playAction = play;
        stopAction = stop;
    }

    public void Play() => playAction?.Invoke();
    public void Stop() => stopAction?.Invoke();
}
public class CutsceneManager: MonoBehaviour
{
    private Dictionary<string, ICutscene> cutscenes = new();

    public void RegisterCutscene(ICutscene cutscene)
    {
        if (!cutscenes.ContainsKey(cutscene.Name))
            cutscenes.Add(cutscene.Name, cutscene);
    }

    public void Play(string name)
    {
        if (cutscenes.TryGetValue(name, out var cutscene))
        {
            cutscene.Play();
            Debug.Log($"Playing cutscene: {name}");
        }
        else
        {
            Debug.LogWarning($"Cutscene not found: {name}");
        }
    }

    public void Stop(string name)
    {
        if (cutscenes.TryGetValue(name, out var cutscene))
        {
            cutscene.Stop();
            Debug.Log($"Stopped cutscene: {name}");
        }
    }
}
using UnityEngine.AddressableAssets;
using UnityEngine.ResourceManagement.AsyncOperations;

public void LoadAndRegisterTimeline(string name, PlayableDirector director)
{
    Addressables.LoadAssetAsync<PlayableAsset>(name).Completed += handle =>
    {
        if (handle.Status == AsyncOperationStatus.Succeeded)
        {
            var cutscene = new TimelineCutscene(name, director, handle.Result);
            RegisterCutscene(cutscene);
        }
    };
}
