# OzBargain Deal Scraper and Discord Bot

This project is a web scraper that monitors OzBargain for new deals and sends notifications to a Discord channel.

## Features

- Scrapes OzBargain website for the latest deals
- Compares new deals with previously fetched deals to identify updates
- Sends notifications about new deals to a specified Discord channel
- Configurable scanning interval

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later recommended)
- npm (usually comes with Node.js)
- A Discord bot token and a channel ID where the bot can send messages

## Installation

1. Clone the repository:
```
git clone https://github.com/your-username/ozbargain-deal-scraper.git
cd ozbargain-deal-scraper
```

2. Install the dependencies:
```
npm install
```

3. Set up your environment variables:
- Rename the `.txt` file to `.env`
- Open the `.env` file and fill in your Discord bot token and channel ID:
  ```
  DISCORD_TOKEN=your_discord_bot_token_here
  DISCORD_CHANNEL_ID=your_discord_channel_id_here
  ```

## Configuration

You can modify the `config.js` file to change the scanning interval, URL, or CSS selectors used for scraping.

## Usage

To start the bot, run:
```
npm start
```

The bot will start scanning OzBargain at the specified interval and send new deals to your Discord channel.

## Contributing

Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Thanks to OzBargain for providing a platform for great deals
- This project uses the Discord.js library for interacting with Discord