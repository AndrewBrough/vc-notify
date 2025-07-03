# Enhanced Voice Channel Tracking

This document describes the enhanced voice channel tracking functionality that has been added to prevent state synchronization issues.

## Overview

The bot now includes comprehensive tracking of voice channel events and state validation to prevent and detect inconsistencies that can occur when:

- Users switch between channels rapidly
- Network issues cause missed events
- Discord API events are not received properly
- Users are moved by moderators or other bots
- Channels are deleted while users are in them

## New Events Tracked

### 1. Guild Member Updates (`guildMemberUpdate`)
- Tracks when users are muted/deafened
- Monitors role changes that might affect notifications
- Logs voice state changes for debugging

### 2. Channel Deletion (`channelDelete`)
- Detects when voice channels are deleted
- Logs potential session interruptions
- Helps identify orphaned session messages

### 3. Guild Member Removal (`guildMemberRemove`)
- Tracks when users leave the server while in voice channels
- Provides debugging information for state inconsistencies

### 4. Enhanced Voice State Updates
- Improved logging for all voice state changes
- Better error handling and recovery
- Detailed member tracking per channel

## New Commands

### `/sync-voice-state [channel]`
Manually synchronizes the voice channel state for debugging purposes.

**Usage:**
- Without channel parameter: Syncs your current voice channel
- With channel parameter: Syncs the specified voice channel

**Permissions:** Manage Guild

**What it does:**
- Compares actual channel members with recorded session members
- Creates or updates session messages to match current state
- Deletes session messages for empty channels
- Provides detailed feedback on the synchronization process

### `/validate-voice-state`
Validates all voice channels in the server for state inconsistencies.

**Permissions:** Manage Guild

**What it does:**
- Checks all voice channels for state inconsistencies
- Reports missing or extra members in session messages
- Identifies channels with missing session messages
- Provides a comprehensive summary of issues found

## Automatic State Validation

### Periodic Validation
The bot automatically runs state validation every 5 minutes to detect inconsistencies:

- Scans all voice channels in all guilds
- Logs any inconsistencies found
- Provides console output for debugging
- Runs silently in the background

### Event-Driven Validation
State validation is also triggered by certain events:

- When users join/leave channels
- When channels are deleted
- When guild members are updated

## Debugging Features

### Enhanced Logging
All voice state changes now include detailed logging:

```
🎤 Voice state update for User#1234: {
  oldChannel: 'General',
  newChannel: 'Gaming',
  oldChannelId: '123456789',
  newChannelId: '987654321',
  timestamp: '2024-01-01T12:00:00.000Z'
}
```

### State Validation Reports
Comprehensive reports show:

- Channel consistency status
- Member count discrepancies
- Missing or extra members
- Session message status
- Associated text channels

## Troubleshooting

### Common Issues and Solutions

1. **Missing Members in Session**
   - Use `/sync-voice-state` to fix individual channels
   - Check logs for any missed voice state events

2. **Extra Members in Session**
   - Use `/sync-voice-state` to clean up the session
   - This usually happens when users leave without proper events

3. **No Session Message for Active Channel**
   - Use `/sync-voice-state` to create a new session
   - Check if the text channel association is correct

4. **Session Message for Empty Channel**
   - Use `/sync-voice-state` to clean up empty sessions
   - This can happen when the last user leaves unexpectedly

### Manual State Recovery

If you encounter persistent state issues:

1. Run `/validate-voice-state` to identify all problems
2. Use `/sync-voice-state` on each problematic channel
3. Check the console logs for any error messages
4. Restart the bot if issues persist

## Configuration

### Validation Interval
The periodic validation interval can be adjusted in `src/utils/periodicValidation.ts`:

```typescript
const VALIDATION_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
```

### Logging Level
Console logging can be controlled by modifying the logging statements in the event handlers.

## Best Practices

1. **Regular Monitoring**: Use `/validate-voice-state` periodically to check for issues
2. **Quick Fixes**: Use `/sync-voice-state` immediately when you notice inconsistencies
3. **Log Review**: Check console logs for any unusual patterns or errors
4. **Permission Management**: Ensure the bot has all necessary permissions for proper tracking

## Technical Details

### Event Flow
1. Voice state changes trigger `voiceStateUpdate` event
2. Member updates trigger `guildMemberUpdate` event
3. Channel deletions trigger `channelDelete` event
4. Member removals trigger `guildMemberRemove` event
5. All events are logged and processed for state consistency

### State Validation Process
1. Scan all voice channels in the guild
2. Compare actual members with recorded session members
3. Check for session message existence and validity
4. Report any inconsistencies found
5. Log results for debugging

### Error Recovery
- All events include try-catch blocks for error handling
- Failed operations are logged but don't crash the bot
- State validation continues even if individual channels fail
- Manual commands provide fallback recovery options 