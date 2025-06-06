import jsPDF from 'jspdf';
import { Facility, LineId } from '../store/FacilityContext';

// Line lengths in meters
const LINE_LENGTHS: Record<string, number> = {
  baseline: 10.97,
  sidelineSingle: 23.70,
  sidelineDouble: 23.7,
  serviceLine: 8.2,
  serviceLineCenter: 12.75
};

// Map LineId to line type for length calculation
const LINE_TYPE_MAP: Record<LineId, string> = {
  baselineNear: 'baseline',
  baselineFar: 'baseline',
  sidelineDoubleNearLeft: 'sidelineDouble',
  sidelineDoubleNearRight: 'sidelineDouble',
  sidelineDoubleFarLeft: 'sidelineDouble',
  sidelineDoubleFarRight: 'sidelineDouble',
  sidelineSingleNearLeft: 'sidelineSingle',
  sidelineSingleNearRight: 'sidelineSingle',
  sidelineSingleFarLeft: 'sidelineSingle',
  sidelineSingleFarRight: 'sidelineSingle',
  serviceLineNear: 'serviceLine',
  serviceLineFar: 'serviceLine',
  serviceLineCenterNear: 'serviceLineCenter',
  serviceLineCenterFar: 'serviceLineCenter'
};

// German line names
const LINE_NAMES: Record<LineId, string> = {
  baselineNear: 'Grundlinie (nah)',
  baselineFar: 'Grundlinie (fern)',
  sidelineDoubleNearLeft: 'Doppel-Seitenlinie (nah links)',
  sidelineDoubleNearRight: 'Doppel-Seitenlinie (nah rechts)',
  sidelineDoubleFarLeft: 'Doppel-Seitenlinie (fern links)',
  sidelineDoubleFarRight: 'Doppel-Seitenlinie (fern rechts)',
  sidelineSingleNearLeft: 'Einzel-Seitenlinie (nah links)',
  sidelineSingleNearRight: 'Einzel-Seitenlinie (nah rechts)',
  sidelineSingleFarLeft: 'Einzel-Seitenlinie (fern links)',
  sidelineSingleFarRight: 'Einzel-Seitenlinie (fern rechts)',
  serviceLineNear: 'Aufschlaglinie (nah)',
  serviceLineFar: 'Aufschlaglinie (fern)',
  serviceLineCenterNear: 'Mittellinie (nah)',
  serviceLineCenterFar: 'Mittellinie (fern)'
};

function normalizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .trim();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE');
}

function getCurrentDateTime(): string {
  const now = new Date();
  return now.toLocaleString('de-DE').replace(/[,:]/g, '-').replace(/\s+/g, '_');
}

