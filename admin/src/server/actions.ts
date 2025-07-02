'use server'

import { createBranch, octokit } from "@/lib/git"
import { Base64 } from "js-base64"
import set from 'lodash/set'
import has from 'lodash/has'

type FileChange = {
    key: string
    value: string
}

export const saveBatch = async (changes: FileChange[]) => {
    const owner = 'tuliofaria'
    const repo = 'json-cms-poc'
    const path = 'content/en.json'
    const ref = 'refs/heads/test'

    const branchName = `content-${new Date().toISOString()}`.replaceAll(':', '_')

    await createBranch({ branchName })


    // applying changes on branch
    const currentFile = await octokit.repos.getContent({
        owner,
        repo,
        ref: `heads/${branchName}`,
        path
    })

    // @ts-expect-error
    const content = Buffer.from(currentFile?.data?.content, 'base64').toString('utf-8');

    const obj = JSON.parse(content)

    // apply file changes
    changes.forEach(change => {
        // TODO: validation on schema
        // - The key can be changed? This is only to change allowed keys
        if (has(obj, change.key)) {
            set(obj, change.key, change.value)
        }
    })


    // @ts-expect-error
    const fileSha = currentFile.data.sha

    const contentEncoded = Base64.encode(JSON.stringify(obj, null, 2))

    const { data } = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        branch: branchName,
        sha: fileSha,
        message: `content: changed at: ${new Date().toISOString()}`,
        content: contentEncoded,
        committer: {
            name: `Content editor`,
            email: "content-editor@gmail.com",
        },
        author: {
            name: `Content editor`,
            email: "content-editor@gmail.com",
        },
    });

    // open the PR
    const response = await octokit.pulls.create({
        owner,
        repo,
        title: 'cms: content update',
        head: `refs/heads/${branchName}`,
        base: 'refs/heads/main',
        body: 'cms: content update',
    });

    return { data, response }

}
