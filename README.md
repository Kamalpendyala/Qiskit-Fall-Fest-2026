# Qiskit Fall Fest 2026 — MGIT Hyderabad

Static one-page event site built with HTML, CSS, and vanilla JavaScript.

## Run locally

Serve this directory with any static-file server, for example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Launch checklist

Replace all announcement placeholders in `index.html`, including dates, programme, speakers, partner names/logos, venue, team contacts, social links, and metadata.

Set the official form URL in `assets/js/main.js` by replacing `registrationUrl` with the approved URL. This automatically enables every registration button.

Add approved MGIT and Qiskit Fall Fest logo assets, plus a 1200×630 social-share image, before publishing.

## Google Form registration generator

Use [scripts/create_qff_registration_form.gs](scripts/create_qff_registration_form.gs) to generate the event registration form in the Google account that should own it.

1. Create a new project at [script.google.com](https://script.google.com), replace its default file with the generator, and fill every `CONFIG` value.
2. The UPI QR value must be a publicly reachable, direct image URL. The script stops before creating anything if a required value is still a placeholder.
3. Run `createQffRegistrationForm` and approve the requested Google Forms, Drive, and Sheets permissions. The execution log will contain the editor URL and linked response-sheet URL.
4. In the form editor, add a required **File upload** question titled **Payment screenshot**, restrict it to one image file, then remove the temporary “Manual editor step required” instruction. Google Apps Script does not provide an API for creating File upload questions.
5. Publish the form, preview it, submit a test response through both IEEE membership paths, then set the respondent URL as `registrationUrl` in `assets/js/main.js`.

The file-upload question requires Google sign-in. Once added, the form collects verified email addresses, required registration data, required payment reference IDs, and payment screenshots. It directs successful submissions to the configured WhatsApp invite.
