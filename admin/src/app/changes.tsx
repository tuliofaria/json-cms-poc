'use client'

import { saveBatch } from "@/server/actions"
import { useActionState, useState } from "react"

type FileChange = {
    key: string
    value: string
}

type Field = {
    key: string
    label: string
    editable: boolean
}

type Props = {
    fields: Field[]
    ids: string[]
}

export const Changes = ({ fields, ids }: Props) => {
    const [listChanges, setListChanges] = useState<FileChange[]>([])

    const [productId, setProductId] = useState('')
    const [selectedField, setSelectedField] = useState('')


    const [value, setValue] = useState('')
    const [result, setResult] = useState<unknown>()

    const addToBatch = () => {

        if (productId === '' || selectedField === '' || value === '') {
            return
        }

        const key = selectedField.replace('{id}', productId)

        setListChanges(old => {
            return [...old, { key, value }]
        })

        setSelectedField('')
        setProductId('')
        setValue('')
    }

    const onSaveBatch = async () => {
        const result = await saveBatch(listChanges)
        setResult(result)
    }

    return (<div className="m-8 p-8">
        <h2 className="font-bold py-2">Changes:</h2>
        <select value={productId} onChange={(e) => setProductId(e.target.value)} >
            <option>Select a product</option>
            {ids?.map(id => <option key={id} value={id}>{id}</option>)}
        </select>
        <p>
            <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
                <option>Select the field</option>
                {fields.map(field => <option key={field.key} value={field.key} disabled={!field.editable}>{field.label}</option>)}
            </select>
            <label><input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="border-1" placeholder="Key to update" /> </label>
            <button className="cursor-pointer bg-gray-100 p-2" type="button" onClick={addToBatch}>Add change to batch</button>
        </p>
        <h3 className="border-t mt-1 pt-2 font-bold">Changes on the batch: </h3>
        <ul>
            {listChanges.map(change => (
                <li key={change.key} className="py-1">Key: {change.key} New value: {change.value}</li>
            ))}
        </ul>
        <button type="button" className="cursor-pointer bg-gray-100 p-2" onClick={onSaveBatch}>Publish batch</button>
        <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>)

}
