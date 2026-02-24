// ============================================
// CREATOR INTELLIGENCE OS — Export Utilities
// ============================================
// Handles text and PDF export for all tab data

import jsPDF from 'jspdf';
import 'jspdf-autotable';

// ── Text/Markdown/JSON Export Functions ──

export function exportAsJSON(data, section, topic) {
  const content = JSON.stringify(data[section] || data, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(topic)}_${section}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAsMarkdown(data, section, topic) {
  const content = formatSectionAsMarkdown(data, section, topic);
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(topic)}_${section}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAnalyticsAsCSV(analyticsData, topic) {
  let csv = 'Metric,Value,Date\n';
  
  // Basic KPIs
  csv += `Total Revenue,${analyticsData.totalRevenue || 0},${new Date().toLocaleDateString()}\n`;
  csv += `Active Subscribers,${analyticsData.subscribers || 0},${new Date().toLocaleDateString()}\n`;
  csv += `Total Views,${analyticsData.views || 0},${new Date().toLocaleDateString()}\n`;
  
  // Engagement Data
  if (analyticsData.engagementRate) {
    csv += `Engagement Rate,${analyticsData.engagementRate}%,\n`;
  }
  
  // Platform Split
  if (analyticsData.platformSplit) {
    csv += '\nPlatform Split,Percentage\n';
    analyticsData.platformSplit.forEach(p => {
      csv += `${p.name},${p.value}%\n`;
    });
  }

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(topic)}_growth_report.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportMasterReport(data, topic) {
  let content = `# CREATOR INTELLIGENCE MASTER REPORT\n\n`;
  content += `**Topic:** ${topic}\n`;
  content += `**Generated:** ${new Date().toLocaleString()}\n`;
  content += `**Author:** Creator Intelligence OS\n`;
  content += `\n---\n\n`;

  // Summary Table of Contents
  content += `## Table of Contents\n`;
  content += `1. [Narrative Intelligence](#narrative-intelligence)\n`;
  content += `2. [Deep Analysis & Research](#deep-analysis--research)\n`;
  content += `3. [Master Script](#master-script)\n`;
  content += `4. [Title Psychology](#title-psychology)\n`;
  content += `5. [Thumbnail Strategy](#thumbnail-strategy)\n`;
  content += `\n---\n\n`;

  // Concatenate Sections
  if (data.narrative) content += formatNarrativeMarkdown(data.narrative) + '\n\n---\n\n';
  if (data.research) content += formatResearchMarkdown(data.research) + '\n\n---\n\n';
  if (data.script) content += formatScriptMarkdown(data.script) + '\n\n---\n\n';
  if (data.titles) content += formatTitlesMarkdown(data.titles) + '\n\n---\n\n';
  if (data.thumbnails) content += formatThumbnailsMarkdown(data.thumbnails) + '\n\n---\n\n';

  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(topic)}_MASTER_REPORT.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Text Export Functions ──

export function exportAsText(data, section, topic) {
  const content = formatSectionAsText(data, section, topic);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sanitizeFilename(topic)}_${section}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAsPDF(data, section, topic) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = 20;

  // Header
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Creator Intelligence OS', margin, yPos);
  yPos += 10;
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'normal');
  doc.text(`Topic: ${topic}`, margin, yPos);
  yPos += 8;
  
  doc.setFontSize(12);
  doc.text(`Section: ${section.charAt(0).toUpperCase() + section.slice(1)}`, margin, yPos);
  yPos += 12;
  
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Content
  formatSectionAsPDF(doc, data, section, yPos, margin, pageWidth);

  // Save
  doc.save(`${sanitizeFilename(topic)}_${section}.pdf`);
}

// ── Section Formatters (Text) ──

function formatSectionAsText(data, section, topic) {
  let content = `CREATOR INTELLIGENCE OS\n`;
  content += `Topic: ${topic}\n`;
  content += `Section: ${section.toUpperCase()}\n`;
  content += `Generated: ${new Date().toLocaleString()}\n`;
  content += `${'='.repeat(60)}\n\n`;

  switch (section) {
    case 'narrative':
      content += formatNarrativeText(data);
      break;
    case 'script':
      content += formatScriptText(data);
      break;
    case 'research':
      content += formatResearchText(data);
      break;
    case 'titles':
      content += formatTitlesText(data);
      break;
    case 'thumbnails':
      content += formatThumbnailsText(data);
      break;
    case 'series':
      content += formatSeriesText(data);
      break;
    case 'optimization':
      content += formatOptimizationText(data);
      break;
    case 'motion':
      content += formatMotionPromptsText(data);
      break;
    default:
      content += 'No data available for this section.\n';
  }

  return content;
}

