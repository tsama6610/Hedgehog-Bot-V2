const { createCanvas, loadImage } = require('canvas');
const fs = require("fs-extra");
const path = require("path");
const { utils } = global;

// ==========================================
// 🎨 ENGINE CANVAS CYBERPUNK - VERSION COMPACTE (400x400)
// ==========================================
async function generatePrefixCanvas(userId, title, prefixText, detailsText, themeColor, badgeText = "STATUS") {
	const size = 400; // Taille moyenne réduite et optimisée
	const canvas = createCanvas(size, size);
	const ctx = canvas.getContext('2d');

	// Fond sombre Cyberpunk
	let gradient = ctx.createRadialGradient(size/2, size/2, 30, size/2, size/2, size);
	gradient.addColorStop(0, '#121826');
	gradient.addColorStop(1, '#0a0d14');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, size, size);

	// Bordures Néon fines
	ctx.strokeStyle = themeColor;
	ctx.lineWidth = 3;
	ctx.strokeRect(15, 15, size - 30, size - 30);

	const avatarX = size / 2;
	const avatarY = 105;
	const radius = 45;

	// Récupération de l'avatar
	const avatarUrl = `https://graph.facebook.com/${userId}/picture?width=150&height=150&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
	try {
		const userAvatar = await loadImage(avatarUrl);
		ctx.save();
		ctx.beginPath();
		ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(userAvatar, avatarX - radius, avatarY - radius, radius * 2, radius * 2);
		ctx.restore();

		ctx.strokeStyle = themeColor;
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(avatarX, avatarY, radius + 2, 0, Math.PI * 2);
		ctx.stroke();
	} catch (e) {
		ctx.fillStyle = themeColor;
		ctx.beginPath(); 
		ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2); 
		ctx.fill();
		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 22px "Sans-Serif"';
		ctx.textAlign = 'center';
		ctx.fillText("🤖", avatarX, avatarY + 8);
	}

	ctx.textAlign = 'center';

	// Badge de statut
	ctx.fillStyle = themeColor;
	ctx.fillRect(size / 2 - 45, 165, 90, 18);
	ctx.fillStyle = '#ffffff';
	ctx.font = 'bold 9px "Sans-Serif"';
	ctx.fillText(badgeText.toUpperCase(), size / 2, 177);

	// Titre principal
	ctx.fillStyle = '#ffffff';
	ctx.font = 'bold 16px "Sans-Serif"';
	ctx.fillText(title.toUpperCase(), size / 2, 210);

	// Ligne technique
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
	ctx.lineWidth = 1;
	ctx.beginPath(); ctx.moveTo(60, 230); ctx.lineTo(size - 60, 230); ctx.stroke();

	// Gros Préfixe au centre
	ctx.fillStyle = themeColor;
	ctx.font = 'bold 52px "Sans-Serif"';
	ctx.fillText(prefixText, size / 2, 285);

	// Infos sous-titre
	ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
	ctx.font = '11px "Sans-Serif"';
	ctx.fillText("INFINIX SYSTEM PREFIX", size / 2, 310);

	// Détails de la configuration
	ctx.fillStyle = '#8a92a6';
	ctx.font = '12px "Sans-Serif"';
	const cleanDetails = detailsText.length > 45 ? detailsText.substring(0, 42) + "..." : detailsText;
	ctx.fillText(cleanDetails, size / 2, 345);

	// Pied de page
	ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
	ctx.font = 'bold 9px "Sans-Serif"';
	ctx.fillText("» INFINIX ENGINE MATRIX V2.5 «", size / 2, 380);

	const tmpDir = path.join(__dirname, "..", "cache");
	await fs.ensureDir(tmpDir);
	const imagePath = path.join(tmpDir, `prefix_${Date.now()}_${userId}.png`);
	fs.writeFileSync(imagePath, canvas.toBuffer('image/png'));
	return imagePath;
}

module.exports = {
	config: {
		name: "prefix",
		version: "2.5",
		author: "NTKhang x Célestin 🔥 (Canvas Compact)",
		countDown: 5,
		role: 0,
		description: "Changer ou afficher le préfixe de commande du bot",
		category: "config",
		guide: {
			en: "   {pn} <nouveau préfixe>\n   Exemple: {pn} #\n\n   {pn} reset"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData }) {
		const senderID = event.senderID;

		if (!args[0]) {
			const sysPrefix = global.GoatBot.config.prefix;
			const groupPrefix = utils.getPrefix(event.threadID);
			const imagePath = await generatePrefixCanvas(senderID, "Infinix Bot Prefix", groupPrefix, `Global Engine : [ ${sysPrefix} ]`, "#72efdd", "ACTIVE");
			
			// Message de texte supprimé, envoi de l'image seule
			return message.reply({
				attachment: fs.createReadStream(imagePath)
			}, () => fs.unlinkSync(imagePath));
		}

		if (args[0] == 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			const defaultPrefix = global.GoatBot.config.prefix;
			const imagePath = await generatePrefixCanvas(senderID, "Reset System", defaultPrefix, "Retour aux paramètres d'usine", "#ff4d6d", "RESET");
			
			return message.reply({
				attachment: fs.createReadStream(imagePath)
			}, () => fs.unlinkSync(imagePath));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: senderID,
			newPrefix
		};

		if (args[1] === "-g") {
			if (role < 2) return; // Sécurisé sans message inutile
			formSet.setGlobal = true;
		} else {
			formSet.setGlobal = false;
		}

		// Utilise directement la création de réaction pour confirmer
		return message.reply(
			"⚠️ Réagissez à ce message pour valider le changement.",
			(err, info) => {
				formSet.messageID = info.messageID;
				global.GoatBot.onReaction.set(info.messageID, formSet);
			}
		);
	},

	onReaction: async function ({ message, threadsData, event, Reaction }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author) return;

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			
			const imagePath = await generatePrefixCanvas(author, "Global Config", newPrefix, "Prise en compte sur tout le réseau", "#7000ff", "GLOBAL");
			return message.reply({
				attachment: fs.createReadStream(imagePath)
			}, () => fs.unlinkSync(imagePath));
		} else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			
			const imagePath = await generatePrefixCanvas(author, "Local Config", newPrefix, "Modifié pour ce groupe", "#00f2fe", "LOCAL");
			return message.reply({
				attachment: fs.createReadStream(imagePath)
			}, () => fs.unlinkSync(imagePath));
		}
	},

	onChat: async function ({ event, message }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			const uid = event.senderID;
			const sysPrefix = global.GoatBot.config.prefix;
			const groupPrefix = utils.getPrefix(event.threadID);

			const imagePath = await generatePrefixCanvas(uid, "Infinix Bot Prefix", groupPrefix, `Global Engine : [ ${sysPrefix} ]`, "#72efdd", "ACTIVE");

			return message.reply({
				attachment: fs.createReadStream(imagePath)
			}, () => fs.unlinkSync(imagePath));
		}
	}
};
