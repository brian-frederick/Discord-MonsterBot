import { DiscordMessenger } from '../../interfaces/DiscordMessenger';
import { getAll } from '../../db/huntersV2';
import { Hunter } from '../../interfaces/Hunter';

export default {
  async execute(
    messenger: DiscordMessenger,
    userId: string
  ): Promise<void> {

    const showStatus = (isActive) => isActive ? ':star:' : '';

    const hunters: Hunter[] = await getAll(userId);

    if (!hunters.length) {
      messenger.respond("YARRR. You lack hunters! Use `/hunters create` to make one.");
      return;
    }

    const huntersString = hunters.reduce((acc, hunter) => {
      return acc +
      `${showStatus(hunter.active)} ` +
      `${hunter.firstName} ` +
      `${hunter.lastName} ` + 
      `(${hunter.hunterId}) ` +
      ` - ${hunter.type} ` +
      `\n`
    }, '');

    const embed = {
      title: 'Hunters',
      description: huntersString
    };

    messenger.respondWithEmbed(embed);
    return;
  }
}
