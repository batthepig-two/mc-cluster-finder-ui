import { useState } from "react";

type FieldKey =
  | "seed" | "version" | "center" | "initial_radius"
  | "block" | "search_radius" | "cluster_radius" | "steps";

const EXPLANATIONS: Record<FieldKey, { title: string; body: string; example?: string }> = {
  seed: {
    title: "Seed  (-s)",
    body: "Every Minecraft world is generated from a single number called the seed. It controls everything — terrain shape, biome layout, ore placement, and more. Two worlds with the same seed on the same version are identical.\n\nThis is the only required input. Without it, the tool has nothing to search.",
    example: "Find it in-game with the command: /seed\nOr check your level.dat file. Text seeds like \"Glacier\" work too — Minecraft hashes them to a number internally.",
  },
  version: {
    title: "Version  (-v)",
    body: "Biome generation changed significantly between Minecraft versions — a seed that puts a mesa biome at X=500 in 1.12 might put a forest there in 1.18. The tool needs to know your exact version so it uses the right biome algorithm.\n\nMajor breakpoints:\n• 1.0–1.12: original biome system\n• 1.13–1.17: aquatic update biome tweaks\n• 1.18+: completely new terrain and biome distribution",
    example: "If you're not sure, check your world folder — the level.dat stores the version it was last opened in.",
  },
  center: {
    title: "Center X / Z  (-x, -z)",
    body: "The tool searches outward from a center point. By default this is 0, 0 (world spawn). If your base is far from spawn and you want to find something nearby, set this to your base coordinates.\n\nNote: these are block coordinates, not chunk coordinates.",
    example: "Your coordinates are shown in-game with F3 (Java) or by enabling \"Show coordinates\" in Bedrock.",
  },
  initial_radius: {
    title: "Initial Radius  (-r)",
    body: "How far from the center point to cast the first search net — measured in blocks.\n\nThe tool scans a square of this size, checking every 16 blocks (one chunk column) to see if the biome there matches your first block. Larger values cover more ground but take longer to run.\n\nThis only applies to Step 1. Steps 2 and beyond use the Search Radius of each step instead.",
    example: "Default 5000 means a 10,000 × 10,000 block area (about 39 km²). For nether searches, 2000 is usually plenty since the nether is 1/8 the scale.",
  },
  block: {
    title: "Block  (-b)",
    body: "The block type you want to find. The tool uses cubiomes to look up which biomes this block can generate in, then scans for those biomes across the search area.\n\nFor ores (coal, iron, diamond, etc.) the tool finds biome regions where the ore's generation conditions are met. The output is a list of candidate chunk columns — not every exact block position, but the right neighbourhood to dig in.",
    example: "Use the exact internal name — e.g. \"deepslate_diamond_ore\" not \"diamond ore\". The search field filters by name and category.",
  },
  search_radius: {
    title: "Search Radius  (-S)",
    body: "After Step 1 produces a list of hit locations, Step 2 doesn't re-scan the entire initial radius. Instead it searches a small box around each hit from Step 1 — that box is the Search Radius.\n\nThis is how the tool progressively narrows down. Each step focuses tighter around the promising locations the previous step found.",
    example: "Step 1 finds 300 places where diamond ore biomes exist.\nStep 2 (emerald ore, -S 200) looks within 200 blocks of each of those 300 points.\nInstead of scanning 10,000² blocks, it only scans 300 × 400² blocks.",
  },
  cluster_radius: {
    title: "Cluster Radius  (-C)",
    body: "Once this step finds a hit, it doesn't pass the exact point to the next step — it passes a cluster centred on that hit. The Cluster Radius sets how big that cluster is.\n\nSmaller cluster radius = more precise hand-off, faster next step.\nLarger cluster radius = more forgiving if the block generation is spread out.\n\nThink of -S as \"how far to look FROM previous hits\" and -C as \"how far each new hit should reach INTO the next step\".",
    example: "Diamond ore is scattered, so -C 32 (one or two chunks) is fine.\nA biome surface feature like a cherry grove might need -C 128 to reliably seed the next step.",
  },
  steps: {
    title: "Search Steps",
    body: "Steps are how you chain multiple searches together to zero in on a specific combination of blocks.\n\nStep 1 scans the whole initial radius to find locations where Block A's biome conditions are met.\nStep 2 takes those hits and searches around each one for Block B.\nStep 3 takes those hits and searches for Block C. And so on.\n\nEach step narrows the results. You might get 500 hits in Step 1, 80 in Step 2, and 5 in Step 3 — those 5 are where all three blocks can co-generate.",
    example: "Classic combo: diamond_ore → emerald_ore → ancient_debris\nThis finds spots where overworld diamonds and emeralds are accessible near a nether portal that leads to ancient debris.",
  },
};

