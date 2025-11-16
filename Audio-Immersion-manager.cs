using UnityEngine;
using UnityEngine.Audio;

public class AudioImmersionManager : MonoBehaviour
{
    [Header("Master Audio Mixer")]
    public AudioMixer masterMixer;

    [Header("Core Clips")]
    public AudioClip menuSelect;
    public AudioClip menuEncryptedTone;
    public AudioClip hudPing;
    public AudioClip dialogueFadeIn;
    public AudioClip missionIntroEcho;
    public AudioClip mutatorWarp;
    public AudioClip stealthReverbPulse;
    public AudioClip pitchDistortCue;

    [Header("Sources")]
    public AudioSource sfxSource;
    public AudioSource ambientSource;
    public AudioSource dialogueSource;

    void Start()
    {
        PlayAmbientLoop("CalmAtmosphere");
    }

    // 🧩 Menu Interaction Sounds
    public void PlayMenuSelect()
    {
        sfxSource.PlayOneShot(menuSelect);
    }

    public void PlayEncryptedTone()
    {
        sfxSource.pitch = 1.2f;
        sfxSource.PlayOneShot(menuEncryptedTone);
    }

    // 🎯 HUD Feedback (Echo & Ping)
    public void TriggerHUDPing()
    {
        AudioEchoFilter echo = gameObject.AddComponent<AudioEchoFilter>();
        echo.delay = 150f;
        echo.decayRatio = 0.5f;
        sfxSource.PlayOneShot(hudPing);
        Destroy(echo, 2f);
    }

    // 🎙️ Dialogue FX
    public void PlayDialogueIntro(AudioClip clip)
    {
        dialogueSource.outputAudioMixerGroup = masterMixer.FindMatchingGroups("Dialogue")[0];
        masterMixer.SetFloat("ReverbLevel", 0.8f);
        dialogueSource.PlayOneShot(dialogueFadeIn);
        dialogueSource.PlayDelayed(0.5f);
        dialogueSource.clip = clip;
        dialogueSource.Play();
    }

    // 🌌 Mutator Sound FX
    public void TriggerMutatorEffect(string type)
    {
        switch (type)
        {
            case "GravityReversal":
                sfxSource.pitch = 0.5f;
                sfxSource.PlayOneShot(mutatorWarp);
                break;
            case "InvisibleMovement":
                ApplyPitchDistortion();
                break;
            case "TimeDilation":
                ambientSource.pitch = 0.7f;
                break;
        }
    }

    void ApplyPitchDistortion()
    {
        masterMixer.SetFloat("PitchShift", 0.6f);
        sfxSource.PlayOneShot(pitchDistortCue);
    }

    // ☁️ Stealth Reverb Pulse
    public void TriggerStealthPulse()
    {
        AudioReverbFilter reverb = gameObject.AddComponent<AudioReverbFilter>();
        reverb.reverbPreset = AudioReverbPreset.Generic;
        reverb.dryLevel = -1000;
        sfxSource.PlayOneShot(stealthReverbPulse);
        Destroy(reverb, 1.5f);
    }

    // 🔁 Ambient Layer Control
    public void PlayAmbientLoop(string mood)
    {
        AudioClip ambientTrack = Resources.Load<AudioClip>($"Ambient/{mood}");
        ambientSource.clip = ambientTrack;
        ambientSource.loop = true;
        ambientSource.Play();
    }
}

/Audio/
├── Menu/
│   ├── menu_select.wav
│   ├── encrypted_tone.wav
├── HUD/
│   └── hud_ping.wav
├── Dialogue/
│   ├── fade_in.wav
│   ├── shadow_intro.wav
├── Mutators/
│   ├── mutator_warp.wav
│   └── pitch_distort.wav
├── Effects/
│   ├── stealth_reverb.wav
│   └── sonar_echo.wav
├── Ambient/
│   ├── CalmAtmosphere.wav
│   ├── AlertPulse.wav

using System.Collections;
using UnityEngine;
using UnityEngine.Audio;

public class AudioImmersionManager : MonoBehaviour
{
    [Header("Master Audio Mixer")]
    public AudioMixer masterMixer;
    
    [Header("Core Clips")]
    public AudioClip menuSelect;
    public AudioClip menuEncryptedTone;
    public AudioClip hudPing;
    public AudioClip dialogueFadeIn;
    public AudioClip missionIntroEcho;
    public AudioClip mutatorWarp;
    public AudioClip stealthReverbPulse;
    public AudioClip pitchDistortCue;
    
