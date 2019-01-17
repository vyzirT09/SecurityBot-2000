exports.run = (client, message, args, sql, Discord, config) =>
{
    if(!message.member.hasPermission('MANAGE_GUILD') || !message.member.hasPermission('ADMINISTRATOR')) return message.reply('sorry, but you don\'t have the permissions to do this!');
    if(message.mentions.channels.size === 0) return message.reply('please mention a channel to lock down!');
    if(args.size < 3) return message.reply('please provide a time for the lockdown!');
    if(!parseInt(args[2]) > 0 || args[2].startsWith('-')) return message.reply('please enter a number for the length of the lockdown that\'s greater than 0!'); //Really sketchy fix, revise later

    let target = message.mentions.channels.first();

    try
    {
        sql.get(`SELECT * FROM settings WHERE serverID = "${message.guild.id}"`).then(row => 
        {
            //Sends a notification of the lockdown and deletes in when it's over
            target.send('⚠ THIS CHANNEL HAS BEEN PLACED ON LOCKDOWN BY THE MODERATORS ⚠').then((msg) =>
            {
                setTimeout(function() 
                {
                    msg.delete();
                }, args[2] * 60000);
            });

            //Locks down the channel
            message.guild.members.forEach((member, id, map) =>
            {
                target.overwritePermissions(id, {"SEND_MESSAGES": false});
            });
            
            target.overwritePermissions(message.guild.id, {"SEND_MESSAGES": false}); //We still overwrite the permissions for the @everyone role in case of newcomers to the guild

            //Creates the embed that shows the lockdown
            let lockdown = new Discord.RichEmbed()
            lockdown.setColor(0xE81F2F)
                .setAuthor(client.user.username, client.user.avatarURL)
                .addField('Channel locked down:', `${target.toString()} for ${args[2]} minute(s)`)
                .addField('Moderator', `\`\`\`${message.member.displayName}\`\`\``)
                .addField('Accidental lockdown?', `Simply run ${row.prefix}unlock [channel] to unlock it again. Make sure to wait for around 10 seconds though, so it'll actually work properly. (NOTE: exclude brackets when using commands)`)
                .setTimestamp();

            if(row.logChannel != '')
            {
                let channel = message.guild.channels.get(row.logChannel);
                channel.send({embed: lockdown});
            }

            setTimeout(function() 
            {
                message.guild.members.forEach((member, id, map) =>
                {
                        let override = target.permissionOverwrites.get(id);
                        if(override) override.delete();
                }); 

                target.overwritePermissions(message.guild.id, {"SEND_MESSAGES": null});
            }, args[2] * 60000);
        });
    } catch(err)
    {
        console.error(err);
    }
}