const FIELD_COLORS: Record<FieldKey, string> = {
  seed:           "ring-yellow-400 bg-yellow-400/10",
  version:        "ring-blue-400 bg-blue-400/10",
  center:         "ring-cyan-400 bg-cyan-400/10",
  initial_radius: "ring-orange-400 bg-orange-400/10",
  block:          "ring-green-400 bg-green-400/10",
  search_radius:  "ring-purple-400 bg-purple-400/10",
  cluster_radius: "ring-pink-400 bg-pink-400/10",
  steps:          "ring-primary bg-primary/10",
};

const DOT_COLORS: Record<FieldKey, string> = {
  seed:           "bg-yellow-400",
  version:        "bg-blue-400",
  center:         "bg-cyan-400",
  initial_radius: "bg-orange-400",
  block:          "bg-green-400",
  search_radius:  "bg-purple-400",
  cluster_radius: "bg-pink-400",
  steps:          "bg-primary",
};

function ClickZone({ fieldKey, active, onClick, children }: {
  fieldKey: FieldKey; active: boolean; onClick: (k: FieldKey) => void; children: React.ReactNode;
}) {
  const ring = FIELD_COLORS[fieldKey];
  return (
    <div
      onClick={e => { e.stopPropagation(); onClick(fieldKey); }}
      className={`cursor-pointer rounded-lg transition-all duration-150 ${active ? `ring-2 ${ring} shadow-lg` : "ring-1 ring-border/40 hover:ring-border"}`}
    >
      {children}
    </div>
  );
}

