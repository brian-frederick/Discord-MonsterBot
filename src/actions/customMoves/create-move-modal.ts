import { DiscordMessenger } from '../../interfaces/DiscordMessenger';
import { createActionRowTextInput, createModal } from '../../utils/components';
import { textInput } from '../../interfaces/DiscordInteractions';
import { CustomMoveModalInputFields, ModalCustomIdNames } from '../../interfaces/enums';

export default {
  async execute(
    messenger: DiscordMessenger,
    userId: string,
    key: string
  ): Promise<void> {


    const descriptionInput: textInput = {
      type: 4,
      custom_id: CustomMoveModalInputFields.description,
      style: 2,
      label: 'Description',
      min_length: 1,
      max_length: 1000,
      required: true
    };

    const formInputs = [
      createActionRowTextInput(descriptionInput),
    ];

    const modalCustomId = `${ModalCustomIdNames.update_move}_${key}`;

    messenger.respondWithModal(createModal(modalCustomId, key, formInputs));

    return;
  }
}