    [Header("Sources")]
    public AudioSource sfxSource;
    public AudioSource ambientSource;
    public AudioSource dialogueSource;
    
    [Header("Audio Settings")]
    [Range(0f, 1f)]
    public float masterVolume = 1f;
    [Range(0f, 1f)]
    public float sfxVolume = 0.8f;
    [Range(0f, 1f)]
    public float ambientVolume = 0.6f;
    
    // Cache for loaded ambient clips
    private System.Collections.Generic.Dictionary<string, AudioClip> ambientClipCache = 
        new System.Collections.Generic.Dictionary<string, AudioClip>();
    
    // Track current ambient mood
    private string currentAmbientMood = "";
    
    void Start()
    {
        InitializeAudioSources();
        PlayAmbientLoop("CalmAtmosphere");
    }
    
    void InitializeAudioSources()
    {
        // Ensure audio sources have proper settings
        if (sfxSource == null) sfxSource = gameObject.AddComponent<AudioSource>();
        if (ambientSource == null) ambientSource = gameObject.AddComponent<AudioSource>();
        if (dialogueSource == null) dialogueSource = gameObject.AddComponent<AudioSource>();
        
        // Set initial volumes
        sfxSource.volume = sfxVolume;
        ambientSource.volume = ambientVolume;
        dialogueSource.volume = 1f;
        
        // Configure ambient source
        ambientSource.loop = true;
        ambientSource.playOnAwake = false;
    }
    
    // 🧩 Menu Interaction Sounds
    public void PlayMenuSelect()
    {
        if (menuSelect != null)
            sfxSource.PlayOneShot(menuSelect);
    }
    
    public void PlayEncryptedTone()
    {
        if (menuEncryptedTone != null)
        {
            float originalPitch = sfxSource.pitch;
            sfxSource.pitch = 1.2f;
            sfxSource.PlayOneShot(menuEncryptedTone);
            StartCoroutine(ResetPitchAfterDelay(originalPitch, menuEncryptedTone.length));
        }
    }
    
    // 🎯 HUD Feedback (Echo & Ping)
    public void TriggerHUDPing()
    {
        if (hudPing != null)
        {
            AudioEchoFilter echo = gameObject.GetComponent<AudioEchoFilter>();
            if (echo == null) echo = gameObject.AddComponent<AudioEchoFilter>();
            
            echo.delay = 150f;
            echo.decayRatio = 0.5f;
            sfxSource.PlayOneShot(hudPing);
            
            StartCoroutine(RemoveComponentAfterDelay(echo, 2f));
        }
    }
    
    // 🎙️ Enhanced Dialogue FX
    public void PlayDialogueIntro(AudioClip clip)
    {
        if (clip == null) return;
        
        StopCoroutine(nameof(DialogueSequence));
        StartCoroutine(DialogueSequence(clip));
    }
    
    IEnumerator DialogueSequence(AudioClip clip)
    {
        // Set mixer group
        var dialogueGroups = masterMixer.FindMatchingGroups("Dialogue");
        if (dialogueGroups.Length > 0)
            dialogueSource.outputAudioMixerGroup = dialogueGroups[0];
        
        // Apply reverb
        masterMixer.SetFloat("ReverbLevel", 0.8f);
        
        // Play fade in sound
        if (dialogueFadeIn != null)
            dialogueSource.PlayOneShot(dialogueFadeIn);
        
        // Wait for fade in
        yield return new WaitForSeconds(0.5f);
        
        // Play main dialogue
        dialogueSource.clip = clip;
        dialogueSource.Play();
        
        // Reset reverb after dialogue
        yield return new WaitForSeconds(clip.length);
        masterMixer.SetFloat("ReverbLevel", 0f);
    }
    
    // 🌌 Enhanced Mutator Sound FX
    public void TriggerMutatorEffect(string type)
    {
        switch (type.ToLower())
        {
            case "gravityreversal":
                StartCoroutine(GravityReversalEffect());
                break;
            case "invisiblemovement":
                ApplyPitchDistortion();
                break;
            case "timedilation":
                StartCoroutine(TimeDilationEffect());
                break;
            default:
                Debug.LogWarning($"Unknown mutator type: {type}");
                break;
        }
    }
    
    IEnumerator GravityReversalEffect()
    {
        float originalPitch = sfxSource.pitch;
        sfxSource.pitch = 0.5f;
        
        if (mutatorWarp != null)
            sfxSource.PlayOneShot(mutatorWarp);
        
        yield return new WaitForSeconds(2f);
        sfxSource.pitch = originalPitch;
    }
    
