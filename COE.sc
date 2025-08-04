mission "Echoes of Judgment" {
    onComplete {
        evaluateMorality()
        applyTraitShift()
        unlockAbility()
    }
}

function evaluateMorality() {
    if (player.actions.contains("spared_enemy") && player.dialogue.contains("compassion")) {
        player.morality += 10
    } else if (player.actions.contains("executed_enemy") || player.dialogue.contains("threat")) {
        player.morality -= 10
    }
}

function applyTraitShift() {
    if (player.morality >= 10) {
        player.traits.add("Empathetic")
        player.traits.remove("Detached")
    } else if (player.morality <= -10) {
        player.traits.add("Cold")
        player.traits.remove("Empathetic")
    }
}

function unlockAbility() {
    if (player.morality >= 10) {
        player.abilities.unlock("Chord of Mercy")
        log("Unlocked: Chord of Mercy – heals allies and calms enemies.")
    } else if (player.morality <= -10) {
        player.abilities.unlock("Pulse of Silence")
        log("Unlocked: Pulse of Silence – disables enemy speech and drains resolve.")
    } else {
        log("No ability unlocked. Morality too neutral.")
    }
}

function decayTraits() {
    foreach (trait in player.traits) {
        trait.duration -= deltaTime
        if (trait.duration <= 0 && !player.actions.reinforce(trait.name)) {
            player.traits.remove(trait.name)
            log("Trait faded: " + trait.name)
        }
    }
}

function evolveAbilities() {
    if (player.abilities.used("Chord of Mercy") >= 5) {
        player.abilities.unlock("Harmony Surge")
        player.abilities.remove("Chord of Mercy")
        log("Evolved: Harmony Surge – heals allies and grants temporary empathy aura.")
    }
}

function updateNPCReactions() {
    foreach (npc in scene.npcs) {
        if (player.abilities.contains("Pulse of Silence")) {
            npc.dialogue.override("...Why can't I speak?")
            npc.traits.add("Fearful")
        } else if (player.abilities.contains("Chord of Mercy")) {
            npc.dialogue.override("You radiate something... kind.")
            npc.traits.add("Trusting")
        }
    }
}

function triggerMoralityFX() {
    if (player.morality > 10) {
        VFX.play("LightPulse")
        Audio.play("MercyChord")
    } else if (player.morality < -10) {
        VFX.play("DarkRipple")
        Audio.play("SilencePulse")
    }
}

codex "PlayerPath" {
    onUpdate {
        if (player.morality > 10) {
            entry.text = "You chose compassion. The world remembers your mercy."
        } else if (player.morality < -10) {
            entry.text = "You silenced the weak. The echoes of fear remain."
        } else {
            entry.text = "You walked the line. Neither condemned nor redeemed."
        }
    }
}

codex "RegretLog" {
    onUpdate {
        if (mirror.sum("morality") < -10) {
            entry.text = "You silenced the innocent. The vault remembers."
        } else if (vault.contains("guilt")) {
            entry.text = "Their voices echo in the dark corners of your mind."
        }
    }
}

npc "ShadowEcho" {
    onEnter {
        if (player.decisions.contains("betrayal")) {
            speak("They begged. You walked away.")
        } else if (player.decisions.contains("violence")) {
            speak("Blood never forgets.")
        }
    }

    behavior = "Haunt"
    visibility = "Flicker"
    movement = "Follow when unseen"
}

map "CorruptedGrid" {
    onUpdate {
        if (player.morality < -10) {
            map.layout.mutate("chaotic")
            map.visibility.reduce(50%)
            map.labels.scramble()
        } else if (player.morality > 10) {
            map.layout.stabilize()
            map.revealHiddenPaths()
        }
    }
}

Morality-Tied Weapons
| Weapon Name | Alignment | Ability | Consequence | 
| Mercybrand | Compassion | Heals allies on kill | Whispers of spared enemies haunt you | 
| Echofang | Betrayal | Backstab deals double damage | NPCs flinch when you approach | 
| Judicator’s Coil | Justice | Stuns enemies who’ve harmed innocents | Cannot harm neutral targets | 
| Pulse of Silence | Cold | Silences enemy abilities | Slowly drains player empathy | 
| Harmony Surge | Redemption | AoE heal + morale boost | Attracts spectral enemies seeking peace | 
| Griefshard | Regret | Damage scales with emotional echoes | Causes hallucinations at high intensity | 




