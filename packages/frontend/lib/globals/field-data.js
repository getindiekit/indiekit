import _ from "lodash";

/**
 * Get field data
 * @param {string} key - Key name
 * @returns {object} Field data
 */
export function fieldData(key) {
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