export function generatePDFReport(facility: Facility): void {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Embed JSON data as metadata and custom properties
  const jsonData = JSON.stringify(facility, null, 2);
  
  // Add hidden watermark (invisible to user but embedded in PDF)
  doc.setTextColor(255, 255, 255); // White text (invisible on white background)
  doc.setFontSize(1); // Very small font
  doc.text('Created with tennis-court-editor by mayasse', 1, 1);
  
  // Add JSON data as a hidden annotation (invisible but searchable/extractable)
  doc.setTextColor(255, 255, 255); // White text
  doc.setFontSize(0.1); // Extremely small
  doc.text(`DATA:${jsonData}`, 1, 2);
  
  // Reset text color for visible content
  doc.setTextColor(0, 0, 0);
    // Add metadata to PDF
  doc.setProperties({
    title: `Linierungsarbeiten ${facility.name}`,
    subject: 'Tennis Court Line Maintenance Report',
    author: 'tennis-court-editor by mayasse',
    keywords: 'tennis, court, maintenance, lines',
    creator: 'tennis-court-editor by mayasse'
  });
  
  // Title
  const zeitraumText = `${formatDate(facility.zeitraum.startDate)} - ${formatDate(facility.zeitraum.endDate)}`;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`Linierungsarbeiten ${facility.name}`, 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`Zeitraum: ${zeitraumText}`, 20, yPosition);
  yPosition += 15;
  
  // Summary calculations
  let totalAnker = 0;
  let totalDubel = 0;
  let totalRepairedLines = 0;
  let totalNewLines = 0;
  let totalRepairedMeters = 0;
  let totalNewMeters = 0;
  
  // Calculate totals
  facility.courts.forEach(court => {
    Object.entries(court.lines).forEach(([lineId, details]) => {
      if (details.anchorSet) totalAnker++;
      if (details.dubelUpdated) totalDubel++;
      if (details.lineRepaired) {
        totalRepairedLines++;
        const lineType = LINE_TYPE_MAP[lineId as LineId];
        const meters = LINE_LENGTHS[lineType] || 0;
        totalRepairedMeters += meters;
      }
      if (details.isNew) {
        totalNewLines++;
        const lineType = LINE_TYPE_MAP[lineId as LineId];
        const meters = LINE_LENGTHS[lineType] || 0;
        totalNewMeters += meters;
        
        // For new lines, add anchor and dübel if not sideline
        if (!lineId.includes('sideline')) {
          // These are already counted above in anchorSet/dubelUpdated
        }
      }
    });
  });
  
  // Summary section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Zusammenfassung', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Gesamtanzahl Anker: ${totalAnker}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Gesamtanzahl Dübel: ${totalDubel}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Reparierte Linien: ${totalRepairedLines} (${totalRepairedMeters.toFixed(2)} m)`, 20, yPosition);
  yPosition += 7;
  doc.text(`Neue Linien: ${totalNewLines} (${totalNewMeters.toFixed(2)} m)`, 20, yPosition);
  yPosition += 15;
    // Important note
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Bei neuen Linien wird außer bei Seitenlinien, 1x Anker und Dübel berechnet.', 20, yPosition);
  yPosition += 15;
  
  // Court details
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Details pro Platz', 20, yPosition);
  yPosition += 10;
  
  facility.courts.forEach((court, courtIndex) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Platz ${courtIndex + 1}`, 20, yPosition);
    yPosition += 8;
    
    // Find lines with activity
    const activeLinesData: Array<{
      name: string;
      isNew: boolean;
      isRepaired: boolean;
      hasAnker: boolean;
      hasDubel: boolean;
      meters: number;
    }> = [];
    
    Object.entries(court.lines).forEach(([lineId, details]) => {
      if (details.anchorSet || details.dubelUpdated || details.lineRepaired || details.isNew) {
        const lineType = LINE_TYPE_MAP[lineId as LineId];
        const meters = LINE_LENGTHS[lineType] || 0;
        
        activeLinesData.push({
          name: LINE_NAMES[lineId as LineId],
          isNew: details.isNew,
          isRepaired: details.lineRepaired,
          hasAnker: details.anchorSet,
          hasDubel: details.dubelUpdated,
          meters
        });
      }
    });
    
    if (activeLinesData.length === 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('Keine Arbeiten durchgeführt', 25, yPosition);
      yPosition += 12;
    } else {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      activeLinesData.forEach(line => {
        let status = '';
        if (line.isNew) status += 'Neu, ';
        if (line.isRepaired) status += 'Repariert, ';
        if (line.hasAnker) status += 'Anker, ';
        if (line.hasDubel) status += 'Dübel, ';
        status = status.replace(/, $/, ''); // Remove trailing comma
        
        const text = `• ${line.name}: ${status} (${line.meters.toFixed(2)} m)`;
        doc.text(text, 25, yPosition);
        yPosition += 5;
      });
      yPosition += 5;
    }  });
    // Footer with generation date
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Erstellt am: ${new Date().toLocaleString('de-DE')}`, 20, 285);
    doc.text(`Seite ${i} von ${pageCount}`, 150, 285);
  }
  
  // Generate filename
  const timestamp = getCurrentDateTime();
  const filename = normalizeFilename(`${facility.name}_${timestamp}.pdf`);
  
  // Save the PDF
  doc.save(filename);
}
