<div align='center'>
  <img width='100px'  src='https://avatars2.githubusercontent.com/u/23360933?s=200&v=4'/>
  <img width='100px' src='https://gitforwindows.org/img/git_logo.png'/>
</div>

# git-submodule-preserve [![Build Status](https://travis-ci.org/erdembircan/git-submodule-preserve.svg?branch=master)](https://travis-ci.org/erdembircan/git-submodule-preserve)

> nuxt module for preserving git submodule in generated static apps

## ❓ Why

By default `nuxt generate` command, which is responsible for creating static web apps, remove the entire target folder at regeneration. This may be an issue if you decided to split your source code from generated code and version/store them on seperate `git` repositories ([git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)). This module gives you the ability to preserve the `git submodule` at your production folder.

## 🖥 Usage

```bash
# install using your favourite package manager
npm install git-submodule-preserve -D
# or
yarn add git-submodule-preserve -D
```

> 💡 It is highly recommended to use this module under `buildModules` in your `nuxt.config.js` file and install as a `devDependency` for a faster production startup and smaller `node_modules` size.

## 📕 License

MIT

---

Erdem Bircan (c) 2019
