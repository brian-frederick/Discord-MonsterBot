import { DiscordMessenger } from '../../interfaces/DiscordMessenger';
import { createActionRowTextInput, createModal } from '../../utils/components';
import { textInput } from '../../interfaces/DiscordInteractions';
import { CustomMoveModalInputFields, ModalCustomIdNames } from '../../interfaces/enums';
import { undefinedIfEmptyString } from '../../utils/movesHelperV2';
import { CUSTOM_ID_LIBRARY_IND } from '../../utils/specialMovesHelper';

export default {
  async execute(
    messenger: DiscordMessenger,
    userId: string,
    key: string,
    isLibraryMove: boolean,
    moveContext?: any,
  ): Promise<void> {

    console.log('bftest moveContext', moveContext);

    /**
     * Get the values from the existing move if present
     * Discord can't handle an empty string in the value field. It can handle undefined.
     */
    const descriptionValue = undefinedIfEmptyString(moveContext?.description);
    const lowVOutcomeValue = undefinedIfEmptyString(moveContext?.outcome?.fail?.description);
    const middleOutcomeValue = undefinedIfEmptyString(moveContext?.outcome?.success?.description);
    const highOutcomeValue = undefinedIfEmptyString(moveContext?.outcome?.high?.description);
    const advancedOutcomeValue = undefinedIfEmptyString(moveContext?.outcome?.advanced?.description);

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

    const lowOutcomeInput: textInput = {
      type: 4,
      custom_id: CustomMoveModalInputFields.low_outcome,
      style: 2,
      label: 'On a miss...',
      min_length: 1,
      max_length: 1000,
      required: false,
      value: lowVOutcomeValue
    };

    const middleOutcomeInput: textInput = {
      type: 4,
      custom_id: CustomMoveModalInputFields.middle_outcome,
      style: 2,
      label: 'On a 7 plus',
      min_length: 1,
      max_length: 1000,
      required: false,
      value: middleOutcomeValue
    };

    const highOutcomeInput: textInput = {
      type: 4,
      custom_id: CustomMoveModalInputFields.high_outcome,
      style: 2,
      label: 'On a 10 plus',
      min_length: 1,
      max_length: 1000,
      required: false,
      value: highOutcomeValue
    };

    const advancedOutcomeInput: textInput = {
      type: 4,
      custom_id: CustomMoveModalInputFields.advanced_outcome,
      style: 2,
      label: 'On a 12 plus if advanced',
      min_length: 1,
      max_length: 1000,
      required: false,
      value: advancedOutcomeValue
    };

    const formInputs = [
      createActionRowTextInput(descriptionInput),
      createActionRowTextInput(lowOutcomeInput),
      createActionRowTextInput(middleOutcomeInput),
      createActionRowTextInput(highOutcomeInput),
      createActionRowTextInput(advancedOutcomeInput)
    ];

    const modalCustomId = isLibraryMove ?
    `${ModalCustomIdNames.update_move}_${key}_${CUSTOM_ID_LIBRARY_IND}` :
    `${ModalCustomIdNames.update_move}_${key}`;
    
    messenger.respondWithModal(createModal(modalCustomId, key, formInputs));

    return;
  }
}