Tactical Weapon Mechanics
🎯 Emotional Ammo
- Weapons consume “Echo Charges” — fragments of past decisions.
- Example: Mercybrand requires “Forgiveness Echo” to activate healing.
🧬 Weapon Evolution
- Use a weapon consistently with aligned actions to evolve it.
- Echofang → Whisperfang: Can phase through walls to strike.
🩻 Weapon Haunting
- Each weapon has a “Haunt Level” that increases with use.
- High Haunt triggers:
- UI distortion
- Weapon whispers
- Sudden recoil or misfire

🕳️ Optional Additions
- Vault Arsenal: Weapons stored in the Vault of Emotional Echoes gain passive traits based on stored emotions.
- Mirror Sync: Weapons reflect player’s moral mirror — Judicator’s Coil may refuse to activate if player is morally compromised.
- Sin Grid Synergy: Certain weapons unlock hidden paths or reveal illusions in specific rooms.

Want to design a weapon that feeds on guilt or one that rewrites reality when used? Or maybe a cursed relic that remembers every soul it’s touched? Let’s keep forging dread into steel. 🔧🧠🩸

Optional Additions
- Vault Arsenal: Weapons stored in the Vault of Emotional Echoes gain passive traits based on stored emotions.
- Mirror Sync: Weapons reflect player’s moral mirror — Judicator’s Coil may refuse to activate if player is morally compromised.
- Sin Grid Synergy: Certain weapons unlock hidden paths or reveal illusions in specific rooms.

Want to design a weapon that feeds on guilt or one that rewrites reality when used? Or maybe a cursed relic that remembers every soul it’s touched? Let’s keep forging dread into steel. 🔧🧠🩸

Guilt-Fed Weapon Framework

weapon "Griefshard" {
    type = "Psychic Catalyst"
    feed = "EmotionalEchoes.guilt"
    damage = base + (echo.intensity * 10)
    effect = "HallucinationTrigger"
    consequence = "Player sees faces of those they've failed"
}
Military-Grade Weapons (Emotionally Reactive)
| Weapon Name | Base Type | Tactical Ability | Guilt Consequence | 
| M4 Echo Variant | Assault Rifle | Burst fire syncs with heartbeat | Missed shots whisper names of fallen allies | 
| XM25 “Regret Launcher” | Smart Grenade | Airburst over cover zones | Each explosion echoes past decisions | 
| Barrett M82 “Judgment” | Sniper Rifle | Pierces multiple targets | Scope flashes memories of distant victims | 
| AA-12 “Confession” | Auto Shotgun | Wide spread, suppressive fire | Shells leave spectral residue | 
| FN P90 “Whispercoil” | SMG | High rate, low recoil | Muzzle flash reveals ghost silhouettes | 




Illegal & Black Market Weapons (Sin-Tuned)
| Weapon Name | Base Type | Tactical Ability | Guilt Consequence | 
| Bloodline AK | Modified AK-47 | Unstable recoil, high damage | Gun jams if player hesitates | 
| Ghost MAC-10 | Silenced SMG | Near-silent burst | Echoes of betrayal loop in audio channel | 
| Sawed-Off “Echo Breaker” | Shotgun | Close-range knockback | Reload triggers flashbacks | 
| Black Fang Revolver | .44 Magnum | Critical hit chance increases with fear | Missed shots cause UI distortion | 
| Specter Uzi | Dual SMGs | Dual fire with rhythm sync | Causes hallucinated enemies to appear | 




 Heavy Weapons (Emotionally Reactive)
