import json, http.server, os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "activity.json")
class H(http.server.BaseHTTPRequestHandler):
    def _send(self, code, body=b"", ctype="application/json"):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
    def do_OPTIONS(self):
        self._send(204)
    def do_POST(self):
        n = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(n)
        try:
            data = json.loads(raw)
            with open(OUT, "w") as f:
                json.dump(data, f, indent=1)
            print("recorded", data.get("activity_query"), flush=True)
        except Exception as e:
            print("bad payload", e, flush=True)
        self._send(200, b'{"ok":true}')
    def do_GET(self):
        if os.path.exists(OUT):
            self._send(200, open(OUT, "rb").read())
        else:
            self._send(200, b'{"activity":[]}')
    def log_message(self, *a):
        pass
http.server.HTTPServer(("127.0.0.1", 8123), H).serve_forever()
