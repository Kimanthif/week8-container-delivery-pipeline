import http, { IncomingMessage, ServerResponse } from "http";

const PORT = process.env.PORT || 3000;

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("KijaniKiosk Payments Service Running");
  }
);

server.listen(PORT, () => {
  console.log(`kk-payments running on port ${PORT}`);
});