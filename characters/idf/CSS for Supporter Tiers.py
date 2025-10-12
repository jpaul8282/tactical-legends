.supporters {
  margin: 80px 0;
  text-align: center;
  color: #00ff88;
}

.supporters h2 {
  font-size: 2.5rem;
  font-family: 'Orbitron', monospace;
  margin-bottom: 30px;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.6);
}

.tiers {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
}

.tier {
  background: rgba(10, 10, 10, 0.8);
  border: 2px solid #00ff88;
  border-radius: 12px;
  padding: 30px;
  width: 280px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
}

.tier: hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.4);
}

.tier h3 {
  font-size: 1.8rem;
  font-family: 'Orbitron', monospace;
  margin-bottom: 10px;
}

.tier p {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #00ffaa;
}

.tier ul {
  list-style: none;
  margin-bottom: 20px;
}

.tier ul li {
  margin: 8px 0;
  font-size: 1rem;
}

.tier button {
  background: linear-gradient(45deg, #00ff88, #00ffff);
  border: none;
  padding: 10px 20px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  color: #000;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.tier button: hover {
  background: linear-gradient(45deg, #00ffff, #00ff88);
}
.trailer {
  margin: 80px 0;
  text-align: center;
  color: #00ff88;
}

.trailer h2 {
  font-size: 2.5rem;
  font-family: 'Orbitron', monospace;
  margin-bottom: 30px;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.6);
}

.video-wrapper {
  position: relative;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border: 2px solid #00ff88;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
