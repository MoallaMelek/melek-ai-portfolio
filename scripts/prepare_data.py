"""Extract compact, real experiment data from Melek's public repositories.

Usage:  python scripts/prepare_data.py <dir-containing-cloned-repos>

Nothing here is invented: every number is copied (and rounded) from files committed in
github.com/MoallaMelek/Reward-Goblin and github.com/MoallaMelek/Reinforcement-Learning-Memory-Dungeon.
Output goes to public/data/ and is committed, so the site never needs the source repos at build time.
"""
import json
import sys
from pathlib import Path

SRC = Path(sys.argv[1])
OUT = Path(__file__).resolve().parents[1] / "public" / "data"
OUT.mkdir(parents=True, exist_ok=True)


def r(v, n=2):
    if isinstance(v, list):
        return [r(x, n) for x in v]
    if isinstance(v, float):
        return round(v, n)
    return v


# --- Reward Goblin: real PPO replays vs the scripted reference on the same start state ---
GOBLINS = [
    ("edge", "edge_goblin_v1_seed1/worst_exploit.json", "Edge Goblin", "v1 · Keep touching it",
     "+0.2 every step the box touches the exit. The episode ends once it is fully inside."),
    ("speed", "speed_goblin_v1_seed1/worst_exploit.json", "Speed Goblin", "v1 · Hurry up!",
     "Reward for moving toward the exit quickly."),
    ("wall", "wall_goblin_v1_seed1/worst_exploit.json", "Wall Goblin", "v1 · Near is good enough",
     "+0.1 per step while the box is within 2.5 m of the exit, measured in a straight line."),
    ("lava", "lava_goblin_v1_seed1/worst_exploit.json", "Lava Goblin", "v1 · Every second counts",
     "−0.05 per step. Lava costs −1 and ends the episode."),
    ("distance", "distance_goblin_v1_seed1/worst_exploit.json", "Distance Goblin", "v1 · Closer is better",
     "+1 per metre whenever the box gets closer. Moving away is free."),
    ("fixed", "edge_goblin_v2_seed1/median.json", "Edge Goblin, fixed", "v2 · Reward completion",
     "Signed, potential-based progress plus a one-time bonus for finishing."),
]

index = []
for gid, rel, name, version, reward_text in GOBLINS:
    d = json.loads((SRC / "Reward-Goblin" / "recordings" / rel).read_text())
    ref = d["reference"]

    def side(s):
        f = s["frames"]
        return {
            "agent": r(f["agent"]),
            "box": r(f["box"]),
            "cum": r(f["cum"]),
            "inside": f["inside"],
            "overlap": f["overlap"],
            "settleBox": r(s["settle"]["box"]),
            "trueSuccess": s["true_success"],
            "return": r(s["return"], 1),
            "length": s["length"],
            "termination": s["termination_reason"],
            "checklist": s["checklist"],
            "events": s["events"][:40],
        }

    lay = d["layout"]
    out = {
        "id": gid,
        "name": name,
        "version": version,
        "reward": reward_text,
        "runId": d["run_id"],
        "seed": d["seed"],
        "layoutSeed": d["layout_seed"],
        "layout": {k: r(lay[k]) for k in ("name", "width", "height", "walls", "obstacles", "hazards", "goal")},
        "exploits": [{"label": e["label"], "step": e["step"], "evidence": e["evidence"]} for e in d["exploits"]],
        "policy": side(d),
        "reference": side(ref),
    }
    (OUT / "goblins").mkdir(exist_ok=True)
    (OUT / "goblins" / f"{gid}.json").write_text(json.dumps(out, separators=(",", ":")))
    index.append({"id": gid, "name": name, "version": version})
    print("goblin", gid, d["return"], ref["return"])

(OUT / "goblins" / "index.json").write_text(json.dumps(index))

# --- Dungeon With Amnesia: the verified memory-deletion replay, with real GRU hidden states ---
d = json.loads((SRC / "Reinforcement-Learning-Memory-Dungeon" / "results" / "ablation" / "showcase_episode.json").read_text())


def tl(side):
    return [
        {
            "step": t["step"],
            "action": t["action"],
            "reward": r(t["reward"]),
            "hidden": r(t["hidden"], 2),
            "p": r(max(t["probabilities"]) if isinstance(t["probabilities"], list) else 0, 2),
        }
        for t in d[side]["timeline"]
    ]


dungeon = {
    "seed": d["seed"],
    "resetAfter": d["at_step"],
    "cue": "MOON",
    "firstObservation": d["control"]["timeline"][0]["observation"].replace("•", "-").replace("�", "-"),
    "control": {"success": d["control"]["metrics"]["success"], "timeline": tl("control")},
    "treatment": {"success": d["treatment"]["metrics"]["success"], "timeline": tl("treatment")},
}
(OUT / "dungeon.json").write_text(json.dumps(dungeon, separators=(",", ":")))
print("dungeon", len(dungeon["control"]["timeline"]), dungeon["control"]["timeline"][-1]["action"],
      dungeon["treatment"]["timeline"][-1]["action"])
