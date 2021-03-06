exports.run = (client, message, args, sql, Discord, config) =>
{
    if(!message.member.hasPermission('MANAGE_GUILD') || !message.member.hasPermission('ADMINISTRATOR')) return message.reply('sorry, but you don\'t have the permissions to do this!');
    if(message.mentions.users.size === 0) return message.reply('please mention a user to mute!');

    let target = message.mentions.users.first();

    message.guild.channels.forEach((channel, id) =>
    {
        if(message.guild.member(target).hasPermission('SEND_MESSAGES') && message.channel.type === 'text') //Only mutes them in a channel if they have send permissions there already
        {
            //Mutes them
            channel.overwritePermissions(target, 
            {
                "SEND_MESSAGES": false
            });
        }
    });

    let mute = new Discord.RichEmbed()
    mute.setColor(0xE81F2F)
        .setAuthor(client.user.username, client.user.avatarURL)
        .addField('Member muted', `\`\`\`${target.username}#${target.discriminator}\`\`\``)
        .addField('Moderator', `\`\`\`${message.member.displayName}\`\`\``)
        .setTimestamp();

    try
    {
        sql.get(`SELECT * FROM settings WHERE serverID = "${message.guild.id}"`).then(row => 
        {
            if(row.logChannel != '')
            {
                let channel = message.guild.channels.get(row.logChannel);
                channel.send({embed: mute});
            }
        });
    } catch(err)
    {
        console.error(err);
    }
}