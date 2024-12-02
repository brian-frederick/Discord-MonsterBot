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

    const lowOutcomeInput: textInput = {
      type: 4,
      custom_id: CustomMoveModalInputFields.low_outcome,
      style: 2,
      label: 'On a miss...',
      min_length: 1,
      max_length: 1000,
      required: false
    };

    const middleOutcomeInput: textInput = {
      type: 4,
      custom_id: CustomMoveModalInputFields.middle_outcome,
      style: 2,
      label: 'On a 7 plus',
      min_length: 1,
      max_length: 1000,
      required: false
    };

    const highOutcomeInput: textInput = {
      type: 4,
      custom_id: CustomMoveModalInputFields.high_outcome,
      style: 2,
      label: 'On a 10 plus',
      min_length: 1,
      max_length: 1000,
      required: false
    };

    const advancedOutcomeInput: textInput = {
      type: 4,
      custom_id: CustomMoveModalInputFields.advanced_outcome,
      style: 2,
      label: 'On a 12 plus if advanced',
      min_length: 1,
      max_length: 1000,
      required: false
    };

    const formInputs = [
      createActionRowTextInput(descriptionInput),
      createActionRowTextInput(lowOutcomeInput),
      createActionRowTextInput(middleOutcomeInput),
      createActionRowTextInput(highOutcomeInput),
      createActionRowTextInput(advancedOutcomeInput)
    ];

    const modalCustomId = `${ModalCustomIdNames.update_move}_${key}`;

    messenger.respondWithModal(createModal(modalCustomId, key, formInputs));

    return;
  }
}
