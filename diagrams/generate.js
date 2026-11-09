/**
 * Générateur des diagrammes Excalidraw — documentation GitHub Copilot.
 * Exécuter : node generate.js
 * Produit les 9 fichiers .excalidraw du dossier.
 */
const fs = require('fs');
const path = require('path');
const OUT = __dirname;

let _id = 0;
const nid = (p = 'e') => `${p}-${++_id}`;
const sd = () => Math.floor(Math.random() * 1e9);
const vn = () => Math.floor(Math.random() * 1e9);

// Palette
const C = {
  navy: '#0f172a', slate: '#475569', muted: '#64748b',
  blue:   { bg: '#e0f2fe', stroke: '#0369a1' },
  sky:    { bg: '#f0f9ff', stroke: '#0284c7' },
  orange: { bg: '#ffedd5', stroke: '#c2410c' },
  amber:  { bg: '#fef3c7', stroke: '#b45309' },
  green:  { bg: '#dcfce7', stroke: '#15803d' },
  red:    { bg: '#fee2e2', stroke: '#b91c1c' },
  purple: { bg: '#ede9fe', stroke: '#6d28d9' },
  gray:   { bg: '#f1f5f9', stroke: '#64748b' },
  yellow: { bg: '#fef9c3', stroke: '#a16207' },
  teal:   { bg: '#ccfbf1', stroke: '#0f766e' },
  white:  { bg: '#ffffff', stroke: '#94a3b8' },
};

function rect(x, y, w, h, c, o = {}) {
  return {
    id: nid(o.prefix || 'r'), type: 'rectangle', x, y, width: w, height: h, angle: 0,
    strokeColor: c.stroke, backgroundColor: c.bg, fillStyle: 'solid',
    strokeWidth: o.strokeWidth || 2, strokeStyle: o.dashed ? 'dashed' : 'solid',
    roughness: 1, opacity: 100, groupIds: [], strokeSharpness: 'round',
    roundness: { type: 3 }, seed: sd(), version: 100, versionNonce: vn(),
    isDeleted: false, boundElements: [], updated: 1, link: null, locked: false,
  };
}

function normColor(c, fallback) {
  if (!c) return fallback;
  return typeof c === 'object' ? c.stroke : c;
}

function text(x, y, w, str, o = {}) {
  const size = o.size || 14;
  const lines = String(str).split('\n').length;
  const h = o.h || Math.round(size * 1.3 * lines + 6);
  return {
    id: nid(o.prefix || 't'), type: 'text', x, y, width: w, height: h, angle: 0,
    strokeColor: normColor(o.color, C.navy), backgroundColor: 'transparent', fillStyle: 'solid',
    strokeWidth: 1, strokeStyle: 'solid', roughness: 1, opacity: 100, groupIds: [],
    strokeSharpness: 'round', seed: sd(), version: 100, versionNonce: vn(),
    isDeleted: false, boundElements: [], updated: 1, link: null, locked: false,
    text: String(str), fontSize: size, fontFamily: 2, textAlign: o.align || 'center',
    verticalAlign: 'top', baseline: size - 4, containerId: null, originalText: String(str),
  };
}

function arrow(x1, y1, x2, y2, o = {}) {
  const dx = x2 - x1, dy = y2 - y1;
  return {
    id: nid(o.prefix || 'a'), type: 'arrow', x: x1, y: y1, width: dx, height: dy, angle: 0,
    strokeColor: normColor(o.color, C.slate), backgroundColor: 'transparent', fillStyle: 'solid',
    strokeWidth: o.strokeWidth || 2, strokeStyle: o.dashed ? 'dashed' : 'solid',
    roughness: 1, opacity: 100, groupIds: [], strokeSharpness: 'round',
    seed: sd(), version: 100, versionNonce: vn(), isDeleted: false, boundElements: [],
    updated: 1, link: null, locked: false,
    points: [[0, 0], [dx, dy]], lastCommittedPoint: [dx, dy],
    startBinding: null, endBinding: null, startArrowhead: null, endArrowhead: o.head || 'arrow',
    text: '', fontSize: 14, fontFamily: 2, textAlign: 'center', verticalAlign: 'middle',
    baseline: 10, containerId: null, originalText: '', groups: [],
  };
}

/** Carte : rectangle + titre coloré + lignes. */
function card(prefix, x, y, w, h, c, title, lines = '', o = {}) {
  const els = [rect(x, y, w, h, c, { prefix: prefix + '-r' })];
  const pad = o.pad || 12;
  const ts = o.titleSize || 15;
  const ls = o.lineSize || 13;
  const titleH = ts * 1.35;
  const linesArr = lines ? String(lines).split('\n') : [];
  const linesH = linesArr.length * ls * 1.3;
  const total = titleH + (linesArr.length ? 8 + linesH : 0);
  const top = o.top != null ? o.top : Math.max(10, (h - total) / 2);
  els.push(text(x + pad, y + top, w - 2 * pad, title, {
    prefix: prefix + '-tt', size: ts, color: o.titleColor || c.stroke, h: titleH,
  }));
  if (linesArr.length) {
    els.push(text(x + pad, y + top + titleH + 8, w - 2 * pad, lines, {
      prefix: prefix + '-tl', size: ls, color: o.lineColor || C.navy,
      align: o.lineAlign || 'center',
    }));
  }
  return els;
}

