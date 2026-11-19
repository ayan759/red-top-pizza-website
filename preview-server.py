"""Local preview server for the site/ folder.

Tells browsers not to reuse saved copies, so phones always load the latest
styles while you're making changes. For previewing only, not for hosting.

Run:  python3 preview-server.py
Then open http://localhost:8765 (or http://<your Mac's Wi-Fi address>:8765 on your phone).
"""
import functools
import http.server
from pathlib import Path

PORT = 8765
SITE = Path(__file__).resolve().parent / "site"


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


handler = functools.partial(NoCacheHandler, directory=str(SITE))
with http.server.ThreadingHTTPServer(("0.0.0.0", PORT), handler) as server:
    print(f"Serving {SITE} on port {PORT}", flush=True)
    server.serve_forever()