    IEnumerator TimeDilationEffect()
    {
        float originalPitch = ambientSource.pitch;
        ambientSource.pitch = 0.7f;
        
        yield return new WaitForSeconds(3f);
        
        // Smooth transition back to normal
        float elapsed = 0f;
        float duration = 1f;
        
        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            ambientSource.pitch = Mathf.Lerp(0.7f, originalPitch, elapsed / duration);
            yield return null;
        }
        
        ambientSource.pitch = originalPitch;
    }
    
    void ApplyPitchDistortion()
    {
        StartCoroutine(PitchDistortionEffect());
    }
    
    IEnumerator PitchDistortionEffect()
    {
        masterMixer.SetFloat("PitchShift", 0.6f);
        
        if (pitchDistortCue != null)
            sfxSource.PlayOneShot(pitchDistortCue);
        
        yield return new WaitForSeconds(1f);
        masterMixer.SetFloat("PitchShift", 1f);
    }
    
    // ☁️ Enhanced Stealth Reverb Pulse
    public void TriggerStealthPulse()
    {
        if (stealthReverbPulse != null)
        {
            AudioReverbFilter reverb = gameObject.GetComponent<AudioReverbFilter>();
            if (reverb == null) reverb = gameObject.AddComponent<AudioReverbFilter>();
            
            reverb.reverbPreset = AudioReverbPreset.Generic;
            reverb.dryLevel = -1000;
            sfxSource.PlayOneShot(stealthReverbPulse);
            
            StartCoroutine(RemoveComponentAfterDelay(reverb, 1.5f));
        }
    }
    
    // 🔁 Enhanced Ambient Layer Control
    public void PlayAmbientLoop(string mood)
    {
        if (currentAmbientMood == mood) return; // Already playing this mood
        
        StartCoroutine(CrossfadeAmbient(mood));
    }
    
    IEnumerator CrossfadeAmbient(string mood)
    {
        AudioClip newClip = GetAmbientClip(mood);
        if (newClip == null) yield break;
        
        // Fade out current ambient
        float fadeTime = 1f;
        float originalVolume = ambientSource.volume;
        
        // Fade out
        float elapsed = 0f;
        while (elapsed < fadeTime)
        {
            elapsed += Time.deltaTime;
            ambientSource.volume = Mathf.Lerp(originalVolume, 0f, elapsed / fadeTime);
            yield return null;
        }
        
        // Switch clip
        ambientSource.clip = newClip;
        ambientSource.Play();
        currentAmbientMood = mood;
        
        // Fade in
        elapsed = 0f;
        while (elapsed < fadeTime)
        {
            elapsed += Time.deltaTime;
            ambientSource.volume = Mathf.Lerp(0f, ambientVolume, elapsed / fadeTime);
            yield return null;
        }
        
        ambientSource.volume = ambientVolume;
    }
    
    AudioClip GetAmbientClip(string mood)
    {
        // Check cache first
        if (ambientClipCache.ContainsKey(mood))
            return ambientClipCache[mood];
        
        // Load from resources
        AudioClip clip = Resources.Load<AudioClip>($"Ambient/{mood}");
        if (clip != null)
        {
            ambientClipCache[mood] = clip;
        }
        else
        {
            Debug.LogWarning($"Ambient clip not found: Ambient/{mood}");
        }
        
        return clip;
    }
    
    // 🔧 Utility Methods
    IEnumerator ResetPitchAfterDelay(float originalPitch, float delay)
    {
        yield return new WaitForSeconds(delay);
        sfxSource.pitch = originalPitch;
    }
    
    IEnumerator RemoveComponentAfterDelay(Component component, float delay)
    {
        yield return new WaitForSeconds(delay);
        if (component != null)
            Destroy(component);
    }
    
    // 🎛️ Public Volume Controls
    public void SetMasterVolume(float volume)
    {
        masterVolume = Mathf.Clamp01(volume);
        masterMixer.SetFloat("MasterVolume", Mathf.Log10(masterVolume) * 20);
    }
    
    public void SetSFXVolume(float volume)
    {
        sfxVolume = Mathf.Clamp01(volume);
        sfxSource.volume = sfxVolume;
    }
    
    public void SetAmbientVolume(float volume)
    {
        ambientVolume = Mathf.Clamp01(volume);
        ambientSource.volume = ambientVolume;
    }
    
    // Clean up on destroy
    void OnDestroy()
    {
        StopAllCoroutines();
    }
}
