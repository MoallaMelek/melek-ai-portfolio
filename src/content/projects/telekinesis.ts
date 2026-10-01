import { m } from "../media";
import type { Project } from "../types";

const S = "telekinesis";

export const telekinesis: Project = {
  slug: S,
  title: "Telekinesis",
  oneLiner: "Touch a real object in the webcam image, pinch, and lift its appearance out of the video while the background is reconstructed behind it.",
  question: "Can you pick up anything on your desk, in video, without a class list or a 3D model?",
  year: "2026",
  status: "Working local app · CPU only · honest limitations documented",
  domains: ["vision"],
  stack: ["Python", "OpenCV", "MediaPipe", "EdgeSAM", "ONNX Runtime", "NumPy"],
  repo: "https://github.com/MoallaMelek/Telekinesis-CV",
  headline: { value: "0.3–1.1 s", label: "EdgeSAM encode on a laptop CPU, run once per selection; tracking is per-frame" },
  cover: m(S, "step-3", "A red mug lifted out of the scene by a pinch, with its original spot filled in"),
  hue: 12,
  limits: [
    "Segmentation varies with contrast, clutter, thin, transparent or reflective objects.",
    "Without a clean plate or scene memory, the hole is inpainted: expect a blurry patch. Shadows outside the mask stay visible.",
    "Image-plane rotation only. No depth, no 3D, no novel views; tracking is translation-only.",
    "The frames shown here are the real pipeline on the repo's synthetic desk fixture. A live webcam recording is still to be made.",
  ],
  sections: [
    {
      id: "sequence",
      title: "One interaction, eight frames",
      blocks: [
        {
          type: "prose",
          body: [
            "These frames come from running the project's own fixture script: real EdgeSAM, real app logic, a drawn hand driving synthetic landmarks over a synthetic desk. Nothing is mocked except the camera.",
          ],
        },
        { type: "exhibit", id: "telekinesis" },
      ],
    },
    {
      id: "pipeline",
      title: "Detection, segmentation and tracking are different jobs",
      blocks: [
        {
          type: "notes",
          items: [
            { title: "Detection", body: "MediaPipe finds hands. No object detector and no class list: anything coherent can be picked up." },
            { title: "Segmentation", body: "EdgeSAM, a promptable SAM-family model, answers “what object is at this point?” once per selection, in a background thread. The prompt sits slightly ahead of the fingertip, because the fingertip pixel is skin; points on the hand go in as negative prompts." },
            { title: "Choosing the whole object", body: "SAM's own score favours small crisp parts. Ranking drops implausible masks, then prefers the largest candidate whose score and stability (does the mask change if the logit threshold moves ±1?) are close to the best. Stability is what rejects merges of neighbouring objects." },
            { title: "Tracking", body: "Masked normalised cross-correlation in a small window follows the same object every frame. It can report OCCLUDED or LOST and hold still; it never switches objects." },
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
            ["Transforms", "BGR→RGB, SAM normalisation, longest side 1024, pad; logits upsampled, padding cropped, then resized back"],
            ["Compositing", "Feathered soft alpha; premultiplied colour before warping to avoid dark fringes"],
            ["Geometry", "One affine T(pos)·R(angle)·S(scale)·T(−anchor) applied to pixels and alpha alike"],
            ["Reconstruction", "Clean plate → scene memory (last ~40 s) → pyramid fill, with OpenCV FSR in the background"],
            ["Occlusion", "MediaPipe selfie segmenter person mask, hands drawn in front by rule (no depth)"],
            ["Gestures", "Pinch state machine with hysteresis, arming and minimum durations; throw velocity is a least-squares fit before release"],
            ["Real-time budget", "One running + one replaceable pending job; stale answers discarded by snapshot id"],
          ],
        },
      ],
    },
  ],
};
