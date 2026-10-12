import _ from "lodash";

/**
 * @typedef {object} FieldError
 * @property {unknown} value - Submitted value
 * @property {string} msg - Error message
 */

/**
 * @typedef {object} FieldData
 * @property {unknown} value - Field value
 * @property {{ text: string }} [errorMessage] - Error message
 */

/**
 * Get field data
 * @this {{ ctx: { errors?: Record<string, FieldError>, properties?: object } }}
 * @param {string} key - Key name
 * @returns {FieldData} Field data
 */
export function fieldData(key) {
  // eslint-disable-next-line unicorn/no-this-outside-of-class
  const { errors, properties } = this.ctx;
  const errorData = _.get(errors, key);

  return {
    value: errorData ? errorData?.value : _.get(properties, key),
    ...(errorData && {
      errorMessage: {
        text: errorData?.msg,
      },
    }),
  };
}