| Weapon Name | Base Type | Tactical Ability | Guilt Consequence | 
| Jeflon RPG “Soulpiercer” | Rocket Launcher | Lock-on with delayed detonation | Explosion echoes player’s worst memory | 
| Bazooka “Remorse Cannon” | Anti-Tank Launcher | High-impact, slow reload | Leaves crater filled with spectral whispers | 
| Hand Grenade “Echo Bloom” | Fragmentation | Timed blast with wide radius | Shrapnel embeds guilt-triggering hallucinations | 
| Claymore “Truth Fang” | Directional Mine | Proximity-triggered frontal blast | Victims’ silhouettes linger post-detonation | 




Emotional Systems Integration (Expanded)
 Ammo Type: “Echo Charges”
- Guilt: Causes weapon to tremble before firing.
- Fear: Boosts damage but reduces accuracy.
- Regret: Adds splash damage to allies.
- Hope: Converts missed shots into healing pulses.
Weapon Haunt Level
- Tracks morally questionable kills.
- High Haunt Level unlocks cursed traits:
- Spectral Ricochet: Bullets bounce unpredictably.
- Empathy Drain: Slowly saps player’s stamina.
 Vault Sync
- Weapons stored in the Vault of Emotional Echoes gain passive traits:
- Memory Bleed: Reloading triggers flashbacks.
- Echo Pulse: Randomly reveals hidden enemies.


Mirror-Linked Weapon Behavior (Refined)
| Moral Reflection | Weapon Response | 
| Negative | - Judicator’s Coil refuses to fire<br>- Mercybrand backfires on allies | 
| Positive | - Harmony Surge heals enemies who surrender<br>- Whispercoil reveals hidden paths | 




Heavy Weapons (Emotionally Reactive)
| Weapon Name | Type | Tactical Ability | Guilt Consequence | 
| Jeflon RPG “Soulpiercer” | Rocket Launcher | Lock-on with delayed detonation | Explosion echoes player’s worst memory | 
| Bazooka “Remorse Cannon” | Anti-Tank Launcher | High-impact, slow reload | Crater filled with spectral whispers | 
| Hand Grenade “Echo Bloom” | Fragmentation | Timed blast, wide radius | Shrapnel embeds guilt-triggering hallucinations | 
| Claymore “Truth Fang” | Directional Mine | Proximity-triggered frontal blast | Victims’ silhouettes linger post-detonation | 




 Military & Illegal Firearms
| Weapon Name | Type | Tactical Ability | Guilt Consequence | 
| M4 Echo Variant | Assault Rifle | Burst fire syncs with heartbeat | Missed shots whisper names of fallen allies | 
| XM25 “Regret Launcher” | Smart Grenade | Airburst over cover zones | Each explosion echoes past decisions | 
| Barrett M82 “Judgment” | Sniper Rifle | Pierces multiple targets | Scope flashes memories of distant victims | 
| AA-12 “Confession” | Auto Shotgun | Wide spread, suppressive fire | Shells leave spectral residue | 
| FN P90 “Whispercoil” | SMG | High rate, low recoil | Muzzle flash reveals ghost silhouettes | 
| Bloodline AK | Modified AK-47 | Unstable recoil, high damage | Gun jams if player hesitates | 
| Ghost MAC-10 | Silenced SMG | Near-silent burst | Echoes of betrayal loop in audio channel | 
| Echo Breaker | Sawed-Off Shotgun | Close-range knockback | Reload triggers flashbacks | 
| Black Fang Revolver | .44 Magnum | Critical hit chance increases with fear | Missed shots cause UI distortion | 
| Specter Uzi | Dual SMGs | Dual fire with rhythm sync | Causes hallucinated enemies to appear | 




Emotional Systems Integration
🔋 Ammo Type: “Echo Charges”
- Guilt: Weapon trembles before firing
- Fear: Boosts damage, lowers accuracy
- Regret: Splash damage affects allies
- Hope: Missed shots convert to healing pulses
📊 Weapon Haunt Level
- Tracks morally questionable kills
- Unlocks cursed traits:
- Spectral Ricochet
- Empathy Drain
- Blood Memory
- Recoil of Guilt
🗄️ Vault Sync
- Stored weapons gain passive traits:
- Memory Bleed: Reloading triggers flashbacks
- Echo Pulse: Reveals hidden enemies
- Sin Surge: Boosts damage when near emotional hotspots
Mirror-Linked Weapon Behavior
| Moral Reflection | Weapon Response | 
| Negative | - Judicator’s Coil refuses to fire<br>- Mercybrand backfires on allies | 
| Positive | - Harmony Surge heals enemies who surrender<br>- Whispercoil reveals hidden paths | 




