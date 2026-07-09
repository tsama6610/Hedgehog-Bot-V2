const { createCanvas, loadImage } = require('canvas');
const fs = require("fs-extra");
const path = require("path");
const GIFEncoder = require('gifencoder');

const characters = [
  { name: "ʚʆɞ𝕔é𝕝𝕖𝕤𝕥𝕚𝕟 𝕥𝕙𝗲 𝕜𝕚𝕟げるʚʆɞ ネ", power: 89, basic: "pouvoir de Mark Zuckerberg", ultimate: " attaque +coup Géant 🌪️", color: "#00ffff" },
  { name: "Naruto (Mode Ermite)", power: 60, basic: "Rasengan Géant 🌪️", ultimate: "Futon Rasenshuriken 🌪️💨", color: "#ff9900" },
  { name: "Naruto (Rikudo)", power: 70, basic: "Orbe Truth Seeker ⚫", ultimate: "Bijuu Mode Rasenshuriken 🦊🌪️", color: "#ffff00" },
  { name: "Naruto (Baryon Mode)", power: 85, basic: "Punch Ultra Rapide ⚡", ultimate: "Explosion Chakra Nucléaire ☢️", color: "#ff3333" },
  { name: "Sasuke Uchiha", power: 60, basic: "Chidori ⚡", ultimate: "Kirin ⚡🌩️", color: "#2a0066" },
  { name: "Sasuke (Taka)", power: 65, basic: "Chidori Nagashi ⚡💧", ultimate: "Susano'o 💀", color: "#6600cc" },
  { name: "Sasuke (Rinnegan)", power: 70, basic: "Amaterasu 🔥", ultimate: "Indra's Arrow ⚡🏹", color: "#9d4edd" },
  { name: "Kakashi Hatake", power: 60, basic: "Raikiri ⚡", ultimate: "Kamui 🌀", color: "#00bfff" },
  { name: "Kakashi (DMS)", power: 75, basic: "Kamui Raikiri ⚡🌀", ultimate: "Susano'o Parfait 💠", color: "#00ffff" },
  { name: "Minato Namikaze", power: 80, basic: "Hiraishin Rasengan ⚡🌀", ultimate: "Mode Kyuubi 🦊", color: "#ffcc00" },
  { name: "Hashirama Senju", power: 70, basic: "Foret Naissante 🌳", ultimate: "Art Senin 🌿", color: "#006622" },
  { name: "Tobirama Senju", power: 60, basic: "Suiton: Dragon 🌊", ultimate: "Edo Tensei ⚰️", color: "#0044ff" },
  { name: "Tsunade", power: 60, basic: "Coup Surprenant 💥", ultimate: "Sceau Byakugō 💎", color: "#ff66cc" },
  { name: "Hiruzen Sarutobi", power: 65, basic: "5 Éléments 🌍🔥💧🌪️⚡", ultimate: "Shinimagi Seal ☠️", color: "#8b0000" },
  { name: "Pain (Tendo)", power: 68, basic: "Shinra Tensei ⬇️", ultimate: "Chibaku Tensei ⬆️", color: "#ff4500" },
  { name: "Itachi Uchiha", power: 70, basic: "Tsukuyomi 🌙", ultimate: "Amaterasu + Susano'o 🔥💀", color: "#ff0000" },
  { name: "Madara (Rikudo)", power: 85, basic: "Truth Seeker Orbs ⚫", ultimate: "Infinite Tsukuyomi 🌙", color: "#cc99ff" },
  { name: "Obito Uchiha", power: 70, basic: "Kamui 🌀", ultimate: "Jūbi Mode 🔥", color: "#ff5500" },
  { name: "Kaguya Otsutsuki", power: 78, basic: "Portail Dimensionnel 🌀", ultimate: "Os Cendré + Expansion Divine ☄️", color: "#e6e6fa" },
  { name: "Boruto (Karma)", power: 75, basic: "Rasengan Spatial 🌌", ultimate: "Pouvoir Otsutsuki 🌙", color: "#00ffff" },
  { name: "Kawaki", power: 70, basic: "Transformation Morpho ⚔️", ultimate: "Karma Full Power 💀", color: "#ff0055" },
  { name: "Isshiki Otsutsuki", power: 90, basic: "Sukunahikona 🔍", ultimate: "Daikokuten ⏳", color: "#7b2cbf" }
];

