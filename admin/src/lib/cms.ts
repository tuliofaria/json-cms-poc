import { getFileContents } from "./git"
import { availableSchemas } from "./schemas/products"
import keys from 'lodash/keys'
import map from 'lodash/map'

export const getMetaFields = (schemaKey: keyof typeof availableSchemas) => {
    const schema = availableSchemas[schemaKey]
    const fields = keys(schema.fields)
    const meta = map(fields, fieldKey => {
        const field = schema.fields[fieldKey]
        return {
            key: field.path,
            label: field.label,
            editable: field.editable
        }
    })
    return meta
}


export const getSchemaIds = async (schemaKey: keyof typeof availableSchemas) => {
    const schema = availableSchemas[schemaKey]

    const branchName = 'main'
    const path = schema.settings.path
    const idPath = schema.fields.id.path

    const content = await getFileContents({ path, ref: branchName })

    // root
    if (idPath === '{id}') {
        return keys(content)
    }

    // TODO handle others: ex, prePath.{id}, prePath.{id} etc

    return []
}
