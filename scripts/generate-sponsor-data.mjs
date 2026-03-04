import fs from 'node:fs';
import path from 'node:path';
import { parse as parseCsv } from 'csv-parse/sync';
import xlsx from 'xlsx';

const ROOT = process.cwd();
const VOL9_DIR = path.join(ROOT, 'public', 'sponsors', 'vol-9');
const CSV_PATH = path.join(VOL9_DIR, 'guests.csv');
const XLSX_PATH = path.join(VOL9_DIR, 'budget.xlsx');
const PDF_PATH = path.join(VOL9_DIR, 'agenda.pdf');
const OUTPUT_PATH = path.join(VOL9_DIR, 'report-data.json');
const FALLBACK_BUDGET_PATH = path.join(ROOT, 'src', 'data', 'sponsors', 'vol9-budget-fallback.json');

const ROLE_COLUMN = 'Which best describes your current role?';
const TOOLS_COLUMN = 'Which tools are you using most lately? (AI or not)';
const INTEREST_COLUMN = "Select three that you're most interested in:";
const HOT_TAKE_COLUMN = 'What’s your hottest take or question about AI tools or generative media right now?';
const WORKING_ON_COLUMN = 'Working on anything you want to share?';

const KNOWN_TOOL_PATTERNS = [
  [/claude code/gi, 'Claude Code'],
  [/(^|\W)claude(\.ai)?(\W|$)/gi, 'Claude'],
  [/chat\s?gpt/gi, 'ChatGPT'],
  [/gemini/gi, 'Gemini'],
  [/cursor/gi, 'Cursor'],
  [/codex/gi, 'Codex'],
  [/comfy\s?ui/gi, 'ComfyUI'],
  [/touch\s?designer/gi, 'TouchDesigner'],
  [/blender/gi, 'Blender'],
  [/unreal\s?engine/gi, 'Unreal Engine'],
  [/midjourney/gi, 'Midjourney'],
  [/houdini/gi, 'Houdini'],
  [/runway/gi, 'Runway'],
  [/notion/gi, 'Notion'],
  [/figma/gi, 'Figma'],
  [/three\.?js/gi, 'Three.js'],
  [/(^|\W)p5(\W|$)/gi, 'P5'],
  [/python/gi, 'Python'],
  [/fal\s?ai/gi, 'Fal AI'],
  [/google\s?flow/gi, 'Google Flow'],
  [/obsidian/gi, 'Obsidian'],
  [/descript/gi, 'Descript'],
  [/excalidraw/gi, 'Excalidraw'],
  [/capcut/gi, 'CapCut'],
  [/reaper/gi, 'Reaper'],
  [/davinci/gi, 'DaVinci Resolve'],
  [/kling/gi, 'Kling'],
  [/seedance/gi, 'Seedance'],
  [/openclaw/gi, 'OpenClaw'],
  [/loraverse/gi, 'Loraverse'],
  [/kimi/gi, 'Kimi']
];

const CRM_LINK_OVERRIDES = {
  'noah van hart': 'https://noahvanhart.com/'
};

function nameKey(value) {
  return asText(value).toLowerCase().replace(/\s+/g, ' ');
}

function safeRead(pathname) {
  if (!fs.existsSync(pathname)) {
    throw new Error(`Missing required file: ${pathname}`);
  }
  return fs.readFileSync(pathname, 'utf8');
}

function asText(value) {
  return String(value ?? '').replace(/\uFEFF/g, '').trim();
}

function asNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  const cleaned = asText(value).replace(/[^0-9.-]/g, '');
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function round2(value) {
  return Number.parseFloat(value.toFixed(2));
}

