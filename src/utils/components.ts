import { textInput } from "../interfaces/DiscordInteractions"

export const createActionRow = (innerComponents) => {

    return {
        type: 1,
        components: innerComponents
    }
}

export const createActionRowTextInput = (textInput: textInput) => {

    return {
        type: 1,
        components: [textInput]
    }
}
export const createModal = (customId: string, title: string,innerComponents) => {
    return {
        type: 9,
        data: {
            custom_id: customId,
            title,
            components: innerComponents
        }
    };
}

export const createButton = (label: string, style: number, customId: string) => {
    return {
        type: 2,
        label,
        style,
        custom_id: customId
    }
}

export const createBeerButton = () => {
    return {
        emoji: {
            "id": null,
            "name": "🍺"
        },
        label: `Buy Monsterbot a beer`,
        style: 5,
        type: 2,
        url: 'https://www.buymeacoffee.com/monsterbot'
    }
};

export const createSelect = (customId: string, options: any[], minValues?: number, maxValues?: number) => {
    return {
        type: 3,
        custom_id: customId,
        options,
        min_values: minValues,
        max_values: maxValues
    }
}
