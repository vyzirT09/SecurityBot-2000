exports.run = (client, message, args, sql, Discord, config) =>
{
        if(!message.member.hasPermission('MANAGE_GUILD') || !message.member.hasPermission('ADMINISTRATOR')) return message.reply('sorry, but you don\'t have the permissions to do this!');
        if(message.mentions.users.size === 0) return message.reply('please mention a user to unmute!');

        let target = message.mentions.users.first();

        message.guild.channels.forEach((channel, id) =>
        {
            try
            {
                let override = channel.permissionOverwrites.get(target.id);
                if(override) override.delete();
            } catch (err)
            {
                console.log(err);
            }
        });

        let unmute = new Discord.RichEmbed()
        unmute.setColor(0xE81F2F)
            .setAuthor(client.user.username, client.user.avatarURL)
            .addField('Member unmuted', `\`\`\`${target.username}#${target.discriminator}\`\`\``)
            .addField('Moderator', `\`\`\`${message.member.displayName}\`\`\``)
            .setTimestamp();

        try
        {
            sql.get(`SELECT * FROM settings WHERE serverID = "${message.guild.id}"`).then(row => 
            {
                if(row.logChannel != '')
                {
                    let channel = message.guild.channels.get(row.logChannel);
                    channel.send({embed: unmute});
                }
            });
        } catch(err)
        {
            console.error(err);
        }
}