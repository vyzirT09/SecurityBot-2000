exports.run = (client, message, args, sql, Discord, config) =>
{
    if(!message.member.hasPermission('MANAGE_GUILD') || !message.member.hasPermission('ADMINISTRATOR')) return message.reply('sorry, but you don\'t have the permissions to do this!');
    if(message.mentions.channels.size === 0) return message.reply('please mention a channel to unlock!');

    let target = message.mentions.channels.first();

    message.guild.members.forEach((member, id, map) =>
    {
        let override = target.permissionOverwrites.get(id);
        if(override) override.delete();
    }); 

    target.overwritePermissions(message.guild.id, {"SEND_MESSAGES": null});

    target.send('The channel lockdown has been overridden! Feel free to speak amongst yourselves now.');

    let unlock = new Discord.RichEmbed()
        unlock.setColor(0xE81F2F)
              .setAuthor(client.user.username, client.user.avatarURL)
              .addField('Channel unlocked:', `${target.toString()}`)
              .addField('Moderator', `\`\`\`${message.member.displayName}\`\`\``)
              .setTimestamp();

    try
    {
        sql.get(`SELECT * FROM settings WHERE serverID = "${message.guild.id}"`).then(row => 
        {
            if(row.logChannel != '')
            {
                let channel = message.guild.channels.get(row.logChannel);
                channel.send({embed: unlock});
            }
        });
    } catch(err)
    {
        console.error(err);
    }
}