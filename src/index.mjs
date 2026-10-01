// Objectif : implémenter la frontière de décision métier propre au dépôt.
import { readFile } from "node:fs/promises";
export const DECISIONS = Object.freeze({
  "protected_part": "partie_protégée",
  "possible_impact": "impact_possible",
  "outside_scope": "hors_périmètre",
  "insufficient_data": "données_insuffisantes"
});
const CRITERIA = Object.freeze({
  "protected_part": "partie protégée",
  "possible_impact": "impact possible",
  "outside_scope": "hors périmètre",
  "insufficient_data": "données insuffisantes"
});
export function heritageWorksCase(input) {
  if (!input?.id || !input?.text || !input?.source?.url || !input?.source?.date) throw new TypeError("Le dossier exige id, text, source.url et source.date");
  const date = new Date(input.source.date);
  if (Number.isNaN(date.valueOf())) throw new TypeError("source.date doit être une date ISO valide");
  return { ...input, id: String(input.id), text: String(input.text).trim(), source: { url: String(input.source.url), date: date.toISOString() } };
}
export async function assessHeritageScope(input, provider) {
  const record = heritageWorksCase(input);
  if (Array.isArray(record.proposedWorks) && record.proposedWorks.length === 0) return { decision: "outside_scope", label: DECISIONS["outside_scope"], probability: 1, review: false, deterministic: true };
  const response = await provider.decide({
    state: record,
    questions: { decision: { type: "choice", instructions: "Analysez ce projet de travaux patrimoniaux à partir des seuls éléments sourcés. Choisissez la catégorie la plus prudente. N’inventez ni fait, ni droit applicable, ni garantie.", criteria: CRITERIA } },
  });
  const answer = response.answers.decision;
  return { decision: answer.choice, label: DECISIONS[answer.choice], probability: answer.probabilities[answer.choice], confidence: answer.confidence, review: answer.confidence < 0.8, deterministic: false, usage: response.usage };
}
export async function runCli(argv, io = console) {
  if (argv.length !== 1) throw new Error("Usage : jev-patrimoine-travaux-scope <dossier.json>");
  const dossier = heritageWorksCase(JSON.parse(await readFile(argv[0], "utf8")));
  io.log(JSON.stringify({ dossier, prochaineÉtape: "Transmettez ce dossier à assessHeritageScope avec un fournisseur Jev configuré." }, null, 2));
}
