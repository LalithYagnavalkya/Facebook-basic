"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = require("dotenv");
const connectToDb_1 = __importDefault(require("./utils/connectToDb"));
(0, dotenv_1.config)({
    path: './src/config/config.env'
});
const port = process.env.PORT || 5001;
(0, connectToDb_1.default)().then(({ error }) => {
    console.log('Connected to db');
    app_1.default.listen(port, () => {
        console.log('project running on port ' + process.env.PORT);
    });
}).catch(error => {
    console.log(error);
});
