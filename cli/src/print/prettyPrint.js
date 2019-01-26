import figures from 'figures';
import { join } from 'path';
import chalk from 'chalk';
import {
  getCyclic,
  getDependenciesOfNode,
  getInversedDependenciesOfNode,
  getNonCyclic,
} from '@tfinjs/dependency-graph';

const prettyPrint = ({
  add, graph, remove, update,
}, dist) => {
  const getDir = (d) => join(dist, d);
  let output = '';
  const cyclic = getCyclic(graph);
  if (cyclic.stacks.length > 0) {
    const content = cyclic.stacks.map(
      (nodes) => `${figures.bullet} ${nodes.join(', ')}`,
    );
    output += `
      ${chalk.red.bold('Warning, you have circular dependencies!')}\n
      ${chalk.red(content)}
    `;
  }

  console.log(add, update);

  const dependencies = getNonCyclic(graph);
  output += `\n\n${chalk.green.bold('Run the following to deploy')}
    ${dependencies
    .map(
      (nodes, index) =>
        `\n${chalk(`# level ${index}:`)}\n${nodes
          .map((node) =>
            chalk.bgBlack.green(
              `\ncd ${chalk.bold(
                getDir(node),
              )} && tf init && tf apply -auto-approve`,
            ))
          .join(' &&\n')}`,
    )
    .join('\n\n')}
  `;
  if (remove.length) {
    output += `\n\n${chalk.red.bold('Delete the following resources')}
    ${chalk.bgBlack.red(
    remove
      .map(
        (node) =>
          `\ncd ${chalk.bold(
            getDir(node),
          )} && tf init && tf destroy -auto-approve`,
      )
      .join(' &&\n'),
  )}
  `;
  }

  return output;
};

export default prettyPrint;
