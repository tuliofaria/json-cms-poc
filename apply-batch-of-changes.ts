import { Octokit } from "@octokit/rest"
import { Base64 } from "js-base64"
import dotenv from 'dotenv'
import set from 'lodash/set'

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
});

const owner = 'tuliofaria'
const repo = 'json-cms-poc'
const path = 'content/en.json'
const ref = 'refs/heads/test'

const createBranch = async () => {
  try {
    const masterRef = await octokit.git.getRef({
      owner,
      repo,
      ref: 'heads/main'
    })
    const masterRefSha = masterRef.data.object.sha

    const newBranchName = 'test'
    const newRef = await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranchName}`,
      sha: masterRefSha,
    });

    console.log(newRef)

  } catch (err) {
    console.log(err)
  }
}

const createPullRequest = async () => {
  const response = await octokit.pulls.create({
    owner,
    repo,
    title: 'cms: content update',
    head: 'refs/heads/test',
    base: 'refs/heads/main',
    body: 'cms: content update',
  });

}

const main = async () => {
  // await createBranch()
  try {

    console.log({ owner, repo, ref })

    //await createPullRequest()

    // await createBranch()

    await createPullRequest()

    return

    const currentFile = await octokit.repos.getContent({
      owner,
      repo,
      ref,
      path
    })

    const content = Buffer.from(currentFile?.data?.content, 'base64').toString('utf-8');

    const obj = JSON.parse(content)

    // apply changes
    set(obj, 'product1.name', 'New name ' + new Date().toISOString())

    const fileSha = currentFile.data.sha

    const contentEncoded = Base64.encode(JSON.stringify(obj, null, 2))

    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      branch: 'test',
      sha: fileSha,
      message: "content: 2 update product1.name",
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

    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

main();
