/**
 * Generic utility which merges two objects.
 * 
 * @param {any} current
 * @param {any} updates
 * @returns {any}
 */
const mergeObjects = (current, updates) => {
  if (!current || !updates)
    throw new Error("Both 'current' and 'updates' must be passed-in to merge()")
  if (typeof current !== 'object' || typeof updates !== 'object' || Array.isArray(current) || Array.isArray(updates))
    throw new Error("Both 'current' and 'updates' must be passed-in as objects to merge()")

  let merged = { ...current }

  for (let key of Object.keys(updates)) {
    if (typeof updates[key] !== 'object') {
      merged[key] = updates[key]
    } else {
      /* key is an object, run mergeObjects again */
      merged[key] = mergeObjects(merged[key] || {}, updates[key])
    }
  }

  return merged
}

/**
 * Merge a user config with the default config.
 * 
 * @param {import('types').DefaultConfig} dconfig The default config.
 * @param {import('htmlpm').Config} config The user config.
 * @returns {import('types').ValidatedConfig}
 */
export const mergeConfig = (dconfig, config) => {
  /**
   * We need to make a deep copy of `dconfig`,
   * otherwise we end up altering the original `CONFIG` because `dconfig` is a reference to it.
   */
  return mergeObjects(structuredClone(dconfig), config)
}
