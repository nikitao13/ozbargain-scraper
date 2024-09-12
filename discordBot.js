import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function initializeBot() {
  await client.login(process.env.DISCORD_TOKEN);
  console.log("Discord bot is ready!");
}

function createDealEmbed(deal, siteName, isInitial = false) {
  const embed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle(isInitial ? "Latest Deal" : deal.title)
    .setDescription(isInitial ? deal.title : null)
    .setURL(deal.link)
    .setTimestamp()
    .setFooter({ text: siteName });

  const fields = [
    { name: "Current Price", value: deal.price },
    { name: "Previous Price", value: deal.previousPrice },
    { name: "Discount", value: deal.discount }
  ];

  fields.forEach(field => {
    if (field.value) {
      embed.addFields({ name: field.name, value: field.value, inline: true });
    }
  });

  return embed;
}

async function sendDeals(channelId, deals, siteName, isInitial = false) {
  try {
    const channel = await client.channels.fetch(channelId);
    const dealsToSend = isInitial ? [deals[0]] : deals.reverse();

    for (const deal of dealsToSend) {
      const embed = createDealEmbed(deal, siteName, isInitial);
      await channel.send({ embeds: [embed] });
    }

    console.log(`${isInitial ? 'Latest deal' : 'New deals'} sent to ${siteName} discord channel.\n`);
  } catch (error) {
    console.error(`Error sending ${isInitial ? 'initial message' : 'new deals'} for ${siteName}:`, error);
  }
}

export const sendInitialMessage = (channelId, latestDeal, siteName) => 
  sendDeals(channelId, [latestDeal], siteName, true);

export const sendNewDeals = (channelId, deals, siteName) => 
  sendDeals(channelId, deals, siteName, false);

export { initializeBot };