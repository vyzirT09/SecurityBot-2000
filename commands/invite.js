exports.run = (client, message, args, sql, Discord, config) =>
{
    message.channel.send(`Add SecurityBot 2000 to your server by clicking this link: https://discordapp.com/oauth2/authorize?client_id=413521470317264896&scope=bot&permissions=268443710.\n` +
                         `You can disable the permissions while adding it, although the moderator features may not work if you do.`);
}