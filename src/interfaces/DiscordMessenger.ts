import Discord from 'discord.js';

export interface DiscordMessenger {
  channel: Discord.TextChannel,
  
  /**
  * Initial response to request. Can only be used once per command invocation for slash commands.
  */
  respond: (msg: string) => Promise<Discord.Message>,


  respondWithModal: (components: any) => Promise<Discord.Message>,
  
  /**
  * Subsequent messages after initial ack. Can be invoked multiple times per command.
  */
  followup: (msg: string, components?: any[]) => Promise<Discord.Message>,

  /**
  * Initial response to request in the form of an embed. Can only be used once per command invocation for slash commands.
  */
  respondWithEmbed: (embed: any, components?: any) => Promise<Discord.Message>,

  /**
  * Initial response to request in the form of multiple embeds. Can only be used once per command invocation for slash commands.
  */
  respondWithEmbeds: (embeds: any[], components?: any) => Promise<void>,

  /**
  * Subsequent messages in the form of an embed after initial ack. Can be invoked multiple times per command.
  */
  followupWithEmbed: (embed: any, components?: any) => Promise<Discord.Message>
}
