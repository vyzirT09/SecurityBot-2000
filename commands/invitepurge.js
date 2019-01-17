exports.run = (client, message, args, sql, Discord, config) =>
{
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('sorry, only admins can do this!');

    message.guild.fetchInvites().then((invite) =>
    {
        invite.forEach((invite, id, map) =>
        {
            invite.delete();
        });
    });
}