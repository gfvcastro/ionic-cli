import * as chalk from 'chalk';
import {
  CommandLineInputs,
  CommandLineOptions,
  CommandMetadata,
  CommandPreRun,
} from '@ionic/cli-utils';

import { filterArgumentsForCordova } from '../lib/utils/cordova';
import { resetConfigXmlContentSrc } from '../lib/utils/configXmlUtils';
import { CordovaCommand } from './base';

@CommandMetadata({
  name: 'cordova compile',
  type: 'project',
  description: 'Compile native platform code',
  longDescription: `
Like running ${chalk.green('cordova compile')} directly, but provides friendly checks.
  `,
  exampleCommands: ['ios'],
  inputs: [
    {
      name: 'platform',
      description: `The platform to compile: ${chalk.green('ios')}, ${chalk.green('android')}`,
    }
  ],
})
export class CompileCommand extends CordovaCommand implements CommandPreRun {
  async preRun(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void> {
    await this.checkForAssetsFolder();

    if (!inputs[0]) {
      const platform = await this.env.prompt({
        type: 'input',
        name: 'platform',
        message: `What platform would you like to compile ${chalk.green('ios')}, ${chalk.green('android')}:`
      });

      inputs[0] = platform.trim();
    }

    await this.checkForPlatformInstallation(inputs[0]);
  }

  async run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void> {
    // ensure the content node was set back to its original
    await resetConfigXmlContentSrc(this.env.project.directory);
    const response = await this.runCordova(filterArgumentsForCordova(this.metadata, inputs, options));
    this.env.log.msg(response);
  }
}
