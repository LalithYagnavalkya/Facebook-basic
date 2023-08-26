import app from './app';
import { config } from 'dotenv';
import connectToDb from './utils/connectToDb';
config({
    path: './src/config/config.env'
})
const port = process.env.PORT || 5001;
connectToDb().then(({ error }) => {
    console.log('Connected to db')
    app.listen(port, () => {
        console.log('project running on port ' + process.env.PORT)
    });
}).catch(error => {
    console.log(error)
})