exports.run = (client, message, args, sql, Discord, config) =>
{
    if(!message.member.hasPermission('MANAGE_GUILD') || !message.member.hasPermission('ADMINISTRATOR')) return message.reply('sorry, but you don\'t have the permissions to do this!');

    sql.get(`SELECT * FROM settings WHERE serverID = "${message.guild.id}"`).then(row => 
    {
        if(args[1] === 'view')
        {
            let logChannel = 'None set.';
            let automute = 'false';
            let failsafe = 'false';
            let logMessages = 'false';
            let logMembers = 'false';

            if(row.logChannel != '') logChannel = message.guild.channels.get(row.logChannel).toString();
            if(row.automute === 1) automute = 'true';
            if(row.automuteFailsafe === 1) failsafe = 'true';
            if(row.logMessages === 1) logMessages = 'true';
            if(row.logMembers === 1) logMembers = 'true';

            message.author.send(`**Settings for SecurityBot 2000 in ${message.guild.name}:**\n` +
                                `Prefix: ${row.prefix}\n` +
                                `Log channel: ${logChannel}\n` + 
                                `Automute: ${automute}\n` +
                                `Automute limit: ${row.automuteLimit}\n` +
                                `Automute timeout: ${row.automuteTimeout}\n` +
                                `Failsafe: ${failsafe}\n` +
                                `Message logging: ${logMessages}\n` +
                                `Member logging: ${logMembers}`); 
            
            message.reply('check your DMs!');
        } else if(args[1] === 'prefix')
        {
            sql.run(`UPDATE settings SET prefix = "${args[2]}" WHERE serverID = ${message.guild.id}`);
            return message.reply(`prefix set to \`${args[2]}\``);
        } else if(args[1] === 'logChannel')
        {
            let channel = message.mentions.channels.first();
            
            //That's one doozy of an if statement
            if(!message.guild.member(client.user).permissionsIn(channel).hasPermission('SEND_MESSAGES') || !message.guild.member(client.user).permissionsIn(channel).hasPermission('READ_MESSAGES')) return message.reply('I cannot send messages there!');
            
            sql.run(`UPDATE settings SET logChannel = "${channel.id}" WHERE serverID = "${message.guild.id}"`);
            return message.reply(`log channel successfully set to ${channel.toString()}!`);
        } else if(args[1] === 'logMessages')
        {
            if(row.logMessages == 0)
            {
                sql.run(`UPDATE settings SET logMessages = 1 WHERE serverID = "${message.guild.id}"`);
                return message.reply(`log messages set to on!`);
            } else
            {
                sql.run(`UPDATE settings SET logMessages = 0 WHERE serverID = "${message.guild.id}"`);
                return message.reply(`log messages set to off!`);
            }
        } else if(args[1] === 'logMembers')
        {
            if(row.logMembers == 0)
            {
                sql.run(`UPDATE settings SET logMembers = 1 WHERE serverID = "${message.guild.id}"`);
                return message.reply(`log members set to on!`);
            } else
            {
                sql.run(`UPDATE settings SET logMembers = 0 WHERE serverID = "${message.guild.id}"`);
                return message.reply(`log members set to off!`);
            }
        } else if(args[1] === 'automute')
        {
            if(row.automute == 0)
            {
                sql.run(`UPDATE settings SET automute = 1 WHERE serverID = "${message.guild.id}"`);
                return message.reply(`automute set to on!`);
            } else
            {
                sql.run(`UPDATE settings SET automute = 0 WHERE serverID = "${message.guild.id}"`);
                return message.reply(`automute set to off!`);
            }
        } else if(args[1] === 'automuteLimit')
        {
            //                        Really bad fix for handling negatives, please revise later
            if(!parseInt(args[2]) > 0 || args[2].startsWith('-')) return message.reply('the timeout must be a number that\'s greater than 0!');

            sql.run(`UPDATE settings SET automuteLimit = ${args[2]} WHERE serverID = "${message.guild.id}"`);
            return message.reply(`automute limit set to ${args[2]}!`)
        } else if(args[1] === 'automuteTimeout')
        {
            //                        Really bad fix for handling negatives, please revise later
            if(!parseInt(args[2]) > 0 || args[2].startsWith('-')) return message.reply('the timeout must be a number that\'s greater than 0!');

            sql.run(`UPDATE settings SET automuteTimeout = ${args[2]} WHERE serverID = "${message.guild.id}"`);
            return message.reply(`automute timeout set to ${args[2]}!`);
        } else if(args[1] === 'automuteFailsafe')
        {
            if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('sorry, only admins can use this command!');

            if(row.automuteFailsafe == 0)
            {
                sql.run(`UPDATE settings SET automuteFailsafe = 1 WHERE serverID = "${message.guild.id}"`);
                return message.reply(`failsafe set to on!`);
            } else
            {
                sql.run(`UPDATE settings SET automuteFailsafe = 0 WHERE serverID = "${message.guild.id}"`);
                return message.reply(`failsafe set to off!`);
            }
        } 
    });
}