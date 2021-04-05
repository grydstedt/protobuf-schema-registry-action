import * as core from '@actions/core'
import upload from './upload'

async function run(): Promise<void> {
  try {
    const glob = core.getInput('glob', {required: true})
    const url = core.getInput('registryUrl', {required: true})
    const username = core.getInput('username', {required: true})
    const password = core.getInput('password', {required: true})
    await upload(glob, url, username, password)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

export default run
