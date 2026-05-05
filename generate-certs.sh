#!/bin/bash
# ─────────────────────────────────────────────────────────────
# generate-certs.sh
# Installe mkcert via binaire GitHub et génère les certificats
# SSL locaux pour lingua-learn.com
#
# Compatible : Linux (amd64/arm64), macOS, Windows (Git Bash)
# ─────────────────────────────────────────────────────────────

set -e

SSL_DIR="./config/nginx/ssl"
MKCERT_VERSION="v1.4.4"

# ─────────────────────────────────────────────
# Détection OS / Architecture
# ─────────────────────────────────────────────
detect_platform() {
  OS="$(uname -s)"
  ARCH="$(uname -m)"

  case "$OS" in
    Linux)
      case "$ARCH" in
        x86_64)  BINARY="mkcert-${MKCERT_VERSION}-linux-amd64" ;;
        aarch64) BINARY="mkcert-${MKCERT_VERSION}-linux-arm64" ;;
        armv7l)  BINARY="mkcert-${MKCERT_VERSION}-linux-arm"   ;;
        *)       echo "❌ Architecture non supportée : $ARCH"; exit 1 ;;
      esac
      ;;
    Darwin)
      case "$ARCH" in
        x86_64) BINARY="mkcert-${MKCERT_VERSION}-darwin-amd64" ;;
        arm64)  BINARY="mkcert-${MKCERT_VERSION}-darwin-arm64" ;;
        *)      echo "❌ Architecture non supportée : $ARCH"; exit 1 ;;
      esac
      ;;
    MINGW*|MSYS*|CYGWIN*)
      BINARY="mkcert-${MKCERT_VERSION}-windows-amd64.exe"
      ;;
    *)
      echo "❌ Système non supporté : $OS"
      exit 1
      ;;
  esac

  DOWNLOAD_URL="https://github.com/FiloSottile/mkcert/releases/download/${MKCERT_VERSION}/${BINARY}"
}

# ─────────────────────────────────────────────
# Installation de mkcert si absent
# ─────────────────────────────────────────────
install_mkcert() {
  if command -v mkcert &> /dev/null; then
    echo "✅ mkcert déjà installé : $(mkcert --version)"
    return
  fi

  echo "📦 Installation de mkcert ${MKCERT_VERSION}..."
  detect_platform

  # Téléchargement du binaire
  echo "   → Téléchargement depuis GitHub : $BINARY"
  curl -fsSL "$DOWNLOAD_URL" -o /tmp/mkcert
  chmod +x /tmp/mkcert

  # Installation dans /usr/local/bin (nécessite sudo sur Linux)
  if [ "$(uname -s)" = "Linux" ]; then
    echo "   → Copie dans /usr/local/bin (sudo requis)"
    sudo mv /tmp/mkcert /usr/local/bin/mkcert
  else
    mv /tmp/mkcert /usr/local/bin/mkcert
  fi

  echo "✅ mkcert installé : $(mkcert --version)"
}

# ─────────────────────────────────────────────
# Génération des certificats
# ─────────────────────────────────────────────
generate_certs() {
  mkdir -p "$SSL_DIR"

  echo ""
  echo "🔐 Installation de l'autorité de certification locale..."
  mkcert -install

  echo ""
  echo "📝 Génération des certificats pour lingua-learn.com..."
  mkcert \
    -cert-file "$SSL_DIR/lingua-learn.com.pem" \
    -key-file  "$SSL_DIR/lingua-learn.com-key.pem" \
    lingua-learn.com \
    www.lingua-learn.com

  echo ""
  echo "✅ Certificats générés dans $SSL_DIR :"
  echo "   - lingua-learn.com.pem"
  echo "   - lingua-learn.com-key.pem"
}

# ─────────────────────────────────────────────
# Instructions /etc/hosts
# ─────────────────────────────────────────────
print_hosts_instructions() {
  # Vérifie si l'entrée existe déjà
  if grep -q "lingua-learn.com" /etc/hosts 2>/dev/null; then
    echo ""
    echo "✅ lingua-learn.com déjà présent dans /etc/hosts"
    return
  fi

  echo ""
  echo "─────────────────────────────────────────────────────────"
  echo "⚠️  Ajoutez lingua-learn.com à votre fichier /etc/hosts :"
  echo ""
  echo "   Linux / macOS :"
  echo "   sudo sh -c 'echo \"127.0.0.1 lingua-learn.com www.lingua-learn.com\" >> /etc/hosts'"
  echo ""
  echo "   Windows (PowerShell admin) :"
  echo "   Add-Content C:\\Windows\\System32\\drivers\\etc\\hosts '127.0.0.1 lingua-learn.com www.lingua-learn.com'"
  echo "─────────────────────────────────────────────────────────"
}

# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────
echo "🚀 LinguaLearn — Génération des certificats SSL locaux"
echo ""

install_mkcert
generate_certs
print_hosts_instructions

echo ""
echo "🎉 Tout est prêt ! Lancez le projet avec :"
echo "   docker compose up --build"
echo ""
echo "   Puis ouvrez : https://lingua-learn.com"