const damageSystem = {
  basic: { min: 8, max: 15, chakraCost: 0 },
  special: { min: 15, max: 25, chakraCost: 20 },
  ultimate: { min: 30, max: 45, chakraCost: 75, failChance: 0.3 },
  charge: { chakraGain: 25 }
};

// =========================================================
// 🚀 GIGANTESQUE ENGINE GIF STORM - 50 FRAMES ANIMÉES
// =========================================================
async function generateStormGIF(p1Id, p2Id, title, sub, details, themeColor, badge = "STORM V4") {
	const width = 950; const height = 520;
	const canvas = createCanvas(width, height); const ctx = canvas.getContext('2d');
	const totalFrames = 50;

	const tmpDir = path.join(__dirname, "..", "cache");
	await fs.ensureDir(tmpDir);
	const gifPath = path.join(tmpDir, `storm_${Date.now()}_game.gif`);

	const encoder = new GIFEncoder(width, height);
	const writeStream = fs.createWriteStream(gifPath);
	encoder.createReadStream().pipe(writeStream);
	encoder.start(); encoder.setRepeat(0); encoder.setDelay(65); encoder.setQuality(18);

	const loadAv = async (id) => {
		try { return await loadImage(`https://graph.facebook.com/${id}/picture?height=400&width=400&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`); }
		catch { try { return await loadImage(`https://api.mestaria.com/fb/avatar?id=${id}`); } catch { return null; } }
	};

	const av1 = p1Id ? await loadAv(p1Id) : null;
	const av2 = p2Id ? await loadAv(p2Id) : null;

	for (let f = 0; f < totalFrames; f++) {
		ctx.clearRect(0, 0, width, height);

		// Fond Espace de combat Cyber
		let grad = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, width);
		grad.addColorStop(0, '#0a061c'); grad.addColorStop(0.7, '#020205'); grad.addColorStop(1, '#000000');
		ctx.fillStyle = grad; ctx.fillRect(0, 0, width, height);

		// Ring Aura Pulsant
		ctx.strokeStyle = themeColor || "#00ffcc";
		ctx.lineWidth = (f % 5 === 0) ? 5 : 3;
		ctx.shadowColor = themeColor || "#00ffcc"; ctx.shadowBlur = (f % 5 === 0) ? 20 : 10;
		ctx.beginPath(); ctx.roundRect(20, 20, width - 40, height - 40, 15); ctx.stroke();
		ctx.shadowBlur = 0;

		// Dessin Joueur 1 (Gauche)
		if (av1) {
			ctx.save(); ctx.beginPath(); ctx.arc(160, 260, 80, 0, Math.PI * 2); ctx.clip();
			ctx.drawImage(av1, 80, 180, 160, 160); ctx.restore();
			ctx.strokeStyle = themeColor || "#ffaa00"; ctx.lineWidth = 4;
			ctx.beginPath(); ctx.arc(160, 260, 86, f*0.1, f*0.1 + Math.PI); ctx.stroke();
		}

		// Dessin Joueur 2 (Droite)
		if (av2) {
			ctx.save(); ctx.beginPath(); ctx.arc(790, 260, 80, 0, Math.PI * 2); ctx.clip();
			ctx.drawImage(av2, 710, 180, 160, 160); ctx.restore();
			ctx.strokeStyle = "#ff3366"; ctx.lineWidth = 4;
			ctx.beginPath(); ctx.arc(790, 260, 86, -f*0.1, -f*0.1 + Math.PI); ctx.stroke();
		}

		// Effet d'Impact Énergétique Central au pic du round
		if (f >= 15 && f <= 35) {
			ctx.fillStyle = (f % 2 === 0) ? "rgba(255,255,255,0.15)" : themeColor || "#00ffcc";
			ctx.beginPath(); ctx.arc(width/2, height/2 - 20, (f - 15) * 8, 0, Math.PI * 2); ctx.fill();
		}

		// Textes et logs
		ctx.textAlign = 'center';
		ctx.fillStyle = "#ffffff"; ctx.font = 'bold 36px "Sans-Serif"';
		ctx.fillText(title.toUpperCase(), width / 2, 95);

		ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '16px "Sans-Serif"';
		ctx.fillText(sub, width / 2, 135);

		ctx.fillStyle = "#ffffff"; ctx.font = 'bold 20px "Sans-Serif"';
		ctx.fillText(details, width / 2, 380);

		// Interface de commande basse clignotante
		ctx.fillStyle = themeColor || "#00ffcc"; ctx.font = 'bold 12px "Sans-Serif"';
		ctx.fillText(`⚡ SHINOBI SYSTEM MATRIX // FRAME_${f.toString().padStart(2, '0')} // ${badge} ⚡`, width / 2, 470);

		encoder.addFrame(ctx);
	}
	encoder.finish();
	await new Promise((res) => writeStream.on('finish', res));
	return gifPath;
}

