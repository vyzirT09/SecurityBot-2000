exports.run = (client, message, args, sql, Discord, config) =>
{
    if(!message.member.hasPermission('BAN_MEMBERS') && !message.member.hasPermission('ADMINISTRATOR')) return message.reply('you do not have the permissions required to ban members!');
    if(message.mentions.users.size === 0) return message.reply('please mention a user to be banned!');

    let target = message.mentions.users.first(); //Gets the person to be kicked
    let reason = message.content.split(' ').splice(2).join(' '); //Gets the reason

    if(message.guild.member(target).bannable === false) return message.reply('I cannot ban this member! (Make sure my role is higher than theirs before banning someone)');

    if(reason === '')
    {
        reason = 'None given.';
    }

    message.guild.member(target).ban();
    message.reply(`${target} has been banned!`);

    /*sql.get(`SELECT * FROM settings WHERE serverID = "${message.guild.id}"`).then(row => 
    {
        let channel = row.logChannel;   
    }*/

    let ban = new Discord.RichEmbed()
    ban.setColor(0xE81F2F)
        .setAuthor(client.user.username, client.user.avatarURL)
        .addField('Member banned', `\`\`\`${target.username}#${target.discriminator}\`\`\``)
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
                channel.send({embed: ban});
            }
        });
    } catch(err)
    {
        console.error(err);
    }
}