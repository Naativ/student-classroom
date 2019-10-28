export const DejaVue = {
  plugin: (init, localStorageName) => store => {
    store.commit(init)
    store.subscribe((mutation, state) => {
      localStorage.setItem(
        localStorageName,
        JSON.stringify({
          jwt: state.jwt,
          member: state.member,
          principal: state.principal
        })
      )
    })
  },
  mutation: (localStorageName, setup) => state => {
    const dehydratedState = localStorage.getItem(localStorageName)
    if (dehydratedState) {
      const hydratedState = JSON.parse(dehydratedState)
      if (Array.isArray(setup)) {
        setup.forEach(s => s(hydratedState))
      }
      if (typeof setup === 'function') {
        setup(hydratedState)
      }
      state = Object.assign(state, hydratedState)
    }
  }
}
