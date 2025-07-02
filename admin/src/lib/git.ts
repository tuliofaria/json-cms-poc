import { Octokit } from "@octokit/rest"

const owner = 'tuliofaria'
const repo = 'json-cms-poc'

export const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
});

type GetFileContentsParams = {
    ref: string
    path: string
}

export const getFileContents = async ({
    ref,
    path
}: GetFileContentsParams) => {

    const currentFile = await octokit.repos.getContent({
        owner,
        repo,
        ref,
        path
    })

    // @ts-expect-error
    const content = Buffer.from(currentFile?.data?.content, 'base64').toString('utf-8');

    return JSON.parse(content)
}


export const createBranch = async ({ branchName }: { branchName: string }) => {
    try {
        const masterRef = await octokit.git.getRef({
            owner,
            repo,
            ref: `heads/main`
        })
        const masterRefSha = masterRef.data.object.sha

        const newRef = await octokit.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${branchName}`,
            sha: masterRefSha,
        });

        return newRef

    } catch (err) {
        console.log(err)
    }
}
