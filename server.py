"""
L'AURA Atelier & Cafe - Local Development Server
Run this script to launch a local server and open the website in your default browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080

class CustomHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and caching headers for local assets
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    Handler = CustomHTTPHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 60)
        print(f"  ☕ L'AURA ATELIER & CAFE WEBSITE RUNNING")
        print(f"  URL: {url}")
        print("  Press Ctrl+C to stop the server.")
        print("=" * 60)
        
        try:
            webbrowser.open(url)
        except Exception:
            pass
            
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer gracefully shut down.")
            sys.exit(0)

if __name__ == "__main__":
    main()