/** Petit badge / puce. */
function chip(prefix, x, y, w, h, c, label, o = {}) {
  return [
    rect(x, y, w, h, o.solid ? c : C.white, { prefix: prefix + '-r' }),
    text(x, y + (h - (o.size || 12) * 1.3) / 2, w, label, {
      prefix: prefix + '-t', size: o.size || 12, color: o.color || c.stroke, h: (o.size || 12) * 1.3,
    }),
  ];
}

function titleBlock(prefix, title, subtitle, w) {
  return [
    text(40, 22, w, title, { prefix: prefix + '-title', size: 23, align: 'left', h: 32 }),
    text(40, 60, w, subtitle, { prefix: prefix + '-sub', size: 13, align: 'left', color: C.muted, h: 20 }),
  ];
}

function section(prefix, x, y, w, label) {
  return [text(x, y, w, label, {
    prefix: prefix + '-sec', size: 11, align: 'left', color: C.muted, h: 16,
  })];
}

function save(name, elements) {
  const data = {
    type: 'excalidraw', version: 2, source: 'https://excalidraw.com',
    elements,
    appState: {
      viewBackgroundColor: '#ffffff', gridSize: null, gridStep: 5, gridMode: 'grid',
      backgroundColor: '#ffffff', currentItemStrokeColor: '#000000', currentItemBackgroundColor: '#ffffff',
      currentItemFillStyle: 'solid', currentItemStrokeWidth: 1, currentItemStrokeStyle: 'solid',
      currentItemRoughness: 1, currentItemOpacity: 100, currentItemFontFamily: 2, currentItemFontSize: 16,
      currentItemTextAlign: 'center', currentItemStartArrowhead: null, currentItemEndArrowhead: 'arrow',
      currentItemLinearStrokeSharpness: 'round', scrollX: 400, scrollY: 300, zoom: 1,
      currentItemElements: [], composing: false, embedMode: false, viewModeEnabled: false,
      selectedElementIds: {}, activeTool: { type: 'selection', customType: null, activeToolButton: 'selection' },
      elementLifeCycle: {}, multiElementMode: false, cursorColor: '#000000', selectedGroupIds: {},
      shouldAddCache: false, showStatus: true, showCanvasBorder: false, showZenMode: false,
      exporting: false, exportingBefore: null, exportingAfter: null, replacingElement: null,
      editingElement: null, editingTextElement: null, editingLineElement: null, resizingElement: null,
      rotatingElement: null, hoveringElement: null, selectingElement: null, selectingElements: [],
      selectedElements: [], cuttingElement: null, pastingElement: null, duplicatingElement: null,
      draggingSelectedElement: null, draggingSelectedElements: [], insertingElement: null,
      creatingArrow: null, insertingText: null, resizing: null, rotating: null, moving: null,
      hasSelectedElement: false, hasMultiSelectedElement: false, elementToDuplicate: null,
      elementToDrag: null, scrollbars: { showHorizontal: true, showVertical: true },
      liveChannels: {}, pendingPointerEvents: [], liveUsers: [], selectedLiveUser: null,
      sidebar: { open: true, brushes: false, colors: false, fonts: false, link: false, images: false, libraries: false, themes: false },
      activeLibrary: null, showProperties: false, selectedColors: {}, frameElement: null,
      framePadding: 40, showFrameBorder: false, showFrameShadow: false, exportBackground: true,
      exportWithDarkMode: false, exportScale: 1, exportPadding: 0, saveToTimer: null,
      shortcuts: {}, showToggleSidebar: true, lastSelectedTool: 'selection', lastActiveToolButton: 'selection',
      elementIdCounter: 0, nextFrameId: null, frameLabel: null, deleteElementsOnPaste: false,
      showGrid: true, selectedGroupStack: null,
    },
    scrollToContent: { x: 400, y: 300 },
    files: {},
  };
  fs.writeFileSync(path.join(OUT, name + '.excalidraw'), JSON.stringify(data, null, 2));
  console.log(`✓ ${name}.excalidraw — ${elements.length} éléments`);
}

