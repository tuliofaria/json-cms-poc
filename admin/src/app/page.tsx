import { getFileContents } from "@/lib/git"
import { Changes } from "./changes"
import { getMetaFields, getSchemaIds } from "@/lib/cms"

export const dynamic = 'force-dynamic'

const path = 'content/en.json'
const ref = 'refs/heads/main'



export default async function Home() {
  const obj = await getFileContents({
    path, ref
  })
  const availableFields = getMetaFields('product')
  const availableProductIds = await getSchemaIds('product')

  return (
    <>
      <div className="m-8 p-8 border-1 rounded">
        <h1>Update content/en.json</h1>
        <pre className="bg-gray-100 p-4">{JSON.stringify(obj, null, 2)}</pre>
      </div>

      <Changes fields={availableFields} ids={availableProductIds} />
    </>
  );
}
