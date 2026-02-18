# Work Manager - Umtelkomd

Sistema de gestión de trabajo para instalaciones de fibra óptica en Alemania.

## 🚀 Características

- **Gestión de Proyectos**: Control de proyectos de despliegue de fibra óptica
- **Órdenes de Trabajo**: Soplado de fibra, fusiones, excavaciones
- **Clientes y DPs**: Administración de clientes y Distribution Points
- **Facturación**: Control de facturación por proyecto
- **Multi-idioma**: Español y Alemán
- **Offline-first**: Funciona sin conexión (IndexedDB)
- **PWA**: Instalable como aplicación en móviles

## 📁 Estructura del Proyecto

```
work-manager-optimized/
├── index.html          # Punto de entrada
├── manifest.json       # Configuración PWA
├── css/
│   └── main.css        # Estilos principales
├── js/
│   ├── i18n.js         # Internacionalización
│   ├── db.js           # Base de datos (IndexedDB)
│   └── app.js          # Lógica principal
├── data/
│   └── prices.js       # Lista de precios
└── README.md           # Este archivo
```

## 🛠️ Tipos de Órdenes

| Código | Descripción | Unidad |
|--------|-------------|--------|
| ACT_001 | HÜP-GFTA-ONT, Fusión + Activación + Perforación | UDS |
| ACT_003 | HÜP-GFTA-ONT, Fusión + Perforación | UDS |
| BLOW_001 | Soplado 6/12/24 fibras RD | ML |
| BLOW_002 | Soplado 48/96/144 fibras RA | ML |
| BLOW_003 | Fusiones en DP | UDS |
| CW_204 | Excavación suelo no consolidado | M³ |
| ING_FIX_003 | HBG Individual área POP | UDS |

## 📊 Estados de Trabajo

- **0**: Sin progreso
- **100**: Termin (Cita programada)
- **103**: Hausbegehung (Inspección de vivienda)
- **108**: Tiefbau (Excavación)
- **109**: Einblasen (Soplado de fibra)
- **Fertig**: Completado

## 🚀 Despliegue

### Opción 1: GitHub Pages
1. Sube el código a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona la rama principal
4. Listo en `https://tuusuario.github.io/work-manager`

### Opción 2: Netlify
1. Arrastra la carpeta a [Netlify Drop](https://app.netlify.com/drop)
2. Obtén URL instantánea

### Opción 3: Servidor propio
```bash
# Copiar archivos al servidor
scp -r work-manager-optimized/* usuario@servidor:/var/www/html/

# O usar rsync
rsync -avz work-manager-optimized/ usuario@servidor:/var/www/html/
```

## 🔧 Tecnologías

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Base de datos**: IndexedDB (navegador)
- **Estilos**: CSS Variables, Flexbox, Grid
- **PWA**: Service Worker, Manifest

## 📝 Mejoras Futuras

- [ ] Backend con API REST
- [ ] Autenticación de usuarios
- [ ] Sincronización en la nube
- [ ] Reportes PDF
- [ ] Integración con sistemas externos

## 👨‍💻 Desarrollador

**Usuario GitHub**: jarl9801  
**Empresa**: Umtelkomd

## 📄 Licencia

Proyecto privado - Umtelkomd