/* ============================================================
   00 — PRISE EN MAIN
   ============================================================ */
{
  const e = [];
  e.push(...titleBlock('00',
    '00 — Prise en main : que voit-il, que fait-il sans me demander ?',
    'Comprendre le modèle, les outils, la boucle — et la boîte de permission, ton dernier rempart.', 900));

  e.push(...card('00-a', 40, 115, 220, 100, C.gray, 'TON IDE',
    'VS Code · JetBrains · CLI'));
  e.push(...card('00-b', 330, 115, 300, 100, C.orange, 'GITHUB COPILOT',
    'modèle (probabiliste)\n+ harnais (déterministe)'));
  e.push(...card('00-c', 700, 115, 240, 100, C.green, 'SUGGESTIONS',
    'ghost text · chat\néditions guidées'));
  e.push(arrow(260, 165, 330, 165));
  e.push(arrow(630, 165, 700, 165));

  e.push(arrow(480, 215, 490, 275, { dashed: true }));
  e.push(text(500, 232, 120, 'contexte', { size: 11, color: C.muted, align: 'left', h: 16 }));

  e.push(...section('00', 40, 250, 400, 'CE QUE COPILOT MANIPULE'));

  e.push(...card('00-d', 40, 275, 280, 160, C.blue, '👁 CE QU\'IL VOIT',
    '• fichiers ouverts + onglets\n• sélection / curseur\n• instructions Copilot\n• historique de chat', { lineAlign: 'left' }));
  e.push(...card('00-e', 350, 275, 280, 160, C.orange, '⚙ CE QU\'IL FAIT SEUL',
    '• complétion en ligne\n• propositions de code\n• réponses en lecture seule', { lineAlign: 'left' }));
  e.push(...card('00-f', 660, 275, 280, 160, C.red, '🚫 CE QU\'IL NE FAIT PAS',
    '• lancer une commande\n• modifier un fichier\n• committer\n— sans ta validation', { lineAlign: 'left' }));

  e.push(...section('00', 40, 462, 400, 'LE DERNIER REMPART'));

  e.push(rect(40, 488, 900, 112, C.yellow, { prefix: '00-perm' }));
  e.push(text(60, 498, 860, 'BOÎTE DE PERMISSION', { size: 16, color: C.amber, h: 22 }));
  e.push(text(60, 522, 860, 'Chaque outil, chaque commande : tu autorises, tu refuses, ou tu choisis « toujours ».', { size: 12, h: 18 }));

  e.push(...chip('00-p1', 70, 550, 250, 38, C.green, '✅  Autoriser une fois'));
  e.push(...chip('00-p2', 360, 550, 250, 38, C.orange, '♾  Toujours autoriser'));
  e.push(...chip('00-p3', 650, 550, 250, 38, C.red, '⛔  Refuser'));

  e.push(text(40, 632, 900, 'Règle d\'or : Copilot lit et suggère ; il n\'exécute jamais sans ton accord explicite.', {
    size: 13, align: 'left', color: C.navy, h: 20,
  }));

  save('00-prise-en-main', e);
}

/* ============================================================
   01 — COMMANDES NATIVES
   ============================================================ */
{
  const e = [];
  e.push(...titleBlock('01',
    '01 — Commandes natives : arrêter, annuler, voir ce qu\'il a en tête',
    'Exécutées par le harnais (déterministe), pas interprétées par le modèle (probabiliste).', 980));

  e.push(...card('01-model', 40, 112, 260, 95, C.red, 'MODÈLE',
    'probabiliste\npropose, peut déraper'));
  e.push(...card('01-harness', 355, 112, 300, 95, C.blue, 'HARNAIS COPILOT',
    'déterministe\nexécute, cadre, journalise'));
  e.push(...card('01-term', 710, 112, 270, 95, C.orange, 'TON IDE / TERMINAL',
    'tu gardes le contrôle'));
  e.push(arrow(300, 159, 355, 159));
  e.push(arrow(655, 159, 710, 159));

  e.push(...section('01', 40, 232, 500, 'QUATRE FAMILLES DE COMMANDES'));

  e.push(...card('01-c1', 40, 258, 225, 150, C.green, 'CADRER',
    '/init\n/plan\n/goal\n/effort', { lineSize: 14 }));
  e.push(...card('01-c2', 285, 258, 225, 150, C.purple, 'REPRENDRE LA MAIN',
    '/rewind\n/compact\n/clear', { lineSize: 14 }));
  e.push(...card('01-c3', 530, 258, 225, 150, C.blue, 'VOIR',
    '/context\n/usage\n/tasks', { lineSize: 14 }));
  e.push(...card('01-c4', 775, 258, 225, 150, C.red, 'QUALITÉ & SÉCURITÉ',
    '/code-review\n/security-review\n/permissions', { lineSize: 13 }));

  e.push(...section('01', 40, 438, 500, 'LE CYCLE VERTUEUX'));

  e.push(...card('01-f1', 40, 464, 150, 70, C.green, '1 · /plan', '', { titleSize: 14 }));
  e.push(...card('01-f2', 235, 464, 200, 70, C.gray, '2 · explore & propose', '', { titleSize: 14 }));
  e.push(...card('01-f3', 465, 464, 150, 70, C.yellow, '3 · tu valides', '', { titleSize: 14 }));
  e.push(...card('01-f4', 660, 464, 150, 70, C.blue, '4 · exécution', '', { titleSize: 14 }));
  e.push(arrow(190, 499, 235, 499));
  e.push(arrow(435, 499, 465, 499));
  e.push(arrow(615, 499, 660, 499));

  e.push(arrow(720, 558, 130, 558, { dashed: true, color: C.red }));
  e.push(text(330, 566, 220, '/rewind — dernier checkpoint', { size: 11, color: C.red, h: 16 }));

  e.push(rect(40, 620, 945, 78, C.red, { prefix: '01-limit' }));
  e.push(text(60, 630, 905, '⚠  LIMITE DE /rewind', { size: 14, color: C.red, h: 20 }));
  e.push(text(60, 654, 905, '/rewind restaure les fichiers édités par l\'agent, pas les effets d\'une commande shell (migration, image, déploiement). Pour ceux-là : Git et les garde-fous.', { size: 12, align: 'left', h: 34 }));

  e.push(text(40, 714, 945, 'Tape / dans une session : la liste dépend de ta version de GitHub Copilot.', {
    size: 12, align: 'left', color: C.muted, h: 18,
  }));

  save('01-commandes-natives', e);
}

