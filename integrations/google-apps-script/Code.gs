/**
 * Google Apps Script web app that appends leads from /api/lead to a Sheet.
 * Setup: see README.md in this folder.
 */
const SHEET_NAME = 'Leads';
// Must match SHEETS_WEBHOOK_SECRET in your Vercel environment (leave both empty to skip the check).
const SECRET = PropertiesService.getScriptProperties().getProperty('SHEETS_WEBHOOK_SECRET') || '';

const COLUMNS = ['receivedAt', 'kind', 'name', 'company', 'phone', 'email', 'city', 'industry', 'budgetBand', 'message', 'context', 'utm_source', 'utm_medium', 'utm_campaign', 'landing', 'referrer'];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (SECRET && body.secret !== SECRET) return json({ ok: false, error: 'unauthorised' });
    const lead = body.lead || {};
    const attr = lead.attribution || {};
    const sheet = getSheet();
    const row = COLUMNS.map((c) => {
      if (c in attr) return attr[c];
      const v = lead[c];
      return typeof v === 'object' && v !== null ? JSON.stringify(v) : v || '';
    });
    sheet.appendRow(row);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
