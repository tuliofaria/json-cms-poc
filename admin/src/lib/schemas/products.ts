
type MirrorOperation = {
    filePath: string | ((id: string) => string)
    path: string | ((id: string) => string)
}

type Field = {
    path: string
    label: string
    editable: boolean
    validator: (value: string) => boolean
    type: 'string' | 'video-id'
    mirror?: MirrorOperation[]
}

type FieldId = {
    id: Field
}

export type ContentSchema = {
    settings: {
        mode: 'single-file',
        path: string
    },
    fields: FieldId & Record<string, Field>
}

export const ProductsSchema: ContentSchema = {
    settings: {
        mode: 'single-file',
        path: 'content/en.json',
    },
    fields: {
        id: {
            path: '{id}',
            label: 'Product Slug',
            validator(value) {
                return Boolean(value && value.length > 10)
            },
            editable: false,
            type: 'string'
        },
        name: {
            path: '{id}.name',
            label: 'Product name',
            validator(value) {
                return Boolean(value && value.length > 10)
            },
            editable: true,
            type: 'string',
            mirror: [
                { filePath: '', path: 'products.{id}' }
            ]
        },
        video: {
            path: '{id}.video.id',
            label: 'Video',
            validator(value) {
                return Boolean(value && value.match(/[a-z0-9]{4,5}/))
            },
            editable: true,
            type: 'video-id'
        }
    }
}

export const availableSchemas = {
    product: ProductsSchema
} as const
