# Voice Channel New Session Announcer

A Discord bot that announces when users join voice channels, with support for separate public and private channel announcements.

## Features

- **Public Voice Channels**: Announce when users join public voice channels
- **Private Voice Channels**: Separate announcements for private voice channels
- **Channel Validation**: Ensures private announcement channels are actually private
- **Simple Setup**: Easy configuration with slash commands

## Setup

### Prerequisites
- Node.js (v16 or higher)
- Discord Bot Token

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Voice-Channel-New-Session-Announcer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the root directory:
   ```
   DISCORD_BOT_TOKEN=your_bot_token_here
   ```

4. **Run the bot**
   ```bash
   npm start
   ```

## Bot Setup

### Creating a Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Copy the bot token and add it to your `.env` file

### Required Bot Permissions

- **View Channels**
- **Send Messages** 
- **Mention Everyone**
- **Use Slash Commands**

### Inviting the Bot

Use this URL (replace `YOUR_BOT_ID` with your actual bot ID):
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=274877910016&scope=bot%20applications.commands
```

## Commands

### Setup Commands
- `/set_announcement_channel #channel` - Set public voice channel announcements (Manage Messages)
- `/set_private_channel #channel` - Set private voice channel announcements (Admin only)
- `/show_channels` - View current announcement channel settings (Admin only)

### Management Commands
- `/remove_announcement_channel` - Remove public announcement channel (Manage Messages)
- `/remove_private_channel` - Remove private announcement channel (Admin only)

## How It Works

- **Public Voice Channels**: When someone joins a public voice channel, the bot sends a message to the configured public announcement channel
- **Private Voice Channels**: When someone joins a private voice channel, the bot sends a message to the configured private announcement channel
- **Channel Validation**: The bot ensures private announcement channels are actually private (not visible to @everyone)

## Example Messages

- **Public**: `"John joined General at 2:30 PM"`
- **Private**: `"John joined private Staff Room at 2:30 PM"`

## Project Structure

```
├── commands/          # Slash command handlers
├── events/           # Discord event handlers
├── utils/            # Utility functions
├── data/             # Guild configuration data
├── functions.js      # Shared utility functions
├── index.js          # Bot entry point
└── package.json      # Dependencies and scripts
```

## Notes

This bot uses JSON files to store guild configuration data. For production use with many servers, consider using a proper database like MongoDB or PostgreSQL.

## License

This project is open source and available under the MIT License.
