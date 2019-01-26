Packager for @tfinjs/aws-lambda
===============================

Use this packager to transpile your modules with webpack, find all the used dependencies and package it all into a zip file.


```typescript
async packager(entryFilePath: string, dist: string)
```

### Usage:
```javascript
import packager from '@tfinjs/aws-lambda-packager';
import path from 'path';

const entryFilePath = path.resolve(__dirname, 'service.js');
const zipFilePath = path.resolve(__dirname, 'dist/service.zip')
packager(entryFilePath, zipFilePath)
  .then(() => {
    console.log('Done');
  })
  .catch((err) => {
    console.log(err);
  });

```


