exports.run = (client, message, args, sql, Discord, config) =>
{
    sql.get(`SELECT * FROM settings WHERE serverID = "${message.guild.id}"`).then(row => 
    {
        let pre = row.prefix;

        if(args.length === 1)
        {
            return message.channel.send(`\`\`\`Commands for SecurityBot 2000\`\`\`` +
                                        `\`Fun commands:\`  banhammer` +                                        
                                        `\n\`Useful commands:\`  help  |  ping  |  info` +  
                                        `\n\`Moderation commands:\`  ban  |  invitepurge  |  kick  |  lockdown  |  mute  |  settings  |  unlock  |  unmute` +                                          
                                        `\n ` +
                                        `\nDo \`${pre}help [command name]\` for more information about a specific command, i.e. \`${pre}help kick\`` +
                                        `\nDon't know what SecurityBot's prefix in a server is? Simply mention SecurityBot and say "what's your prefix?"`);
        } else if(args.length > 2)
        {
            return message.reply('please only ask about one command at a time!');
        } else if(args[1] === 'banhammer')
        {
            return message.channel.send(`\`\`\`Banhammer\`\`\`` +
                                        `"Don't make me get out my banhammer!"` +
                                        `\n**Usage:** \`${pre}banhammer\``);
        } else if(args[1] === 'help')
        {
            return message.channel.send(`\`\`\`Help\`\`\`` +
                                        `Displays a list of commands, along with a description and usage guide for each one.` +
                                        `\n**Usage:** \`${pre}help\` or \`${pre}help [command name]\` (NOTE: exclude brackets when using command)`);
        } else if(args[1] === 'ping')
        {
            return message.channel.send(`\`\`\`Ping\`\`\`` +
                                        `Displays the bot's ping (how long it takes to respond) along with its heartbeat (time it takes the bot to call the API), both in milliseconds.` +
                                        `\n**Usage:** \`${pre}ping\``);
        } else if(args[1] === 'info')
        {
            return message.channel.send(`\`\`\`Info\`\`\`` +
                                        `Displays some information about SecurityBot 2000.` +
                                        `\n**Usage:** \`${pre}info\``);
        } else if(args[1] === 'ban')
        {
            return message.channel.send(`\`\`\`Ban\`\`\`` +
                                        `Bans a mentioned user.` +
                                        `\n**Usage:** \`${pre}ban [mention]\` (NOTE: exclude brackets when using command)`);
        } else if(args[1] === 'invitepurge')
        {
            return message.channel.send(`\`\`\`Invite Purge\`\`\`` +
                                        `Deletes/revokes every single active invite. Only use as a last resort.` +
                                        `\n**Usage:** \`${pre}invitepurge\``);
        } else if(args[1] === 'kick')
        {
            return message.channel.send(`\`\`\`Kick\`\`\`` +
                                        `Kicks a mentioned member from a server, with an optional reason.` +
                                        `\n**Usage:** \`${pre}kick [mention]\` or \`${pre}kick [mention] [reason for kick]\` (NOTE: exclude brackets when using command)`);
        } else if(args[1] === 'lockdown')
        {
            return message.channel.send(`\`\`\`Lockdown\`\`\`` +
                                        `Locks down a channel for a certain number of minutes, preventing everyone except admins from speaking in it (Use ${[pre]}unlock [channel] to unlock a channel prematurely).` +
                                        `\n**Usage:** \`${pre}lockdown [channel] [number of minutes]\` (NOTE: exclude brackets when using this command)`);
        } else if(args[1] === 'mute')
        {
            return message.channel.send(`\`\`\`Mute\`\`\`` +
                                        `Takes away a mentioned member's permission to speak in every channel in the server (This does not affect people with admin priviledges!)` +
                                        `\n**Usage:** \`${pre}mute [mention]\` (NOTE: exclude brackets when using command)`);
        } else if(args[1] === 'settings')
        {
            return message.channel.send(`\`\`\`Settings\`\`\`` +
                                        `Allows one to view settings and to change them.` +
                                        `\n**Usage:** (NOTE: exclude brackets when using command)` +
                                        `\n\`${pre}settings view\` - DMs you a list of the current settings.` +
                                        `\n\`${pre}settings prefix [new prefix]\` - Allows you to change the prefix of SecurityBot for that server.` +
                                        `\n\`${pre}settings logChannel [channel mention]\` - Allows  you to set the log channel, where the bot can log things such as deleted messages and members leaving.` +
                                        `\n\`${pre}settings logMessages\` - Toggles on and off whether the bot logs deleted and edited messages.` +
                                        `\n\`${pre}settings logMembers\` - Toggles on and off whether the bot logs leaving and joining members.` +
                                        `\n\`${pre}settings automute\` Toggles automute on and off. Automute is a feature that mutes a member automatically if they send too many messages within 30 seconds.` +
                                        `\n\`${pre}settings automuteLimit [number]\` - Sets the automute limit, which is how many messages a user can send in 30 seconds before automute is triggered.` +
                                        `\n\`${pre}settings automuteTimeout [number]\` - Sets the automute timeout, which is how long (in seconds) a user will be muted for.` +
                                        `\n\`${pre}settings automuteFailsafe\` - Toggles automute failsafe on and off, which will kick a member if they get muted 5 times and no mods are online (Only use this as a last resort!).`);
        } else if(args[1] === 'unlock')
        {
            return message.channel.send(`\`\`\`Unlock\`\`\`` +
                                        `Unlocks a channel that has been locked down before the timer is up (Please wait at around 10-30 seconds before using this command after a lockdown to prevent channel permissions from being messed up).` +
                                        `\n**Usage:** \`${pre}unlock [channel]\` (NOTE: exclude brackets when using this command)`);   
        } else if(args[1] === 'unmute')
        {
            return message.channel.send(`\`\`\`Unmute\`\`\`` +
                                        `Unmutes a mentioned user after they are muted.` +
                                        `\n**Usage:** \`${pre}unmute [mention]\` (NOTE: exclude brackets when using this command)`);
        }
    });
}