# Leads to Google Sheets

1. Create a Google Sheet. Open **Extensions → Apps Script**.
2. Replace the default code with `Code.gs` from this folder. Save.
3. Optional but recommended: **Project Settings → Script properties → Add** `SHEETS_WEBHOOK_SECRET` with a long random value.
4. **Deploy → New deployment → Web app**. Execute as: *Me*. Who has access: *Anyone*. Deploy and copy the web app URL.
5. In Vercel (Project → Settings → Environment Variables) set:
   - `SHEETS_WEBHOOK_URL` = the web app URL
   - `SHEETS_WEBHOOK_SECRET` = the same secret as step 3
6. Redeploy. Submit the planner's "Get a detailed plan" form and check the **Leads** tab.

The API posts `{ secret, lead }`. `lead` includes the form fields, planner state (`context`), UTM attribution, referrer and user agent.
