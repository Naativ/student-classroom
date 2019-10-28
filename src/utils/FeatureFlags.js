const flags = {
  disabled: {}
}

const moduleJson = process.env.VUE_APP_MODULE_OVERRIDES

if (moduleJson) {
  try {
    Object.assign(flags, JSON.parse(moduleJson))
  } catch (e) {
    console.warn('Failed to parse module overrides')
  }
}

export default flags
