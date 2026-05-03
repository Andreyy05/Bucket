import { ErrorMap } from './errors.js';

export function validateDtoIn(dtoIn, schema) {
  const warnings = [];
  const invalidTypeKeyMap = {};
  const missingKeyMap = {};
  const unsupportedKeyList = [];

  // Check unsupported keys
  Object.keys(dtoIn).forEach(key => {
    if (!schema[key]) {
      unsupportedKeyList.push(key);
    }
  });

  if (unsupportedKeyList.length > 0) {
    warnings.push({
      code: 'unsupportedKeys',
      message: 'Některé parametry nejsou podporovány.',
      params: { unsupportedKeyList }
    });
  }

  // Check required and types
  Object.keys(schema).forEach(key => {
    const rules = schema[key];
    const value = dtoIn[key];

    if (rules.required && (value === undefined || value === null || value === '')) {
      missingKeyMap[key] = true;
    } else if (value !== undefined) {
      if (rules.type === 'string' && typeof value !== 'string') {
        invalidTypeKeyMap[key] = typeof value;
      }
    }
  });

  if (Object.keys(missingKeyMap).length > 0 || Object.keys(invalidTypeKeyMap).length > 0) {
    throw ErrorMap.invalidDtoIn({ invalidTypeKeyMap, missingKeyMap });
  }

  return { warnings };
}
