import ddb from '../utils/dynamodb';
import { createRecapEmbed } from '../utils/recap';
import Discord from 'discord.js';
export default {
  validate(guildId) {
    if (!guildId) {
      return 'Grrr Bleep Blrrrr. Monsterbot no like. Only ask recap in General channel.';
    }
    return;
  },
  async execute(
    channel: Discord.TextChannel,
    maybeRecordLimit: number | undefined,
  ): Promise<void> {
    let recaps;
    const guildId = channel?.guild?.id;
    const recapsLimit = maybeRecordLimit ? maybeRecordLimit : 0;

    const errorMessage = this.validate(guildId);
    if (errorMessage){
      channel.send(errorMessage);
      return;
    }

    recaps = await ddb.getRecap(guildId, maybeRecordLimit);
    if (!recaps || recaps.length < 1) {
      channel.send(`Grrr Bleep Blorp SCREEEEE. Monsterbot has failed you.`);
      return;
    }

    // if we've only got one recap, show it and bail
    if (recaps.length === 1) {
      const recapEmbed = createRecapEmbed(recaps[0], true);
      channel.send({embed: recapEmbed});
      return;
    }

    // if we've got multiple, there's more work to do
    recaps.reverse().forEach(recap => {
      const embed = createRecapEmbed(recap, false);
      channel.send({ embed: embed });
    });

    return;
  }
}
