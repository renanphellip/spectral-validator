import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'
import { bundleAndLoadRuleset } from '@stoplight/spectral-ruleset-bundler/with-loader'
import { Ruleset, Document } from '@stoplight/spectral-core'
import {
  Yaml,
  YamlParserResult,
  Json,
  JsonParserResult
} from '@stoplight/spectral-parsers'

export function readFileAndParse(
  filePath: string
):
  | Document<unknown, JsonParserResult<unknown>>
  | Document<unknown, YamlParserResult<unknown>> {
  try {
    const fileExtension = path.extname(filePath)
    if (fileExtension === '.json') {
      const fileContent = fs.readFileSync(filePath, 'utf-8').trim()
      return new Document(fileContent, Json)
    } else if (fileExtension === '.yml' || fileExtension === '.yaml') {
      const fileContent = fs.readFileSync(filePath, 'utf-8').trim()
      return new Document(fileContent, Yaml)
    } else {
      throw new Error(
        'Extensão de arquivo não suportada. As extensões suportadas são: .json, .yml ou .yaml'
      )
    }
  } catch (error) {
    if (error instanceof Error)
      throw new Error(
        `Erro ao ler e converter o arquivo "${filePath}": ${error.message}`
      )
    else throw new Error(`Erro desconhecido: ${error}`)
  }
}

export async function readRulesetAndParse(
  rulesetPath: string
): Promise<Ruleset> {
  const rulesetAbsolutePath = path.resolve(rulesetPath)
  return await bundleAndLoadRuleset(rulesetAbsolutePath, { fs, fetch })
}

export function createFile(outputPath: string, content: string): void {
  try {
    const directory = path.dirname(outputPath)

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }

    fs.writeFileSync(outputPath, content, { flag: 'w', encoding: 'utf-8' })
    core.debug(`Arquivo "${outputPath}" criado com sucesso.`)
  } catch (error) {
    if (error instanceof Error)
      throw new Error(
        `Erro ao criar o arquivo "${outputPath}": ${error.message}`
      )
    else throw new Error(`Erro desconhecido: ${error}`)
  }
}
