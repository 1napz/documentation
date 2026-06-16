const {test} = require('node:test')
const assert = require('node:assert/strict')
const {resolve} = require('node:path')
const fs = require('node:fs')

const ROOT = resolve(__dirname, '..', '..')

const cliPkg = JSON.parse(fs.readFileSync(resolve(ROOT, 'cli', 'package.json'), 'utf-8'))
const rootPkg = JSON.parse(fs.readFileSync(resolve(ROOT, 'package.json'), 'utf-8'))
const lockfile = JSON.parse(fs.readFileSync(resolve(ROOT, 'package-lock.json'), 'utf-8'))

// Pull a resolved version from the npm lockfile v3 packages map
const lockedVersion = pkgName => lockfile.packages[`node_modules/${pkgName}`]?.version

test('cli/package.json is valid JSON with expected shape', () => {
  assert.ok(cliPkg.dependencies, 'has dependencies field')
  assert.ok(cliPkg.devDependencies, 'has devDependencies field')
  assert.ok(cliPkg.templateOSS, 'has templateOSS field')
})

test('root package.json is valid JSON with expected shape', () => {
  assert.ok(rootPkg.devDependencies, 'has devDependencies field')
  assert.ok(rootPkg.templateOSS, 'has templateOSS field')
})

test('cli/package.json semver dependency is bumped to ^7.8.1', () => {
  assert.equal(cliPkg.dependencies.semver, '^7.8.1')
})

test('package-lock.json semver locked version is 7.8.1', () => {
  const locked = lockedVersion('semver')
  assert.equal(locked, '7.8.1')
})

test('package-lock.json semver locked version satisfies ^7.8.1 range', () => {
  const locked = lockedVersion('semver')
  assert.ok(locked, 'semver must be present in lockfile')
  const [major, minor, patch] = locked.split('.').map(Number)
  // ^7.8.1 means >=7.8.1 <8.0.0
  assert.equal(major, 7, `major version must be 7, got ${major}`)
  assert.ok(minor > 8 || (minor === 8 && patch >= 1), `version ${locked} must be >=7.8.1`)
})

test('cli/package.json @npmcli/template-oss devDependency is bumped to 5.1.0', () => {
  assert.equal(cliPkg.devDependencies['@npmcli/template-oss'], '5.1.0')
})

test('cli/package.json templateOSS.version is updated to 5.1.0', () => {
  assert.equal(cliPkg.templateOSS.version, '5.1.0')
})

test('root package.json @npmcli/template-oss devDependency is bumped to 5.1.0', () => {
  assert.equal(rootPkg.devDependencies['@npmcli/template-oss'], '5.1.0')
})

test('root package.json templateOSS.version is updated to 5.1.0', () => {
  assert.equal(rootPkg.templateOSS.version, '5.1.0')
})

test('template-oss version is consistent between cli and root package.json', () => {
  assert.equal(
    cliPkg.devDependencies['@npmcli/template-oss'],
    rootPkg.devDependencies['@npmcli/template-oss'],
    'Both package.json files must declare the same @npmcli/template-oss version',
  )
  assert.equal(
    cliPkg.templateOSS.version,
    rootPkg.templateOSS.version,
    'Both templateOSS.version fields must match',
  )
})

test('template-oss devDependency matches templateOSS.version field in cli/package.json', () => {
  assert.equal(
    cliPkg.devDependencies['@npmcli/template-oss'],
    cliPkg.templateOSS.version,
    'devDependency pin and templateOSS.version must agree in cli/package.json',
  )
})

test('template-oss devDependency matches templateOSS.version field in root package.json', () => {
  assert.equal(
    rootPkg.devDependencies['@npmcli/template-oss'],
    rootPkg.templateOSS.version,
    'devDependency pin and templateOSS.version must agree in root package.json',
  )
})

test('package-lock.json @npmcli/template-oss locked version is 5.1.0', () => {
  const locked = lockedVersion('@npmcli/template-oss')
  assert.equal(locked, '5.1.0')
})

test('package-lock.json cli workspace declares semver ^7.8.1', () => {
  const cliWorkspace = lockfile.packages['cli']
  assert.ok(cliWorkspace, 'cli workspace entry exists in lockfile')
  assert.equal(cliWorkspace.dependencies.semver, '^7.8.1')
})

test('package-lock.json cli workspace declares @npmcli/template-oss 5.1.0', () => {
  const cliWorkspace = lockfile.packages['cli']
  assert.ok(cliWorkspace, 'cli workspace entry exists in lockfile')
  assert.equal(cliWorkspace.devDependencies['@npmcli/template-oss'], '5.1.0')
})

// Regression: previous pinned versions must not appear after the bump
test('cli/package.json does not reference old semver version ^7.8.0', () => {
  assert.notEqual(cliPkg.dependencies.semver, '^7.8.0')
})

test('cli/package.json does not reference old template-oss version 5.0.0', () => {
  assert.notEqual(cliPkg.devDependencies['@npmcli/template-oss'], '5.0.0')
  assert.notEqual(cliPkg.templateOSS.version, '5.0.0')
})

test('root package.json does not reference old template-oss version 5.0.0', () => {
  assert.notEqual(rootPkg.devDependencies['@npmcli/template-oss'], '5.0.0')
  assert.notEqual(rootPkg.templateOSS.version, '5.0.0')
})

test('package-lock.json does not contain old @npmcli/template-oss 5.0.0', () => {
  assert.notEqual(lockedVersion('@npmcli/template-oss'), '5.0.0')
})

test('package-lock.json does not contain old semver 7.8.0', () => {
  assert.notEqual(lockedVersion('semver'), '7.8.0')
})
