import { IOutcome } from "./iOutcome"

export interface ISpecialMove {
    userDiscriminator: string,
    createdOn: number,
    commandDescription?: string,
    userId: string,
    guildName: string,
    moveToModify?: string,
    outcome?: IOutcome,
    userName: string,
    playbook?: string,
    guildId: string,
    description: string,
    key: string,
    name: string,
    type: 'simple' | 'modification' | 'roll',
    modifiers?: IModifier[],
    hasLibraryCopy?: boolean,
    guildIdOfOrigin?: string
}

interface IModifier {
    type: string,
    property: string,
    plus: boolean,
}
