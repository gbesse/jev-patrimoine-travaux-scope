// Objectif : montrer qu’une décision incertaine est explicitement envoyée en revue humaine.
import assert from "node:assert/strict";
import { assessHeritageScope } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
  "id": "revue-1",
  "text": "Création d’une gaine technique dans une aile ancienne reliée au corps protégé, sans plan de localisation joint.",
  "source": {
    "url": "https://example.test/dossier-ambigu",
    "date": "2026-09-26"
  },
  "details": {
    "origine": "donnée synthétique",
    "signal": "informations incomplètes"
  }
};
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "possible_impact", probabilities: {
  "protected_part": 0.16,
  "possible_impact": 0.52,
  "outside_scope": 0.16,
  "insufficient_data": 0.16
}, confidence: 0.62 } }, usage: { input_tokens: 140, output_tokens: 0 } }));
const résultat = await assessHeritageScope(dossier, provider);
assert.equal(résultat.decision, "possible_impact");
assert.equal(résultat.review, true);
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · revue humaine : ${résultat.review} · confiance : ${résultat.confidence}`);
