import { m } from "../media";
import type { Project } from "../types";

const S = "protein-synthesis";

export const proteinSynthesis: Project = {
  slug: S,
  title: "Protein Plant Synthesis",
  oneLiner: "A leakage-controlled surrogate ML pipeline that designs DNA for therapeutic proteins across four plant hosts, and explains its own predictions.",
  question: "If you had to produce a therapeutic protein in a plant, which host and which DNA design should you try first?",
  year: "2025–2026",
  status: "Working pipeline + dashboard · simulated target, not wet-lab data · 26 tests",
  domains: ["ml"],
  stack: ["Python", "scikit-learn", "XGBoost", "LightGBM", "SHAP", "pandas", "Streamlit", "Plotly", "py3Dmol"],
  repo: "https://github.com/MoallaMelek/AI-Driven-Therapeutic-Protein-Plant-Synthesis",
  headline: { value: "4 hosts", label: "Arabidopsis, rice, maize and date palm, compared under protein-grouped evaluation" },
  cover: m(S, "dna-flow", "Visual flow from naive DNA to protein structure to host-optimised DNA"),
  hue: 120,
  limits: [
    "The expression target is a deterministic simulated proxy built from codon, host and structure signals. It is explicitly not wet-lab measured.",
    "It ships as a CLI and Streamlit app; the REST service layer is planned, not built.",
  ],
  sections: [
    {
      id: "pipeline",
      title: "From UniProt to a ranked decision",
      blocks: [
        {
          type: "prose",
          body: [
            "Proteins are fetched from UniProt and quality-checked. Each one gets a naive back-translation and host-aware optimised DNA for four plant hosts, using host-biased codon tables. Structure descriptors come from AlphaFold, with a deterministic fallback so the app still runs offline.",
            "Codon adaptation (CAI), GC compatibility, rare-codon ratios and protein features feed a set of regressors. The final screen turns predictions into an operations view: which host to try, at what estimated cost and time.",
          ],
        },
        { type: "media", media: m(S, "architecture", "System architecture: data collection, DNA generation and feature engineering, proxy target construction"), size: "wide" },
      ],
    },
    {
      id: "evaluation",
      title: "Making the evaluation credible",
      blocks: [
        {
          type: "notes",
          items: [
            { title: "Grouped splits", body: "The same protein appears once per host. Random splits would leak an accession into both train and test, so splits are grouped by protein (GroupShuffleSplit, GroupKFold)." },
            { title: "Beat the trivial model first", body: "Every model is compared against a dummy baseline that predicts the mean. The dashboard asks the question explicitly: is this better than a trivial prediction?" },
            { title: "Explain, then trust", body: "Permutation importance, local SHAP explanations and residual analysis are part of the product, not an afterthought." },
          ],
        },
        {
          type: "gallery",
          columns: 2,
          items: [
            m(S, "baseline-vs-model", "Validation RMSE of each model against the dummy baseline", "Model lab: every regressor against the dummy baseline."),
            m(S, "shap", "Local SHAP explanation for a single prediction", "Local SHAP: what pushed this prediction up or down."),
            m(S, "cai-scatter", "Scatter of codon adaptation index against the proxy target, coloured by host", "Dataset analysis: CAI against the proxy target by host."),
            m(S, "ranking", "Production ranking dashboard listing hosts by score, cost and time", "Decision view: hosts ranked by efficiency, cost and time proxies."),
          ],
        },
      ],
    },
    {
      id: "system",
      title: "Under the hood",
      deep: true,
      blocks: [
        {
          type: "spec",
          items: [
            ["Models", "Dummy baseline, Linear, Ridge, Random Forest (350 trees, depth 14), XGBoost (350, depth 6, lr 0.05), optional LightGBM"],
            ["Features", "CAI, GC content, codon diversity, rare-codon ratio, protein length, hydrophobicity, structure-derived descriptors"],
            ["Evaluation", "Protein-grouped holdout, RMSE / MAE / R², ablations"],
            ["Explainability", "Permutation importance, SHAP, residual diagnostics"],
            ["Product", "Multi-tab Streamlit with Plotly charts and py3Dmol structure views"],
            ["Tests", "26 unittest cases: training protocol safety, artifact loading, dashboard helpers, codon analysis"],
          ],
        },
      ],
    },
  ],
};
