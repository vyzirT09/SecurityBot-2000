exports.run = (client, message, args, sql, Discord, config) =>
{
    if(!message.member.hasPermission('KICK_MEMBERS') && !message.member.hasPermission('ADMINISTRATOR')) return message.reply('you do not have the permissions required to kick members!');
    if(message.mentions.users.size === 0) return message.reply('please mention a user to be kicked!');

    let target = message.mentions.users.first(); //Gets the person to be kicked
    let reason = message.content.split(' ').splice(2).join(' '); //Gets the reason

    if(message.guild.member(target).kickable === false) return message.reply('I cannot kick this member! (Make sure my role is higher than theirs before kicking someone)');

    if(reason === '')
    {
        reason = 'None given.';
    }

    message.guild.member(target).kick(reason);
    message.reply(`${target} has been kicked!`);

    let kick = new Discord.RichEmbed()
    kick.setColor(0xE81F2F)
        .setAuthor(client.user.username, client.user.avatarURL)
        .addField('Member kicked', `\`\`\`${target.username}#${target.discriminator}\`\`\``)
        .addField('Reason', `\`\`\`${reason}\`\`\``)
        .addField('Moderator', `\`\`\`${message.member.displayName}\`\`\``)
        .setTimestamp();
    
    try
    {
        sql.get(`SELECT * FROM settings WHERE serverID = "${message.guild.id}"`).then(row => 
        {
            if(row.logChannel != '')
            {
                let channel = message.guild.channels.get(row.logChannel);
                channel.send({embed: kick});
            }
        });
    } catch(err)
    {
        console.error(err);
    }
}