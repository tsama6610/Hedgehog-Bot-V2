const axios = require('axios');
const { createCanvas } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

const defaultEmojiTranslate = "🌐";

// 🖼️ Fonction de génération d'image Canvas
async function generateTranslateCanvas(originalText, translatedText, fromLang, toLang) {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // Fond style "Néo"
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 800, 400);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, 800, 400);

    // Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial';
    ctx.fillText("TRADUCTION NÉO", 50, 60);
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '20px Arial';
    ctx.fillText(`${fromLang.toUpperCase()} ➔ ${toLang.toUpperCase()}`, 50, 95);

    // Texte original
    ctx.fillStyle = '#777777';
    ctx.font = 'italic 18px Arial';
    let shortOrig = originalText.length > 60 ? originalText.substring(0, 60) + "..." : originalText;
    ctx.fillText("Original: " + shortOrig, 50, 150);

    // Traduction
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 28px Arial';
    let shortTrans = translatedText.length > 80 ? translatedText.substring(0, 80) + "..." : translatedText;
    ctx.fillText(shortTrans, 50, 220);

    const p = path.join(__dirname, 'cache', `trans_${Date.now()}.png`);
    await fs.ensureDir(path.join(__dirname, 'cache'));
    await fs.writeFile(p, canvas.toBuffer('image/png'));
    return p;
}

// Fonction de traduction via Google API
async function translate(text, langCode) {
    const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${langCode}&dt=t&q=${encodeURIComponent(text)}`);
    return {
        text: res.data[0].map(item => item[0]).join(''),
        lang: res.data[2]
    };
}

// Fonction principale d'envoi
async function translateAndSendMessage(content, langCodeTrans, message, getLang) {
    const { text, lang } = await translate(content.trim(), langCodeTrans.trim());
    const imagePath = await generateTranslateCanvas(content, text, lang, langCodeTrans);
    
    await message.reply({
        body: `✅ Traduction effectuée :`,
        attachment: fs.createReadStream(imagePath)
    });
    
    await fs.unlink(imagePath);
}

module.exports = {
	config: {
		name: "translate",
		aliases: ["trans"],
		version: "2.0",
		author: "NTKhang x Célestin",
		countDown: 5,
		role: 0,
		category: "utility"
	},

	onStart: async function ({ message, event, args, threadsData, getLang }) {
		const { body = "" } = event;
		let content;
		let langCodeTrans;
		const langOfThread = await threadsData.get(event.threadID, "data.lang") || "en";

		if (event.messageReply) {
			content = event.messageReply.body;
			langCodeTrans = args[0] && args[0].length <= 3 ? args[0] : langOfThread;
		} else {
			content = args.join(" ");
			let sep = content.lastIndexOf("->");
			if (sep !== -1) {
				langCodeTrans = content.slice(sep + 2).trim();
				content = content.slice(0, sep).trim();
			} else {
				langCodeTrans = langOfThread;
			}
		}

		if (!content) return message.reply("⚠️ Veuillez entrer un texte à traduire.");
		translateAndSendMessage(content, langCodeTrans, message, getLang);
	}
};
