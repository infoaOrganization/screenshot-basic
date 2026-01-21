"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_wrapper_1 = require("@citizenfx/http-wrapper");
const uuid_1 = require("uuid");
const fs = __importStar(require("fs"));
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_body_1 = require("koa-body");
const mv_1 = __importDefault(require("mv"));
const app = new koa_1.default();
const router = new koa_router_1.default();
class UploadData {
}
const uploads = {};
router.post('/upload/:token', async (ctx) => {
    const tkn = ctx.params['token'];
    ctx.response.append('Access-Control-Allow-Origin', '*');
    ctx.response.append('Access-Control-Allow-Methods', 'GET, POST');
    if (uploads[tkn] !== undefined) {
        const upload = uploads[tkn];
        delete uploads[tkn];
        const finish = (err, data) => {
            setImmediate(() => {
                upload.cb(err || false, data);
            });
        };
        const f = ctx.request.files['file'];
        if (f) {
            if (upload.fileName) {
                (0, mv_1.default)(f.filepath || f.path, upload.fileName, (err) => {
                    if (err) {
                        finish(err.message, null);
                        return;
                    }
                    finish(null, upload.fileName);
                });
            }
            else {
                const filePath = f.filepath || f.path;
                const mimeType = f.mimetype || f.type || 'image/jpeg';
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        finish(err.message, null);
                        return;
                    }
                    fs.unlink(filePath, (err) => {
                        finish(null, `data:${mimeType};base64,${data.toString('base64')}`);
                    });
                });
            }
        }
        ctx.body = { success: true };
        return;
    }
    ctx.body = { success: false };
});
app.use((0, koa_body_1.koaBody)({
    patchKoa: true,
    multipart: true,
}))
    .use(router.routes())
    .use(router.allowedMethods());
(0, http_wrapper_1.setHttpCallback)(app.callback());
// Cfx stuff
const exp = global.exports;
exp('requestClientScreenshot', (player, options, cb) => {
    const tkn = (0, uuid_1.v4)();
    const fileName = options.fileName;
    delete options['fileName']; // so the client won't get to know this
    uploads[tkn] = {
        fileName,
        cb
    };
    emitNet('screenshot_basic:requestScreenshot', player, options, `/${GetCurrentResourceName()}/upload/${tkn}`);
});
//# sourceMappingURL=server.js.map