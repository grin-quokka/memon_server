import * as express from 'express';

class App {
  public application: express.Application;
  constructor() {
    this.application = express();
  }
}

export default App;