/* ============================================================
   02 — CONTEXTE & MÉMOIRE
   ============================================================ */
{
  const e = [];
  e.push(...titleBlock('02',
    '02 — Contexte & mémoire : il n\'a pas oublié, il ne les a jamais sues',
    'Une mémoire versionnée, relue à chaque session, par toute l\'équipe.', 960));

  e.push(...card('02-s1', 40, 110, 250, 70, C.blue, 'SESSION 1', 'lundi 9 h', { titleSize: 14 }));
  e.push(...card('02-s2', 330, 110, 250, 70, C.blue, 'SESSION 2', 'mardi 14 h', { titleSize: 14 }));
  e.push(...card('02-s3', 620, 110, 250, 70, C.blue, 'SESSION 3', 'nouvelle recrue', { titleSize: 14 }));

  e.push(arrow(165, 180, 300, 245));
  e.push(arrow(455, 180, 455, 245));
  e.push(arrow(745, 180, 610, 245));

  e.push(...card('02-m1', 130, 245, 620, 70, C.purple, '1 · INSTRUCTIONS ORGANISATION',
    'règles globales · sécurité · RGPD · stack', { titleSize: 14, lineSize: 12 }));
  e.push(...card('02-m2', 130, 330, 620, 70, C.orange, '2 · DÉPÔT — .github/copilot-instructions.md',
    'conventions · build · branches · tests', { titleSize: 14, lineSize: 12 }));
  e.push(...card('02-m3', 130, 415, 620, 70, C.green, '3 · DÉPÔT — COPILOT.md',
    'contexte métier · décisions d\'architecture', { titleSize: 14, lineSize: 12 }));

  e.push(...section('02', 40, 512, 400, 'LE RÉSULTAT'));

  e.push(...card('02-bad', 40, 538, 440, 110, C.red, 'SANS FICHIER',
    'chaque session repart de zéro :\nlocalhost en dur · logs PII · branche feature/…'));
  e.push(...card('02-good', 520, 538, 440, 110, C.green, 'AVEC FICHIER',
    'les mêmes conventions pour tous :\nservice discovery · logs sûrs · feat/…'));

  e.push(text(40, 676, 920, 'Une seule source de vérité : le fichier versionné — pas la mémoire individuelle.', {
    size: 13, align: 'left', color: C.navy, h: 20,
  }));

  save('02-contexte-memoire', e);
}

/* ============================================================
   03 — COMMANDES PERSONNALISÉES
   ============================================================ */
{
  const e = [];
  e.push(...titleBlock('03',
    '03 — Commandes personnalisées : écrire une fois, rejouer tous les jours',
    'Un prompt enregistré, versionné et partagé — plus de revue retapée à la main.', 960));

  e.push(...card('03-a', 40, 110, 210, 110, C.red, '😩 PROMPT RÉPÉTÉ',
    '« révise mon code »\nchaque matin'));
  e.push(...card('03-b', 290, 110, 240, 110, C.blue, '📝 COMMANDE VERSIONNÉE',
    '.github/copilot-instructions.md\nou instructions de chat', { lineSize: 12 }));
  e.push(...card('03-c', 570, 110, 190, 110, C.orange, '⚡ DÉCLENCHEUR',
    '@fichier · #note\n/commande'));
  e.push(...card('03-d', 800, 110, 180, 110, C.green, '✅ REVUE HOMOGÈNE',
    'même checklist\npour tous'));
  e.push(arrow(250, 165, 290, 165));
  e.push(arrow(530, 165, 570, 165));
  e.push(arrow(760, 165, 800, 165));

  e.push(...section('03', 40, 252, 500, 'ANATOMIE D\'UNE BONNE COMMANDE'));

  e.push(...card('03-k1', 40, 278, 215, 110, C.purple, '1 · RÔLE', 'réviseur senior'));
  e.push(...card('03-k2', 270, 278, 215, 110, C.blue, '2 · CONTEXTE', 'dépôt · conventions\nstack', { lineSize: 12 }));
  e.push(...card('03-k3', 500, 278, 215, 110, C.orange, '3 · CHECKLIST', 'RGPD · secrets\nbuild · tests', { lineSize: 12 }));
  e.push(...card('03-k4', 730, 278, 215, 110, C.green, '4 · SORTIE', 'corrections\n+ verdict GO/NO-GO', { lineSize: 12 }));

  e.push(rect(40, 428, 570, 150, C.white, { prefix: '03-ex' }));
  e.push(text(58, 440, 534, 'EXEMPLE — COMMANDE « REVUE DE PR »', { size: 14, color: C.slate, align: 'left', h: 20 }));
  e.push(text(58, 468, 534,
    'Rôle : réviseur senior — dépôt E-Commerce.\nChecklist : pas de PII dans les logs · pas de secret en dur ·\nbuild via ECommerce.slnx · branche feat/* · test par endpoint.\nSortie : corrections requises, puis verdict GO / NO-GO.', {
    size: 12, align: 'left', color: C.navy, h: 96,
  }));

  e.push(...card('03-gain', 640, 428, 330, 150, C.green, 'GAIN',
    'zéro saisie répétée\nrevue identique partout\nonboarding accéléré'));

  e.push(text(40, 610, 930, 'Une commande = un prompt enregistré, versionné, réutilisable par toute l\'équipe.', {
    size: 13, align: 'left', color: C.navy, h: 20,
  }));

  save('03-commandes-personnalisees', e);
}

