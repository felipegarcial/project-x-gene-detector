import { CONFIG, validateConfig } from './config.js'
import { app } from './app.js'
import { logger } from './shared/lib/logger.js'

validateConfig()

app.listen(CONFIG.PORT, () => {
  logger.info({ port: CONFIG.PORT }, `Server running on http://localhost:${CONFIG.PORT}`)
})
