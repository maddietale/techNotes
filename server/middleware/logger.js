// IMPORTS
import path from "path";
import * as url from "url";
import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
// CONFIGURATION
const fsPromises = fs.promises;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", logFileName), logItem);
    } catch (err) {
        console.log(err);
    }
};

const logger = async (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');
    console.log(`${req.method}\t${req.path}`);
    next();
};

export default logger;