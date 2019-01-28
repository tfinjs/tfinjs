import { reference, Resource } from '@tfinjs/api';

export default (deploymentConfig, lambda, lambdaRole) => {
  const lambdaCloudwatchGroup = new Resource(
    deploymentConfig,
    'aws_cloudwatch_log_group',
    'lambda_cloudwatch_group',
    {
      name: `/aws/lambda/${lambda.versionedName()}`,
    },
  );
  deploymentConfig.getProvider();
  const prefix = [
    'arn:aws:logs',
    '${data.aws_region.current.name}',
    '${data.aws_caller_identity.current.account_id}',
    'log-group',
    `/aws/lambda/${lambda.versionedName()}`,
  ].join(':');
  const cloudwatchAttachablePolicy = new Resource(
    deploymentConfig,
    'aws_iam_policy',
    'cloudwatch_attachable_policy',
    {
      policy: JSON.stringify(
        {
          Version: '2012-10-17',
          Statement: [
            {
              Action: ['logs:CreateLogStream'],
              Effect: 'Allow',
              Resource: `${prefix}:*`,
            },
            {
              Action: ['logs:PutLogEvents'],
              Effect: 'Allow',
              Resource: `${prefix}:*:*`,
            },
          ],
        },
        null,
        2,
      ),
    },
    {
      extraHcl: () => `
            data "aws_region" "current" {}
            data "aws_caller_identity" "current" {}
          `,
    },
  );

  const cloudwatchRoleAttachment = new Resource(
    deploymentConfig,
    'aws_iam_role_policy_attachment',
    'cloudwatch_role_attachment',
    {
      role: reference(lambdaRole, 'name'),
      policy_arn: reference(cloudwatchAttachablePolicy, 'arn'),
    },
  );

  return {
    lambdaCloudwatchGroup,
    cloudwatchAttachablePolicy,
    cloudwatchRoleAttachment,
  };
};
