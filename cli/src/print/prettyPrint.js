import { getCyclic, getNonCyclic } from '@tfinjs/dependency-graph';
import assert from 'assert';
import chalk from 'chalk';
import figures from 'figures';
import { join } from 'path';

const prettyPrint = ({
  add, graph, remove, update, resources,
}, dist) => {
  assert(Array.isArray(add), 'add must be an array');
  assert(Array.isArray(remove), 'remove must be an array');
  assert(Array.isArray(update), 'update must be an array');
  assert(typeof graph === 'object', 'object must be an object');

  const getDir = (d) => join(dist, d);
  let output = '';
  const cyclic = getCyclic(graph);
  if (cyclic.stacks.length > 0) {
    const content = cyclic.stacks.map(
      (nodes) => `${figures.bullet} ${nodes.join(', ')}`,
    );
    output += `
      ${chalk.yellow.bold(
    `${figures.warning} Warning, you have circular dependencies!`,
  )}\n
      ${chalk.yellow(content)}
    `;
  }

  const dependencies = getNonCyclic(graph);

  const levels = dependencies
    .map((nodes) => nodes.filter((node) => [...add, ...update].includes(node)))
    .filter((nodes) => nodes.length);

  if (levels.length) {
    output += `\n\n${chalk.green.bold(
      `${figures.info} Run the following to deploy`,
    )}
    ${levels
    .map(
      (nodes, index) =>
        `\n${chalk(`# ${figures.pointer} level ${index}:`)}\n${nodes
          .map((node) =>
            chalk.bgBlack.green(
              `\n#${resources[node].uri}@${
                resources[node].contentHash
              }\ncd ${chalk.bold(
                getDir(node),
              )} && tf init && tf apply -auto-approve`,
            ))
          .join(' &&\n')}`,
    )
    .join('\n\n')}
    `;
  } else {
    output += '\nNothing to deploy\n';
  }
  if (remove.length) {
    output += `\n\n${chalk.red.bold('Delete the following resources')}
    ${chalk.bgBlack.red(
    remove
      .filter((node) => remove.includes(node))
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
