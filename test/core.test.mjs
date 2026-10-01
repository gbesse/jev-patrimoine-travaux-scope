// Objectif : vérifier la normalisation, la règle déterministe et les décisions sémantiques.
import test from "node:test";
import assert from "node:assert/strict";
import { heritageWorksCase, assessHeritageScope } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const casLimite = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-09-27"
  },
  "proposedWorks": []
};
const casPrincipal = {
  "id": "exemple-1",
  "text": "Remplacement des menuiseries de la façade principale, explicitement mentionnée dans l’arrêté de protection.",
  "source": {
    "url": "https://example.test/source-publique",
    "date": "2026-09-25"
  },
  "details": {
    "territoire": "Commune Exemple",
    "origine": "donnée synthétique"
  }
};
const casÀRevoir = {
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
test("exige une source", () => assert.throws(() => heritageWorksCase({ id: "x", text: "y" }), /source/));
test("applique le cas limite sans appel Jev", async () => {
  const provider = createFakeProvider(() => { throw new Error("appel interdit"); });
  assert.equal((await assessHeritageScope(casLimite, provider)).decision, "outside_scope");
  assert.equal(provider.calls, 0);
});
test("classe un dossier sourcé avec une confiance suffisante", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "protected_part", probabilities: {
  "protected_part": 0.82,
  "possible_impact": 0.06,
  "outside_scope": 0.06,
  "insufficient_data": 0.06
}, confidence: 0.82 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await assessHeritageScope(casPrincipal, provider);
  assert.equal(résultat.decision, "protected_part");
  assert.equal(résultat.review, false);
  assert.equal(provider.calls, 1);
});
test("marque une décision incertaine pour revue humaine", async () => {
  const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "possible_impact", probabilities: {
  "protected_part": 0.16,
  "possible_impact": 0.52,
  "outside_scope": 0.16,
  "insufficient_data": 0.16
}, confidence: 0.62 } }, usage: { input_tokens: 10, output_tokens: 0 } }));
  const résultat = await assessHeritageScope(casÀRevoir, provider);
  assert.equal(résultat.decision, "possible_impact");
  assert.equal(résultat.review, true);
  assert.equal(résultat.confidence, 0.62);
  assert.equal(provider.calls, 1);
});