/* ============================================================
   04 — HOOKS
   ============================================================ */
{
  const e = [];
  e.push(...titleBlock('04',
    '04 — Hooks : le garde-fou qui dit non avant le commit',
    'Un contrôle déterministe s\'exécute à ta place — même quand le prompt est oublié.', 980));

  e.push(...card('04-add', 40, 128, 150, 70, C.gray, 'git add', '', { titleSize: 14 }));
  e.push(...card('04-commit', 235, 128, 165, 70, C.gray, 'git commit', '', { titleSize: 14 }));
  e.push(...card('04-hook', 445, 112, 220, 100, C.purple, 'HOOK pre-commit', 'scan des secrets', { titleSize: 14 }));
  e.push(arrow(190, 163, 235, 163));
  e.push(arrow(400, 163, 445, 163));

  e.push(...card('04-pass', 720, 92, 280, 55, C.green, '✅  AUCUN SECRET → commit', '', { titleSize: 13 }));
  e.push(...card('04-fail', 720, 182, 280, 55, C.red, '⛔  SECRET DÉTECTÉ → bloqué', '', { titleSize: 13 }));
  e.push(arrow(665, 145, 720, 120));
  e.push(arrow(665, 180, 720, 208));

  e.push(...card('04-scan', 445, 250, 220, 130, C.gray, 'CE QU\'IL CHERCHE',
    'clés API · tokens\nmots de passe · .env\ncertificats · private keys', { lineSize: 12 }));
  e.push(arrow(555, 212, 555, 250, { dashed: true, color: C.purple.stroke }));

  e.push(...section('04', 40, 418, 500, 'REMÉDIATION'));

  e.push(...card('04-r1', 40, 444, 200, 80, C.red, '1 · commit bloqué', '', { titleSize: 13 }));
  e.push(...card('04-r2', 285, 444, 240, 80, C.orange, '2 · retirer le secret', '', { titleSize: 13 }));
  e.push(...card('04-r3', 570, 444, 260, 80, C.blue, '3 · variable d\'env', 'ou coffre-fort', { titleSize: 13 }));
  e.push(...card('04-r4', 875, 444, 125, 80, C.green, '4 · nouveau', 'commit', { titleSize: 13 }));
  e.push(arrow(240, 484, 285, 484));
  e.push(arrow(525, 484, 570, 484));
  e.push(arrow(830, 484, 875, 484));

  e.push(rect(40, 572, 960, 100, C.red, { prefix: '04-limit' }));
  e.push(text(60, 582, 920, 'LIMITE — le hook sait dire NON, pas faire la procédure.', { size: 14, color: C.red, h: 20 }));
  e.push(text(60, 608, 920, 'La remédiation guidée (rotation, coffre, mise à jour de la documentation) est le rôle des skills — module 05.', { size: 12, align: 'left', h: 34 }));

  e.push(text(40, 706, 960, 'Un hook = une politique exécutable, pas une bonne intention dans un prompt.', {
    size: 13, align: 'left', color: C.navy, h: 20,
  }));

  save('04-hooks', e);
}

