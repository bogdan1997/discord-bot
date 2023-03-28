module.exports = {
    name: 'stop',
    description: 'Stops playing',
    execute(msg, args, queue) {

    if (!msg.member.voice.channel)
      return msg.channel.send(
        ` **You have to be in a voice channel to stop the music!**`
      );
      
    const serverQueue = queue.get(msg.guild.id);
    if (!serverQueue)
      return msg.channel.send(` **There is no song that I could stop!**`);
      
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    serverQueue.textChannel.send(`⏹️ **Stoping...**`);
    } 
  };
  