function formatNarrativeText(n) {
  let text = `NARRATIVE INTELLIGENCE\n${'='.repeat(60)}\n\n`;
  text += `Content Type: ${n.contentType}\n`;
  text += `${n.contentTypeReasoning}\n\n`;
  text += `Topic Interpretation:\n${n.interpretation}\n\n`;
  text += `Core Tension:\n${n.coreTension}\n\n`;
  text += `Hidden Incentives:\n${n.hiddenIncentives.map((item, i) => `${i + 1}. ${item}`).join('\n')}\n\n`;
  text += `Emotional Leverage:\n${n.emotionalLeverage.map(e => `- ${e.emotion}: ${e.description}`).join('\n')}\n\n`;
  text += `Market Context:\n${n.marketContext}\n\n`;
  text += `Psychological Context:\n${n.psychologicalContext}\n`;
  return text;
}

function formatScriptText(s) {
  let text = `MASTER SCRIPT\n${'='.repeat(60)}\n\n`;
  text += `Tone: ${s.tone}\n`;
  text += `Duration: ${s.estimatedDuration}\n\n`;
  s.sections.forEach((sec, i) => {
    text += `\n${'─'.repeat(60)}\n`;
    text += `SECTION ${i + 1}: ${sec.title.toUpperCase()}\n`;
    text += `${sec.subtitle}\n`;
    text += `${'─'.repeat(60)}\n\n`;
    text += `${sec.content}\n\n`;
    text += `Scene: ${sec.sceneDescription}\n`;
    text += `Camera: ${sec.cameraMovement}\n`;
    text += `Lighting: ${sec.lighting}\n`;
    text += `Music: ${sec.musicCue}\n\n`;
    text += `AI Video Prompt:\n${sec.aiVideoPrompt}\n`;
  });
  return text;
}

function formatResearchText(r) {
  let text = `DEEP ANALYSIS MODE\n${'='.repeat(60)}\n\n`;
  text += `MYTH MATRIX\n${'-'.repeat(60)}\n`;
  r.mythMatrix.forEach((m, i) => {
    text += `\n${i + 1}. Myth: ${m.myth}\n`;
    text += `   Reality: ${m.reality}\n`;
    text += `   Confidence: ${m.confidence}%\n`;
  });
  text += `\n\nINCENTIVE MAP\n${'-'.repeat(60)}\n`;
  r.incentiveMap.forEach((item, i) => {
    text += `\n${i + 1}. ${item.actor} (${item.impact} Impact)\n`;
    text += `   Incentive: ${item.incentive}\n`;
    text += `   Behavior: ${item.behavior}\n`;
  });
  text += `\n\nCOGNITIVE BIASES\n${'-'.repeat(60)}\n`;
  r.cognitiveBiases.forEach((b, i) => {
    text += `\n${i + 1}. ${b.bias} (${b.severity})\n`;
    text += `   ${b.description}\n`;
    text += `   Exploited by: ${b.exploitedBy}\n`;
  });
  text += `\n\nALGORITHMIC AMPLIFICATION\n${'-'.repeat(60)}\n`;
  r.algorithmicAmplification.forEach((item, i) => {
    text += `${i + 1}. ${item}\n`;
  });
  return text;
}

function formatTitlesText(t) {
  let text = `TITLE PSYCHOLOGY\n${'='.repeat(60)}\n\n`;
  text += `TITLE VARIANTS\n${'-'.repeat(60)}\n`;
  t.variants.forEach((v, i) => {
    text += `\n${i + 1}. ${v.title}\n`;
    text += `   Trigger: ${v.trigger}\n`;
    text += `   CTR: ${v.ctr}\n`;
    text += `   Audience: ${v.audience}\n`;
    text += `   Psychology: ${v.emotionalTrigger}\n`;
  });
  text += `\n\nA/B TESTING SETS\n${'-'.repeat(60)}\n`;
  text += `Primary:\n${t.abSets.primary.map((title, i) => `${i + 1}. ${title}`).join('\n')}\n\n`;
  text += `High Risk:\n${t.abSets.highRisk.map((title, i) => `${i + 1}. ${title}`).join('\n')}\n\n`;
  text += `Safe Evergreen:\n${t.abSets.safeEvergreen}\n`;
  return text;
}

