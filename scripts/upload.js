const path = require('path')
const childProcess = require('child_process')
const ci = require('miniprogram-ci')
const pkg = require('./../package.json')
const projectConfig = require('./../project.config.json')

const execSync = childProcess.execSync

const getVersionInfo = () => {
  const gitTags = execSync('git tag -l --points-at HEAD').toString().split('\n').filter(Boolean)
  const commitId = execSync('git rev-parse --short HEAD').toString().trim()
  const [tag] = gitTags

  let versionName = (tag || pkg.version)

  if (!versionName.startsWith('v'))
    versionName = `v${versionName}`

  if (tag)
    return { version: versionName, commitId: '', tag, isMain: true }

  return {
    version: [versionName, commitId].join('#'),
    commitId,
    tag: '',
    isMain: false,
  }
}

const main = async () => {
  const resolve = dir => path.resolve(__dirname, dir)
  const { version, isMain } = getVersionInfo()

  const project = new ci.Project({
    appid: projectConfig.appid,
    type: 'miniProgram',
    projectPath: resolve('./../'),
    privateKeyPath: resolve('./../private.key'),
    ignores: ['node_modules/**/*'],
  })
  const beginTime = new Date()
  console.log(`[${beginTime.toLocaleTimeString()}] 开始上传`)
  await ci.upload({
    project,
    version,
    desc: isMain ? pkg.description : `[alpha]${pkg.description}`,
    robot: isMain ? 1 : 2,
    setting: {
      es6: true,
    },
  })
  const endTime = new Date()
  console.log(`[${endTime.toLocaleTimeString()}] 上传成功! 耗时: ${Math.floor((endTime.getTime() - beginTime.getTime()) / 1000)}s`)
}

main()
