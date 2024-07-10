import Handlebars from 'handlebars';
import stripIndent from 'strip-indent';

export interface ConfigMatcherTypeHandlebarsTemplateData {
  stateTypeUnion: string;
}

const handlebarsTemplate = stripIndent(`
/**
 * DO NOT EDIT THIS FILE MANUALLY
 * Auto generated file by the build process
 */

export type State = {
{{{stateTypeUnion}}}
};
`);

export const configMatcherTypeTemplate = Handlebars.compile<ConfigMatcherTypeHandlebarsTemplateData>(handlebarsTemplate);