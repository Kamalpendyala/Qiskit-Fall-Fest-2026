/**
 * Qiskit Fall Fest 2026 — Google Form generator
 *
 * Run createQffRegistrationForm() from script.google.com while signed in to the
 * Google account that should own the form. Fill every CONFIG value first.
 */
const CONFIG = {
  eventName: "Qiskit Fall Fest 2026",
  hostName: "MGIT Hyderabad",
  eventDate: "TBD",
  venue: "TBD",
  organizerContact: "TBD",
  registrationFee: "TBD",
  // Must be a publicly accessible, direct image URL (PNG, JPG, or GIF).
  upiQrImageUrl: "https://example.com/replace-with-upi-qr.png",
  whatsappInviteUrl: "https://chat.whatsapp.com/REPLACE_WITH_INVITE_CODE",
};

function createQffRegistrationForm() {
  validateConfig_();

  // Keep the draft unpublished until the owner adds the File upload question
  // manually (Apps Script does not expose that Google Forms item type).
  const form = FormApp.create(`${CONFIG.eventName} — Registration`, false);
  form
    .setDescription([
      `Register for ${CONFIG.eventName}, hosted by ${CONFIG.hostName}.`,
      `Date: ${CONFIG.eventDate}`,
      `Venue: ${CONFIG.venue}`,
      "A completed form records your registration. Please enter accurate details.",
      `Questions? Contact: ${CONFIG.organizerContact}`,
    ].join("\n\n"))
    .setProgressBar(true)
    .setConfirmationMessage([
      "Thank you — your registration has been submitted.",
      "Join the Qiskit Fall Fest community for future event updates:",
      CONFIG.whatsappInviteUrl,
    ].join("\n\n"));

  // Collect the respondent's verified account email. The manually added File
  // upload item will also require the respondent to sign in to Google.
  form.setCollectEmail(true);

  form.addTextItem()
    .setTitle("Full name")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Phone number")
    .setHelpText("Enter an Indian mobile number, with or without +91.")
    .setValidation(FormApp.createTextValidation()
      .requireTextMatchesPattern("^(?:\\+91[- ]?)?[6-9]\\d{9}$")
      .setHelpText("Enter a valid 10-digit Indian mobile number.")
      .build())
    .setRequired(true);

  form.addTextItem()
    .setTitle("Organization")
    .setHelpText("College, company, or institution.")
    .setRequired(true);

  form.addListItem()
    .setTitle("Role")
    .setChoiceValues(["Student", "Faculty", "Professional", "Researcher", "Other"])
    .setRequired(true);

  form.addListItem()
    .setTitle("Proficiency level")
    .setChoiceValues(["Beginner", "Intermediate", "Advanced"])
    .setRequired(true);

  const ieeeMembership = form.addMultipleChoiceItem()
    .setTitle("Are you an IEEE member?")
    .setRequired(true);

  const ieeeSection = form.addPageBreakItem()
    .setTitle("IEEE membership")
    .setHelpText("Please provide your membership details.");

  form.addTextItem()
    .setTitle("IEEE member ID")
    .setHelpText("Enter the member ID associated with your active IEEE membership.")
    .setValidation(FormApp.createTextValidation()
      .requireTextMatchesPattern("^[0-9]{6,12}$")
      .setHelpText("Enter a 6 to 12 digit IEEE member ID.")
      .build())
    .setRequired(true);

  const paymentSection = form.addPageBreakItem()
    .setTitle("Registration fee and payment")
    .setHelpText(`Registration fee: ${CONFIG.registrationFee}. Scan the QR code, complete payment, then upload proof.`);

  const qrImage = UrlFetchApp.fetch(CONFIG.upiQrImageUrl).getBlob();
  form.addImageItem()
    .setTitle("UPI QR code")
    .setHelpText(`Amount to pay: ${CONFIG.registrationFee}`)
    .setImage(qrImage);

  form.addTextItem()
    .setTitle("UPI payment reference ID")
    .setHelpText("Enter the reference/transaction ID shown after payment.")
    .setValidation(FormApp.createTextValidation()
      .requireTextMatchesPattern("^[A-Za-z0-9-]{8,30}$")
      .setHelpText("Enter an 8 to 30 character transaction or reference ID.")
      .build())
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle("Manual editor step required before publishing")
    .setHelpText("In the form editor, add a required File upload question titled “Payment screenshot”. Set it to accept one image file, then delete this instruction and publish the form.");

  ieeeMembership.setChoices([
    ieeeMembership.createChoice("Yes", ieeeSection),
    ieeeMembership.createChoice("No", paymentSection),
  ]);

  const responseSheet = SpreadsheetApp.create(`${CONFIG.eventName} — Registration responses`);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, responseSheet.getId());

  Logger.log(`Edit form: ${form.getEditUrl()}`);
  Logger.log(`Response sheet: ${responseSheet.getUrl()}`);
  Logger.log("The form is intentionally unpublished. Add the required Payment screenshot File upload question in the editor, then publish and copy the respondent URL.");
}

function validateConfig_() {
  const requiredValues = [
    ["eventDate", CONFIG.eventDate],
    ["venue", CONFIG.venue],
    ["organizerContact", CONFIG.organizerContact],
    ["registrationFee", CONFIG.registrationFee],
    ["upiQrImageUrl", CONFIG.upiQrImageUrl],
    ["whatsappInviteUrl", CONFIG.whatsappInviteUrl],
  ];
  const missing = requiredValues
    .filter(([, value]) => !value || value === "TBD" || value.includes("REPLACE") || value.includes("example.com"))
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Fill CONFIG before running the generator: ${missing.join(", ")}`);
  }
}
