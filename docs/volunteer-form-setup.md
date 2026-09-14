# Volunteer form setup

The page at `/volunteer` sends each response to a Google Sheet through a Google Apps Script web app.

## Connect a spreadsheet

1. Open the Google Sheet that should receive volunteer responses.
2. Select **Extensions → Apps Script**.
3. Replace the contents of `Code.gs` with the code from `scripts/google-apps-script/volunteer-form.gs` in this repository, then save.
4. Select **Deploy → New deployment**.
5. Choose **Web app** as the deployment type.
6. Set **Execute as** to **Me** and **Who has access** to **Anyone**.
7. Deploy, approve the requested permissions, and copy the web app URL ending in `/exec`.
8. Add that URL to the website's production environment as `VOLUNTEER_GOOGLE_SCRIPT_URL`.
9. Redeploy the website and submit one test response at `/volunteer`.

The script creates a tab named `Volunteer responses`, adds the column headers, and appends one row per submission.

## Optional email notifications

In the Apps Script editor, open **Project Settings → Script properties** and add:

- Property: `NOTIFICATION_EMAIL`
- Value: the email address that should receive a message for each submission

After changing the Apps Script code later, create a new deployment version so the live web app uses the update. The deployment URL can remain the same.
