const exp = global.exports;
RegisterNuiCallbackType('screenshot_created');
class ResultData {
}
const results = {};
let correlationId = 0;
function registerCorrelation(cb) {
    const id = correlationId.toString();
    results[id] = { cb };
    correlationId++;
    return id;
}
on('__cfx_nui:screenshot_created', (body, cb) => {
    cb(true);
    if (body.id !== undefined && results[body.id]) {
        results[body.id].cb(body.data);
        delete results[body.id];
    }
});
exp('requestScreenshot', (options, cb) => {
    const realOptions = (cb !== undefined) ? options : {
        encoding: 'jpg'
    };
    const realCb = (cb !== undefined) ? cb : options;
    realOptions.resultURL = null;
    realOptions.targetField = null;
    realOptions.targetURL = `http://${GetCurrentResourceName()}/screenshot_created`;
    realOptions.correlation = registerCorrelation(realCb);
    SendNuiMessage(JSON.stringify({
        request: realOptions
    }));
});
exp('requestScreenshotUpload', (url, field, options, cb) => {
    const realOptions = (cb !== undefined) ? options : {
        headers: {},
        encoding: 'jpg'
    };
    const realCb = (cb !== undefined) ? cb : options;
    realOptions.targetURL = url;
    realOptions.targetField = field;
    realOptions.resultURL = `http://${GetCurrentResourceName()}/screenshot_created`;
    realOptions.correlation = registerCorrelation(realCb);
    SendNuiMessage(JSON.stringify({
        request: realOptions
    }));
});
onNet('screenshot_basic:requestScreenshot', (options, url) => {
    options.encoding = options.encoding || 'jpg';
    options.targetURL = `http://${GetCurrentServerEndpoint()}${url}`;
    options.targetField = 'file';
    options.resultURL = null;
    options.correlation = registerCorrelation(() => { });
    SendNuiMessage(JSON.stringify({
        request: options
    }));
});
//# sourceMappingURL=client.js.map