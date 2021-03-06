import assert from 'assert';
import { join } from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';
import {
  versionedName,
  reference,
  Resource,
  DeploymentConfig,
} from '@tfinjs/api';
import withCloudwatch from './withCloudwatch';

const relativeZipFilePath = './aws_lambda_package.zip';

const getS3Key = (r) => `${r.versionedName()}.zip`;

class LambdaResource {
  constructor(
    deploymentConfig,
    name,
    {
      lambdaDeploymentBucket,
      package: packageFunction,
      timeout = 30,
      memorySize = 512,
      cloudwatch = true,
    },
    fileSystem = fs,
  ) {
    if (!(deploymentConfig instanceof DeploymentConfig)) {
      throw new Error(
        'Error you have two versions of @tfinjs/api in you node_modules, @tfinjs/aws-lambda is not using the same version as your project',
      );
    }

    this.setFs(fileSystem);

    const lambdaRole = new Resource(deploymentConfig, 'aws_iam_role', name, {
      assume_role_policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
            Effect: 'Allow',
            Sid: '',
          },
        ],
      }),
    });

    const zipUpload = new Resource(
      deploymentConfig,
      'aws_s3_bucket_object',
      name,
      {
        bucket: reference(lambdaDeploymentBucket, 'id'),
        key: getS3Key,
        source: relativeZipFilePath,
        content_type: 'application/zip',
      },
    );

    zipUpload.addPreBuildHook(async (r) => {
      const outputFolder = join(r.getProject().getDist(), r.versionedName());
      mkdirp.sync(outputFolder, {
        fs: this.fs,
      });
      await packageFunction(join(outputFolder, relativeZipFilePath));
    });

    const lambda = new Resource(
      deploymentConfig,
      'aws_lambda_function',
      name,
      {
        function_name: versionedName(),
        s3_key: getS3Key(zipUpload),

        s3_bucket: reference(lambdaDeploymentBucket, 'id'),

        handler: 'service.handler',
        runtime: 'nodejs8.10',

        timeout,
        memory_size: memorySize,

        role: reference(lambdaRole, 'arn'),

        description: `tfinjs-aws-lambda/${name}`,
      },
      {
        dependsOn: [zipUpload],
      },
    );

    let cloudwatchResources = {};
    if (cloudwatch) {
      cloudwatchResources = withCloudwatch(
        deploymentConfig,
        lambda,
        lambdaRole,
      );
    }

    return {
      lambda,
      zipUpload,
      lambdaRole,
      ...cloudwatchResources,
    };
  }

  /**
   * Sets the filesystem of this project
   *
   * @returns {*} fs
   * @memberof Project
   */
  setFs(fileSystem) {
    assert(
      fileSystem.writeFileSync
        && fileSystem.readFileSync
        && fileSystem.mkdir
        && fileSystem.stat,
      'fileSystem must be implemented as the node fs module',
    );

    this.fs = fileSystem;
  }
}

export default LambdaResource;