function formatThumbnailsText(th) {
  let text = `THUMBNAIL PSYCHOLOGY\n${'='.repeat(60)}\n\n`;
  text += `VISUAL CONCEPT\n${'-'.repeat(60)}\n`;
  text += `Primary Emotion: ${th.visualConcept.primaryEmotion}\n`;
  text += `Color Psychology: ${th.visualConcept.colorPsychology}\n`;
  text += `Composition: ${th.visualConcept.compositionStructure}\n\n`;
  text += `ARCHETYPE\n${'-'.repeat(60)}\n`;
  text += `Selected: ${th.archetype.selected}\n`;
  text += `Reasoning: ${th.archetype.reasoning}\n\n`;
  text += `TEXT OVERLAY\n${'-'.repeat(60)}\n`;
  text += `Text: ${th.textOverlay.text}\n`;
  text += `Placement: ${th.textOverlay.placement}\n\n`;
  text += `AI PROMPTS\n${'-'.repeat(60)}\n`;
  text += `Midjourney: ${th.aiPrompt.midjourney}\n\n`;
  text += `SDXL: ${th.aiPrompt.sdxl}\n`;
  return text;
}

function formatSeriesText(s) {
  let text = `SERIES BUILDER\n${'='.repeat(60)}\n\n`;
  text += `SEQUELS\n${'-'.repeat(60)}\n`;
  s.sequels.forEach((seq, i) => {
    text += `\n${i + 1}. ${seq.title}\n`;
    text += `   ${seq.description}\n`;
    text += `   Timing: ${seq.timing}\n`;
  });
  text += `\n\nCONTENT ARCS\n${'-'.repeat(60)}\n`;
  s.contentArcs.forEach((arc, i) => {
    text += `${i + 1}. ${arc}\n`;
  });
  text += `\n\nESCALATION ROADMAP\n${'-'.repeat(60)}\n`;
  s.escalationRoadmap.forEach((phase, i) => {
    text += `\n${i + 1}. ${phase.phase} (${phase.episodes})\n`;
    text += `   Goal: ${phase.goal}\n`;
  });
  return text;
}

function formatOptimizationText(o) {
  let text = `OPTIMIZATION\n${'='.repeat(60)}\n\n`;
  text += `WEAK TENSION ZONES\n${'-'.repeat(60)}\n`;
  o.weakTensionZones.forEach((z, i) => {
    text += `\n${i + 1}. ${z.section}\n`;
    text += `   Issue: ${z.issue}\n`;
    text += `   Suggestion: ${z.suggestion}\n`;
  });
  text += `\n\nPACING RISKS\n${'-'.repeat(60)}\n`;
  o.pacingRisks.forEach((r, i) => {
    text += `\n${i + 1}. ${r.section} (${r.risk} Risk)\n`;
    text += `   ${r.detail}\n`;
  });
  text += `\n\nCTR IMPROVEMENTS\n${'-'.repeat(60)}\n`;
  o.ctrImprovements.forEach((imp, i) => {
    text += `${i + 1}. ${imp}\n`;
  });
  return text;
}

function formatMotionPromptsText(prompts) {
  let text = `MOTION PROMPTS\n${'='.repeat(60)}\n\n`;
  prompts.forEach((p, i) => {
    text += `${i + 1}. ${p.scene}\n`;
    text += `   Duration: ${p.duration}\n`;
    text += `   Platforms: ${p.platforms.join(', ')}\n`;
    text += `   Prompt: ${p.prompt}\n\n`;
  });
  return text;
}

// ── Section Formatters (PDF) ──

function formatSectionAsPDF(doc, data, section, startY, margin, pageWidth) {
  doc.setFontSize(10);
  const maxWidth = pageWidth - (margin * 2);

  switch (section) {
    case 'narrative':
      formatNarrativePDF(doc, data, startY, margin, maxWidth);
      break;
    case 'script':
      formatScriptPDF(doc, data, startY, margin, maxWidth);
      break;
    case 'research':
      formatResearchPDF(doc, data, startY, margin, maxWidth);
      break;
    case 'titles':
      formatTitlesPDF(doc, data, startY, margin, maxWidth);
      break;
    case 'thumbnails':
      formatThumbnailsPDF(doc, data, startY, margin, maxWidth);
      break;
    case 'series':
      formatSeriesPDF(doc, data, startY, margin, maxWidth);
      break;
    case 'optimization':
      formatOptimizationPDF(doc, data, startY, margin, maxWidth);
      break;
    case 'motion':
      formatMotionPromptsPDF(doc, data, startY, margin, maxWidth);
      break;
  }
}

