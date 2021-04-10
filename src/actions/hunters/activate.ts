import { DiscordMessenger } from '../../interfaces/DiscordMessenger';

export default {
  async execute(
    messenger: DiscordMessenger,
    userId: string
  ): Promise<void> {
    messenger.respond('This is where we would activate a hunter.');
    return;
  }
}
