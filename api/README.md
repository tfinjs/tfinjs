Terraform in JavaScript
=======================

**Note:** The project is in beta and will undergo major changes before a stable release (version 1.0.0).


## Table of Contents
* [Intro](#intro)
* [Installation](#installation)
* [Examples](#installation)


## Intro

Use a scripting language to generate resources with a greater degree of configurability and modularity.

#### tfinjs API provides:
1. The JavaScript API for creating terraform resources.
2. A resource naming API. Used to avoid in-cloud naming collisions and to reference resources across projects, environments, versions, tennants and regions.

#### tfinjs CLI provides:
1. Commands to build, plan and deploy a tfinjs project with versioning and deployment-environment control for each deployed resource.
2. CI/CD capabilities.

## Installation
### CLI
```bash
npm install -D @tfinjs/api @tfinjs/cli
```

## Examples
See EXAMPLES.md
