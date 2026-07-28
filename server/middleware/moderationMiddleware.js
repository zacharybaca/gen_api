import leoProfanity from "leo-profanity";
import asyncHandler from "express-async-handler";

// Initialize default English dictionary
leoProfanity.loadDictionary("en");

// Append custom terms to the active memory array
leoProfanity.add([
  "loser",
  "idiot",
  "dumb",
  "ignorant",
  "stupid",
  "moron",
  "fool",
  "jerk",
  "sociopath",
  "slave driver",
  "bloodsucker",
  "brownnoser",
  "kiss-ass",
  "scam artist",
  "crook",
  "extortionist",
  "nazi",
  "fascist",
  "psycho",
  "bootlicker",
  "shill",
  "scab",
  "brain-dead",
  "sweatshop",
  "narcissist",
  "megalomaniac",
  "tyrant",
  "dictator",
  "parasite",
  "leech",
  "fraud",
  "con artist",
  "charlatan",
  "backstabber",
  "snake",
  "creep",
  "pervert",
  "groomer",
  "dirtbag",
  "scum",
  "sycophant",
  "nepo baby",
  "thief",
  "embezzler",
]);

export const moderateContent = asyncHandler(async (req, res, next) => {
  // Expanded to include 'title' and 'content' for Knowledge Base Articles
  const fieldsToMatch = [
    req.body.title,
    req.body.content,
    req.body.body,
    req.body.comment,
    req.body.text,
  ];

  // Filter out undefined/null fields and join them into one string for checking
  const contentToScan = fieldsToMatch.filter(Boolean).join(" ");

  if (!contentToScan) {
    return next();
  }

  const isFlagged = leoProfanity.check(contentToScan);

  if (isFlagged) {
    res.status(400);
    throw new Error(
      "Content rejected. Your submission contains language that violates company guidelines.",
    );
  }

  next();
});
