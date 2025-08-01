/**
 * Builds the add-on card UI when a message is opened.
 */
function buildAddOn(e) {
  console.log("DEBUG: buildAddOn triggered with event: " + JSON.stringify(e));

  var messageId = e.gmail && e.gmail.messageId;
  console.log("DEBUG: Message ID: " + messageId);

  var message = GmailApp.getMessageById(messageId);

  // Parse recipients from To, Cc, and Bcc
  var toRecipients = parseRecipients(message.getTo());
  var ccRecipients = parseRecipients(message.getCc());
  var bccRecipients = parseRecipients(message.getBcc());

  console.log("DEBUG: Parsed To: " + JSON.stringify(toRecipients));
  console.log("DEBUG: Parsed Cc: " + JSON.stringify(ccRecipients));
  console.log("DEBUG: Parsed Bcc: " + JSON.stringify(bccRecipients));

  // Sort alphabetically by name/email
  toRecipients.sort((a, b) => a.name.localeCompare(b.name));
  ccRecipients.sort((a, b) => a.name.localeCompare(b.name));
  bccRecipients.sort((a, b) => a.name.localeCompare(b.name));

  // Header with logo and title
  var logoUrl = "https://raw.githubusercontent.com/Elliephant19967/Recipient_Selector_Add_On_Gmail/fcdb8d594a26a35703dde30e8e368a5efcef5632/Add_On_Logo_120px.jpg";
  var header = CardService.newDecoratedText()
    .setText("Select Recipients")
    .setStartIcon(CardService.newIconImage().setIconUrl(logoUrl));

  var section = CardService.newCardSection();
  section.addWidget(header);

  // Add each recipient group
  addRecipientGroup(section, "To Recipients", toRecipients, "toRecipients");
  addRecipientGroup(section, "Cc Recipients", ccRecipients, "ccRecipients");
  addRecipientGroup(section, "Bcc Recipients", bccRecipients, "bccRecipients");

  // Action buttons
  var subject = message.getSubject();
  var composeAction = CardService.newAction().setFunctionName("composeEmail");
  var createEventAction = CardService.newAction()
    .setFunctionName("createCalendarEvent")
    .setParameters({ subject: subject });

  var buttonSet = CardService.newButtonSet()
    .addButton(CardService.newTextButton()
      .setText("Compose Email")
      .setOnClickAction(composeAction))
    .addButton(CardService.newTextButton()
      .setText("Create Event")
      .setOnClickAction(createEventAction));

  section.addWidget(buttonSet);

  return [CardService.newCardBuilder().addSection(section).build()];
}

/**
 * Adds a group of recipients with checkboxes.
 */
function addRecipientGroup(section, label, recipients, fieldName) {
  if (recipients.length > 0) {
    section.addWidget(CardService.newKeyValue().setTopLabel(label));
    recipients.forEach(function (recipient) {
      section.addWidget(
        CardService.newSelectionInput()
          .setFieldName(fieldName)
          .setType(CardService.SelectionInputType.CHECK_BOX)
          .addItem(
            recipient.name + " <" + recipient.email + ">",
            recipient.email,
            false
          )
      );
    });
  }
}

/**
 * Parses a comma-separated recipient string into an array of objects.
 */
