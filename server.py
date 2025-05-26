#!/usr/bin/env python3
"""
Serveur HTTP simple pour tester le globe interactif Three.js
Usage: python server.py
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Ajouter les en-têtes CORS pour éviter les problèmes de sécurité
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        # Rediriger la racine vers esports.html au lieu de index.html
        if self.path == '/' or self.path == '/index.html':
            # Effectuer une redirection HTTP explicite (code 302)
            self.send_response(302)
            self.send_header('Location', '/esports.html')
            self.end_headers()
            return
        return super().do_GET()

def main():
    # Vérifier que nous sommes dans le bon répertoire
    if not os.path.exists('esports.html'):
        print("❌ Erreur: esports.html non trouvé dans le répertoire courant")
        print("📁 Assurez-vous d'être dans le dossier du projet Globe")
        sys.exit(1)
    
    # Créer le serveur
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🌍 Serveur démarré sur le port {PORT}")
        print(f"🔗 Ouvrez votre navigateur à l'adresse: http://localhost:{PORT}")
        print("⏹️  Appuyez sur Ctrl+C pour arrêter le serveur")
        print("ℹ️  Redirection automatique configurée: / → /esports.html")
        
        # Ouvrir automatiquement le navigateur avec esports.html directement
        try:
            webbrowser.open(f'http://localhost:{PORT}/esports.html')
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Serveur arrêté")

if __name__ == "__main__":
    main() 