function formatNarrativePDF(doc, n, y, margin, maxWidth) {
  doc.setFont(undefined, 'bold');
  doc.text('Content Type:', margin, y);
  doc.setFont(undefined, 'normal');
  doc.text(n.contentType, margin + 30, y);
  y += 6;
  const lines = doc.splitTextToSize(n.contentTypeReasoning, maxWidth);
  doc.text(lines, margin, y);
  y += lines.length * 5 + 8;

  doc.setFont(undefined, 'bold');
  doc.text('Topic Interpretation:', margin, y);
  y += 6;
  doc.setFont(undefined, 'normal');
  const interpLines = doc.splitTextToSize(n.interpretation, maxWidth);
  doc.text(interpLines, margin, y);
  y += interpLines.length * 5 + 8;

  doc.setFont(undefined, 'bold');
  doc.text('Core Tension:', margin, y);
  y += 6;
  doc.setFont(undefined, 'normal');
  const tensionLines = doc.splitTextToSize(n.coreTension, maxWidth);
  doc.text(tensionLines, margin, y);
}

function formatScriptPDF(doc, s, y, margin, maxWidth) {
  doc.setFont(undefined, 'bold');
  doc.text(`Tone: ${s.tone} | Duration: ${s.estimatedDuration}`, margin, y);
  y += 10;

  s.sections.forEach((sec, i) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFont(undefined, 'bold');
    doc.text(`${i + 1}. ${sec.title}`, margin, y);
    y += 6;
    doc.setFont(undefined, 'normal');
    const contentLines = doc.splitTextToSize(sec.content, maxWidth);
    doc.text(contentLines, margin, y);
    y += contentLines.length * 5 + 8;
  });
}

function formatResearchPDF(doc, r, y, margin, maxWidth) {
  doc.setFont(undefined, 'bold');
  doc.text('Myth Matrix', margin, y);
  y += 8;
  
  doc.autoTable({
    startY: y,
    head: [['Myth', 'Reality', 'Confidence']],
    body: r.mythMatrix.map(m => [m.myth, m.reality, `${m.confidence}%`]),
    margin: { left: margin },
    styles: { fontSize: 9 },
  });
  
  y = doc.lastAutoTable.finalY + 10;
  doc.setFont(undefined, 'bold');
  doc.text('Incentive Map', margin, y);
  y += 8;
  
  doc.autoTable({
    startY: y,
    head: [['Actor', 'Incentive', 'Impact']],
    body: r.incentiveMap.map(i => [i.actor, i.incentive, i.impact]),
    margin: { left: margin },
    styles: { fontSize: 9 },
  });
}

function formatTitlesPDF(doc, t, y, margin, maxWidth) {
  doc.autoTable({
    startY: y,
    head: [['Title', 'Trigger', 'CTR']],
    body: t.variants.map(v => [v.title, v.trigger, v.ctr]),
    margin: { left: margin },
    styles: { fontSize: 9 },
  });
}

function formatThumbnailsPDF(doc, th, y, margin, maxWidth) {
  doc.setFont(undefined, 'bold');
  doc.text(`Archetype: ${th.archetype.selected}`, margin, y);
  y += 6;
  doc.setFont(undefined, 'normal');
  const reasonLines = doc.splitTextToSize(th.archetype.reasoning, maxWidth);
  doc.text(reasonLines, margin, y);
  y += reasonLines.length * 5 + 8;
  
  doc.setFont(undefined, 'bold');
  doc.text(`Text Overlay: ${th.textOverlay.text}`, margin, y);
}

function formatSeriesPDF(doc, s, y, margin, maxWidth) {
  doc.autoTable({
    startY: y,
    head: [['Title', 'Description', 'Timing']],
    body: s.sequels.map(seq => [seq.title, seq.description, seq.timing]),
    margin: { left: margin },
    styles: { fontSize: 9 },
  });
}

