#!/usr/bin/env python3
"""
Simple HTTP Server for SkyWings Flight Booking Web Application
Serves static files with proper MIME types and opens the default browser.
"""
import http.server
import socketserver
import webbrowser
import os
import sys

# Force UTF-8 stdout if available
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 3000

class CustomHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/favicon.ico':
            self.send_response(200)
            self.send_header('Content-Type', 'image/x-icon')
            self.end_headers()
            self.wfile.write(b'')
            return
        super().do_GET()

    def end_headers(self):
        # Enable CORS and caching headers for modern ESM modules
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        # Ensure JavaScript modules have the exact required MIME type
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.css'):
            return 'text/css'
        if path.endswith('.html'):
            return 'text/html'
        if path.endswith('.json'):
            return 'application/json'
        return super().guess_type(path)

def start_server():
    # Change directory to the script's folder
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    # Find an open port
    for attempt_port in range(PORT, PORT + 20):
        try:
            with socketserver.TCPServer(("", attempt_port), CustomHTTPHandler) as httpd:
                print("=" * 60)
                print("[*] SkyWings Airways Flight Booking Server is Running!")
                print(f"[>] Local URL: http://localhost:{attempt_port}")
                print("=" * 60)
                print("Press Ctrl+C to stop the server.")
                sys.stdout.flush()

                # Open the default web browser automatically
                try:
                    webbrowser.open(f"http://localhost:{attempt_port}")
                except Exception:
                    pass

                httpd.serve_forever()
                break
        except OSError:
            print(f"Port {attempt_port} in use, trying next...")

if __name__ == '__main__':
    try:
        start_server()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)