/* ============================================================
   05 — SKILLS
   ============================================================ */
{
  const e = [];
  e.push(...titleBlock('05',
    '05 — Skills : le savoir-faire qui répare, pas seulement qui interdit',
    'Le hook refuse ; la skill exécute la procédure pas à pas.', 980));

  e.push(...card('05-hook', 40, 110, 450, 130, C.red, 'HOOK',
    'répond NON\nbloque une action\npolitique de sécurité'));
  e.push(...card('05-skill', 510, 110, 450, 130, C.green, 'SKILL',
    'répond COMMENT\nexécute une procédure\nsavoir-faire métier'));

  e.push(...section('05', 40, 272, 500, 'CYCLE D\'UNE SKILL'));

  e.push(...card('05-s1', 40, 298, 170, 90, C.purple, '1 · DÉCLENCHEUR', 'commande\nou contexte', { titleSize: 12, lineSize: 12 }));
  e.push(...card('05-s2', 230, 298, 170, 90, C.blue, '2 · PRÉCONDITIONS', 'branche, droits\ntests', { titleSize: 12, lineSize: 12 }));
  e.push(...card('05-s3', 420, 298, 170, 90, C.orange, '3 · ÉTAPES', 'procédure\nguidée', { titleSize: 12, lineSize: 12 }));
  e.push(...card('05-s4', 610, 298, 170, 90, C.amber, '4 · VALIDATION', 'résultat\nvérifié', { titleSize: 12, lineSize: 12 }));
  e.push(...card('05-s5', 800, 298, 170, 90, C.green, '5 · SORTIE', 'PR, correctif\nrapport', { titleSize: 12, lineSize: 12 }));
  e.push(arrow(210, 343, 230, 343));
  e.push(arrow(400, 343, 420, 343));
  e.push(arrow(590, 343, 610, 343));
  e.push(arrow(780, 343, 800, 343));

  e.push(...card('05-ex', 40, 438, 600, 150, C.blue, 'EXEMPLE — « CRÉER UNE PR DE REVUE »',
    '1. vérifier la branche feat/*\n2. lancer les tests\n3. remplir le template de PR\n4. assigner les reviewers\n5. ouvrir la PR et notifier', { titleSize: 13, lineSize: 12, lineAlign: 'left' }));
  e.push(...card('05-comp', 670, 438, 290, 150, C.green, 'COMPLÉMENTARITÉ',
    'Hook : refuse le commit\navec un secret.\nSkill : guide la rotation\ndu secret et la mise à\njour du coffre.', { titleSize: 13, lineSize: 12 }));

  e.push(rect(40, 618, 920, 52, C.yellow, { prefix: '05-note' }));
  e.push(text(58, 632, 884, 'Une skill s\'exécute toujours dans le cadre de la boîte de permission.', {
    size: 12, align: 'left', h: 20,
  }));

  e.push(text(40, 692, 920, 'Le hook protège ; la skill rend capable.', {
    size: 13, align: 'left', color: C.navy, h: 20,
  }));

  save('05-skills', e);
}

/* ============================================================
   06 — PLUGINS
   ============================================================ */
{
  const e = [];
  e.push(...titleBlock('06',
    '06 — Plugins : capitaliser au lieu de réinventer',
    '12 collègues, 8 dépôts — une seule bibliothèque de briques partagées.', 980));

  // Panneau AVANT
  e.push(rect(40, 110, 440, 250, C.red, { prefix: '06-before' }));
  e.push(text(58, 122, 404, 'AVANT — CHACUN RECRÉE', { size: 15, color: C.red, align: 'left', h: 20 }));
  e.push(...chip('06-ca', 58, 160, 120, 55, C.white, 'Collègue A', { color: C.slate, size: 12 }));
  e.push(...chip('06-cb', 188, 160, 120, 55, C.white, 'Collègue B', { color: C.slate, size: 12 }));
  e.push(...chip('06-cc', 318, 160, 120, 55, C.white, 'Collègue C', { color: C.slate, size: 12 }));
  e.push(text(58, 232, 404, 'chacun recrée : prompts · hooks · skills · instructions', {
    size: 12, align: 'left', h: 18,
  }));
  e.push(...chip('06-r1', 58, 264, 85, 36, C.white, 'repo 1', { color: C.slate, size: 11 }));
  e.push(...chip('06-r2', 153, 264, 85, 36, C.white, 'repo 2', { color: C.slate, size: 11 }));
  e.push(...chip('06-r3', 248, 264, 85, 36, C.white, 'repo 3', { color: C.slate, size: 11 }));
  e.push(...chip('06-r4', 343, 264, 85, 36, C.white, '+ 5 autres', { color: C.slate, size: 11 }));
  e.push(text(58, 312, 404, '12 collègues × 8 dépôts = duplication et dérive des pratiques', {
    size: 11, align: 'left', color: C.red, h: 16,
  }));

  // Panneau APRÈS
  e.push(rect(520, 110, 440, 250, C.green, { prefix: '06-after' }));
  e.push(text(538, 122, 404, 'APRÈS — UN PLUGIN PARTAGÉ', { size: 15, color: C.green, align: 'left', h: 20 }));
  e.push(...card('06-hub', 640, 155, 200, 70, C.purple, 'PLUGIN D\'ÉQUIPE', 'v1.4.0 — versionné', { titleSize: 12, lineSize: 11 }));
  e.push(...chip('06-p1', 538, 248, 125, 40, C.white, 'commandes', { color: C.purple, size: 11 }));
  e.push(...chip('06-p2', 673, 248, 125, 40, C.white, 'skills', { color: C.purple, size: 11 }));
  e.push(...chip('06-p3', 808, 248, 125, 40, C.white, 'hooks', { color: C.purple, size: 11 }));
  e.push(...chip('06-p4', 538, 298, 125, 40, C.white, 'instructions', { color: C.purple, size: 11 }));
  e.push(...chip('06-p5', 673, 298, 125, 40, C.white, 'versionné', { color: C.purple, size: 11 }));
  e.push(...chip('06-p6', 808, 298, 125, 40, C.white, 'testé', { color: C.purple, size: 11 }));

  e.push(...section('06', 40, 392, 400, 'DIFFUSION'));

  e.push(...card('06-d1', 40, 418, 190, 80, C.blue, 'MAINTAINER', 'met à jour', { titleSize: 13 }));
  e.push(...card('06-d2', 275, 418, 210, 80, C.purple, 'DÉPÔT PLUGIN', 'versionné, testé', { titleSize: 13 }));
  e.push(...card('06-d3', 530, 418, 200, 80, C.orange, 'INSTALLATION', 'une fois', { titleSize: 13 }));
  e.push(...card('06-d4', 775, 418, 225, 80, C.green, '8 DÉPÔTS', 'alignés', { titleSize: 13 }));
  e.push(arrow(230, 458, 275, 458));
  e.push(arrow(485, 458, 530, 458));
  e.push(arrow(730, 458, 775, 458));

  e.push(...card('06-g1', 40, 548, 290, 80, C.green, '1 INSTALLATION', 'pour toute l\'équipe', { titleSize: 13 }));
  e.push(...card('06-g2', 350, 548, 290, 80, C.blue, '0 DUPLICATION', 'une seule source', { titleSize: 13 }));
  e.push(...card('06-g3', 660, 548, 290, 80, C.purple, 'N ÉQUIPES', 'mêmes règles', { titleSize: 13 }));

  e.push(text(40, 664, 910, 'Un plugin évite que chacun réinvente la roue sur ses 8 dépôts.', {
    size: 13, align: 'left', color: C.navy, h: 20,
  }));

  save('06-plugins', e);
}

