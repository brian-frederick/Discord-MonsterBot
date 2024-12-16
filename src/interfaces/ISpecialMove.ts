export interface ISpecialMove {
    userDiscriminator: string,
    userEmail: string,
    createdOn: Date,
    userId: string,
    guildName: string,
    userName: string,
    playbook: string,
    guildId: string,
    description: string,
    key: string,
    name: string,
    type: 'simple' | 'modification' | 'roll'
}