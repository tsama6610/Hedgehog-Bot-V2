const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "bal",
    aliases: ["bal", "$", "cash"],
    version: "5.1",
    author: "Christus",
    countDown: 3,
    role: 0,
    description: "💰 Système économique stylé avec transfert",
    category: "economy",
    guide: {
      fr: "{pn} - voir ton solde\n{pn} @utilisateur - voir le solde d'un autre\n{pn} t @utilisateur montant - transférer de l'argent"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { senderID, mentions, messageReply } = event;

    // --- Formatage de l'argent ---
    const formatMoney = (amount) => {
      if (isNaN(amount)) return "0$";
      amount = Number(amount);
      const scales = [
        { value: 1e15, suffix: 'Q' },
        { value: 1e12, suffix: 'T' },
        { value: 1e9, suffix: 'B' },
        { value: 1e6, suffix: 'M' },
        { value: 1e3, suffix: 'k' }
      ];
      const scale = scales.find(s => amount >= s.value);
      if (scale) return `${(amount / scale.value).toFixed(1)}${scale.suffix}$`;
      return `${amount.toLocaleString()}$`;
    };

    // --- Récupération sécurisée de l'avatar ---
    const fetchAvatar = async (userID) => {
      try {
        let avatarURL = `https://graph.facebook.com/${userID}/picture?type=large&width=500&height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const res = await axios.get(avatarURL, { responseType: "arraybuffer", timeout: 10000 });
        return await loadImage(Buffer.from(res.data));
      } catch (e) {
        const size = 100;
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#3b0066";
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${size / 2}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(userID.charAt(0).toUpperCase(), size / 2, size / 2);
        return canvas;
      }
    };

    // === TRANSFERT D'ARGENT ===
    if (args[0]?.toLowerCase() === "t") {
      let targetID = Object.keys(mentions)[0] || messageReply?.senderID;
      const amountRaw = args.find(a => !isNaN(a));
      const amount = parseFloat(amountRaw);

      if (!targetID || isNaN(amount)) return message.reply("❌ Usage : !bal t @utilisateur montant");
      if (targetID === senderID) return message.reply("❌ Vous ne pouvez pas vous envoyer de l'argent.");
      if (amount <= 0) return message.reply("❌ Le montant doit être supérieur à 0.");

      const sender = await usersData.get(senderID);
      const receiver = await usersData.get(targetID);
      if (!receiver) return message.reply("❌ Utilisateur cible introuvable.");

      const taxRate = 5;
      const tax = Math.ceil(amount * taxRate / 100);
      const total = amount + tax;

      if (sender.money < total) return message.reply(
        `❌ Fonds insuffisants.\nNécessaire : ${formatMoney(total)}\nVous avez : ${formatMoney(sender.money)}`
      );

      await Promise.all([
        usersData.set(senderID, { ...sender, money: sender.money - total }),
        usersData.set(targetID, { ...receiver, money: receiver.money + amount })
      ]);

      const receiverName = await usersData.getName(targetID);
      return message.reply(
        `✅ Transfert réussi ! 💸
➤ Vers : ${receiverName}
➤ Montant envoyé : ${formatMoney(amount)}
➤ Taxe : ${formatMoney(tax)}
➤ Total débité : ${formatMoney(total)}`
      );
    }

    // === CARTE DE SOLDE ===
    let targetID;
    if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
    else if (messageReply) targetID = messageReply.senderID;
    else targetID = senderID;

    const name = await usersData.getName(targetID);
    const money = await usersData.get(targetID, "money") || 0;
    const avatar = await fetchAvatar(targetID);

    const width = 700, height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // --- Fond dégradé stylé ---
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0f2027");
    gradient.addColorStop(0.5, "#203a43");
    gradient.addColorStop(1, "#2c5364");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Carte transparente
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(40, 40, width - 80, height - 80);

    // Bordure dorée
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Avatar rond
    const avatarSize = 100;
    const avatarX = 70, avatarY = 130;
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    // Titre
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("⚡ Carte de Solde ⚡", width / 2, 80);

    // Nom de l'utilisateur
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`💎 ${name}`, 200, 160);

    // ID utilisateur
    ctx.font = "22px Arial";
    ctx.fillStyle = "#AAAAAA";
    ctx.fillText(`🆔 ${targetID}`, 200, 200);

    // Solde
    ctx.font = "bold 44px Arial";
    ctx.fillStyle = "#00FF7F";
    ctx.textAlign = "center";
    ctx.fillText(`${formatMoney(money)}`, width / 2, 250);

    const filePath = path.join(__dirname, "balance_card.png");
    fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

    return message.reply({
      body: `⚡ Infos de solde pour ${name} ⚡`,
      attachment: fs.createReadStream(filePath)
    });
  }
};
