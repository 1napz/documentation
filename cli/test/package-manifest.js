'use strict'

const {test} = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')

const cliPkg = require('../package.json')

test('semver dependency uses updated version constraint ^7.8.1', () => {
  assert.equal(cliPkg.dependencies.semver, '^7.8.1')
})

test('semver dependency version satisfies minimum 7.8.1', () => {
  // Ensure the constraint is not the older ^7.8.0
  assert.notEqual(cliPkg.dependencies.semver, '^7.8.0')
})

test('@npmcli/template-oss devDependency is pinned to 5.1.0', () => {
  assert.equal(cliPkg.devDependencies['@npmcli/template-oss'], '5.1.0')
})

test('@npmcli/template-oss devDependency is not the old 5.0.0 pin', () => {
  assert.notEqual(cliPkg.devDependencies['@npmcli/template-oss'], '5.0.0')
})

test('templateOSS.version matches the devDependency pin', () => {
  const devDepVersion = cliPkg.devDependencies['@npmcli/template-oss']
  assert.equal(cliPkg.templateOSS.version, devDepVersion)
})

test('templateOSS.version is 5.1.0', () => {
  assert.equal(cliPkg.templateOSS.version, '5.1.0')
})

test('templateOSS.version is not the old 5.0.0 value', () => {
  assert.notEqual(cliPkg.templateOSS.version, '5.0.0')
})

test('templateOSS config preserves required fields', () => {
  assert.equal(typeof cliPkg.templateOSS.content, 'string')
  assert.equal(cliPkg.templateOSS.testRunner, 'node:test')
  assert.equal(typeof cliPkg.templateOSS.coverageThreshold, 'number')
})

test('semver dependency version range starts with caret (^)', () => {
  assert.match(cliPkg.dependencies.semver, /^\^/)
})

test('semver version major.minor are 7.8', () => {
  // Constraint is ^7.8.1 — strip the leading ^
  const range = cliPkg.dependencies.semver.replace(/^\^/, '')
  const [major, minor] = range.split('.')
  assert.equal(major, '7')
  assert.equal(minor, '8')
})

test('package.json path resolves to the cli subdirectory', () => {
  const resolved = require.resolve('../package.json')
  assert.ok(resolved.includes(path.join('cli', 'package.json')))
})