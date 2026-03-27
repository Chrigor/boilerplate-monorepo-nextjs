import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register()

require('@testing-library/jest-dom')

const { cleanup } = require('@testing-library/react')
afterEach(() => {
  cleanup()
})
