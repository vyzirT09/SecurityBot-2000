//     ~~<{ VARIABLES }>~~     //
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json'); //Gets the config file
const sql = require('sqlite');

sql.open('./settings.sqlite');

var mutedList = {}; //Creates an object with users and the amound of messages they have sent

var portal = 
{
    portalOn: false,
    destination: null
}; //Creates an object we store portal data in

//     ~~<{ FUNCTIONS }>~~     //

function clean(text) //Puts a 0-width space in any mentions so the bot doesn't unintentionally ping anyone
{
    if(typeof(text) === 'string')
    {
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)); //Searches for @'s and places a 0-width space after them
    } else
    {
        return text; //Returns it if it's not a string because then we don't have to worry about mentions
    }
}

function modsOff(message) //Returns true if no admins are online, used for automute failsafe
{
    let result = true;

    message.guild.members.forEach((member, id, map) =>
    {
        if(member.hasPermission('ADMINISTRATOR') || member.hasPermission('MANAGE_GUILD'))
        { 
            if(!member.presence.equals('offline') && !member.bot) result = false;
        }
    });

    return result;
}

function dmMods(message, text) //DMs all mods a message
{
    message.guild.members.forEach((member, id, map) =>
    {
        if(member.hasPermission('ADMINISTRATOR'))
        { 
            member.send(text);
        }
    });
}

//     ~~<{ EVENTS }>~~     //

//Logs the bot in
client.login(config.token);

//When the bot finishes starting up
client.on('ready', () =>
{
    console.log('SecurityBot 2000 online and ready.');
    client.user.setPresence({game: {name: 'idk', type: 0}});
});

