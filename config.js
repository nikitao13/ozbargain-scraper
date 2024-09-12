export default {
  ozbargain: {
    url: "https://www.ozbargain.com.au/deals", // ozbargain most recent deals
    scanInterval: 1 * 60 * 1000, // 1 minute
    selectors: {
      deals: ".node-ozbdeal", // deal container
      title: "h2.title", // deal title
      link: ".foxshot-container a", // link to deal
      infoLink: "h2.title a", // link to deal info
    },
    baseUrl: "https://www.ozbargain.com.au",
    discordChannelId: process.env.DISCORD_CHANNEL_ID,
  },
};