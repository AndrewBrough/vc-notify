# Setup
## Node.JS
Since this bot uses Node.JS you will need to download and install Node.JS from [the official Node.JS website](https://nodejs.org/en/).

## Deploying

You can run this on a server using `npm run start`. It'll automatically connect assuming you've configured your bot token in the `.env` file.

## Creating A Bot
To create a bot go to the [Discord Developer Portal](https://discord.com/developers/applications) and then click the **New Application** button at the top right.

Once Discord asks for the application name type in whatever you want the name to be and then accept the Developer ToS agreement.

After clicking **Create** Discord should take you to the application page, at the middle left click **Bot** and then click **Add Bot**, Discord will ask if you're sure, click **Yes, do it!**.

## Inviting The Bot
To do this you'll need to click **OAuth2** at the middle left of the page.

Once you're at the **OAuth2** page, under **Scopes** check **bot** and **applications.commands**.
You should now see a big **Bot Permissions** box at the bottom of the **Scopes** box, under the **Bot Permissions** box you'll want to check **Read Messages/View Channels**, **Send Messages** and **Mention Everyone**.

You should then see **Generated URL** at the bottom of the **Bot Permissions** box, click **Copy** and then paste the URL in a new tab.

On **Add To Server** select the server you want to add it to then click **Continue**.
Afterwards Discord will show you the permissions you've given the bot, click **Authorise**.

Now close the tab and then go back to the applications Developer Portal, you'll need to go back to it to get the bot token.

## Getting The Bot Token
If you're still on the **OAuth2** page click the **Bot** tab at the middle left.

Click **Reset Token** and then copy the new long text.
You may need to go through 2FA if you have 2FA enabled.

## Setting Up VC New Session Announcer
Now that you have the token, create a `.env` file in the root directory of the project and add the following line:
```
DISCORD_BOT_TOKEN=your_token_here
```
Replace `your_token_here` with the bot token you copied from Discord.

Open command prompt, konsole, or whichever terminal application you use in the root folder (root folder = folder that contains the **index.js** file) and then type **npm i**, this will install packages.
Once the packages have installed type **node index.js**.

The bot will automatically create a `data` directory with the necessary configuration files on first run.

If everything goes well, you should see **Connected to <bot_tag>** in your terminal.

Now you can go to the server you added the bot to and then type **/set_announcement_channel #channel** to setup an announcement channel.

## Notes
This bot uses JSON files to store announcement channel data, if you'd like to use something such as MongoDB, look into setting up an npm package such as Mongoose.

Since this is designed to be used in small/private servers I decided not to use Mongoose since it'd require more setup on the users side.

**If you do plan on using this on many servers I highly recommend looking into proper databases, JSON files aren't designed to handle a lot of read and write operations and may corrupt**.
