const jsonSchemaToDocgen = require('./json-schema-to-docgen');

describe('follow-props/json-schema-to-docgen', () => {
  test('converts empty schema', () => {
    expect(jsonSchemaToDocgen({
      schema: {
        properties: {}
      }, fallbackDocgen: {
        props: {}
      }
    })).toEqual({
      props: {}
    });
  });

  test('merges into an object', () => {
    expect(jsonSchemaToDocgen({
      schema: {
        properties: {
          someproperty: {
            'allOf': [
              {
                '$ref': '#/definitions/Object'
              },
              {
                'type': 'object'
              }
            ],
          }
        }
      }
    })).toEqual({
      props: {
        someproperty: {
          required: false,
          type: {
            name: 'object'
          }
        }
      }
    });
  });

  test('allows undefined fallbackDocgen', () => {
    expect(jsonSchemaToDocgen({
      schema: {
        properties: {
          a: {
            type: 'string'
          }
        }
      }
    })).toEqual({
      props: {
        a: {
          required: false,
          type: {
            name: 'string',
          }
        }
      }
    });
  });

  test('allOfOverrides works', () => {
    expect(jsonSchemaToDocgen({
      schema: {
        allOfOverrides: true,
        'allOf': [
          {
            '$ref': '#/definitions/SomeClass'
          },
          {
            'properties': {
              someproperty: {
                'originalType': 'Status',
                '$ref': '#/definitions/Status'
              }
            },
            'type': 'object'
          }
        ],
        definitions: {
          Status: {
            'originalType': 'Status',
            'type': 'string',
            'enum': [
              'warning'
            ],
          },
          InputStatus: {
            'originalType': 'Status',
            'type': 'string',
            'enum': [
              'error'
            ],
          },
          SomeClass: {
            'properties': {
              someproperty: {
                'originalType': 'InputStatus',
                '$ref': '#/definitions/InputStatus'
              }
            },
            'type': 'object'
          }
        },
      }
    })).toEqual({
      props: {
        someproperty: {
          description: '@definition Status',
          required: false,
          type: {
            name: 'enum',
            value: [
              {
                value: '\'warning\'',
                computed: false
              }
            ]
          }
        }
      }
    });
  });
});
