import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Colores institucionales
const COLORS = {
  primary: [30, 43, 79],      // #1e2b4f
  secondary: [100, 100, 100],
  accent: [220, 38, 38],       // Rojo para alertas
  success: [22, 101, 52],      // Verde para resuelto
  warning: [180, 83, 9],       // Naranja para proceso
  light: [249, 250, 251],
  border: [229, 231, 235]
};

export const exportarSiniestroPDF = async (siniestro) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // ============================================
  // ENCABEZADO - LOGO Y MEMBRETE
  // ============================================
  
  // Rectángulo superior (membrete)
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, 210, 25, 'F');
  
  // Logo (simulado con texto)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('SIGMA', 20, 15);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Sistema de Gestión de Flotilla', 20, 22);
  
  // Fecha y número de reporte (lado derecho)
  const fechaActual = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`Fecha: ${fechaActual}`, 150, 12);
  doc.text(`Reporte: SIN-${siniestro.idSiniestro}`, 150, 18);

  // ============================================
  // TÍTULO DEL REPORTE
  // ============================================
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...COLORS.primary);
  doc.text('REPORTE DE SINIESTRO', 20, 40);
  
  // Línea decorativa
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(20, 43, 190, 43);

  // ============================================
  // INFORMACIÓN DEL SINIESTRO (TARJETAS)
  // ============================================
  
  let yPos = 55;
  
  // Función para crear tarjetas de información
  const crearTarjeta = (titulo, contenido, x, y, ancho = 80) => {
    const colorFondo = titulo === 'ESTADO' ? 
      (siniestro.estatusNombre === 'Resuelto' ? COLORS.success :
       siniestro.estatusNombre === 'En proceso' ? COLORS.warning :
       siniestro.estatusNombre === 'Reportado' ? COLORS.accent : COLORS.secondary) : COLORS.primary;
    
    // Fondo del encabezado
    doc.setFillColor(...colorFondo);
    doc.rect(x, y, ancho, 8, 'F');
    
    // Título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(titulo, x + 3, y + 5.5);
    
    // Contenido
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(contenido, x + 3, y + 15);
    
    return y + 25;
  };

  // Primera fila de tarjetas
  yPos = crearTarjeta('VEHÍCULO', 
    `${siniestro.vehiculoInfo}\nECO: ${siniestro.numeroEconomico}\nPlacas: ${siniestro.placas || 'N/A'}`, 
    20, yPos, 80);
  
  yPos = 55; // Reset para segunda columna
  crearTarjeta('CONDUCTOR',
    `${siniestro.conductorNombre}\n${siniestro.conductorCorreo || ''}\nTel: ${siniestro.conductorTelefono || 'N/A'}`,
    110, yPos, 80);
  
  // Segunda fila de tarjetas
  yPos = 95;
  crearTarjeta('FECHA Y HORA',
    new Date(siniestro.fecha).toLocaleString('es-MX', {
      dateStyle: 'full',
      timeStyle: 'short'
    }),
    20, yPos, 80);
  
  crearTarjeta('ESTADO',
    siniestro.estatusNombre?.toUpperCase() || 'N/A',
    110, yPos, 80);

  // ============================================
  // UBICACIÓN
  // ============================================
  
  yPos = 135;
  
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(20, yPos, 170, 25, 2, 2, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.primary);
  doc.text('📍 UBICACIÓN DEL INCIDENTE', 25, yPos + 7);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(siniestro.ubicacion || 'No especificada', 25, yPos + 16);

  // ============================================
  // DESCRIPCIÓN
  // ============================================
  
  yPos += 35;
  
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(20, yPos, 170, 45, 2, 2, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.primary);
  doc.text('📝 DESCRIPCIÓN DEL INCIDENTE', 25, yPos + 7);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  const descripcionLines = doc.splitTextToSize(
    siniestro.descripcion || 'Sin descripción', 
    160
  );
  doc.text(descripcionLines, 25, yPos + 16);

  // ============================================
  // EVIDENCIAS FOTOGRÁFICAS
  // ============================================
  
  yPos += 55 + (descripcionLines.length * 3);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.primary);
  doc.text('📸 EVIDENCIAS FOTOGRÁFICAS', 20, yPos);
  
  yPos += 8;
  
  if (siniestro.evidencias?.length > 0) {
    // Crear miniaturas de imágenes (simuladas por ahora)
    const maxImagenes = Math.min(siniestro.evidencias.length, 4);
    const anchoImagen = 35;
    const espacio = 5;
    
    for (let i = 0; i < maxImagenes; i++) {
      const x = 20 + (i * (anchoImagen + espacio));
      
      // Marco de la imagen
      doc.setDrawColor(...COLORS.border);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, yPos, anchoImagen, 30, 2, 2, 'FD');
      
      // Icono de imagen
      doc.setFontSize(20);
      doc.setTextColor(...COLORS.secondary);
      doc.text('🖼️', x + 12, yPos + 18);
      
      // Tipo de evidencia
      doc.setFontSize(7);
      doc.text(siniestro.evidencias[i].tipo || 'FOTO', x + 12, yPos + 26);
    }
    
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.secondary);
    doc.text(`Total: ${siniestro.evidencias.length} evidencia(s)`, 20, yPos + 40);
  } else {
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.secondary);
    doc.text('No hay evidencias registradas', 20, yPos + 10);
  }

  // ============================================
  // PIE DE PÁGINA
  // ============================================
  
  const pageHeight = doc.internal.pageSize.height;
  
  // Línea superior del pie
  doc.setDrawColor(...COLORS.border);
  doc.line(20, pageHeight - 20, 190, pageHeight - 20);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.secondary);
  doc.text('Sistema de Gestión de Flotilla SIGMA', 20, pageHeight - 12);
  doc.text('Documento generado automáticamente', 20, pageHeight - 7);
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Página 1 de 1`, 180, pageHeight - 7, { align: 'right' });

  // ============================================
  // GUARDAR PDF
  // ============================================
  
  doc.save(`Siniestro_${siniestro.idSiniestro}.pdf`);
};