import http.server, socketserver, os
root = "dist"
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**k): super().__init__(*a,directory=root,**k)
    def do_GET(self):
        p = os.path.join(root, self.path.lstrip("/").split("?")[0])
        if not os.path.exists(p) or os.path.isdir(p):
            self.path = "/index.html"
        super().do_GET()
with socketserver.TCPServer(("", 8799), H) as httpd:
    httpd.serve_forever()
