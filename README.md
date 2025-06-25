# Voice Channel New Session Announcer

A Discord bot that announces when users join voice channels, with support for public and private channels.

## Features

- **Public Channel Announcements**: Announce when users join public voice channels
- **Private Channel Announcements**: Announce when users join private voice channels (admin-only setup)
- **Multi-Server Support**: Works across multiple Discord servers
- **Permission-Based Setup**: Different permission levels for public vs private channels
- **TypeScript**: Built with TypeScript for better type safety and development experience
- **Rich Embeds**: Beautiful embed messages with interactive timestamps that display in each user's local timezone

## Quick Start

### Invite the Bot

Use this link to invite the bot to your server with the correct permissions:

```
https://discord.com/oauth2/authorize?client_id=1347826239804538894&permissions=397553134592&integration_type=0&scope=bot+applications.commands
```

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

### Available Commands

- `/change-vc-notify-role @role` - Change the role used for VC notifications (requires Manage Roles permission)

> **Note:** Commands are automatically registered with Discord when the bot starts. If you don't see commands immediately, wait a few minutes for them to appear globally.

### Role Management

The bot automatically creates and manages a notification role for each server:

- **Default Role Name**: `voice-notifications`
- **Customizable**: Admins can rename the role using Discord's built-in role management
- **Role Selection**: Use `/change-vc-notify-role` to select which role gets mentioned in notifications
- **Mentionable**: The role is set to be mentionable for notifications

## Bot Permissions

The bot requires the following permissions to function properly:

### Required Permissions

- **View Channels** - To see voice channels and their states
- **Send Messages** - To send announcements in text channels
- **Embed Links** - To send rich embed messages with timestamps
- **Mention Everyone** - To mention roles/users in announcements
- **Read Message History** - To find and update previous session messages
- **Use Slash Commands** - To register and use slash commands (via `applications.commands` scope)

### Optional Permissions

- **Manage Roles** - Required for the `/change-vc-notify-role` command
- **Manage Messages** - For future features like deleting old messages or pinning important ones

## Inviting the Bot with Correct Permissions

Follow these steps to invite the bot to your server with the proper permissions:

### Step 1: Generate the Invite Link

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Navigate to **OAuth2 > URL Generator**

### Step 2: Select Scopes

Under **Scopes**, select:

- ✅ `bot`
- ✅ `applications.commands`

### Step 3: Select Bot Permissions

Under **Bot Permissions**, select:

**Required Permissions:**

- ✅ View Channels
- ✅ Send Messages
- ✅ Embed Links
- ✅ Mention Everyone
- ✅ Read Message History

**Optional Permissions (for advanced features):**

- ✅ Manage Roles (for role management command)
- ✅ Manage Messages (for future message management features)

### Step 4: Invite the Bot

1. Copy the generated URL from the bottom of the page
2. Open the URL in your browser
3. Select your server from the dropdown
4. Click "Authorize"
5. Complete the CAPTCHA if prompted

### Step 5: Verify Permissions

After inviting the bot:

1. Go to your server's **Server Settings > Roles**
2. Find the bot's role and ensure it has the necessary permissions
3. Check that the bot's role is positioned above any roles it needs to mention

## Troubleshooting

### Bot Can't See a Channel

If the bot can't see a channel you're trying to set as an announcement channel:

1. Check that the bot has the "View Channel" permission for that channel
2. Ensure the bot's role is above the channel's permission overwrites
3. Verify the bot has the necessary permissions at the server level

### Bot Can't Send Messages

If the bot can't send messages:

1. Check that the bot has "Send Messages" permission in the target channel
2. Ensure the bot has "Embed Links" permission for rich messages
3. Verify the bot's role has the correct permissions

### Commands Not Working

If slash commands aren't working:

1. Ensure the bot has the `applications.commands` scope
2. Check that the bot has "Use Slash Commands" permission
3. Wait a few minutes for commands to register globally

### Duplicate Announcements

If you're seeing duplicate announcements:

1. Check if multiple bot instances are running
2. Use `pm2 list` to see running processes
3. Stop any duplicate instances with `pm2 stop <process-name>`

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
