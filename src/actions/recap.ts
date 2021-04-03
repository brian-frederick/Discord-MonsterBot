import ddb from '../utils/dynamodb';
import { createRecapEmbed } from '../utils/recap';
import { DiscordMessenger } from '../interfaces/DiscordMessenger';

export default {
  validate(guildId) {
    if (!guildId) {
      return 'Grrr Bleep Blrrrr. Monsterbot no like. Only ask recap in General channel.';
    }
    return;
  },
  async execute(
    messenger: DiscordMessenger,
    maybeRecordLimit: number | undefined,
  ): Promise<void> {
    let recaps;
    const guildId = messenger.channel?.guild?.id;
    const recapsLimit = maybeRecordLimit ? maybeRecordLimit : 1;

    const errorMessage = this.validate(guildId);
    if (errorMessage){
      messenger.respond(errorMessage);
      return;
    }

    recaps = await ddb.getRecap(guildId, maybeRecordLimit);

    if (!recaps || recaps.length < 1) {
      messenger.respond(`Grrr Bleep Blorp SCREEEEE. Monsterbot has failed you.`);
      return;
    }

    // if we've only got one recap, show it and bail
    if (recaps.length === 1) {
      const recapEmbed = createRecapEmbed(recaps[0], true);
      messenger.respondWithEmbed(recapEmbed);
      return;
    }

    // if multiple recaps, there's more work to do.
    const embeds = recaps.reverse().map(recap => createRecapEmbed(recap, false));
    messenger.respondWithEmbeds(embeds);

    return;
  }
}
