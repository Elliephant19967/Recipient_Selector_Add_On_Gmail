function getContextualAddOn(e) {
  return buildRecipientSelectionCard(e);
}

function buildRecipientSelectionCard(e) {
  var messageId = e.gmail.messageId;
  var message = GmailApp.getMessageById(messageId);

  var recipientGroups = {
    "To": sortRecipients(parseRecipientList(message.getTo())),
    "Cc": sortRecipients(parseRecipientList(message.getCc())),
    "Bcc": sortRecipients(parseRecipientList(message.getBcc()))
  };

  var card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Recipient Selector"));

  Object.keys(recipientGroups).forEach(function(group) {
    var recipients = recipientGroups[group];
    if (recipients.length > 0) {
      var section = CardService.newCardSection()
        .setHeader(group + " Recipients");

      recipients.forEach(function(emailObj, index) {
        var labelText = emailObj.displayName || emailObj.address;

        var selectionInput = CardService.newSelectionInput()
          .setType(CardService.SelectionInputType.CHECK_BOX)
          .setFieldName(group + "_recipient_" + index)
          .addItem(labelText, emailObj.original, true);

        section.addWidget(selectionInput);

        if (emailObj.displayName) {
          section.addWidget(
            CardService.newTextParagraph()
              .setText("<small>" + emailObj.address + "</small>")
          );
        }
      });

      card.addSection(section);
    }
  });

  var buttonSection = CardService.newCardSection();
  buttonSection.addWidget(
    CardService.newButtonSet()
      .addButton(
        CardService.newTextButton()
          .setText("✉️ Compose Email")
          .setOnClickAction(CardService.newAction().setFunctionName("handleComposeSelected"))
      )
      .addButton(
        CardService.newTextButton()
          .setText("📅 Create Event")
          .setOnClickAction(CardService.newAction()
            .setFunctionName("handleCreateEventSelected")
            .setParameters({ messageId: messageId }))
      )
  );

  card.addSection(buttonSection);

  return card.build();
}

/**
 * Improved parseRecipientList to handle quoted names with commas
 */
function parseRecipientList(list) {
  if (!list) return [];
  
  var recipients = [];
  var regex = /("(?:[^"\\]|\\.)*"|[^,])+/g;
  var matches = list.match(regex);
  
  if (!matches) return [];

  matches.forEach(function(rawRecipient) {
    var trimmed = rawRecipient.trim();

    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      trimmed = trimmed.slice(1, -1);
    }

    var nameMatch = trimmed.match(/^(.*)<(.*)>$/);
    if (nameMatch) {
      recipients.push({
        displayName: nameMatch[1].trim(),
        address: nameMatch[2].trim(),
        original: rawRecipient.trim()
      });
    } else {
      recipients.push({
        displayName: "",
        address: trimmed,
        original: rawRecipient.trim()
      });
    }
  });
  
  return recipients;
}

function sortRecipients(recipients) {
  return recipients.sort(function(a, b) {
    var nameA = a.displayName || a.address;
    var nameB = b.displayName || b.address;
    return nameA.localeCompare(nameB);
  });
}

function getSelectedRecipients(formInputs) {
  var selected = [];
  for (var key in formInputs) {
    if (formInputs.hasOwnProperty(key) && key.includes("_recipient_")) {
      var value = formInputs[key];
      if (value) {
        if (Array.isArray(value)) {
          selected = selected.concat(value);
        } else {
          selected.push(value);
        }
      }
    }
  }
  return selected;
}

function handleComposeSelected(e) {
  var selectedRecipients = getSelectedRecipients(e.formInput);
  var recipientsStr = selectedRecipients.join(", ");
  var composeUrl = "https://mail.google.com/mail/?view=cm&to=" + encodeURIComponent(recipientsStr);

  return CardService.newActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink().setUrl(composeUrl))
    .build();
}

function handleCreateEventSelected(e) {
  var selectedRecipients = getSelectedRecipients(e.formInput);
  var recipientsStr = selectedRecipients.join(",");

  var messageId = e.parameters.messageId;
  var subject = "";
  if (messageId) {
    var message = GmailApp.getMessageById(messageId);
    subject = message.getSubject() || "New Event";
  }

  var calendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&add=" + encodeURIComponent(recipientsStr) +
    "&text=" + encodeURIComponent(subject);

  return CardService.newActionResponseBuilder()
    .setOpenLink(CardService.newOpenLink().setUrl(calendarUrl))
    .build();
}
