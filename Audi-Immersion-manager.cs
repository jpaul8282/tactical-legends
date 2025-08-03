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
