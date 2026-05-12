"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const PORT = process.env.PORT || 3000;
const server = http_1.default.createServer((req, res) => {
    if (req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok" }));
        return;
    }
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("KijaniKiosk Payments Service Running");
});
server.listen(PORT, () => {
    console.log(`kk-payments running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map