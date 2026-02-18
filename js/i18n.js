// ============================================
// I18N - Internacionalización (ES/DE)
// ============================================

const i18n = {
    es: {
        navDashboard:'Dashboard', navClients:'Clientes', navOrders:'Órdenes', navProjects:'Proyectos', navInvoicing:'Facturación', navPrices:'Precios',
        totalProjects:'Proyectos', totalDPs:'DPs', totalClients:'Clientes',
        status108:'108 - Tiefbau', status109:'109 - Einblasen', status103:'103 - Hausbegehung', status100:'100 - Termin', status0:'0 - Sin progreso', statusFertig:'Fertig',
        ordersRA:'Órdenes Soplado RA', ordersRD:'Órdenes Soplado RD', ordersFusion:'Órdenes Fusión',
        projectProgress:'Progreso por Proyecto', markInvoiced:'Marcar Facturado',
        avgMargin:'Margen Promedio', totalItems:'Ítems', priceVersion:'Versión Precios',
        thCode:'Código', thDescription:'Descripción', thUnit:'Unidad', thSalePrice:'Precio Venta (€)', thCostPrice:'Precio Costo (€)', thMarginEur:'Margen (€)', thMarginPct:'Margen %',
        noData:'Sin datos', imported:'importados', detected:'Detectado',
        blowingDone:'Soplado AP-DP', splicingAP:'Empalme AP', splicingDP:'Empalme DP',
        completion:'Completado', total:'Total', addresses:'direcciones',
        certNotInv:'Certificado sin facturar', totalInvoiced:'Total Facturado', totalPending:'Pendiente',
        faltaCargar:'Falta cargar orden', yaExistia:'Ya existía', resultadoImport:'Resultado de Importación',
        nuevas:'Nuevas', importadas:'Importadas', faltan:'Faltan por cargar',
        gereedEnGO:'GEREED en GO pero sin orden', ordenesCargadas:'Órdenes cargadas',
        clickExpandir:'▼ Click para ver detalle DPs', dpNumber:'DP', sopladoRA:'Soplado RA',
        fusionAP:'Fusión AP', fusionDP:'Fusión DP', statusCol:'Estado', pendiente:'Pendiente',
    },
    de: {
        navDashboard:'Dashboard', navClients:'Kunden', navOrders:'Aufträge', navProjects:'Projekte', navInvoicing:'Abrechnung', navPrices:'Preise',
        totalProjects:'Projekte', totalDPs:'DPs', totalClients:'Kunden',
        status108:'108 - Tiefbau', status109:'109 - Einblasen', status103:'103 - Hausbegehung', status100:'100 - Termin', status0:'0 - Kein Fortschritt', statusFertig:'Fertig',
        ordersRA:'Einblasen RA Aufträge', ordersRD:'Einblasen RD Aufträge', ordersFusion:'Spleißen Aufträge',
        projectProgress:'Fortschritt pro Projekt', markInvoiced:'Als abgerechnet markieren',
        avgMargin:'Durchschn. Marge', totalItems:'Positionen', priceVersion:'Preisversion',
        thCode:'Code', thDescription:'Beschreibung', thUnit:'Einheit', thSalePrice:'Verkaufspreis (€)', thCostPrice:'Kostenpreis (€)', thMarginEur:'Marge (€)', thMarginPct:'Marge %',
        noData:'Keine Daten', imported:'importiert', detected:'Erkannt',
        blowingDone:'Einblasen AP-DP', splicingAP:'Spleißen AP', splicingDP:'Spleißen DP',
        completion:'Abgeschlossen', total:'Gesamt', addresses:'Adressen',
        certNotInv:'Zertifiziert, nicht abgerechnet', totalInvoiced:'Gesamt abgerechnet', totalPending:'Ausstehend',
        faltaCargar:'Auftrag fehlt', yaExistia:'Bereits vorhanden', resultadoImport:'Importergebnis',
        nuevas:'Neue', importadas:'Importiert', faltan:'Fehlen noch',
        gereedEnGO:'GEREED in GO aber kein Auftrag', ordenesCargadas:'Geladene Aufträge',
        clickExpandir:'▼ Klick für DP-Details', dpNumber:'DP', sopladoRA:'Einblasen RA',
        fusionAP:'Spleißen AP', fusionDP:'Spleißen DP', statusCol:'Status', pendiente:'Ausstehend',
    }
};

let currentLang = 'es';

function t(key) {
    return i18n[currentLang]?.[key] || i18n.es[key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        const value = t(key);
        if (value !== key) el.textContent = value;
    });
    if (typeof renderAll === 'function') renderAll();
}

function toggleLanguage() {
    setLanguage(currentLang === 'es' ? 'de' : 'es');
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { t, setLanguage, toggleLanguage, i18n };
}
