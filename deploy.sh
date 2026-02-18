#!/bin/bash
# Deploy script for Work Manager

set -e

echo "🚀 Work Manager - Script de Despliegue"
echo "========================================"

# Check if directory exists
if [ ! -d "work-manager-optimized" ]; then
    echo "❌ Error: No se encuentra la carpeta work-manager-optimized"
    exit 1
fi

echo ""
echo "📦 Opciones de despliegue:"
echo "1. GitHub Pages (recomendado)"
echo "2. Netlify (instantáneo)"
echo "3. Servidor SFTP/SCP"
echo "4. Verificar archivos locales"
echo ""

read -p "Selecciona una opción (1-4): " option

case $option in
    1)
        echo ""
        echo "📋 Instrucciones para GitHub Pages:"
        echo "1. Crea un repositorio en GitHub"
        echo "2. Ejecuta estos comandos:"
        echo ""
        echo "   cd work-manager-optimized"
        echo "   git init"
        echo "   git add ."
        echo "   git commit -m 'Initial commit'"
        echo "   git branch -M main"
        echo "   git remote add origin https://github.com/TU_USUARIO/work-manager.git"
        echo "   git push -u origin main"
        echo ""
        echo "3. Ve a GitHub > Settings > Pages"
        echo "4. Selecciona 'Deploy from a branch' > main > / (root)"
        echo "5. Espera 1-2 minutos y visita la URL"
        ;;
    2)
        echo ""
        echo "📋 Instrucciones para Netlify:"
        echo "1. Ve a https://app.netlify.com/drop"
        echo "2. Arrastra la carpeta 'work-manager-optimized'"
        echo "3. Obtendrás una URL instantánea como:"
        echo "   https://work-manager-abc123.netlify.app"
        echo ""
        echo "✅ Ventaja: HTTPS gratuito y dominio personalizado"
        ;;
    3)
        echo ""
        read -p "Servidor (ej: usuario@servidor.com): " server
        read -p "Ruta remota (ej: /var/www/html): " remote_path
        
        echo ""
        echo "🔄 Subiendo archivos..."
        rsync -avz --delete work-manager-optimized/ "$server:$remote_path/"
        
        echo ""
        echo "✅ Despliegue completado!"
        echo "🌐 Visita: http://$(echo $server | cut -d@ -f2)/work-manager"
        ;;
    4)
        echo ""
        echo "📁 Archivos en work-manager-optimized:"
        find work-manager-optimized -type f | head -20
        echo ""
        echo "📊 Total de archivos: $(find work-manager-optimized -type f | wc -l)"
        echo "📦 Tamaño total: $(du -sh work-manager-optimized | cut -f1)"
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "🎉 Listo!"
