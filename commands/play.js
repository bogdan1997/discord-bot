module.exports = {
    name: 'play',
    description: 'Plays a song or adds it to the queue of songs.',
    play(guild, song, queue, ytdl) {
        const serverQueue = queue.get(guild.id);
        if (!song) {
          serverQueue.voiceChannel.leave();
          queue.delete(guild.id);
          return;
        }
      
        const dispatcher = serverQueue.connection
          .play(ytdl(song.url))
          .on("finish", () => {
            serverQueue.songs.shift();
            this.play(guild, serverQueue.songs[0],queue,ytdl);
          })
          .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`✅ Now playing: **${song.title}**`);
    },
    async execute(msg, args, queue, ytdl) {
        const serverQueue = queue.get(msg.guild.id);
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel)
          return msg.channel.send(
            ` **You need to be in a voice channel to play music!**`
          );

        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
          return msg.channel.send(
            ` **I need the permissions to join and speak in your voice channel!**`
          );
        }
      
        const songInfo = await ytdl.getInfo(args[0]).catch((error)=>{
          return msg.channel.send(
            ` **The song could not be processed: ` + error.message +`!**`
          );
        });

        if(!songInfo.videoDetails)
          return;

        const song = {
              title: songInfo.videoDetails.title,
              url: songInfo.videoDetails.video_url,
         };
      
        if (!serverQueue) {
          const queueContruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
          };
      
          queue.set(msg.guild.id, queueContruct);
          queueContruct.songs.push(song);
      
          try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            this.play(msg.guild, queueContruct.songs[0], queue, ytdl);
          } catch (err) {
            console.log(err);
            queue.delete(msg.guild.id);
            return msg.channel.send(err);
          }
        } else {
          serverQueue.songs.push(song);
          return msg.channel.send(`✅ Added to queue: **${song.title}**`);
        }
    },
    
  };
  