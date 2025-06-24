# Voice Channel New Session Announcer

A Discord bot that announces when users join voice channels, with support for public and private channels.

## Features

- **Public Channel Announcements**: Announce when users join public voice channels
- **Private Channel Announcements**: Announce when users join private voice channels (admin-only setup)
- **Multi-Server Support**: Works across multiple Discord servers
- **Permission-Based Setup**: Different permission levels for public vs private channels
- **TypeScript**: Built with TypeScript for better type safety and development experience
- **Timezone Support**: Customizable timezone for accurate time display

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Voice-Channel-New-Session-Announcer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DISCORD_BOT_TOKEN=your_discord_bot_token_here
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## Usage

### Development
```bash
npm run dev          # Start development server with linting and type checking
```

### Production
```bash
npm start            # Build and start with PM2
```

### PM2 Management
```bash
npm run stop         # Stop the bot
npm run restart      # Restart the bot
```

### Code Quality
```bash
npm run lint         # Run ESLint with auto-fix
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
```

## Commands

### Public Channels (Manage Messages permission required)
- `/set_announcement_channel #channel` - Set the announcement channel for public voice channels
- `/remove_announcement_channel` - Remove the public announcement channel

### Private Channels (Administrator permission required)
- `/set_private_channel #channel` - Set the announcement channel for private voice channels (must be a private channel)
- `/remove_private_channel` - Remove the private announcement channel

### Timezone Settings (Manage Messages permission required)
- `/set_timezone <timezone>` - Set the timezone for voice channel announcements
- `/remove_timezone` - Remove custom timezone setting (revert to default)

#### Available Timezones
- Eastern Time (ET) - `America/New_York`
- Central Time (CT) - `America/Chicago`
- Mountain Time (MT) - `America/Denver`
- Pacific Time (PT) - `America/Los_Angeles`
- UTC - `UTC`
- London (GMT) - `Europe/London`
- Paris (CET) - `Europe/Paris`
- Tokyo (JST) - `Asia/Tokyo`
- Sydney (AEDT) - `Australia/Sydney`

## Bot Permissions

The bot requires the following permissions:
- **View Channels** - To see voice channels and their states
- **Send Messages** - To send announcements
- **Mention @everyone** - To mention users in announcements
- **Use Slash Commands** - To register and use slash commands

## Inviting the Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to OAuth2 > URL Generator
4. Select the following scopes:
   - `bot`
   - `applications.commands`
5. Select the following bot permissions:
   - View Channels
   - Send Messages
   - Mention Everyone
   - Use Slash Commands
6. Use the generated URL to invite the bot to your server

## Troubleshooting

### Bot Can't See a Channel
If the bot can't see a channel you're trying to set as an announcement channel:
1. Check that the bot has the "View Channel" permission for that channel
2. Ensure the bot's role is above the channel's permission overwrites
3. Verify the bot has the necessary permissions at the server level

### Duplicate Announcements
If you're seeing duplicate announcements:
1. Check if multiple bot instances are running
2. Use `pm2 list` to see running processes
3. Stop any duplicate instances with `pm2 stop <process-name>`

### Timezone Issues
If the time displayed is incorrect:
1. Use `/set_timezone` to configure the correct timezone for your server
2. The bot will automatically use the server's timezone for all future announcements
3. Use `/remove_timezone` to revert to the default timezone

## Development

### Project Structure
```
src/
├── commands/          # Slash command handlers
├── events/            # Discord event handlers
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── services/          # Business logic services
└── config/            # Configuration files
```

### TypeScript Configuration
The project uses a modern TypeScript configuration with:
- **Strict type checking** for better runtime safety
- **Path aliases** for cleaner imports (`@/utils/functions`)
- **Modern ES2021 target** for better performance
- **Source maps** for debugging

### Code Quality Tools
- **ESLint** with TypeScript support for code quality
- **Prettier** for consistent code formatting
- **TypeScript** for type safety and IntelliSense

### Development Workflow
The development server (`npm run dev`) automatically:
1. Runs ESLint to check code quality
2. Performs TypeScript type checking
3. Starts the bot with hot reloading

## Future Improvements

### Code Optimization Opportunities
- **Permission validation**: Create reusable utility functions for channel permission checks
- **Response patterns**: Standardize error/success response handling
- **Type safety**: Replace `any` types with proper interfaces
- **Error handling**: Implement centralized error handling and logging

### Performance Enhancements
- **Caching**: Implement guild data caching
- **Rate limiting**: Add command rate limiting
- **Database**: Consider migrating from JSON files to a proper database

## License

This project is licensed under the MIT License.
