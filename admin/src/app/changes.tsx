'use client'

import { saveBatch } from "@/server/actions"
import { useActionState, useState } from "react"

type FileChange = {
    key: string
    value: string
}

export const Changes = () => {
    const [listChanges, setListChanges] = useState<FileChange[]>([])
    const [key, setKey] = useState('')
    const [value, setValue] = useState('')
    const [result, setResult] = useState<unknown>()

    const addToBatch = () => {
        setListChanges(old => {
            return [...old, { key, value }]
        })
        setKey('')
        setValue('')
    }

    const onSaveBatch = async () => {
        const result = await saveBatch(listChanges)
        setResult(result)
    }

    return (<div className="m-8 p-8">
        <h2 className="font-bold py-2">Changes:</h2>
        <p>
            <label><input type="text" value={key} onChange={(e) => setKey(e.target.value)} className="border-1" placeholder="Key to update" /> </label>
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