function splitCommaValues(value) {
  return asText(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(values) {
  return [...new Set(values)];
}

function toTitleCase(value) {
  return value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function sanitizeText(value) {
  return asText(value)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted]')
    .replace(/\+?\d[\d\s().-]{8,}\d/g, '[redacted]')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanUrlCandidate(value) {
  return value
    .trim()
    .replace(/[),.;!?]+$/g, '')
    .replace(/^[<(]+/g, '');
}

function normalizeUrl(value) {
  if (!value) return null;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const parsed = new URL(withProtocol);
    if (!parsed.hostname || parsed.hostname.includes('@')) {
      return null;
    }
    if (parsed.hostname !== 'localhost' && !parsed.hostname.includes('.')) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function extractUrls(value) {
  const input = asText(value);
  if (!input) {
    return [];
  }

  const directLinks = input.match(/https?:\/\/[^\s<>"')\]]+|www\.[^\s<>"')\]]+/gi) ?? [];
  const bareDomains = input.match(/\b(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<>"')\]]*)?/gi) ?? [];

  const normalized = unique([...directLinks, ...bareDomains])
    .map(cleanUrlCandidate)
    .map(normalizeUrl)
    .filter(Boolean);

  return unique(normalized);
}

function linkLabelFromUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./i, '');
  } catch {
    return 'Open link';
  }
}

function extractTools(value) {
  const input = asText(value);
  if (!input) {
    return [];
  }

  const found = [];
  for (const [pattern, label] of KNOWN_TOOL_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(input)) {
      found.push(label);
    }
  }

  if (found.length > 0) {
    return unique(found);
  }

  const fallback = input
    .split(/[,;/|]|\band\b/gi)
    .map((token) => token.replace(/^[-.\s]+|[-.\s]+$/g, '').trim())
    .filter((token) => token && token.length <= 24 && token.split(' ').length <= 4)
    .map(toTitleCase)
    .filter((token) => token && token !== 'Ai' && token !== 'Tools');

  return unique(fallback);
}

function buildDistribution(rows, extractor, limit = 12) {
  const counts = new Map();

  for (const row of rows) {
    for (const value of extractor(row)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, value]) => ({ name, value }));
}

function parseAudienceData() {
  const rawCsv = safeRead(CSV_PATH);
  const rows = parseCsv(rawCsv, {
    columns: true,
    skip_empty_lines: true,
    bom: true
  });

  const deduped = [...new Map(rows.map((row) => [asText(row.api_id) || `${asText(row.name)}-${asText(row.created_at)}`, row])).values()];

  const attendees = deduped.map((row, index) => {
    const roles = splitCommaValues(row[ROLE_COLUMN]);
    const interests = splitCommaValues(row[INTEREST_COLUMN]);
    const tools = extractTools(row[TOOLS_COLUMN]);

    return {
      id: asText(row.api_id) || `attendee-${index + 1}`,
      name: asText(row.name) || 'Unknown attendee',
      approvalStatus: asText(row.approval_status) || 'pending',
      checkedIn: Boolean(asText(row.checked_in_at)),
      role: roles.join(', ') || 'Unspecified',
      roles,
      interests,
      tools,
      hotTake: sanitizeText(row[HOT_TAKE_COLUMN]),
      workingOn: sanitizeText(row[WORKING_ON_COLUMN])
    };
  });

  const approvedCount = attendees.filter((attendee) => attendee.approvalStatus.toLowerCase() === 'approved').length;
  const checkedInCount = attendees.filter((attendee) => attendee.checkedIn).length;
  const showRate = approvedCount > 0 ? round2((checkedInCount / approvedCount) * 100) : 0;

  const roleDistribution = buildDistribution(attendees, (attendee) => attendee.roles, 10);
  const interestDistribution = buildDistribution(attendees, (attendee) => attendee.interests, 12);
  const toolsDistribution = buildDistribution(attendees, (attendee) => attendee.tools, 12);

  const scoredHighlights = attendees
    .map((attendee) => {
      const technicalRole = attendee.roles.some((role) => /developer|frontend|engineer|software|builder|technical/i.test(role));
      const collaborationSignal = attendee.interests.some((interest) => /tool builder|automation|interactive|touchdesigner|3d/i.test(interest));

      let score = 0;
      if (attendee.checkedIn) score += 3;
      if (technicalRole) score += 4;
      if (collaborationSignal) score += 2;
      if (attendee.tools.length > 0) score += 2;
      if (attendee.workingOn) score += 2;
      if (attendee.hotTake) score += 1;

      const topTags = unique([
        ...attendee.roles.slice(0, 2),
        ...attendee.interests.slice(0, 1),
        ...attendee.tools.slice(0, 2)
      ]).slice(0, 4);

      const whyRelevant = technicalRole
        ? 'Technical builder active in creative technology workflows'
        : 'Engaged attendee with useful collaboration signals';

      const noteSource = attendee.workingOn || attendee.hotTake || 'Strong event engagement';
      const candidateLinks = unique([...extractUrls(attendee.workingOn), ...extractUrls(attendee.hotTake)]);
      const overrideLink = CRM_LINK_OVERRIDES[nameKey(attendee.name)] ?? null;
      const primaryLink = overrideLink ?? candidateLinks[0] ?? null;

      return {
        name: attendee.name,
        role: attendee.role,
        tags: topTags,
        whyRelevant,
        note: noteSource,
        linkUrl: primaryLink,
        linkLabel: primaryLink ? linkLabelFromUrl(primaryLink) : null,
        score
      };
    })
    .filter((highlight) => highlight.score >= 7)
    .sort((a, b) => b.score - a.score);

  const dedupedByName = [];
  const seenNames = new Set();
  for (const highlight of scoredHighlights) {
    const key = highlight.name.toLowerCase();
    if (seenNames.has(key)) {
      continue;
    }
    seenNames.add(key);
    dedupedByName.push(highlight);
  }

  let selectedHighlights = dedupedByName.slice(0, 8);
  const mustIncludeNames = ['marcelo'];

  for (const mustIncludeName of mustIncludeNames) {
    const alreadyIncluded = selectedHighlights.some((highlight) =>
      highlight.name.toLowerCase().includes(mustIncludeName)
    );

    if (alreadyIncluded) {
      continue;
    }

    const candidate = dedupedByName.find((highlight) => highlight.name.toLowerCase().includes(mustIncludeName));
    if (!candidate) {
      continue;
    }

    if (selectedHighlights.length < 8) {
      selectedHighlights.push(candidate);
      continue;
    }

    selectedHighlights = [...selectedHighlights.slice(0, 7), candidate];
  }

  const crmHighlights = selectedHighlights.map(({ score, ...highlight }) => highlight);

  return {
    totalRecords: attendees.length,
    approvedCount,
    checkedInCount,
    showRate,
    roleDistribution,
    interestDistribution,
    toolsDistribution,
    attendees,
    crmHighlights
  };
}

function normalizeCategory(value) {
  const text = asText(value).replace(/\s+/g, ' ');
  if (!text) return 'Other';
  if (/^luma\s+plus/i.test(text)) return 'Luma Plus';
  return text;
}

function isSummaryRow(category) {
  return /^(subtotal|total|contingency)/i.test(category);
}

function parseBudgetData() {
  try {
    if (!fs.existsSync(XLSX_PATH)) {
      throw new Error(`Missing XLSX file at ${XLSX_PATH}`);
    }

    const workbook = xlsx.readFile(XLSX_PATH);
    const sheetName = workbook.SheetNames.find((name) => /consolidated/i.test(name)) ?? workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    let inRevenueSection = false;
    let totalRevenue = 0;
    let netPnL = null;

    const expensesByCategoryMap = new Map();
    const lineItems = [];
    const revenueLineItems = [];

    for (const row of rows.slice(1)) {
      const rawCategory = asText(row[0]);
      const rawItem = asText(row[1]);
      const rawNotes = asText(row[2]);

      if (!rawCategory && !rawItem) {
        continue;
      }

      if (/^revenue$/i.test(rawCategory)) {
        inRevenueSection = true;
        continue;
      }

      if (inRevenueSection) {
        const amount = round2(asNumber(row[1]));
        if (!amount) {
          continue;
        }

        if (/^gross\s+revenue$/i.test(rawCategory)) {
          totalRevenue = amount;
          continue;
        }

        if (/^net$/i.test(rawCategory)) {
          netPnL = amount;
          continue;
        }

        revenueLineItems.push({
          label: rawCategory,
          amount
        });
        continue;
      }

      const amount = round2(Math.abs(asNumber(row[5])));
      if (!amount) {
        continue;
      }

      const category = normalizeCategory(rawCategory || rawItem || 'Other');
      if (isSummaryRow(category)) {
        continue;
      }

      const description = [rawItem, rawNotes].filter(Boolean).join(' - ') || category;

      lineItems.push({
        id: `expense-${lineItems.length + 1}`,
        category,
        description,
        amount
      });

      expensesByCategoryMap.set(category, round2((expensesByCategoryMap.get(category) ?? 0) + amount));
    }

    if (!totalRevenue) {
      totalRevenue = round2(revenueLineItems.reduce((sum, item) => sum + item.amount, 0));
    }

    const totalExpenses = round2(lineItems.reduce((sum, item) => sum + item.amount, 0));
    const calculatedNet = round2(totalRevenue - totalExpenses);

    return {
      kpis: {
        totalRevenue,
        totalExpenses,
        netPnL: netPnL ?? calculatedNet
      },
      expensesByCategory: [...expensesByCategoryMap.entries()]
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      lineItems,
      revenueLineItems
    };
  } catch (error) {
    const fallback = JSON.parse(safeRead(FALLBACK_BUDGET_PATH));
    console.warn(`XLSX parse failed. Using fallback financial summary. Reason: ${error.message}`);
    return fallback;
  }
}

function generateReportData() {
  const audience = parseAudienceData();
  const financials = parseBudgetData();

  const output = {
    generatedAt: new Date().toISOString(),
    volume: 9,
    downloads: {
      guestsCsv: '/sponsors/vol-9/guests.csv',
      budgetXlsx: '/sponsors/vol-9/budget.xlsx',
      agendaPdf: '/sponsors/vol-9/agenda.pdf'
    },
    audience: {
      totalRecords: audience.totalRecords,
      approvedCount: audience.approvedCount,
      checkedInCount: audience.checkedInCount,
      showRate: audience.showRate,
      roleDistribution: audience.roleDistribution,
      interestDistribution: audience.interestDistribution,
      toolsDistribution: audience.toolsDistribution,
      attendees: audience.attendees
    },
    financials,
    crmHighlights: audience.crmHighlights
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Generated sponsor report data at ${OUTPUT_PATH}`);
}

if (!fs.existsSync(PDF_PATH)) {
  console.warn(`Agenda PDF is missing at ${PDF_PATH}. Download link will fail until the file is added.`);
}

generateReportData();
