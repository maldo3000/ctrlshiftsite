const SHEET_NAME = 'Volunteer responses';

const HEADERS = [
  'Submitted at',
  'Full name',
  'Email',
  'WhatsApp number',
  'City',
  'Interests',
  'Availability',
  'Anything else',
  'Contact consent',
  'Source'
];

function doPost(event) {
  const lock = LockService.getDocumentLock();

  try {
    lock.waitLock(10000);

    const data = JSON.parse(event.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setFontWeight('bold')
        .setBackground('#7c3aed')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(data.submittedAt || Date.now()),
      safeCell(data.fullName),
      safeCell(data.email),
      safeCell(data.whatsapp),
      safeCell(data.city),
      safeCell(Array.isArray(data.interests) ? data.interests.join(', ') : ''),
      safeCell(data.availability),
      safeCell(data.anythingElse),
      data.consent === true ? 'Yes' : 'No',
      safeCell(data.source)
    ]);

    const notificationEmail = PropertiesService.getScriptProperties().getProperty('NOTIFICATION_EMAIL');
    if (notificationEmail) {
      try {
        MailApp.sendEmail({
          to: notificationEmail,
          subject: 'New CTRL+SHIFT volunteer: ' + safeText(data.fullName),
          body: [
            'A new volunteer form was submitted.',
            '',
            'Name: ' + safeText(data.fullName),
            'Email: ' + safeText(data.email),
            'WhatsApp: ' + safeText(data.whatsapp),
            'City: ' + safeText(data.city),
            'Interests: ' + (Array.isArray(data.interests) ? data.interests.join(', ') : ''),
            'Availability: ' + safeText(data.availability),
            'Anything else: ' + safeText(data.anythingElse),
            '',
            'Open the spreadsheet to review the response.'
          ].join('\n')
        });
      } catch (notificationError) {
        // The spreadsheet row is the source of truth. A notification failure
        // should not tell the volunteer that their saved response was lost.
        console.error(notificationError);
      }
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: 'Could not save the response.' });
  } finally {
    lock.releaseLock();
  }
}

function safeText(value) {
  return value == null ? '' : String(value).trim();
}

function safeCell(value) {
  const valueAsText = safeText(value);
  return /^[=+\-@]/.test(valueAsText) ? "'" + valueAsText : valueAsText;
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
