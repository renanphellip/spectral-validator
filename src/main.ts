import * as core from '@actions/core'
import spectralValidate from './validator'
import { readFileAndParse, readRulesetAndParse, createFile } from './file'

export async function run(): Promise<void> {
  try {
    const rulesetPath: string = core.getInput('ruleset-path')
    const filePath: string = core.getInput('file-path')
    const outputPath: string = core.getInput('output-path')

    core.debug('inputs:')
    core.debug(
      JSON.stringify(
        {
          rulesetPath,
          filePath,
          outputPath
        },
        null,
        4
      )
    )

    const document = readFileAndParse(filePath)
    const ruleset = await readRulesetAndParse(rulesetPath)
    const result = await spectralValidate(ruleset, document)
    const output = JSON.stringify(result)

    createFile(outputPath, output)
    core.setOutput('output', output)

    if (result.length > 0) throw new Error(output)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
