// const COMMAND_DELAY = 500

// for (const command of ['visit', 'click', 'trigger', 'type', 'clear', 'reload', 'contains']) {
//   Cypress.Commands.overwrite(command, (originalFn, ...args) => {
//     const origVal = originalFn(...args)

//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(origVal)
//       }, COMMAND_DELAY)
//     })
//   })
// }
