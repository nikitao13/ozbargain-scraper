import { initializeBot, sendInitialMessage, sendNewDeals } from "./discordBot.js";
import config from "./config.js";
import { getLatestDeals, findNewDeals } from "./scraper.js";

let lastDeals = [];

function logObject(obj) {
  const formattedEntries = Object.entries(obj)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n');
  console.log(`\n${formattedEntries}\n`);
}

async function main() {
  await initializeBot();

  const initialDeals = await getLatestDeals(config.ozbargain);
  if (initialDeals.length > 0) {
    await sendInitialMessage(config.ozbargain.discordChannelId, initialDeals[0], "OzBargain");
    lastDeals = initialDeals;
    logObject(initialDeals[0]);
  }

  setInterval(async () => {
    const currentDeals = await getLatestDeals(config.ozbargain);
    const newDeals = findNewDeals(currentDeals, lastDeals);

    if (newDeals.length > 0) {
      console.log(`\nFound ${newDeals.length} new deals`);
      await sendNewDeals(config.ozbargain.discordChannelId, newDeals, "OzBargain");
      lastDeals = currentDeals;
    } else {
      console.log("Scanned for new deals but none were found.");
    }
  }, config.ozbargain.scanInterval);
}

main().catch(console.error);
console.log("\nMonitoring started. Press Ctrl+C to stop.");