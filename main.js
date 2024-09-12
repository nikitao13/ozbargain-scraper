import { initializeBot, sendInitialMessage, sendNewDeals } from "./discordBot.js";
import config from "./config.js";
import { getLatestDeals, findNewDeals } from "./scraper.js";

let lastDeals = [];

async function main() {
  await initializeBot();

  const initialDeals = await getLatestDeals(config.ozbargain);
  if (initialDeals.length > 0) {
    await sendInitialMessage(config.ozbargain.discordChannelId, initialDeals[0], "OzBargain");
    lastDeals = initialDeals;
    console.log(initialDeals[0]);
  }

  setInterval(async () => {
    const currentDeals = await getLatestDeals(config.ozbargain);
    const newDeals = findNewDeals(currentDeals, lastDeals);

    if (newDeals.length > 0) {
      console.log(`Found ${newDeals.length} new deals`);
      await sendNewDeals(config.ozbargain.discordChannelId, newDeals, "OzBargain");
      lastDeals = currentDeals;
    } else {
      console.log("No new deals found");
    }
  }, config.ozbargain.scanInterval);
}

main().catch(console.error);
console.log("\nMonitoring started. Press Ctrl+C to stop.");