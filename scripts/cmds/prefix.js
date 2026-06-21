const { createCanvas, loadImage } = require('canvas');
const fs = require("fs-extra");
const path = require("path");
const { utils } = global;

// ==========================================
// 🎨 ENGINE CANVAS CYBERPUNK EDITION (CARRÉ 1:1)
// ==========================================
async function generatePrefixCanvas(userId, title, prefixText, detailsText, themeColor, badgeText = "STATUS") {
	const size = 600; // Format carré parfait
	const canvas = createCanvas(size, size);
	const ctx = canvas.getContext('2d');

	// Fond dégradé radial immersif
	let gradient = ctx.createRadialGradient(size/2, size/2, 50, size/2, size/2, size);
	gradient.addColorStop(0, '#111625');
	gradient.addColorStop(1, '#070a12');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, size, size);

	// Bordures Néon Premium
	ctx.strokeStyle = themeColor;
	ctx.lineWidth = 4;
	ctx.strokeRect(20, 20, size - 40, size - 40);
	
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
	ctx.lineWidth = 1;
	ctx.strokeRect(28, 28, size - 56, size - 56);

	// Position centrale de l'avatar
	const avatarX = size / 2;
	const avatarY = 160;
	const radius = 65;

	// Récupération de la photo de profil avec gestion d'erreur robuste
	const avatarUrl = `https://graph.facebook.com/${userId}/picture?width=300&height=300&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
	try {
		const userAvatar = await loadImage(avatarUrl);
		ctx.save();
		ctx.beginPath();
		ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(userAvatar, avatarX - radius, avatarY - radius, radius * 2, radius * 2);
		ctx.restore();

		// Halo Lumineux Autour de l'avatar
		ctx.strokeStyle = themeColor;
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(avatarX, avatarY, radius + 2, 0, Math.PI * 2);
		ctx.stroke();
	} catch (e) {
		// Fallback : Avatar Holographique Vectoriel Épuré
		ctx.fillStyle = themeColor;
		ctx.beginPath(); 
		ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2); 
		ctx.fill();
		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 30px "Sans-Serif"';
		ctx.textAlign = 'center';
		ctx.fillText("🤖", avatarX, avatarY + 10);
	}

	// Configuration globale du texte centré
	ctx.textAlign = 'center';

	// Petit Badge de Statut Supérieur
	ctx.fillStyle = themeColor;
	ctx.fillRect(size / 2 - 60, 250, 120, 22);
	ctx.fillStyle = '#ffffff';
	ctx.font = 'bold 11px "Sans-Serif"';
	ctx.fillText(badgeText.toUpperCase(), size / 2, 265);

	// Titre de l'action / Contexte
	ctx.fillStyle = '#ffffff';
	ctx.font = 'bold 22px "Sans-Serif"';
	ctx.fillText(title.toUpperCase(), size / 2, 310);

	// Ligne de Séparation Technique
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
	ctx.lineWidth = 1;
	ctx.beginPath(); ctx.moveTo(80, 335); ctx.lineTo(size - 80, 335); ctx.stroke();

	// Affichage du Préfixe Principal (Gros & Impactant)
	ctx.fillStyle = themeColor;
	ctx.font = 'bold 64px "Sans-Serif"';
	ctx.fillText(prefixText, size / 2, 410);

	// Ligne de Décoration Inférieure sous le Préfixe
	ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
	ctx.font = '13px "Sans-Serif"';
	ctx.fillText("CORE ENGINE PREFIX", size / 2, 440);

	// Sous-Détails descriptifs
	ctx.fillStyle = '#8a92a6';
	ctx.font = '14px "Sans-Serif"';
	
	// Permet de wrapper automatiquement si le texte d'aide ou d'erreur est trop long
	const cleanDetails = detailsText.length > 55 ? detailsText.substring(0, 52) + "..." : detailsText;
	ctx.fillText(cleanDetails, size / 2, 490);

	// Signature Footer Matricielle
	ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
	ctx.font = 'bold 11px "Sans-Serif"';
	ctx.fillText("» SYSTEM CONFIGURATION MATRIX V2.5 «", size / 2, 550);

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
		author: "NTKhang x Célestin 🔥 (Canvas Edition)",
		countDown: 5,
		role: 0,
		description: "Changer ou afficher le préfixe de commande du bot",
		category: "config",
		guide: {
			en: "   {pn} <nouveau préfixe>\n   Exemple: {pn} #\n\n   {pn} <nouveau préfixe> -g (changement global)\n   Exemple: {pn} # -g\n\n   {pn} reset"
		}
	},

	langs: {
		en: {
			reset: "┏━━━━━━━━━━━━━━━┓\n🔄 Préfixe réinitialisé : %1\n┗━━━━━━━━━━━━━━━┛",
			onlyAdmin: "⛔ Seul un administrateur du bot possède les droits d'accès requis.",
			confirmGlobal: "━━━━━━━━━━━━━━━\n⚠️ Confirmation requise\n🌐 Changement GLOBAL\nRéagissez à ce message pour valider l'action.\n━━━━━━━━━━━━━━━",
			confirmThisThread: "━━━━━━━━━━━━━━━\n⚠️ Confirmation requise\n💬 Changement LOCAL (Ce groupe)\nRéagissez à ce message pour valider l'action.\n━━━━━━━━━━━━━━━",
			successGlobal: "━━━━━━━━━━━━━━━\n✅ Préfixe global modifié : %1\n━━━━━━━━━━━━━━━",
			successThisThread: "━━━━━━━━━━━━━━━\n✅ Préfixe du groupe modifié : %1\n━━━━━━━━━━━━━━━",
			myPrefix: "\n━━━━━━━━━━━━━━ ◦ ❖ ◦ ━━━━━━\n⚙️  𝑺𝒚𝒔𝒕𝒆̀𝒎𝒆 : %1\n💬  𝑮𝒓𝒐𝒖𝒑𝒆 : %2\n━━━━━━━━━━━━━━ ◦ ❖ ◦ ━━━━━━\n"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		const senderID = event.senderID;

		if (!args[0]) {
			// S'il n'y a pas d'arguments, on affiche la configuration actuelle automatiquement
			const sysPrefix = global.GoatBot.config.prefix;
			const groupPrefix = utils.getPrefix(event.threadID);
			const imagePath = await generatePrefixCanvas(senderID, "System Parameters", groupPrefix, `Global Core Engine : [ ${sysPrefix} ]`, "#72efdd", "ACTIVE");
			
			return message.reply({
				body: getLang("myPrefix", sysPrefix, groupPrefix),
				attachment: fs.createReadStream(imagePath)
			}, () => fs.unlinkSync(imagePath));
		}

		if (args[0] == 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			const defaultPrefix = global.GoatBot.config.prefix;
			const imagePath = await generatePrefixCanvas(senderID, "Reset System", defaultPrefix, "Retour aux paramètres d'usine par défaut", "#ff4d6d", "RESET");
			
			return message.reply({
				body: getLang("reset", defaultPrefix),
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
			if (role < 2) return message.reply(getLang("onlyAdmin"));
			formSet.setGlobal = true;
		} else {
			formSet.setGlobal = false;
		}

		return message.reply(
			args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"),
			(err, info) => {
				formSet.messageID = info.messageID;
				global.GoatBot.onReaction.set(info.messageID, formSet);
			}
		);
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;

		if (event.userID !== author) return;

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			
			const imagePath = await generatePrefixCanvas(author, "Global Config", newPrefix, "Prise en compte globale sur le serveur distant", "#7000ff", "GLOBAL");
			return message.reply({
				body: getLang("successGlobal", newPrefix),
				attachment: fs.createReadStream(imagePath)
			}, () => fs.unlinkSync(imagePath));
		} else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			
			const imagePath = await generatePrefixCanvas(author, "Local Config", newPrefix, "Modifié uniquement pour cette discussion", "#00f2fe", "LOCAL");
			return message.reply({
				body: getLang("successThisThread", newPrefix),
				attachment: fs.createReadStream(imagePath)
			}, () => fs.unlinkSync(imagePath));
		}
	},

	onChat: async function ({ event, message, getLang }) {
		// Déclenchement intuitif si l'utilisateur envoie simplement le mot "prefix"
		if (event.body && event.body.toLowerCase() === "prefix") {
			const uid = event.senderID;
			const sysPrefix = global.GoatBot.config.prefix;
			const groupPrefix = utils.getPrefix(event.threadID);

			const imagePath = await generatePrefixCanvas(
				uid, 
				"System Parameters", 
				groupPrefix, 
				`Global Core Engine : [ ${sysPrefix} ]`, 
				"#72efdd",
				"ACTIVE"
			);

			return message.reply({
				body: getLang("myPrefix", sysPrefix, groupPrefix),
				attachment: fs.createReadStream(imagePath)
			}, () => fs.unlinkSync(imagePath));
		}
	}
};
		
