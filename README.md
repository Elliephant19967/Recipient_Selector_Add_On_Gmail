# ![Recipient Selector Logo](https://raw.githubusercontent.com/Elliephant19967/Recipient_Selector_Add_On_Gmail/fcdb8d594a26a35703dde30e8e368a5efcef5632/Add_On_Logo_24px.jpg) Recipient Selector Gmail Add-on

## Overview

**Recipient Selector** is a Gmail add-on that helps you quickly view and select email recipients (To, Cc, Bcc) from an opened message and easily compose emails or create calendar events with those recipients. The add-on provides a simple, intuitive interface within Gmail to streamline your workflow.

---

## Features

- Displays all recipients (To, Cc, Bcc) from the currently opened email.
- Allows selecting **multiple recipients** in each group via checkboxes.
- Deduplicates selected recipients automatically.
- Quickly compose a new email prefilled with the selected recipients.
- Create a Google Calendar event invitation including selected recipients.
- Confirmation prompt when no recipients are selected before composing or creating an event.
- Clean, modern interface with inline logo and clear labels.

---

## Privacy Policy

**Recipient Selector** only accesses the recipients and subject line of emails you open in Gmail. It does **not store, transmit, or use any of your email or calendar data beyond what is necessary to build recipient lists and prefill compose or event creation windows.**

- Access scopes used:  
  - `https://www.googleapis.com/auth/gmail.readonly` — read recipients and subject of opened messages.  
  - `https://www.googleapis.com/auth/calendar.events` — create calendar event links.  
  - `https://www.googleapis.com/auth/gmail.addons.execute` — execute add-on actions in Gmail context.  
  - `https://www.googleapis.com/auth/script.external_request` — load logo image and open Gmail/Calendar URLs.

Your data remains secure and private; no information is saved or shared outside your Gmail and Calendar sessions.

---

## Terms of Use

By using this add-on, you agree that:

- The add-on is provided **as-is** without warranty of any kind.
- The developer is not responsible for any data loss or unintended behavior.
- You must use the add-on in compliance with Google Workspace policies.
- This add-on does not have access to send emails or modify calendar events directly; it only pre-fills links for you to manually confirm and send.

---

## Installation

Recipient Selector is published as an **unlisted public add-on** on the Google Workspace Marketplace.

### To install:

1. Visit the [Recipient Selector add-on page](https://workspace.google.com/marketplace/app/recipient_selector/your_addon_id) (replace with your actual Marketplace URL).
2. Click **Install** and grant the required permissions.
3. Once installed, the add-on will appear in the right-hand Gmail sidebar when you open an email.

---

## Usage Instructions

1. **Open an email in Gmail.**  
   The Recipient Selector add-on icon will appear in the right sidebar.

2. **Click the add-on icon.**  
   The sidebar will open and list all recipients from the email (To, Cc, Bcc).

3. **Select recipients to include.**  
   Use the checkboxes to select or deselect one or more recipients from each group.

4. **Choose an action:**  
   - **Compose Email**: Opens a new Gmail compose window prefilled with the selected recipients.  
   - **Create Event**: Opens Google Calendar’s event creation page with selected recipients added as guests.

5. **If no recipients are selected,** a prompt will ask if you want to proceed without recipients or go back.

---

## Development

This project is built with Google Apps Script and uses the Gmail Add-on CardService UI.

### Repository Structure

- `Code.gs` — main Apps Script code.
- `appsscript.json` — manifest file with add-on configuration.
- `README.md` — this file.
- `Add_On_Logo_24px.jpg` — add-on logo (24x24 px, JPG format).
- `Add_On_Logo_120px.jpg` — add-on marketplace logo (120x120 px, JPG format).

---

## Support & Contact

For questions or issues, please open an issue in this repository or contact **[Your Name/Email]**.

---

## License

[MIT License](LICENSE)

---

*Last updated: 2025-08-01*
