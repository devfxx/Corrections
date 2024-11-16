/**
 * Applies a transformation to the given text based on the provided alert.
 * @param {string} text - The original text.
 * @param {object} alert - The alert object containing information about the transformation.
 * @param {number} alert.begin - The starting index of the substring to transform.
 * @param {number} alert.end - The ending index of the substring to transform.
 * @param {object[]} alert.replacements - An array of replacement objects.
 * @param {string} alert.replacements[].replacement - The replacement string.
 * @returns {object} - An object containing the transformed text and the difference in length between the original and transformed text.
 */
function applyTransform(text, alert) {
  const replacement = alert.replacements[0];

  const substringToTransform = text.substring(alert.begin, alert.end);

  const transformed = replacement
    ? text.substring(0, alert.begin) + replacement + text.substring(alert.end)
    : text;

  const diff = replacement
    ? replacement.length - substringToTransform.length
    : 0;

  return {
    text: transformed,
    diff
  };
}

/**
 * Updates the properties of an alert object based on the provided diff value.
 * @param {object} alert - The alert object to update.
 * @param {number} diff - The difference value to add to the alert properties.
 * @returns {object} - The updated alert object.
 */
function updateAlert(alert, diff) {
  const { begin, end, highlightBegin, highlightEnd, transformJson } = alert;

  const { e, s } = transformJson.context;

  return Object.assign({}, alert, {
    begin: begin + diff,
    end: end + diff,
    highlightBegin: highlightBegin + diff,
    highlightEnd: highlightEnd + diff,
    transformJson: Object.assign({}, transformJson, {
      context: {
        e: e + diff,
        s: s + diff
      }
    })
  });
}

/**
 * Corrects the given result by applying transformations to the alerts.
 * @param {object} result - The result object containing alerts.
 * @returns {object} - The corrected result object.
 */
export function correct(result) {
  const { alerts } = result;

  return alerts.reduce((prev, currentAlert) => {
    const { text, diff } = applyTransform(
      prev.corrected || prev.original,
      currentAlert
    );

    // Apply diff to every appropriate part of the following alerts
    prev.alerts.forEach((tbd, i) => {
      prev.alerts[i] = updateAlert(tbd, diff);
    });

    return Object.assign({}, prev, { corrected: text });
  }, result);
}

/**
 * Performs final reformatting on the given result.
 * Making sure there are spaces after commas, etc.
 *
 * @param {any} result - The result to be reformatted.
 * @returns {string} The reformatted text.
 */
export function reformat(result: any): string {
  const final = correct(result);
  let finalText = final.corrected;

  // Make sure there's a space after a comma, dot, etc.
  finalText = finalText.replace(/([.,!?;:])\s*/g, '$1 ');

  // Capitalize the first letter of every sentence
  finalText = finalText.replace(/(^|[.!?]\s+)([a-z])/g, (_, p1, p2) => {
    return p1 + p2.toUpperCase();
  });

  return finalText.trim();
}
