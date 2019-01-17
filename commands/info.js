exports.run = (client, message, args, sql, Discord, config) =>
{
    let version = config.version;
    let owner = config.ownerName;

    let info = new Discord.RichEmbed()
    info.setColor(0xE81F2F)
        .setAuthor(client.user.username, client.user.avatarURL)
        .setTitle(`SecurityBot version ${version}`)
        .setThumbnail(client.user.avatarURL)
        .setDescription(`A Discord bot built by ${owner}.`)
        .addField(`Overview`, `SecurityBot 2000 is a bot made solely to protect your servers against spammers, trolls, and raiders. With it, your server will be in safe hands.`)
        .addField(`Features`, `SecurityBot has a multitude of defense features, ranging from the ordinary kick and ban to the elegant automute feature, which will mute spammers and can even ` +
        `automatically kick them. This bot has it all and more.`)
        .addField(`About`, `SecurityBot was made in Microsoft Visual Studio Code using node.js and discord.js. The discord.js library can be found [here](https://discord.js.org/#/docs/main/stable/general/welcome).` +
        ` He is currently hosted on the dev's computer, but the dev is looking for a permanent, stable host.`)
        .addField(`Support`, `If you're having an issue with SecurityBot, feel free to DM the owner, ${owner}. They will address it as soon as they possibly can.`)
        .addField(`GitHub`, `SecurityBot 2000's code can be found on GitHub [here](https://github.com/vyzirT09/SecurityBot-2000).`)
        .addField(`Meet the family!`, `Come join the conversation at [MemeBot HQ](https://discord.gg/w2PrTYb)! Here you can chat with the dev, recieve updates on SecurityBot, and meet the rest of his bot family!`)
        .setTimestamp()
        .setFooter(`SecurityBot 2000's profile picture drawn by Lofi.`);

    message.channel.send({ embed: info});
}