function formatOptimizationPDF(doc, o, y, margin, maxWidth) {
  doc.setFont(undefined, 'bold');
  doc.text('Weak Tension Zones', margin, y);
  y += 8;
  
  doc.autoTable({
    startY: y,
    head: [['Section', 'Issue', 'Suggestion']],
    body: o.weakTensionZones.map(z => [z.section, z.issue, z.suggestion]),
    margin: { left: margin },
    styles: { fontSize: 8 },
  });
}

function formatMotionPromptsPDF(doc, prompts, y, margin, maxWidth) {
  doc.autoTable({
    startY: y,
    head: [['Scene', 'Duration', 'Prompt']],
    body: prompts.map(p => [p.scene, p.duration, p.prompt]),
    margin: { left: margin },
    styles: { fontSize: 8 },
  });
}

// ── Section Formatters (Markdown) ──

function formatSectionAsMarkdown(data, section, topic) {
  let content = `# CREATOR INTELLIGENCE OS\n\n`;
  content += `**Topic:** ${topic}\n`;
  content += `**Section:** ${section.toUpperCase()}\n`;
  content += `**Generated:** ${new Date().toLocaleString()}\n`;
  content += `---\n\n`;

  switch (section) {
    case 'narrative': return content + formatNarrativeMarkdown(data);
    case 'script': return content + formatScriptMarkdown(data);
    case 'research': return content + formatResearchMarkdown(data);
    case 'titles': return content + formatTitlesMarkdown(data);
    case 'thumbnails': return content + formatThumbnailsMarkdown(data);
    case 'series': return content + formatSeriesMarkdown(data);
    case 'optimization': return content + formatOptimizationMarkdown(data);
    case 'motion': return content + formatMotionPromptsMarkdown(data);
    default: return content + 'No data available for this section.\n';
  }
}

function formatNarrativeMarkdown(n) {
  let text = `## NARRATIVE INTELLIGENCE\n\n`;
  text += `### Content Type: ${n.contentType}\n`;
  text += `> ${n.contentTypeReasoning}\n\n`;
  text += `### Topic Interpretation\n${n.interpretation}\n\n`;
  text += `### Core Tension\n${n.coreTension}\n\n`;
  text += `### Hidden Incentives\n${n.hiddenIncentives.map((item, i) => `${i + 1}. ${item}`).join('\n')}\n\n`;
  text += `### Emotional Leverage\n${n.emotionalLeverage.map(e => `- **${e.emotion}**: ${e.description}`).join('\n')}\n\n`;
  text += `### Market Context\n${n.marketContext}\n\n`;
  text += `### Psychological Context\n${n.psychologicalContext}\n`;
  return text;
}

function formatScriptMarkdown(s) {
  let text = `## MASTER SCRIPT\n\n`;
  text += `**Tone:** ${s.tone} | **Duration:** ${s.estimatedDuration}\n\n`;
  s.sections.forEach((sec, i) => {
    text += `### Section ${i + 1}: ${sec.title}\n`;
    text += `*${sec.subtitle}*\n\n`;
    text += `${sec.content}\n\n`;
    text += `> **Scene:** ${sec.sceneDescription}\n`;
    text += `> **Camera:** ${sec.cameraMovement}\n`;
    text += `> **Lighting:** ${sec.lighting}\n`;
    text += `> **Music:** ${sec.musicCue}\n\n`;
    text += `**AI Video Prompt:**\n\`\`\`\n${sec.aiVideoPrompt}\n\`\`\`\n\n`;
    text += `---\n\n`;
  });
  return text;
}

function formatResearchMarkdown(r) {
  let text = `## DEEP ANALYSIS MODE\n\n`;
  text += `### MYTH MATRIX\n\n`;
  text += `| Myth | Reality | Confidence |\n|---|---|---|\n`;
  r.mythMatrix.forEach(m => {
    text += `| ${m.myth} | ${m.reality} | ${m.confidence}% |\n`;
  });
  
  text += `\n### INCENTIVE MAP\n\n`;
  r.incentiveMap.forEach((item, i) => {
    text += `**${i + 1}. ${item.actor}** (${item.impact} Impact)\n`;
    text += `- **Incentive:** ${item.incentive}\n`;
    text += `- **Behavior:** ${item.behavior}\n\n`;
  });
  
  text += `### COGNITIVE BIASES\n\n`;
  r.cognitiveBiases.forEach((b, i) => {
    text += `**${i + 1}. ${b.bias}** (${b.severity})\n`;
    text += `> ${b.description}\n`;
    text += `- *Exploited by:* ${b.exploitedBy}\n\n`;
  });
  
  text += `### ALGORITHMIC AMPLIFICATION\n\n`;
  r.algorithmicAmplification.forEach((item, i) => {
    text += `${i + 1}. ${item}\n`;
  });
  return text;
}

