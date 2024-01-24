import {
  ISpectralDiagnostic,
  Ruleset,
  Spectral,
  Document
} from '@stoplight/spectral-core'
import { Resolver } from '@stoplight/json-ref-resolver'
import Parsers from '@stoplight/spectral-parsers'

async function spectralValidate(
  rulesetPath: Ruleset,
  document:
    | Document<unknown, Parsers.JsonParserResult<unknown>>
    | Document<unknown, Parsers.YamlParserResult<unknown>>
): Promise<ISpectralDiagnostic[]> {
  const customResolver = new Resolver({
    dereferenceInline: false,
    dereferenceRemote: false
  })
  const spectral = new Spectral({ resolver: customResolver })
  spectral.setRuleset(rulesetPath)
  return await spectral.run(document)
}

export default spectralValidate