/* ============================================================
   07 — SOUS-AGENTS
   ============================================================ */
{
  const e = [];
  e.push(...titleBlock('07',
    '07 — Sous-agents : déléguer sans saturer, vérifier sans complaisance',
    'Chaque sous-agent travaille dans son contexte isolé et rend un verdict indépendant.', 1000));

  e.push(...card('07-main', 40, 110, 250, 100, C.red, 'SESSION PRINCIPALE', 'saturée par la revue', { titleSize: 14 }));
  e.push(...card('07-orch', 345, 110, 230, 100, C.purple, 'ORCHESTRATEUR', 'décompose et délègue', { titleSize: 14 }));
  e.push(arrow(290, 160, 345, 160));

  e.push(...card('07-a', 40, 285, 210, 130, C.green, 'SOUS-AGENT A', 'revue fonctionnelle\ncontexte isolé'));
  e.push(...card('07-b', 280, 285, 210, 130, C.green, 'SOUS-AGENT B', 'revue sécurité\ncontexte isolé'));
  e.push(...card('07-c', 520, 285, 210, 130, C.green, 'SOUS-AGENT C', 'revue performance\ncontexte isolé'));
  e.push(...card('07-d', 760, 285, 210, 130, C.green, 'SOUS-AGENT D', 'revue tests\ncontexte isolé'));

  e.push(arrow(430, 210, 145, 285));
  e.push(arrow(450, 210, 385, 285));
  e.push(arrow(470, 210, 625, 285));
  e.push(arrow(490, 210, 865, 285));

  e.push(...card('07-syn', 350, 490, 400, 90, C.blue, 'SYNTHÈSE', 'verdicts croisés + justification obligatoire', { titleSize: 14 }));
  e.push(...card('07-dec', 790, 490, 240, 90, C.green, 'DÉCISION FINALE', 'GO / NO-GO documenté', { titleSize: 14 }));
  e.push(arrow(145, 415, 380, 490));
  e.push(arrow(385, 415, 430, 490));
  e.push(arrow(625, 415, 660, 490));
  e.push(arrow(865, 415, 720, 490));
  e.push(arrow(750, 535, 790, 535));

  e.push(...card('07-bad', 40, 630, 470, 90, C.red, 'SANS SOUS-AGENTS',
    'session saturée → validation complaisante', { titleSize: 14 }));
  e.push(...card('07-good', 560, 630, 470, 90, C.green, 'AVEC SOUS-AGENTS',
    'contextes isolés → avis contradictoires', { titleSize: 14 }));

  e.push(text(40, 748, 990, 'Déléguer la revue évite la saturation et la complaisance.', {
    size: 13, align: 'left', color: C.navy, h: 20,
  }));

  save('07-sous-agents', e);
}

