exports.run = (client, message, args, sql, Discord, config) =>
{
    //Combines arguments to make my life easier
    function combineArgs(min, args)
    {
        let combinedArgs;

        for(i = min; i <= args.length - 1; i ++)
        {
            if(combinedArgs == null)
            {
                combinedArgs = args[i];
            } else if(combinedArgs != null)
            {
                combinedArgs += ' ' + args[i];
            }
        }
        return combinedArgs;
    }

    function clean(text) //Puts a 0-width space in any mentions so it doesn't fuck up the eval command
    {
        if(typeof(text) === 'string')
        {
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)); //Searches for @'s and places a 0-width space after them
        } else
        {
            return text; //Returns it if it's not a string because then we don't have to worry about mentions
        }
    }


    let ownerID = config.ownerID;
    let e = new Discord.RichEmbed();

    if(message.author.id != ownerID) return message.channel.send('Only the owner can use this!');

    try
    {
        let result = eval(combineArgs(1, args));

        if(result == config.token) result = 'Nice try';

        e.setColor(0x00FF00)
         .setAuthor(client.user.username, client.user.avatarURL)
         .setTitle('Eval complete!')
         .addField('Input:', `\`\`\`${combineArgs(1, args)}\`\`\``)
         .addField('Result:', `\`\`\`${result}\`\`\``)
         .addField('Type:', `\`\`\`${typeof(result)}\`\`\``)
         .setTimestamp()
    } catch(err)
    {
        e.setColor(0xFF0000)
         .setAuthor(client.user.username, client.user.avatarURL)
         .setTitle('Eval failed')
         .addField('Input:', `\`\`\`${combineArgs(1, args)}\`\`\``)
         .addField('Error:', `\`\`\`xl\n${clean(err)}\n\`\`\``)
         .setTimestamp()
    }

    message.channel.send({ embed: e});
}