//When a message is sent
client.on('message', message => 
{
    //Stuff for the portal, which allows the owner (aka me) to speak as the bot
    if(message.channel.type === 'dm' && message.author.id === config.ownerID) //If the bot is sent a DM and it's from me
    {
        if(message.content.toLowerCase().startsWith('s!')) //If it's a command
        {
            //We need to use regexes here because args hasn't been declared yet
            if(/open\b/i.test(message.cleanContent)) //If the command is to open a portal
            {
                let channelID = /open\s(\d+)/i.exec(message.cleanContent); //Gets the ID passed in the command

                if(!client.channels.has(channelID[1])) return message.author.send('No such channel exists!'); //If the channel doesn't exist

                portal.destination = client.channels.get(channelID[1]); //Sets the destination
                portal.portalOn = true; //Turns on the portal

                message.author.send(`Opening portal to ${portal.destination.toString()}!`);
            } else if(/close\b/i.test(message)) //If the command is to close the portal
            {
                message.author.send(`Closing portal to ${portal.destination.toString()}!`);
                portal.destination.stopTyping(); //Stops typing

                portal.portalon = false; //Turn the portal off
                //portal.destination = null; //Resets the destination
            }
        } else if(portal.portalOn) //If the portal is on
        {
            portal.destination.send(message.content); //Send the message DMed to the bot
        }
    }

    if(message.channel.type === 'dm') return; //Stop if the command is in a DM

    //This is only here for redundancy and in case the database is deleted
    sql.get(`SELECT * FROM settings WHERE serverID = "${message.guild.id}"`).then(row => //Gets the part of the table corresponding to the server we're in
    {
        if (!row) //Creates the row if it doesn't exist
        {                                                                //No setting for interval                                                                          SQLite has no boolean class so we use 0 for false and 1 for true
            sql.run("INSERT INTO settings (serverID, prefix, logChannel, automute, automuteLimit, automuteTimeout, automuteFailsafe, logMessages, logMembers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [message.guild.id, "s!", "", 0, 15, 30, 0, 0, 0]); //Fills in the row with default settings
        }
    }).catch(() =>
    {
        console.error; //Logs any errors

        //Creates a table for settings if it doesn't exist
        sql.run("CREATE TABLE IF NOT EXISTS settings (serverID TEXT, prefix TEXT, logChannel TEXT, automute INTEGER, automuteLimit INTEGER, automuteTimeout INTEGER, automuteFailsafe INTEGER, logMessages INTEGER, logMembers INTEGER)").then(() =>
        {
           sql.run("INSERT INTO settings (serverID, prefix, logChannel, automute, automuteLimit, automuteTimeout, automuteFailsafe, logMessages, logMembers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [message.guild.id, "s!", "", 0, 15, 30, 0, 0, 0]); //Fills in a row for the server
        });
    });

    //MESSAGE CODE GOES HERE
    sql.get(`SELECT * FROM settings WHERE serverID = "${message.guild.id}"`).then(row => 
    {
        //Relays messages from the channel the portal is from to me
        if(portal.portalOn && message.channel.id === portal.destination.id && message.author.id != client.user.id) //If the portal is on, the channel is the one the destination is open to, and the message author isn't SecurityBot
        {
            let vyzir = client.users.get(config.ownerID); //Gets me
            vyzir.send(`${message.author.username}#${message.author.discriminator} (${message.guild.member(message.author).displayName}): ${message.content}`); //DMs me
        }

        let prefix = row.prefix;
        let muteForm = message.author.id + message.guild.id;
        
        //AUTOMUTE
        if(row.automute == 1 && message.author.id !== client.user.id) //We need to put this up here so we can mute bots too
        {
            let now = Date.now();

            //     ~~<{ ADDING TO MUTELIST }>~~     //
            if(!mutedList[muteForm]) //If they're not on the muted list
            {
                mutedList[muteForm] = //Creates a new object on the list
                {
                    timestamps: [],
                    id: message.author.id,
                    isMuted: false,
                    failsafe: []
                }

                mutedList[muteForm].timestamps.push(now);
            } else if(mutedList[muteForm].isMuted === false) //If they're already on the muted list and not muted
            {
                mutedList[muteForm].timestamps.push(now);
            }

            //     ~~<{ CHECK TIMESTAMPS }>~~     //
            for(i = mutedList[muteForm].timestamps.length - 1; i >= 0; i --) //Counts down so we don't mess up data we haven't checked yet
            {
                if(now - mutedList[muteForm].timestamps[i] >= 30000) //Removes the timestamp
                {
                    mutedList[muteForm].timestamps.splice(i, 1);
                }
            }

            //     ~~<{ DELETE SENT MESSAGES }>~~     //
            if(mutedList[muteForm].isMuted) //If they got muted and still sent a message
            {
                try
                {
                    message.delete(); //Deletes the message
                } catch(err)
                {
                    console.error(err);              
                }
            }

            //     ~~<{ MUTING, UNMUTING, AND FAILSAFE }>~~     //
            if(mutedList[muteForm].timestamps.length > row.automuteLimit && mutedList[muteForm].isMuted === false && mutedList[muteForm].failsafe.length < 5) //If we need to mute them
            {
                mutedList[muteForm].failsafe.push(now); //Add the timestamp to the list

                if(mutedList[muteForm].failsafe.length === 1 && row.automuteFailsafe === 1)
                {
                    message.channel.send(`⚠ **WARNING** ⚠ Because automute failsafe is on and there are no mods online, being muted 4 more times before a mod comes back online will result in a kick.`).then((msg) =>
                    {
                        setTimeout(function() 
                        {
                            msg.delete();
                        }, row.automuteTimeout * 1000);
                    });
                }

                for(i = mutedList[muteForm].failsafe.length - 1; i >= 0; i --) //Checks the timestamps and deletes any expired ones
                {
                    if(now - mutedList[muteForm].timestamps[i] >= 480000) //8 minutes
                    {
                        mutedList[muteForm].timestamps.splice(i, 1);
                    }
                }

                if(mutedList[muteForm].failsafe.length >= 5)
                {
                    let target = message.member;

                    if(target.kickable) target.kick('User activated the automute failsafe');
                    dmMods(message, `User ${target.user.username}#${target.user.discriminator} (${target.displayName}) triggered the automute failsafe!`);

                    try
                    {
                        delete mutedList[muteForm];
                    } catch(err)
                    {
                        console.error(err);
                    }

                    return;
                }

                mutedList[muteForm].isMuted = true;

                message.channel.send(`**${message.author.username}** has been muted for **${row.automuteTimeout} second(s)**!`).then((msg) =>
                {
                    setTimeout(function() 
                    {
                        msg.delete();
                    }, row.automuteTimeout * 1000);
                }); //Sends a notification of the mute then deletes it once the mute is over

                //Mutes the user in every channel in the server
                message.guild.channels.forEach((channel, id) =>
                {
                    if(message.guild.member(message.author).hasPermission('SEND_MESSAGES') && message.channel.type === 'text') //Only mutes them in a channel if they have send permissions there already
                    {
                        //Mutes them
                        channel.overwritePermissions(message.author, 
                        {
                            "SEND_MESSAGES": false
                        });
                    }
                });

                setTimeout(function()
                {  
                    try
                    {
                        //Deletes the permission overwrites preventing them from speaking
                        message.guild.channels.forEach((channel, id) =>
                        {
                            let override = channel.permissionOverwrites.get(message.author.id);
                            if(override) override.delete();
                        });

                        mutedList[muteForm].isMuted = false;

                        if(mutedList[muteForm].failsafe === 0) delete mutedList[muteForm]; //Removes them from the object so we can keep the size of it relatively small
                    } catch(err)
                    {
                        console.log(err);
                    }
                }, row.automuteTimeout * 1000);
            }
        }

        if(/what'?s your prefix\??/gi.test(message.content)) //Returns the local prefix
        {
            let target = message.mentions.users.first();

            if(!target) return; //Stop if no user was mentioned
            if(target.id !== client.user.id) return; //Stop if the mentioned user wasn't SecurityBot

            message.reply(`my command prefix in this server is \`${row.prefix}\``);
        }
        
        if(!message.content.startsWith(prefix)) return; //Stops if the prefix doesn't match
        if(message.author.bot) return; //Stops if the user is a bot 

        let command = message.content.toLowerCase().split(' ')[0];
        command = command.slice(row.prefix.length); //Slices the prefix off the message so we get what command it actually is

        let args = message.content.split(/[ ]+/); //args[1] is the first argument, args[2] the second, and so on

        try
        {
            let commandFile = require(`./commands/${command}.js`); //Gets the file of the appropriate command
            commandFile.run(client, message, args, sql, Discord, config); //Runs the code inside the file
        } catch(err)
        {
            console.error(err);
        }
    });

});

//When the bot leaves a guild
client.on('guildDelete', guild =>
{
    sql.get(`DELETE FROM settings WHERE serverID = "${guild.id}"`); //Removes that guild from the settings so that we don't store any unneccessary data
});

//When the bot joins a guild
client.on('guildCreate', guild =>
{
    //Creates a slot in the database for the guild the bot just joined
    sql.get(`SELECT * FROM settings WHERE serverID = "${guild.id}"`).then(row => //Gets the part of the table corresponding to the server we're in
    {
        if (!row) //Creates the row if it doesn't exist
        {                                                                //No setting for interval                                                                          SQLite has no boolean class so we use 0 for false and 1 for true
            sql.run("INSERT INTO settings (serverID, prefix, logChannel, automute, automuteLimit, automuteTimeout, automuteFailsafe, logMessages, logMembers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [guild.id, "s!", "", 0, 15, 30, 0, 0, 0]); //Fills in the row with default settings
        }
    }).catch(() =>
    {
        console.error; //Logs any errors

        //Creates a table for settings if it doesn't exist
        sql.run("CREATE TABLE IF NOT EXISTS settings (serverID TEXT, prefix TEXT, logChannel TEXT, automute INTEGER, automuteLimit INTEGER, automuteTimeout INTEGER, automuteFailsafe INTEGER, logMessages INTEGER, logMembers INTEGER)").then(() =>
        {
           sql.run("INSERT INTO settings (serverID, prefix, logChannel, automute, automuteLimit, automuteTimeout, automuteFailsafe, logMessages, logMembers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [guild.id, "s!", "", 0, 15, 30, 0, 0, 0]); //Fills in a row for the server
        });
    });
});

//When a message is deleted
client.on('messageDelete', message =>
{
    //Logs the deleted message
    if(message.author.id === client.user.id) return; //Stops the bot from logging messages it deletes

    try
    {
        sql.get(`SELECT * FROM settings WHERE serverID = "${message.guild.id}"`).then(row => 
        {
            if(row.logMessages == 1 && row.logChannel != '')
            {
                let channel = message.guild.channels.get(row.logChannel);
                channel.send(`${message.author.username}#${message.author.discriminator} deleted in ${message.channel.toString()}: \`${clean(message.cleanContent)}\``);
            }
        });
    } catch(err)
    {
        console.error(err);
    }
});

//When a message is edited
client.on('messageUpdate', (oldMessage, newMessage) =>
{
    //Logs the edited message
    if(oldMessage.author.id === client.user.id) return; //Stops the bot from logging messages it edits

    try
    {
        sql.get(`SELECT * FROM settings WHERE serverID = "${oldMessage.guild.id}"`).then(row => 
        {
            if(row.logMessages == 1 && row.logChannel != '')
            {
                let channel = oldMessage.guild.channels.get(row.logChannel);
                channel.send(`${oldMessage.author.username}#${oldMessage.author.discriminator} edited in ${oldMessage.channel.toString()}: \`${clean(oldMessage.cleanContent)}\` to \`${clean(newMessage.cleanContent)}\``);
            }
        });
    } catch(err)
    {
        console.error(err);
    }
});

//When a member joins a guild
client.on('guildMemberAdd', member =>
{
    try //Logs the member joining
    {
        sql.get(`SELECT * FROM settings WHERE serverID = "${member.guild.id}"`).then(row =>
        {
            if(row.logMembers == 1 && row.logChannel != '')
            {
                let channel = member.guild.channels.get(row.logChannel);
                channel.send(`${member.user.username}#${member.user.discriminator} joined.`);
            }
        })
    } catch(err)
    {
        console.error(err);
    }
});

//When a member leaves a guild
client.on('guildMemberRemove', member =>
{
    try //Logs the member leaving
    {
        sql.get(`SELECT * FROM settings WHERE serverID = "${member.guild.id}"`).then(row =>
        {
            if(row.logMembers == 1 && row.logChannel != '')
            {
                let channel = member.guild.channels.get(row.logChannel);
                channel.send(`${member.user.username}#${member.user.discriminator} left.`);
            }
        });
    } catch(err)
    {
        console.error(err);
    }
});

//When a user starts typing
client.on('typingStart', (channel, user) =>
{
    if(portal.portalOn && portal.destination != null && channel.type === 'dm' && user.id === config.ownerID) //If it's me that's typing, the portal is open to a channel, and it's in a DM
    {
        portal.destination.startTyping(); //Starts typing
    } 
});

//When a user stops typing
client.on('typingStop', (channel, user) =>
{
    if(portal.portalOn && portal.destination != null && channel.type === 'dm' && user.id === config.ownerID) //If it's me that stopped typing typing, the portal is open to a channel, and it's in a DM
    {
        portal.destination.stopTyping(); //Stops typing
    } 
});