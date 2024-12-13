import { DiscordMessenger } from '../../interfaces/DiscordMessenger';
import { createActionRowTextInput, createModal } from '../../utils/components';
import { textInput } from '../../interfaces/DiscordInteractions';
import { CustomMoveModalInputFields, ModalCustomIdNames } from '../../interfaces/enums';
import { undefinedIfEmptyString } from '../../utils/movesHelperV2';

export default {
  async execute(
    messenger: DiscordMessenger,
    userId: string,
    key: string,
    moveContext?: any
  ): Promise<void> {

    /**
     * Get the values from the existing move if present
     * Discord can't handle an empty string in the value field. It can handle undefined.
     */
    const descriptionValue = undefinedIfEmptyString(moveContext?.description);

    const descriptionInput: textInput = {
      type: 4,
      custom_id: CustomMoveModalInputFields.description,
      style: 2,
      label: 'Description',
      min_length: 1,
      max_length: 1000,
      required: true,
      value: descriptionValue
    };

    const formInputs = [
      createActionRowTextInput(descriptionInput),
    ];

    const modalCustomId = `${ModalCustomIdNames.update_move}_${key}`;

    messenger.respondWithModal(createModal(modalCustomId, key, formInputs));

    return;
  }
}
