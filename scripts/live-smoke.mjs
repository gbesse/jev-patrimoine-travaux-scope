// Objectif : effectuer un appel Jev synthétique uniquement sur demande explicite.
import { createJevClient } from "../src/jev.mjs";
import { assessHeritageScope } from "../src/index.mjs";
const client = createJevClient();
const résultat = await assessHeritageScope({
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
}, client);
console.log(JSON.stringify({ décision: résultat.decision, confiance: résultat.confidence, usage: résultat.usage }, null, 2));
