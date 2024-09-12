import * as cheerio from "cheerio";
import axios from "axios";

const fetchPageWithAxios = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 60000,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching the page ${url} with Axios:`, error);
    return null;
  }
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const extractIdFromUrl = (url) => url.match(/\/node\/(\d+)/)?.[1] ?? null;

const calculateDiscount = (previousPrice, currentPrice) => {
  const [prevPrice, currPrice] = [previousPrice, currentPrice].map(price => 
    parseFloat(price.replace(/[^0-9.]/g, ""))
  );
  
  if (isNaN(prevPrice) || isNaN(currPrice) || prevPrice === 0) return null;
  
  return ((prevPrice - currPrice) / prevPrice * 100).toFixed(0);
};

const extractLatestDeals = ($, config, count = 5) => 
  $(config.selectors.deals)
    .slice(0, count)
    .map((_, elem) => {
      const $elem = $(elem);
      const title = $elem.find(config.selectors.title).text().trim() || "No title found";
      let link = $elem.find(config.selectors.link).attr("href");
      const infoLink = $elem.find(config.selectors.infoLink).attr("href") || null;

      link = link && !link.startsWith("http") ? `${config.baseUrl}${link}` : link;

      if (!isValidUrl(link)) {
        console.log(`Invalid URL found for title: "${title}". URL: ${link}`);
      }

      const deal = {
        id: extractIdFromUrl(infoLink),
        title,
        link,
        price: config.selectors.price ? $elem.find(config.selectors.price).first().text().trim() : null,
        previousPrice: config.selectors.previousPrice ? $elem.find(config.selectors.previousPrice).first().text().trim() : null,
      };

      if (deal.price && deal.previousPrice) {
        deal.discount = calculateDiscount(deal.previousPrice, deal.price) + "%";
      }

      return deal;
    })
    .get();

const getLatestDeals = async (config, count = 5) => {
  const html = await fetchPageWithAxios(config.url);
  if (!html) {
    console.log("Failed to fetch HTML content.");
    return [];
  }

  const $ = cheerio.load(html);
  const deals = extractLatestDeals($, config, count);

  if (!deals.length) {
    console.log("No deals found. HTML content:", html);
  }

  return deals;
};

const findNewDeals = (currentDeals, lastDeals) => {
  const lastDealIds = new Set(lastDeals.map(deal => deal.id));
  return currentDeals.filter(deal => !lastDealIds.has(deal.id));
};

export { getLatestDeals, findNewDeals };