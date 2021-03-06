"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lightning_1 = require("../utils/lightning");
const res_1 = require("../utils/res");
const readLastLines = require("read-last-lines");
const nodeinfo_1 = require("../utils/nodeinfo");
const path = require("path");
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../../config/app.json'))[env];
const defaultLogFiles = [
    '/home/lnd/.pm2/logs/app-error.log',
    '/var/log/syslog',
];
function getLogsSince(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const logFiles = config.log_file ? [config.log_file] : defaultLogFiles;
        let txt;
        let err;
        yield asyncForEach(logFiles, (filepath) => __awaiter(this, void 0, void 0, function* () {
            if (!txt) {
                try {
                    const lines = yield readLastLines.read(filepath, 500);
                    if (lines) {
                        var linesArray = lines.split('\n');
                        linesArray.reverse();
                        txt = linesArray.join('\n');
                    }
                }
                catch (e) {
                    err = e;
                }
            }
        }));
        if (txt)
            res_1.success(res, txt);
        else
            res_1.failure(res, err);
    });
}
exports.getLogsSince = getLogsSince;
const getInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lightning = lightning_1.loadLightning();
    var request = {};
    lightning.getInfo(request, function (err, response) {
        res.status(200);
        if (err == null) {
            res.json({ success: true, response });
        }
        else {
            res.json({ success: false });
        }
        res.end();
    });
});
exports.getInfo = getInfo;
const getChannels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lightning = lightning_1.loadLightning();
    var request = {};
    lightning.listChannels(request, function (err, response) {
        res.status(200);
        if (err == null) {
            res.json({ success: true, response });
        }
        else {
            res.json({ success: false });
        }
        res.end();
    });
});
exports.getChannels = getChannels;
const getBalance = (req, res) => {
    const lightning = lightning_1.loadLightning();
    var request = {};
    lightning.channelBalance(request, function (err, response) {
        res.status(200);
        if (err == null) {
            res.json({ success: true, response });
        }
        else {
            res.json({ success: false });
        }
        res.end();
    });
};
exports.getBalance = getBalance;
const getLocalRemoteBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lightning = lightning_1.loadLightning();
    lightning.listChannels({}, (err, channelList) => {
        const { channels } = channelList;
        const localBalances = channels.map(c => c.local_balance);
        const remoteBalances = channels.map(c => c.remote_balance);
        const totalLocalBalance = localBalances.reduce((a, b) => parseInt(a) + parseInt(b), 0);
        const totalRemoteBalance = remoteBalances.reduce((a, b) => parseInt(a) + parseInt(b), 0);
        res.status(200);
        if (err == null) {
            res.json({ success: true, response: { local_balance: totalLocalBalance, remote_balance: totalRemoteBalance } });
        }
        else {
            res.json({ success: false });
        }
        res.end();
    });
});
exports.getLocalRemoteBalance = getLocalRemoteBalance;
const getNodeInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var ipOfSource = req.connection.remoteAddress;
    if (!(ipOfSource.includes('127.0.0.1') || ipOfSource.includes('localhost'))) {
        res.status(401);
        res.end();
        return;
    }
    const node = yield nodeinfo_1.nodeinfo();
    res.status(200);
    res.json(node);
    res.end();
});
exports.getNodeInfo = getNodeInfo;
function asyncForEach(array, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = 0; index < array.length; index++) {
            yield callback(array[index], index, array);
        }
    });
}
//# sourceMappingURL=details.js.map