function Dot({ fieldKey }: { fieldKey: FieldKey }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${DOT_COLORS[fieldKey]} mr-1.5 shrink-0`} />
  );
}

export default function Tutorial({ onBack }: { onBack: () => void }) {
  const [active, setActive] = useState<FieldKey | null>(null);

  const toggle = (k: FieldKey) => setActive(prev => prev === k ? null : k);
  const exp = active ? EXPLANATIONS[active] : null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" onClick={() => setActive(null)}>
      <header className="border-b border-border px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="text-xs text-muted-foreground hover:text-foreground transition-colors mr-1">← Back</button>
        <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center text-sm">?</div>
        <div>
          <h1 className="font-bold text-lg leading-none">Tutorial</h1>
          <p className="text-muted-foreground text-xs mt-0.5">Click any field to learn what it does</p>
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>

        {/* Instruction banner */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 text-sm text-primary">
          Tap any highlighted field below — an explanation appears at the bottom of the page.
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          {(Object.keys(EXPLANATIONS) as FieldKey[]).map(k => (
            <button key={k} onClick={() => toggle(k)} className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Dot fieldKey={k} />
              {EXPLANATIONS[k].title.split("  ")[0]}
            </button>
          ))}
        </div>

        {/* Replica UI */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">World Settings</h2>
          <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-4">

            <ClickZone fieldKey="seed" active={active === "seed"} onClick={toggle}>
              <div className="p-2 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Dot fieldKey="seed" />
                  <label className="text-xs font-medium text-muted-foreground">Seed <span className="text-destructive">*</span></label>
                </div>
                <div className="bg-input border border-border rounded-md px-3 py-2 text-sm text-muted-foreground/60 pointer-events-none">e.g. 123456789 or a text seed</div>
              </div>
            </ClickZone>

            <div className="grid grid-cols-2 gap-4">
              <ClickZone fieldKey="version" active={active === "version"} onClick={toggle}>
                <div className="p-2 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Dot fieldKey="version" />
                    <label className="text-xs font-medium text-muted-foreground">Version <span className="text-destructive">*</span></label>
                  </div>
                  <div className="bg-input border border-border rounded-md px-3 py-2 text-sm text-muted-foreground/60 pointer-events-none flex items-center justify-between">
                    1.18 <span className="text-xs">▼</span>
                  </div>
                </div>
              </ClickZone>

              <ClickZone fieldKey="initial_radius" active={active === "initial_radius"} onClick={toggle}>
                <div className="p-2 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Dot fieldKey="initial_radius" />
                    <label className="text-xs font-medium text-muted-foreground">Initial Radius</label>
                  </div>
                  <div className="bg-input border border-border rounded-md px-3 py-2 text-sm text-muted-foreground/60 pointer-events-none">5000</div>
                </div>
              </ClickZone>

              <ClickZone fieldKey="center" active={active === "center"} onClick={toggle}>
                <div className="p-2 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Dot fieldKey="center" />
                    <label className="text-xs font-medium text-muted-foreground">Center X</label>
                  </div>
                  <div className="bg-input border border-border rounded-md px-3 py-2 text-sm text-muted-foreground/60 pointer-events-none">0</div>
                </div>
              </ClickZone>

              <ClickZone fieldKey="center" active={active === "center"} onClick={toggle}>
                <div className="p-2 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Dot fieldKey="center" />
                    <label className="text-xs font-medium text-muted-foreground">Center Z</label>
                  </div>
                  <div className="bg-input border border-border rounded-md px-3 py-2 text-sm text-muted-foreground/60 pointer-events-none">0</div>
                </div>
              </ClickZone>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search Steps</h2>
            <ClickZone fieldKey="steps" active={active === "steps"} onClick={toggle}>
              <div className="px-2 py-1 flex items-center gap-1.5">
                <Dot fieldKey="steps" />
                <span className="text-xs text-muted-foreground">What are steps?</span>
              </div>
            </ClickZone>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">Step 1</span>
            </div>

            <ClickZone fieldKey="block" active={active === "block"} onClick={toggle}>
              <div className="p-2 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Dot fieldKey="block" />
                  <label className="text-xs font-medium text-muted-foreground">Block <span className="text-destructive">*</span></label>
                </div>
                <div className="bg-input border border-border rounded-md px-3 py-2 text-sm text-muted-foreground/60 pointer-events-none flex items-center justify-between">
                  Choose a block… <span className="text-xs">▼</span>
                </div>
              </div>
            </ClickZone>

            <div className="grid grid-cols-2 gap-3">
              <ClickZone fieldKey="search_radius" active={active === "search_radius"} onClick={toggle}>
                <div className="p-2 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Dot fieldKey="search_radius" />
                    <label className="text-xs font-medium text-muted-foreground">Search Radius <code className="text-xs text-muted-foreground/60">-S</code></label>
                  </div>
                  <div className="bg-input border border-border rounded-md px-3 py-2 text-sm text-muted-foreground/60 pointer-events-none">500</div>
                  <p className="text-xs text-muted-foreground">Blocks around each hit to re-search</p>
                </div>
              </ClickZone>

              <ClickZone fieldKey="cluster_radius" active={active === "cluster_radius"} onClick={toggle}>
                <div className="p-2 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Dot fieldKey="cluster_radius" />
                    <label className="text-xs font-medium text-muted-foreground">Cluster Radius <code className="text-xs text-muted-foreground/60">-C</code></label>
                  </div>
                  <div className="bg-input border border-border rounded-md px-3 py-2 text-sm text-muted-foreground/60 pointer-events-none">32</div>
                  <p className="text-xs text-muted-foreground">Radius seeding the next step</p>
                </div>
              </ClickZone>
            </div>
          </div>

          {/* Step 2 ghost to show chaining */}
          <div className="bg-card/50 border border-dashed border-border rounded-lg p-4 flex flex-col gap-2 opacity-60">
            <span className="text-xs font-semibold text-primary">Step 2 <span className="text-muted-foreground font-normal">(searches around Step 1's hits)</span></span>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-input/50 border border-border rounded-md px-3 py-2 text-xs text-muted-foreground/40">Block…</div>
              <div className="bg-input/50 border border-border rounded-md px-3 py-2 text-xs text-muted-foreground/40">Block…</div>
            </div>
          </div>
        </section>

        {/* How -r vs -S vs -C differ — visual diagram */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">-r vs -S vs -C at a glance</h2>
          <div className="bg-card border border-border rounded-lg p-4 text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre">
{`World (10,000 × 10,000 blocks)
┌─────────────────────────────┐
│   ← Initial Radius (-r) →  │  Step 1 scans this whole area
│         ┌───┐               │
│         │ ✓ │  hit found    │
│         └─┬─┘               │
│     ←-S→ │ ←-S→            │  Step 2 searches within -S
│       ┌──┴──┐               │     of each Step 1 hit
│       │  ✓  │  hit found    │
│       └──┬──┘               │
│     ←-C→─┘                  │  -C: how big a "zone" this
│                             │     hit seeds into Step 3
└─────────────────────────────┘`}
          </div>
        </section>

        {/* Explanation panel */}
        {exp && (
          <div className={`sticky bottom-4 rounded-xl border-2 p-4 flex flex-col gap-2 shadow-2xl backdrop-blur-sm bg-card/95 ${FIELD_COLORS[active!].split(" ")[0]} ${FIELD_COLORS[active!].split(" ")[1]}`}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">{exp.title}</h3>
              <button onClick={() => setActive(null)} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
            </div>
            <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">{exp.body}</p>
            {exp.example && (
              <div className="mt-1 bg-muted/50 rounded-md px-3 py-2 text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Example: </span>{exp.example}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
