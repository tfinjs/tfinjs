import fromPairs from 'lodash/fromPairs';
import { resolve } from 'path';

export const STATUS_DEPLOYED = 'DEPLOYED';
export const STATUS_DESTROYED = 'DESTROYED';
export const STATUS_OUTDATED = 'OUTDATED';
export const STATUS_UNDEPLOYED = 'UNDEPLOYED';

const getBuiltResources = (dist, fs) => {
  const files = fs.readdirSync(dist);
  const resources = fromPairs(
    files
      .filter((fileName) => {
        const filePath = resolve(dist, fileName);
        return (
          fs.lstatSync(filePath).isDirectory()
          && fs.existsSync(resolve(dist, fileName, 'tfinjs.json'))
        );
      })
      .map((fileName) => {
        const resource = JSON.parse(
          fs.readFileSync(resolve(dist, fileName, 'tfinjs.json')),
        );
        let status = '';
        const statusFilePath = resolve(dist, fileName, 'deployment_status.txt');
        if (!fs.existsSync(statusFilePath)) {
          status = STATUS_UNDEPLOYED;
        } else {
          const content = fs
            .readFileSync(statusFilePath, 'utf8')
            .replace(/^\s+/, '')
            .replace(/\s+$/, '');
          if (content === 'DESTROYED') {
            status = STATUS_DESTROYED;
          } else if (content !== resource.contentHash) {
            status = STATUS_OUTDATED;
          } else {
            status = STATUS_DEPLOYED;
          }
        }
        return [
          fileName,
          {
            ...resource,
            status,
          },
        ];
      }),
  );

  return resources;
};

export default getBuiltResources;
