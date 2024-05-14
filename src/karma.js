import env from "runtime-compat/env";
import fs from 'fs';
import path from 'path';

const datafile = 'karma.json';
const plusPattern = /(.+)(\+\+)/;
const minusPattern = /(.+)(--)/;

function karmaCheck(str) {
    let match;
    if (match = str.match(plusPattern)) {
        return {frame: match[1].toString(), pattern: match[2].toString()};
    } else if (match = str.match(minusPattern)) {
        return {frame: match[1].toString(), pattern: match[2].toString()};
    } else {
        return null;
    }
}

function readDb() {
    try {
        if (fs.existsSync(datafile)) {
            const data = fs.readFileSync(datafile, 'utf8');
            return JSON.parse(data);
        } else {
            return {};
        }
    } catch (error) {
        return {};
    }
}

function writeDb(data) {
    fs.writeFileSync(datafile, JSON.stringify(data || {}, null, 2));
}

export default async (message, channel, more) => {
    const {client, from}=more || {};
    const karma = karmaCheck(message);
    if (karma !== null) {
        const karmaDb = readDb();
        let karmaValue = karmaDb[karma.frame] || 0;
        let responses=[];
        if(karma.frame === from && karma.pattern === "++") {
            // you can't inc your own karma, person.
            karma.pattern='--';
            responses.push(`You can't add to your own karma, $from.`)
        }
        switch (karma.pattern) {
            case '--':
                karmaValue--;
                karmaDb[karma.frame] = karmaValue;
                writeDb(karmaDb);
                responses.push(`${karma.frame} has a karma level of ${karmaValue}`);
                    return responses;
            case '++':
                karmaValue++;
                karmaDb[karma.frame] = karmaValue;
                writeDb(karmaDb);
                responses.push(`${karma.frame} has a karma level of ${karmaValue}`);
                return responses;
            default:
                break; // what?
        }
    }
    return undefined;
}