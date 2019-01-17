exports.run = (client, message, args, sql, Discord, config) =>
{
    if(message.author.id !== '272958747889106953') return message.reply('only the bot owner can do this!'); //Stop if I'm not the one issuing the reload command
    if(!args || args.size < 2) return message.reply('you need to say which command to reload!'); //Stops if no command was specified

    let com = args[1];

    delete require.cache[require.resolve(`./${com}.js`)]; //Deletes the old file from the cache
    message.reply(`the ${com} command has been reloaded!`);
}