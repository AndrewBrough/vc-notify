# Production Setup Guide

This guide explains how to deploy the Discord bot in production using PM2 with Vite build support for environment variables.

## Prerequisites

- Node.js 18+ installed
- A Discord bot token and application ID
- PM2 installed globally (optional, included as dev dependency)

## Environment Setup

1. **Copy the example environment file:**

   ```bash
   cp .env.example .env.production
   ```

2. **Edit `.env.production` with your actual values:**
   ```env
   DISCORD_BOT_TOKEN=your_actual_discord_bot_token
   DISCORD_BOT_DATA_DIR=./data
   DISCORD_CLIENT_ID=your_actual_client_id
   DISCORD_INVITE_LINK=https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
   ```

## How It Works

### Vite Build Process

- Vite reads environment variables from `.env.production` during build
- Environment variables are **baked into the built bundle** at build time
- No runtime environment variable loading needed
- The built `dist/index.js` contains all necessary configuration

### PM2 Process Management

- PM2 simply runs the built `dist/index.js` file
- No complex configuration needed
- Automatic restarts on crashes
- Built-in logging and monitoring

## Available Scripts

### Development

```bash
npm run dev              # Start development server with hot reload
npm run build            # Build optimized production bundle
npm run start            # Start built development version
```

### Production with PM2

```bash
npm run pm2:start        # Build and start production with PM2
npm run pm2:stop         # Stop PM2 process
npm run pm2:restart      # Restart PM2 process
npm run pm2:logs         # View PM2 logs
npm run pm2:status       # Check PM2 process status
```

## Deployment Steps

1. **Set up environment:**

   ```bash
   cp .env.example .env.production
   # Edit .env.production with your actual values
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Build and start production:**

   ```bash
   npm run pm2:start
   ```

4. **Monitor the application:**
   ```bash
   npm run pm2:status    # Check if running
   npm run pm2:logs      # View logs
   ```

## PM2 Management

### View all processes

```bash
pm2 list
```

### View specific app logs

```bash
pm2 logs vc-notify
```

### Restart specific app

```bash
pm2 restart vc-notify
```

### Stop and delete all apps

```bash
pm2 delete all
```

### Save PM2 configuration

```bash
pm2 save
pm2 startup
```

## Environment Variables

The application uses the following environment variables (baked into build):

- `DISCORD_BOT_TOKEN`: Your Discord bot token
- `DISCORD_BOT_DATA_DIR`: Directory for storing bot data (defaults to `./data`)
- `DISCORD_CLIENT_ID`: Your Discord application client ID
- `DISCORD_INVITE_LINK`: OAuth2 invite link for the bot

## Data Storage

The bot stores data in JSON files in the configured data directory:

- `sessionStartMessages.json`: Voice channel session messages
- `vcNotifyRoles.json`: Role management data

## Troubleshooting

### Common Issues

1. **Token Invalid Error**: Make sure your Discord bot token is correct in `.env.production`

2. **Permission Denied**: Ensure the bot has the necessary Discord permissions

3. **Data Directory Issues**: The bot will automatically create the data directory if it doesn't exist

4. **PM2 Process Not Starting**: Check logs with `npm run pm2:logs`

### Log Locations

- PM2 logs: `~/.pm2/logs/`
- Application logs: Check PM2 logs with `npm run pm2:logs`

## Security Notes

- Never commit `.env.production` to version control
- Keep your Discord bot token secure
- Environment variables are baked into the build, so rebuild after changing them
- Consider using a reverse proxy for additional security in production

## Why This Approach?

- **Minimal overhead**: No complex PM2 ecosystem config
- **Vite integration**: Full environment variable support during build
- **Simple deployment**: Single command to build and start
- **Reliable**: PM2 handles process management and restarts
- **Secure**: Environment variables baked into build, not loaded at runtime
