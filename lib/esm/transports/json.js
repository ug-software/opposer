export class JsonTransport {
    constructor() {
        this.name = 'json';
        this.contentType = 'application/json; charset=utf-8';
    }
    matches() {
        return true;
    }
    send(_req, res, data) {
        if (res.writableEnded)
            return;
        res.setHeader('Content-Type', this.contentType);
        res.end(JSON.stringify(data));
    }
}
export default new JsonTransport();