const gameState = {};

module.exports = {
  config: { 
    name: "naruto-storm", 
    aliases: ["storm", "ns"],
    version: "4.6 Fifty-Frames-Storm",
    author: "Delfa x NeoKEX x Célestin",
    role: 0,
    category: "game",
    description: { fr: "Jeu de combat Naruto ultime avec 4 fonctions graphiques et rendu 50 frames complet." }
  },

  onStart: async function ({ message, event }) {
    const threadID = event.threadID;
    gameState[threadID] = {
      step: "waiting_start", players: {}, turn: null, p1Character: null, p2Character: null,
      p1HP: 100, p2HP: 100, p1Chakra: 100, p2Chakra: 100, chakraRegen: 5, defending: false
    };

    const gif = await generateStormGIF(event.senderID, null, "Naruto Storm 4.6", "Initialisation de l'arène de combat", "Envoyez 'start' pour lancer le protocole", "#ffaa00", "LOBBY");
    return message.reply({ body: "🎮 **NARUTO-STORM V4.6**\nEnvoie **start** pour t'inscrire !", attachment: fs.createReadStream(gif) }, () => fs.unlinkSync(gif));
  },

  onChat: async function ({ event, message, usersData }) {
    const threadID = event.threadID; const userID = event.senderID; const body = event.body.toLowerCase();
    if (!gameState[threadID]) return; const state = gameState[threadID];

    if (state.step !== "waiting_start" && state.step !== "choose_p1" && state.step !== "choose_p2" && 
        userID !== state.players.p1 && userID !== state.players.p2) return;

    if (body === 'fin') {
      delete gameState[threadID];
      return message.reply("🔄 Partie réinitialisée. Prêt pour un nouveau combat !");
    }

    if (state.step === "waiting_start" && body === "start") {
      state.step = "choose_p1"; state.players.p1 = userID;
      const gif = await generateStormGIF(userID, null, "Inscription P1", "Attente des joueurs", "Joueur 1 enregistré. Écris 'p1'", "#00ffcc", "P1 JOIN");
      return message.reply({ body: "🧙 **Joueur 1 enregistré !** Tapez **p1** pour valider.", attachment: fs.createReadStream(gif) }, () => fs.unlinkSync(gif));
    }

    if (state.step === "choose_p1" && body === 'p1') {
      if (userID !== state.players.p1) return;
      state.step = "choose_p2";
      return message.reply("🧝 **Joueur 2**, envoyez **p2** pour rejoindre la bataille !");
    }

    if (state.step === "choose_p2" && body === 'p2') {
      if (userID === state.players.p1) return message.reply("❌ Tu ne peux pas jouer contre toi-même, bro !");
      state.players.p2 = userID; state.step = "choose_characters_p1";
      
      let characterList = "🎭 **SÉLECTION DU NINJA**\n━━━━━━━━━━━━━━\n";
      characterList += characters.map((char, i) => `${i + 1}. ${char.name} (${char.power}★)`).join("\n");
      
      const p1Name = (await usersData.get(state.players.p1)).name;
      return message.reply(`${characterList}\n\n@${p1Name} **Joueur 1**, réponds avec le numéro de ton combattant !`);
    }

    if (state.step.startsWith("choose_characters")) {
      const index = parseInt(body) - 1;
      if (isNaN(index) || index < 0 || index >= characters.length) return message.reply("❌ Numéro invalide !");

      if (state.step === "choose_characters_p1" && userID === state.players.p1) {
        state.p1Character = characters[index]; state.step = "choose_characters_p2";
        const p2Name = (await usersData.get(state.players.p2)).name;
        const gif = await generateStormGIF(state.players.p1, null, "Choix Effectué", "Ninja validé", `P1 a choisi : ${state.p1Character.name}`, state.p1Character.color, "LOCK P1");
        return message.reply({ body: `✅ **P1 prêt !**\n@${p2Name} **Joueur 2**, choisis ton numéro à ton tour !`, attachment: fs.createReadStream(gif) }, () => fs.unlinkSync(gif));
      }

      if (state.step === "choose_characters_p2" && userID === state.players.p2) {
        state.p2Character = characters[index]; state.turn = "p1"; state.step = "battle";
        
        const p1Name = (await usersData.get(state.players.p1)).name;
        const p2Name = (await usersData.get(state.players.p2)).name;
        
        const gif = await generateStormGIF(state.players.p1, state.players.p2, "Combat Lancé", `${state.p1Character.name} VS ${state.p2Character.name}`, "Arène prête - Début du Round 1", "#ff3333", "STORM READY");
        
        const welcomeBattle = `⚔️ **QUE LE COMBAT COMMENCE !**\n━━━━━━━━━━━━━━\n` +
          `» **a** - Attaque basique\n» **b** - Technique Spéciale\n» **x** - Technique Ultime\n» **c** - Recharger Chakra\n» **d** - Garde Défensive\n\n@${p1Name} à toi d'ouvrir les hostilités !`;
        return message.reply({ body: welcomeBattle, attachment: fs.createReadStream(gif) }, () => fs.unlinkSync(gif));
      }
      return;
    }

    if (state.step === "battle") {
      const currentPlayer = state.turn === "p1" ? state.players.p1 : state.players.p2;
      if (userID !== currentPlayer) return;

      const attacker = state.turn === "p1" ? state.p1Character : state.p2Character;
      const defender = state.turn === "p1" ? state.p2Character : state.p1Character;
      const hpKey = state.turn === "p1" ? "p2HP" : "p1HP";
      const chakraKey = state.turn === "p1" ? "p1Chakra" : "p2Chakra";

      let damage = 0; let tech = "Attaque basique"; let chakraUsed = 0; let missed = false;

      switch (body) {
        case 'a':
          damage = Math.floor(Math.random() * (damageSystem.basic.max - damageSystem.basic.min + 1)) + damageSystem.basic.min;
          break;
        case 'b':
          if (state[chakraKey] < damageSystem.special.chakraCost) { missed = true; } 
          else {
            damage = Math.floor(Math.random() * (damageSystem.special.max - damageSystem.special.min + 1)) + damageSystem.special.min;
            chakraUsed = damageSystem.special.chakraCost; tech = attacker.basic;
          }
          break;
        case 'x':
          if (state[chakraKey] < damageSystem.ultimate.chakraCost) { missed = true; } 
          else {
            chakraUsed = damageSystem.ultimate.chakraCost;
            if (Math.random() < damageSystem.ultimate.failChance) { missed = true; tech = attacker.ultimate + " (Échoué)"; } 
            else {
              damage = Math.floor(Math.random() * (damageSystem.ultimate.max - damageSystem.ultimate.min + 1)) + damageSystem.ultimate.min;
              tech = attacker.ultimate;
            }
          }
          break;
        case 'c':
          state[chakraKey] = Math.min(100, state[chakraKey] + damageSystem.charge.chakraGain);
          state.turn = state.turn === "p1" ? "p2" : "p1";
          const gifC = await generateStormGIF(state.players.p1, state.players.p2, "Concentration", `${attacker.name} charge`, `Chakra augmenté de +${damageSystem.charge.chakraGain}%`, "#00ff00", "CHAKRA FLUX");
          return message.reply({ body: `🔋 **${attacker.name}** concentre son énergie !`, attachment: fs.createReadStream(gifC) }, () => fs.unlinkSync(gifC));
        case 'd':
          state.defending = state.turn; state.turn = state.turn === "p1" ? "p2" : "p1";
          const gifD = await generateStormGIF(state.players.p1, state.players.p2, "Défense Stricte", `${attacker.name} se protège`, "Dégâts du prochain tour réduits", "#ffffff", "SHIELD");
          return message.reply({ body: `🛡️ **${attacker.name}** se prépare à encaisser !`, attachment: fs.createReadStream(gifD) }, () => fs.unlinkSync(gifD));
        default:
          return message.reply("❌ Commande invalide ! Utilise : a, b, x, c, ou d.");
      }

      if (!missed) {
        if (state.defending && state.defending !== state.turn) { damage = Math.floor(damage * 0.5); tech += " (Bloqué)"; }
        state[chakraKey] -= chakraUsed; state[hpKey] = Math.max(0, state[hpKey] - damage);
      } else {
        state[chakraKey] = Math.max(0, state[chakraKey] - 10); // Perte légère sur échec
      }

      // Regénération passive de fin de tour
      if (state.turn === "p1") state.p1Chakra = Math.min(100, state.p1Chakra + state.chakraRegen);
      else state.p2Chakra = Math.min(100, state.p2Chakra + state.chakraRegen);

      // Fabrication du message de statut du round
      let titleRound = missed ? "Technique Ratée" : "Impact Réussi";
      let detailRound = missed ? `${attacker.name} a manqué sa cible` : `💥 -${damage}% HP infligés avec ${tech}`;
      
      const gifRound = await generateStormGIF(state.players.p1, state.players.p2, titleRound, `${attacker.name} à l'action`, detailRound, attacker.color, "HIT");

      let battleLog = `📊 **STATUT DE LA BATAILLE**\n━━━━━━━━━━━━━━\n` +
        `👤 **${state.p1Character.name}** : ❤️ ${state.p1HP}% | 💙 ${state.p1Chakra}%\n` +
        `👤 **${state.p2Character.name}** : ❤️ ${state.p2HP}% | 💙 ${state.p2Chakra}%\n━━━━━━━━━━━━━━\n`;

      if (state.p1HP <= 0 || state.p2HP <= 0) {
        const winner = state.p1HP <= 0 ? state.p2Character.name : state.p1Character.name;
        const finalGif = await generateStormGIF(state.players.p1, state.players.p2, "Victoire Épique", "Fin du combat", `${winner} triomphe !`, "#ffcc00", "K.O.");
        delete gameState[threadID];
        return message.reply({ body: `${battleLog}🏆 **K.O. TOTAL ! VICTOIRE DE ${winner.toUpperCase()} !**\nÉcris 'start' pour relancer.`, attachment: fs.createReadStream(finalGif) }, () => fs.unlinkSync(finalGif));
      }

      state.turn = state.turn === "p1" ? "p2" : "p1";
      state.defending = false;
      const nextPlayer = state.turn === "p1" ? state.players.p1 : state.players.p2;
      const nextName = (await usersData.get(nextPlayer)).name;
      
      battleLog += `@${nextName} C'est ton tour, choisis ton action !`;
      return message.reply({ body: battleLog, attachment: fs.createReadStream(gifRound) }, () => fs.unlinkSync(gifRound));
    }
  }
};
