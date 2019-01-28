yarn run l:build
rm -rf ./node_modules/@tfinjs/api
rm -rf ./node_modules/@tfinjs/aws-lambda
rm -rf ./node_modules/@tfinjs/aws-lambda-packager
rm -rf ./node_modules/@tfinjs/cli
cp -R "./api" "./node_modules/@tfinjs"
cp -R "./aws-lambda" "./node_modules/@tfinjs"
cp -R "./aws-lambda-packager" "./node_modules/@tfinjs"
cp -R "./cli" "./node_modules/@tfinjs"
