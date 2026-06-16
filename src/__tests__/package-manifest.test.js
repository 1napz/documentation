import rootPkg from '../../package.json'

test('@npmcli/template-oss devDependency is pinned to 5.1.0', () => {
  expect(rootPkg.devDependencies['@npmcli/template-oss']).toBe('5.1.0')
})

test('@npmcli/template-oss devDependency is not the old 5.0.0 pin', () => {
  expect(rootPkg.devDependencies['@npmcli/template-oss']).not.toBe('5.0.0')
})

test('templateOSS.version is 5.1.0', () => {
  expect(rootPkg.templateOSS.version).toBe('5.1.0')
})

test('templateOSS.version is not the old 5.0.0 value', () => {
  expect(rootPkg.templateOSS.version).not.toBe('5.0.0')
})

test('templateOSS.version matches the @npmcli/template-oss devDependency pin', () => {
  const devDepVersion = rootPkg.devDependencies['@npmcli/template-oss']
  expect(rootPkg.templateOSS.version).toBe(devDepVersion)
})

test('templateOSS config preserves required fields after update', () => {
  expect(typeof rootPkg.templateOSS.content).toBe('string')
  expect(typeof rootPkg.templateOSS.dependabotInterval).toBe('string')
  expect(typeof rootPkg.templateOSS.updateNpm).toBe('boolean')
})

test('@npmcli/template-oss version pin is an exact version (no range specifier)', () => {
  const pin = rootPkg.devDependencies['@npmcli/template-oss']
  // Exact pins do not start with ^, ~, >, <, or =
  expect(pin).toMatch(/^\d+\.\d+\.\d+$/)
})

test('@npmcli/template-oss pin major version is 5', () => {
  const pin = rootPkg.devDependencies['@npmcli/template-oss']
  const major = parseInt(pin.split('.')[0], 10)
  expect(major).toBe(5)
})

test('@npmcli/template-oss pin minor version is at least 1', () => {
  const pin = rootPkg.devDependencies['@npmcli/template-oss']
  const minor = parseInt(pin.split('.')[1], 10)
  expect(minor).toBeGreaterThanOrEqual(1)
})
