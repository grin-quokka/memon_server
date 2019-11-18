"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const App_1 = require("./App");
const app = new App_1.default().application;
app.get('/', (req, res) => {
    res.send('Hello MEMON :x');
});
app.get('/main', (req, res) => {
    const obj = {
        moneyToPay: 500,
        moneyToGet: 1000
    };
    res.send(obj);
});
app.listen(3000, () => console.log('http://localhost:3000'));
//# sourceMappingURL=index.js.map