function formatTitlesMarkdown(t) {
  let text = `## TITLE PSYCHOLOGY\n\n`;
  text += `### TITLE VARIANTS\n\n`;
  text += `| Title | Trigger | CTR |\n|---|---|---|\n`;
  t.variants.forEach(v => {
    text += `| ${v.title} | ${v.trigger} | ${v.ctr} |\n`;
  });
  
  text += `\n### A/B TESTING SETS\n\n`;
  text += `**Primary:**\n${t.abSets.primary.map((title, i) => `${i + 1}. ${title}`).join('\n')}\n\n`;
  text += `**High Risk:**\n${t.abSets.highRisk.map((title, i) => `${i + 1}. ${title}`).join('\n')}\n\n`;
  text += `**Safe Evergreen:**\n${t.abSets.safeEvergreen}\n`;
  return text;
}

function formatThumbnailsMarkdown(th) {
  let text = `## THUMBNAIL PSYCHOLOGY\n\n`;
  text += `### VISUAL CONCEPT\n`;
  text += `- **Primary Emotion:** ${th.visualConcept.primaryEmotion}\n`;
  text += `- **Color Psychology:** ${th.visualConcept.colorPsychology}\n`;
  text += `- **Composition:** ${th.visualConcept.compositionStructure}\n\n`;
  text += `### ARCHETYPE\n`;
  text += `**Selected:** ${th.archetype.selected}\n`;
  text += `> ${th.archetype.reasoning}\n\n`;
  text += `### TEXT OVERLAY\n`;
  text += `**Text:** ${th.textOverlay.text}\n`;
  text += `**Placement:** ${th.textOverlay.placement}\n\n`;
  text += `### AI PROMPTS\n`;
  text += `**Midjourney:**\n\`${th.aiPrompt.midjourney}\`\n\n`;
  text += `**SDXL:**\n\`${th.aiPrompt.sdxl}\`\n`;
  return text;
}

function formatSeriesMarkdown(s) {
  let text = `## SERIES BUILDER\n\n`;
  text += `### SEQUELS\n\n`;
  s.sequels.forEach((seq, i) => {
    text += `**${i + 1}. ${seq.title}**\n`;
    text += `${seq.description}\n`;
    text += `*Timing: ${seq.timing}*\n\n`;
  });
  text += `### CONTENT ARCS\n\n`;
  s.contentArcs.forEach((arc, i) => {
    text += `${i + 1}. ${arc}\n`;
  });
  text += `\n### ESCALATION ROADMAP\n\n`;
  s.escalationRoadmap.forEach((phase, i) => {
    text += `**${i + 1}. ${phase.phase}** (${phase.episodes})\n`;
    text += `> Goal: ${phase.goal}\n\n`;
  });
  return text;
}

function formatOptimizationMarkdown(o) {
  let text = `## OPTIMIZATION\n\n`;
  text += `### WEAK TENSION ZONES\n\n`;
  text += `| Section | Issue | Suggestion |\n|---|---|---|\n`;
  o.weakTensionZones.forEach(z => {
    text += `| ${z.section} | ${z.issue} | ${z.suggestion} |\n`;
  });
  
  text += `\n### PACING RISKS\n\n`;
  o.pacingRisks.forEach((r, i) => {
    text += `**${i + 1}. ${r.section}** (${r.risk} Risk)\n`;
    text += `> ${r.detail}\n\n`;
  });
  
  text += `### CTR IMPROVEMENTS\n\n`;
  o.ctrImprovements.forEach((imp, i) => {
    text += `${i + 1}. ${imp}\n`;
  });
  return text;
}

function formatMotionPromptsMarkdown(prompts) {
  let text = `## MOTION PROMPTS\n\n`;
  text += `| Scene | Duration | Platforms | Prompt |\n|---|---|---|---|\n`;
  prompts.forEach(p => {
    text += `| ${p.scene} | ${p.duration} | ${p.platforms.join(', ')} | \`${p.prompt}\` |\n`;
  });
  return text;
}

// ── Helpers ──

function sanitizeFilename(str) {
  return str.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
}
