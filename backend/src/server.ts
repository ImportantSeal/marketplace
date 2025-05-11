import app from './app';
import { config } from './config/env';

if (process.env.NODE_ENV !== 'test') {
  const PORT: number = config.PORT;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on 0.0.0.0:${PORT}`)
  })

}

export default app;