/* ============================================================
   08 — MCP
   ============================================================ */
{
  const e = [];
  e.push(...titleBlock('08',
    '08 — MCP : ouvrir les yeux de Copilot sur ton système',
    'Le Model Context Protocol connecte l\'agent à la base, au navigateur et aux traces.', 960));

  e.push(...card('08-cop', 40, 110, 220, 100, C.blue, 'COPILOT (AGENT)', 'pose la question', { titleSize: 14 }));
  e.push(...card('08-cli', 305, 110, 220, 100, C.purple, 'CLIENT MCP', 'négocie les outils', { titleSize: 14 }));
  e.push(...card('08-srv', 570, 110, 220, 100, C.orange, 'SERVEURS MCP', 'exposent des ressources', { titleSize: 14 }));
  e.push(arrow(260, 160, 305, 160));
  e.push(arrow(525, 160, 570, 160));

  e.push(...card('08-db', 40, 270, 210, 110, C.gray, '🗄 BASE DE DONNÉES', 'schéma · requêtes\nlecture', { titleSize: 12, lineAlign: 'left' }));
  e.push(...card('08-web', 280, 270, 210, 110, C.gray, '🌐 NAVIGATEUR', 'rendu · parcours\nsmoke tests', { titleSize: 12, lineAlign: 'left' }));
  e.push(...card('08-log', 520, 270, 210, 110, C.gray, '📈 TRACES / LOGS', 'erreurs · latences\ncorrélations', { titleSize: 12, lineAlign: 'left' }));
  e.push(...card('08-fs', 760, 270, 210, 110, C.gray, '📁 FICHIERS / DOCS', 'référentiels\nrunbooks', { titleSize: 12, lineAlign: 'left' }));

  e.push(arrow(680, 210, 145, 270, { dashed: true }));
  e.push(arrow(680, 210, 385, 270, { dashed: true }));
  e.push(arrow(680, 210, 625, 270, { dashed: true }));
  e.push(arrow(680, 210, 865, 270, { dashed: true }));

  e.push(...card('08-before', 40, 440, 450, 90, C.red, 'SANS MCP',
    'il ne voit ni la base,\nni le navigateur, ni les traces.'));
  e.push(...card('08-after', 510, 440, 450, 90, C.green, 'AVEC MCP',
    'il interroge, corrèle et explique\navec des faits.'));

  e.push(rect(40, 572, 920, 70, C.yellow, { prefix: '08-note' }));
  e.push(text(58, 584, 884, 'MOINDRE PRIVILÈGE', { size: 13, color: C.amber, align: 'left', h: 18 }));
  e.push(text(58, 606, 884, 'lecture seule quand c\'est possible · serveurs scopés · chaque appel reste soumis à la boîte de permission.', { size: 12, align: 'left', h: 20 }));

  e.push(text(40, 668, 920, 'MCP étend la vue de Copilot ; il n\'étend pas ses droits.', {
    size: 13, align: 'left', color: C.navy, h: 20,
  }));

  save('08-mcp', e);
}

/* ============================================================
   09 — FIL CONDUCTEUR (synthèse)
   ============================================================ */
{
  const e = [];
  e.push(...titleBlock('09',
    'Fil conducteur — les 9 briques GitHub Copilot',
    'Du prompt jeté au toolkit d\'équipe versionné : chaque brique lève une limite concrète.', 920));

  const seq = [
    { x: 60,  y: 150, c: C.blue,   t: '00 · PRISE EN MAIN',      l: 'voit · que voit-il ?\nque fait-il sans demander ?' },
    { x: 360, y: 150, c: C.purple, t: '01 · COMMANDES NATIVES',  l: 'cadre · arrêter, annuler\nvoir ce qu\'il a en tête' },
    { x: 660, y: 150, c: C.teal,   t: '02 · CONTEXTE & MÉMOIRE', l: 'souviens-toi · conventions\nà chaque session' },
    { x: 660, y: 330, c: C.orange, t: '03 · COMMANDES PERSO',    l: 'rejoue · le même prompt\nde revue chaque jour' },
    { x: 360, y: 330, c: C.red,    t: '04 · HOOKS',              l: 'impose · interdire un\ncommit avec secret' },
    { x: 60,  y: 330, c: C.green,  t: '05 · SKILLS',             l: 'sais-faire · exécuter une\nprocédure, pas seulement refuser' },
    { x: 60,  y: 510, c: C.amber,  t: '06 · PLUGINS',            l: 'partage · 12 collègues,\n8 dépôts' },
    { x: 360, y: 510, c: C.purple, t: '07 · SOUS-AGENTS',        l: 'délègue · revue sans saturer\nla session' },
    { x: 660, y: 510, c: C.blue,   t: '08 · MCP',                l: 'vois · base, navigateur,\ntraces' },
  ];
  seq.forEach((s, i) => {
    e.push(...card('09-c' + i, s.x, s.y, 240, 110, s.c, s.t, s.l, { titleSize: 12, lineSize: 11 }));
  });

  e.push(arrow(300, 205, 360, 205));
  e.push(arrow(600, 205, 660, 205));
  e.push(arrow(780, 260, 780, 330, { dashed: true }));
  e.push(arrow(660, 385, 600, 385));
  e.push(arrow(360, 385, 300, 385));
  e.push(arrow(180, 440, 180, 510, { dashed: true }));
  e.push(arrow(300, 565, 360, 565));
  e.push(arrow(600, 565, 660, 565));

  e.push(text(60, 655, 900, 'Chaque brique lève une limite ; aucune ne remplace la boîte de permission.', {
    size: 13, align: 'left', color: C.navy, h: 20,
  }));

  save('09-fil-conducteur', e);
}

console.log('\nTous les diagrammes ont été générés.');
