import { int } from "aws-sdk/clients/datapipeline"

export const createActionRow = (innerComponents) => {

    return {
        type: 1,
        components: innerComponents
    }
}

export const createButton = (label: string, style: int, customId: string) => {
    return {
        type: 2,
        label,
        style,
        custom_id: customId
    }
}

