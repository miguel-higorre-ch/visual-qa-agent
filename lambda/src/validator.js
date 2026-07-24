/**
 * Validate the structure of Bedrock analysis response
 * @param {Object} response - Response object from Bedrock
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
function validateResponse(response) {
  const errors = [];

  // Check if response is an object
  if (!response || typeof response !== 'object') {
    return {
      valid: false,
      errors: ['Response is not a valid object']
    };
  }

  // Check required fields
  if (!response.hasOwnProperty('summary')) {
    errors.push('Missing required field: summary');
  } else if (typeof response.summary !== 'string') {
    errors.push('Field "summary" must be a string');
  }

  if (!response.hasOwnProperty('diffs')) {
    errors.push('Missing required field: diffs');
  } else if (!Array.isArray(response.diffs)) {
    errors.push('Field "diffs" must be an array');
  } else {
    // Validate each diff object
    response.diffs.forEach((diff, index) => {
      const diffErrors = validateDiff(diff, index);
      errors.push(...diffErrors);
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate a single diff object
 * @param {Object} diff - Diff object to validate
 * @param {number} index - Index of diff in array
 * @returns {string[]} Array of error messages
 */
function validateDiff(diff, index) {
  const errors = [];
  const prefix = `diffs[${index}]`;

  if (!diff || typeof diff !== 'object') {
    return [`${prefix}: Diff is not a valid object`];
  }

  // Validate description
  if (!diff.hasOwnProperty('description')) {
    errors.push(`${prefix}: Missing required field "description"`);
  } else if (typeof diff.description !== 'string' || diff.description.trim() === '') {
    errors.push(`${prefix}: Field "description" must be a non-empty string`);
  }

  // Validate severity
  const validSeverities = ['critical', 'minor', 'cosmetic'];
  if (!diff.hasOwnProperty('severity')) {
    errors.push(`${prefix}: Missing required field "severity"`);
  } else if (!validSeverities.includes(diff.severity)) {
    errors.push(`${prefix}: Field "severity" must be one of: ${validSeverities.join(', ')}`);
  }

  // Validate bbox
  if (!diff.hasOwnProperty('bbox')) {
    errors.push(`${prefix}: Missing required field "bbox"`);
  } else {
    const bboxErrors = validateBbox(diff.bbox, `${prefix}.bbox`);
    errors.push(...bboxErrors);
  }

  return errors;
}

/**
 * Validate bounding box object
 * @param {Object} bbox - Bounding box object
 * @param {string} prefix - Field path prefix for error messages
 * @returns {string[]} Array of error messages
 */
function validateBbox(bbox, prefix) {
  const errors = [];

  if (!bbox || typeof bbox !== 'object') {
    return [`${prefix}: Bounding box is not a valid object`];
  }

  const requiredFields = ['x', 'y', 'width', 'height'];
  
  requiredFields.forEach(field => {
    if (!bbox.hasOwnProperty(field)) {
      errors.push(`${prefix}: Missing required field "${field}"`);
    } else if (typeof bbox[field] !== 'number') {
      errors.push(`${prefix}.${field}: Must be a number`);
    } else if (bbox[field] < 0) {
      errors.push(`${prefix}.${field}: Must be non-negative`);
    }
  });

  return errors;
}

/**
 * Sanitize and normalize response
 * Ensures response meets minimum requirements even if validation fails partially
 * @param {Object} response - Response object to sanitize
 * @returns {Object} Sanitized response
 */
function sanitizeResponse(response) {
  const sanitized = {
    summary: response?.summary || 'Analysis completed with errors',
    diffs: []
  };

  if (Array.isArray(response?.diffs)) {
    sanitized.diffs = response.diffs
      .filter(diff => {
        // Keep only valid diffs
        const validation = validateDiff(diff, 0);
        return validation.length === 0;
      })
      .map(diff => ({
        description: String(diff.description).trim(),
        severity: diff.severity,
        bbox: {
          x: Math.max(0, Number(diff.bbox.x) || 0),
          y: Math.max(0, Number(diff.bbox.y) || 0),
          width: Math.max(0, Number(diff.bbox.width) || 0),
          height: Math.max(0, Number(diff.bbox.height) || 0)
        }
      }));
  }

  return sanitized;
}

/**
 * Count diffs by severity
 * @param {Array} diffs - Array of diff objects
 * @returns {Object} Count by severity { critical, minor, cosmetic }
 */
function countBySeverity(diffs) {
  return {
    critical: diffs.filter(d => d.severity === 'critical').length,
    minor: diffs.filter(d => d.severity === 'minor').length,
    cosmetic: diffs.filter(d => d.severity === 'cosmetic').length
  };
}

module.exports = {
  validateResponse,
  validateDiff,
  validateBbox,
  sanitizeResponse,
  countBySeverity
};
