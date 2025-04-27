// 1. CamelCase at runtime
function toCamelCase(str: string): string {
  return str
    .replace(/[_\s-]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toLowerCase())
}

// 2. CamelCase at type level
type CamelCase<S extends string> = S extends `${infer First}_${infer Rest}`
  ? `${Lowercase<First>}${Capitalize<CamelCase<Rest>>}`
  : S extends `${infer First}-${infer Rest}`
  ? `${Lowercase<First>}${Capitalize<CamelCase<Rest>>}`
  : S extends `${infer First} ${infer Rest}`
  ? `${Lowercase<First>}${Capitalize<CamelCase<Rest>>}`
  : Lowercase<S>

// 3. Builder
function buildCamelCaseObject<T extends readonly string[]>(keys: T) {
  return keys.reduce((acc, key) => {
    const camelKey = toCamelCase(key)

    return { ...acc, ...{ [key]: camelKey } }
  }, {} as Record<T[number], CamelCase<T[number]>>) // old is a field and value is mapped camel case
}

// 4. Usage
const existing = [
  'External ID',
  'Site Address',
  'some-other-format',
  'Test_this',
  'Multiple spaces test',
] as const // doesn't have to be 'as const'

const camelCaseObject = buildCamelCaseObject(existing)

// 5. Outputs
// Statically typed camelCaseObject, test by dot accessing values (uncomment the next line)
// camelCaseObject.

console.log(camelCaseObject['External ID']) //externalID
console.log(camelCaseObject['Site Address']) //siteAddress
console.log(camelCaseObject['some-other-format']) //someOtherFormat
console.log(camelCaseObject.Test_this) //testThis
console.log(camelCaseObject['Multiple spaces test']) //multipleSpacesTest

console.log({ camelCaseObject })
/**
 * camelCaseObject: {
    "External ID": "externalID",
    "Site Address": "siteAddress",
    "some-other-format": "someOtherFormat",
    Test_this: "testThis",
    "Multiple spaces test": "multipleSpacesTest"
  }
 */