function parseRecipients(recipientsString) {
  if (!recipientsString) return [];
  return recipientsString.split(",").map(function (r) {
    var match = r.trim().match(/(.*)<(.*)>/);
    if (match) {
      return { name: match[1].replace(/"/g, "").trim(), email: match[2].trim() };
    }
    return { name: r.trim(), email: r.trim() };
  });
}

/**
 * Handles the Compose Email action.
 */
function composeEmail(e) {
  console.log("DEBUG: composeEmail triggered with formInput: " + JSON.stringify(e.formInput));

  // Normalize selected recipients as arrays
  var toSelected = [].concat(e.formInput.toRecipients || []);
  var ccSelected = [].concat(e.formInput.ccRecipients || []);
  var bccSelected = [].concat(e.formInput.bccRecipients || []);

  console.log("DEBUG: Selected To: " + JSON.stringify(toSelected));
  console.log("DEBUG: Selected Cc: " + JSON.stringify(ccSelected));
  console.log("DEBUG: Selected Bcc: " + JSON.stringify(bccSelected));

  // Combine all selected recipients
  var allRecipients = [].concat(toSelected, ccSelected, bccSelected)
    .filter((v, i, a) => v && a.indexOf(v) === i); // Deduplicate

  console.log("DEBUG: All Recipients (Compose): " + JSON.stringify(allRecipients));

  if (allRecipients.length === 0) {
    return buildConfirmationCard("Compose Email", "composeEmail");
  }

  var url = "https://mail.google.com/mail/?view=cm&to=" + encodeURIComponent(allRecipients.join(","));
  return CardService.newNavigation().setOpenLink(CardService.newOpenLink().setUrl(url).setOpenAs(CardService.OpenAs.FULL_SIZE));
}

/**
 * Handles the Create Event action.
 */
function createCalendarEvent(e) {
  console.log("DEBUG: createCalendarEvent triggered with formInput: " + JSON.stringify(e.formInput));

  var toSelected = [].concat(e.formInput.toRecipients || []);
  var ccSelected = [].concat(e.formInput.ccRecipients || []);
  var bccSelected = [].concat(e.formInput.bccRecipients || []);

  console.log("DEBUG: Selected To: " + JSON.stringify(toSelected));
  console.log("DEBUG: Selected Cc: " + JSON.stringify(ccSelected));
  console.log("DEBUG: Selected Bcc: " + JSON.stringify(bccSelected));

  var allRecipients = [].concat(toSelected, ccSelected, bccSelected)
    .filter((v, i, a) => v && a.indexOf(v) === i);

  console.log("DEBUG: All Recipients (Event): " + JSON.stringify(allRecipients));

  if (allRecipients.length === 0) {
    return buildConfirmationCard("Create Event", "createCalendarEvent", e.parameters.subject);
  }

  var url =
    "https://calendar.google.com/calendar/render?action=TEMPLATE&add=" +
    encodeURIComponent(allRecipients.join(",")) +
    "&text=" + encodeURIComponent(e.parameters.subject || "New Event");

  return CardService.newNavigation().setOpenLink(CardService.newOpenLink().setUrl(url).setOpenAs(CardService.OpenAs.FULL_SIZE));
}

/**
 * Builds a confirmation card when no recipients are selected.
 */
function buildConfirmationCard(actionName, callback, subject) {
  console.log("DEBUG: buildConfirmationCard for " + actionName);

  var section = CardService.newCardSection()
    .addWidget(CardService.newTextParagraph().setText("No recipients are selected. Do you still wish to " + actionName + "?"));

  var buttonSet = CardService.newButtonSet()
    .addButton(CardService.newTextButton()
      .setText("No, Go Back")
      .setOnClickAction(CardService.newAction().setFunctionName("getContextualAddOn")))
    .addButton(CardService.newTextButton()
      .setText("Yes, " + actionName)
      .setOnClickAction(CardService.newAction()
        .setFunctionName("proceedWithoutRecipients")
        .setParameters({ actionName: actionName, callback: callback, subject: subject || "" })));

  section.addWidget(buttonSet);

  return CardService.newCardBuilder().addSection(section).build();
}

/**
 * Proceeds when user chooses "Yes" without recipients.
 */
function proceedWithoutRecipients(e) {
  console.log("DEBUG: proceedWithoutRecipients triggered with params: " + JSON.stringify(e.parameters));

  var actionName = e.parameters.actionName;
  var callback = e.parameters.callback;
  var subject = e.parameters.subject;

  if (callback === "composeEmail") {
    var url = "https://mail.google.com/mail/?view=cm";
    return CardService.newNavigation().setOpenLink(CardService.newOpenLink().setUrl(url).setOpenAs(CardService.OpenAs.FULL_SIZE));
  } else if (callback === "createCalendarEvent") {
    var url = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(subject || "New Event");
    return CardService.newNavigation().setOpenLink(CardService.newOpenLink().setUrl(url).setOpenAs(CardService.OpenAs.FULL_SIZE));
  }

  return getContextualAddOn();
}

/**
 * Entry point for contextual add-on trigger.
 */
function getContextualAddOn(e) {
  console.log("DEBUG: getContextualAddOn triggered");
  return buildAddOn(e);
}
