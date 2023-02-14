
export const createActionRow = (innerComponents) => {

    return {
        type: 1,
        components: innerComponents
    }
}

export const createButton = (label: string, style: number, customId: string) => {
    return {
        type: 2,
        label,
        style,
        custom_id: customId
    }
}

export const createSelect = (customId: string, options: any[], minValues?: number, maxValues?: number) => {
    return {
        type: 3,
        custom_id: customId,
        options,
        min_values: minValues,
        max_values: maxValues
    }
}