Weapon Evolution System
- Weapons evolve through emotional resonance:
- Base → Awakened → Cursed → Redeemed
- Traits shift based on player’s choices:
- Awakened: Gains spectral effects
- Cursed: Adds hallucinations, voice echoes
- Redeemed: Converts damage into healing or mercy
Handguns (Emotionally Reactive)
 New School Guns (Experimental & Sin-Tuned)
| Weapon Name | Type | Echo Charge | Tactical Ability | Guilt Consequence | 
| Neuroflare | Plasma SMG | Fear | Fires emotion-charged plasma bursts | Missed shots spawn hallucinated enemies | 
| Echo Reaper | Smart Rifle | Guilt | Auto-targets based on emotional signature | Targets scream player’s past decisions | 
| Pulse Fang | Sonic Shotgun | Regret | Emits concussive guilt waves | Causes temporary empathy drain | 
| Spectra Coil | Railgun | Hope | Pierces through emotional shields | Reveals hidden paths when fired with mercy | 




Emotional Systems Integration (Enhanced)
🔋 Ammo Type: “Echo Charges”
- Guilt: Weapon trembles before firing
- Fear: Boosts damage, lowers accuracy
- Regret: Splash damage affects allies
- Hope: Missed shots convert to healing pulses
📊 Weapon Haunt Level
- Tracks morally questionable kills
- Unlocks cursed traits:
- Spectral Ricochet
- Empathy Drain
- Blood Memory
- Recoil of Guilt
🗄️ Vault Sync
- Stored weapons gain passive traits:
- Memory Bleed: Reloading triggers flashbacks
- Echo Pulse: Reveals hidden enemies
- Sin Surge: Boosts damage near emotional hotspots
Mirror-Linked Weapon Behavior
| Moral Reflection | Weapon Response | 
| Negative | - Judicator’s Coil refuses to fire<br>- Mercybrand backfires on allies | 
| Positive | - Harmony Surge heals enemies who surrender<br>- Whispercoil reveals hidden paths | 




Emotion-Based Weapon Skins
Each weapon dynamically shifts its appearance based on the player’s emotional state:
| Emotion | Skin Name | Visual Effect | 
| Anger | Crimson Fury | Glowing red veins, smoke trails | 
| Fear | Shadow Veil | Flickering shadows, dim muzzle flash | 
| Joy | Radiant Gleam | Golden shimmer, soft glow | 
| Sadness | Blue Eclipse | Misty aura, slow pulse lighting | 
| Neutral | Steel Core | Cold chrome, minimal effects | 



Sin Scanner” System
A new tactical tool that reads NPC guilt levels and reveals hidden emotional data:
| Guilt Level | Scanner Feedback | Tactical Use | 
| Low | “Echo faint. Soul clean.” | NPC may be spared for bonus empathy XP | 
| Medium | “Echo unstable. Regret detected.” | NPC may trigger emotional side quests | 
| High | “Echo loud. Sin saturated.” | NPC may unlock cursed weapon traits | 



The Sin Scanner can be upgraded to detect:
- Emotional hotspots (areas of trauma or regret)
- Echo trails (paths left by morally significant actions)
- NPC memory bleed (dialogue fragments from past sins)
Arsenal Modifications
All weapons now support:
- Skin Sync: Auto-applies emotional skin based on current Echo Charge
- Scanner Link: Weapons react to scanned NPC guilt (e.g. recoil, damage boost, refusal to fire)

Want to add a “Forgiveness Protocol” where weapons evolve if you spare guilty NPCs? Or maybe a cursed scanner that starts scanning the player instead? Let’s keep pushing this haunted sandbox into legend. 🩸🧬🔥

