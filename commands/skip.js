module.exports = {
    name: 'skip',
    description: 'Skips a song in the queue.',
    execute(msg, args, queue) {

    if (!msg.member.voice.channel)
      return msg.channel.send(
        ` **You have to be in a voice channel to stop the music!**`
      );

    const serverQueue = queue.get(msg.guild.id);
    if (!serverQueue)
      return msg.channel.send(` **There is no song that I could skip!**`);
    
    serverQueue.textChannel.send(`⏭️ **Skipping...**`);
    serverQueue.connection.dispatcher.end();
    } 
  };
  