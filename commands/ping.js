exports.run = (client, message, args, sql, Discord, config) =>
{
    let heartbeat = (client.pings[0] + client.pings[1] + client.pings[2]) / 3; //Gets the heartbeat, which is the API's latency
    let startTime = Date.now(); //Gets the current time

    message.channel.send('Pinging...').then((msg) =>
    {
        endTime = Date.now(); //Gets the time again

        msg.edit('Pong! Took `' + Math.round(endTime - startTime) + ' ms` to reply.\nHeartbeat is `' + Math.round(heartbeat) + ' ms`.'); //Replies with the ping
    });
}