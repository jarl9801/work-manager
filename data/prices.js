// ============================================
// PRICE LIST - Lista de precios de servicios
// ============================================
const PRICE_LIST = [
    { code:'ACT_001', desc:'HÜP-GFTA-ONT, Fusión + Activación + Perforación', descDe:'HÜP-GFTA-ONT, Fusion + Aktivierung + Bohrung', unit:'UDS', sale:230, cost:135, cat:'ACT' },
    { code:'ACT_003', desc:'HÜP-GFTA-ONT, Fusión + Perforación', descDe:'HÜP-GFTA-ONT, Fusion + Bohrung', unit:'UDS', sale:184, cost:110, cat:'ACT' },
    { code:'ACT_004', desc:'HÜP-GFTA-ONT, Solo Activación', descDe:'HÜP-GFTA-ONT, Nur Aktivierung', unit:'UDS', sale:46, cost:25, cat:'ACT' },
    { code:'BLOW_001', desc:'Soplado 6/12/24 fibras RD', descDe:'Einblasen 6/12/24 Glasfaserkabel (RD)', unit:'ML', sale:0.43, cost:0.28, cat:'BLOW' },
    { code:'BLOW_002', desc:'Soplado 48/96/144 fibras RA', descDe:'Einblasen 48/96/144 Glasfaserkabel (RA)', unit:'ML', sale:0.62, cost:0.45, cat:'BLOW' },
    { code:'BLOW_003', desc:'Fusiones en DP (Distribution Point)', descDe:'DP Installation (Tray, Routing Pipes inkl.)', unit:'UDS', sale:705, cost:420, cat:'BLOW' },
    { code:'BLOW_004', desc:'Fusiones en POP + Bandejas', descDe:'POP Installation + Verbindungsbandagen', unit:'UDS', sale:1300, cost:440, cat:'BLOW' },
    { code:'BLOW_204', desc:'Preparación NVT Planta Externa (solo GFNW)', descDe:'Outsideplant Vorbereitung in NVT (nur GFNW)', unit:'UDS', sale:2500, cost:0, cat:'BLOW' },
    { code:'CW_204', desc:'Excavación suelo no consolidado', descDe:'Aushub ungebundener Boden (UB)', unit:'M³', sale:78, cost:46.80, cat:'CW' },
    { code:'CW_205', desc:'Excavación adoquinado', descDe:'Aushub Pflaster', unit:'M³', sale:110, cost:66, cat:'CW' },
    { code:'CW_206', desc:'Excavación asfalto', descDe:'Aushub Asphalt', unit:'M³', sale:136, cost:81.60, cat:'CW' },
    { code:'ING_FIX_003', desc:'HBG Individual área POP', descDe:'Hausbegehung Individueller POP Gebiet', unit:'UDS', sale:36, cost:21.60, cat:'ING' },
    { code:'ING_FIX_010', desc:'Cita conexión domiciliaria', descDe:'Hausanschluss Termin', unit:'UDS', sale:2.60, cost:1.56, cat:'ING' },
    { code:'ING_FIX_011', desc:'HBG Paquete POP 35-45 (no GFPLUS)', descDe:'Hausbegehung POP Paket 35-45 (nicht GFPLUS)', unit:'UDS', sale:21, cost:12.60, cat:'ING' },
    { code:'ING_FIX_012', desc:'Cláusula protección exceso +45%', descDe:'Schutzklausel Überschuss +45% HBG', unit:'UDS', sale:33, cost:19.80, cat:'ING' },
    { code:'ING_FIX_015', desc:'HBG Paquete GF+ (solo GFPLUS)', descDe:'Hausbegehung POP Paket GF+ (nur GFPLUS)', unit:'UDS', sale:26, cost:15.60, cat:'ING' },
];

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PRICE_LIST };
}
