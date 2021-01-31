module.exports = {
  name: 'inventory',
  async execute(channel, user, guildId, options): Promise<void> {
    console.log('channel in inventory interaction', channel);
    channel.send('oh hi everybody!');
  }
}
