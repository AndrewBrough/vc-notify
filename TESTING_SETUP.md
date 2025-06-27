# Testing Setup Guide

## Overview

This guide will help you set up and test the Discord bot with different environments, allowing you to safely test new features without affecting your production bot.

## 🚀 Quick Start

### 1. Create a Test Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name it something like "VC Notify Test"
3. Go to the "Bot" section and create a bot
4. Copy the bot token and client ID
5. Generate an invite link with these permissions:
   - Manage Roles
   - Send Messages
   - Use Slash Commands
   - View Channels
   - Connect (for voice channels)

### 2. Set Up Environment Files

#### Create `.env` (Production/Development)

```bash
# Copy the example file
cp env.example .env

# Edit with your main bot credentials
DISCORD_BOT_TOKEN=your_main_bot_token
DISCORD_CLIENT_ID=your_main_client_id
DISCORD_INVITE_LINK=your_main_invite_link
NODE_ENV=development
LOG_LEVEL=info
```

#### Create `.env.test` (Test Environment)

```bash
# Create test environment file
DISCORD_BOT_TOKEN_TEST=your_test_bot_token
DISCORD_CLIENT_ID_TEST=your_test_client_id
DISCORD_INVITE_LINK_TEST=your_test_invite_link
NODE_ENV=test
LOG_LEVEL=debug
```

### 3. Run Different Environments

#### Development Mode (Main Bot)

```bash
npm run dev
```

#### Test Mode (Test Bot)

```bash
npm run dev:test
```

#### Production Mode

```bash
npm run build
npm start
```

#### Test Production Mode

```bash
npm run build:test
```

## 📁 Data Separation

The bot automatically uses different data directories:

- **Development/Production**: `./data/`
- **Test**: `./data-test/`

This ensures your test bot doesn't interfere with your main bot's data.

## 🔧 Available Scripts

| Script               | Description                    | Environment |
| -------------------- | ------------------------------ | ----------- |
| `npm run dev`        | Development mode with main bot | Development |
| `npm run dev:test`   | Development mode with test bot | Test        |
| `npm start`          | Production mode with main bot  | Production  |
| `npm run start:test` | Production mode with test bot  | Test        |
| `npm run build`      | Build for production           | -           |
| `npm run build:test` | Build and run test bot         | Test        |

## 🎯 Testing Workflow

### 1. Set Up Test Server

1. Create a new Discord server for testing
2. Invite your test bot using the test invite link
3. Give the test bot the necessary permissions

### 2. Test Commands

```bash
# Start test bot
npm run dev:test

# Test these commands in your test server:
/change-vc-notify-role @role
/set-session-start-message "🎤 Test session started! @role"
/add-notification-role
/remove-notification-role
```

### 3. Test Voice Channel Features

1. Join a voice channel
2. Check if notifications are sent to the text channel
3. Test role mentions and custom messages
4. Verify data is saved to `./data-test/` directory

## 🔍 Environment Detection

The bot automatically detects the environment and shows relevant information:

```
🤖 Logged in as TestBot#1234 (VC Notify Test Bot)

=== Bot Invite Link ===
Use this link to invite VC Notify Test Bot to your server:
https://discord.com/oauth2/authorize?...

=== Environment Info ===
Environment: test
Data Directory: ./data-test
Log Level: debug
```

## 🛡️ Safety Features

### Data Isolation

- Test bot uses separate data directory (`./data-test/`)
- No interference with production data
- Safe to experiment with settings

### Environment-Specific Configuration

- Different bot tokens and client IDs
- Separate invite links
- Environment-specific logging levels

### Clear Identification

- Bot name shows "Test Bot" vs "Production Bot"
- Console logs clearly indicate environment
- Different data directories prevent confusion

## 🐛 Debugging

### Enable Debug Logging

```bash
# In your .env.test file
LOG_LEVEL=debug
```

### Check Data Files

```bash
# Test environment data
ls -la ./data-test/

# Production environment data
ls -la ./data/
```

### Monitor Logs

```bash
# Test environment with detailed logging
npm run dev:test

# Check for any errors or warnings
```

## 🔄 Switching Between Environments

### Quick Switch Commands

```bash
# Switch to test environment
npm run dev:test

# Switch back to development
npm run dev

# Build and run production
npm run build && npm start
```

### Environment Variables

The bot automatically detects the environment:

- `NODE_ENV=test` → Uses test bot configuration
- `NODE_ENV=development` → Uses development configuration
- `NODE_ENV=production` → Uses production configuration

## 📝 Best Practices

### 1. Always Test First

- Use test environment for new features
- Verify functionality before deploying to production
- Keep test server separate from main server

### 2. Monitor Data

- Check data files after testing
- Verify settings are saved correctly
- Clean up test data if needed

### 3. Use Different Bot Names

- Test bot: "VC Notify Test Bot"
- Production bot: "VC Notify Bot"
- Easy to identify which bot is running

### 4. Backup Production Data

- Keep backups of `./data/` directory
- Test environment changes won't affect production
- Safe to experiment freely

## 🚨 Troubleshooting

### Bot Not Responding

1. Check bot token is correct
2. Verify bot has necessary permissions
3. Ensure bot is online in Discord

### Commands Not Working

1. Check if commands are registered
2. Verify bot has "Use Slash Commands" permission
3. Check console for registration errors

### Data Not Saving

1. Verify data directory exists
2. Check file permissions
3. Look for error messages in console

### Environment Issues

1. Check `NODE_ENV` variable
2. Verify environment file is loaded
3. Check configuration in `src/config/environment.ts`

## 🎉 Success Indicators

When everything is working correctly, you should see:

```
🚀 Starting VC Notify Test Bot...
📁 Data directory initialized: /path/to/data-test
🤖 Logged in as TestBot#1234 (VC Notify Test Bot)

🔄 Started refreshing application (/) commands for VC Notify Test Bot.
✅ Successfully reloaded application (/) commands for VC Notify Test Bot.

=== Bot Invite Link ===
Use this link to invite VC Notify Test Bot to your server:
https://discord.com/oauth2/authorize?...

=== Environment Info ===
Environment: test
Data Directory: ./data-test
Log Level: debug
```

This setup allows you to safely test all bot features without affecting your production environment!
