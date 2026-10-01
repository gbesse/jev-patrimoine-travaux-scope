// Objectif : vérifier que les types publics sont importables.
import { heritageWorksCase, assessHeritageScope } from "../src/index.mjs";
const dossier = heritageWorksCase({
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
});
void assessHeritageScope(dossier, { decide: async () => ({}) });
