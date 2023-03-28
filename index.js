require('dotenv').config();
const Discord = require('discord.js');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');

Object.keys(botCommands).map(key => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX;

const queue = new Map();
const ytdl = require('ytdl-core');

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
 });

bot.on('reconnecting', () => {
  console.info('Reconnecting!');
 });

bot.on('disconnect', () => {
  console.info('Disconnect!');
 });

bot.on('message', msg => {
  if(msg.author.bot) return;
  if (!msg.content.startsWith(PREFIX)) return;

  const args = msg.content.split(/ +/); 
  const command = args.shift().toLowerCase().slice(1);
  console.info(`Called command: ${command}`);

  if (!bot.commands.has(command)) return;

  try {
    bot.commands.get(command).execute(msg, args, queue, ytdl);
  } catch (error) {
    console.error(error);
    msg.reply('there was an error trying to execute that command!');
  }
});
