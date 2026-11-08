import json
import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "assets"
OUT.mkdir(parents=True, exist_ok=True)

P = {
    "blue": ("#1E3A8A", "#DBEAFE"),
    "teal": ("#0F766E", "#CCFBF1"),
    "amber": ("#B45309", "#FEF3C7"),
    "red": ("#B91C1C", "#FEE2E2"),
    "gray": ("#374151", "#F3F4F6"),
    "green": ("#15803D", "#DCFCE7"),
    "purple": ("#6D28D9", "#EDE9FE"),
    "white": ("#E5E7EB", "#FFFFFF"),
}
LANE = {
    "blue": ("#CBD5E1", "#F8FAFC"),
    "red": ("#FECACA", "#FEF2F2"),
    "teal": ("#99F6E4", "#ECFEFF"),
    "amber": ("#FDE68A", "#FFFBEB"),
    "gray": ("#D1D5DB", "#F3F4F6"),
    "purple": ("#DDD6FE", "#F5F3FF"),
}
LANE_TEXT = {
    "blue": "#1E3A8A",
    "red": "#B91C1C",
    "teal": "#0F766E",
    "amber": "#B45309",
    "gray": "#374151",
    "purple": "#6D28D9",
}


class Diagram:
    def __init__(self, seed=1000):
        self.elements = []
        self.shapes = {}
        self.pending_text = []
        self.arrow_labels = []
        self.seed = seed

    def _next(self):
        self.seed += 1
        return self.seed

    def rect(
        self,
        eid,
        x,
        y,
        w,
        h,
        color="gray",
        label=None,
        dashed=False,
        stroke_width=2,
        font_size=12,
        text_color="#111827",
        rounded=True,
        shape_type="rectangle",
        opacity=100,
        label_pos="center",
        label_dx=0,
        label_dy=0,
        label_align=None,
    ):
        stroke, fill = P.get(color, P["gray"])
        el = {
            "id": eid,
            "type": shape_type,
            "x": x,
            "y": y,
            "width": w,
            "height": h,
            "angle": 0,
            "strokeColor": stroke,
            "backgroundColor": fill,
            "fillStyle": "solid",
            "strokeWidth": stroke_width,
            "strokeStyle": "dashed" if dashed else "solid",
            "roughness": 0,
            "opacity": opacity,
            "groupIds": [],
            "frameId": None,
            "roundness": {"type": 3} if rounded and shape_type == "rectangle" else None,
            "seed": self._next(),
            "version": 1,
            "versionNonce": self._next(),
            "isDeleted": False,
            "boundElements": [],
            "updated": 1,
            "link": None,
            "locked": False,
        }
        self.elements.append(el)
        self.shapes[eid] = el
        if label:
            self.pending_text.append(
                {
                    "shape": el,
                    "text": label,
                    "font_size": font_size,
                    "color": text_color,
                    "pos": label_pos,
                    "dx": label_dx,
                    "dy": label_dy,
                    "align": label_align,
                }
            )
        return el

    def text(
        self,
        eid,
        x,
        y,
        text,
        font_size=14,
        color="#111827",
        align="left",
        width=None,
        height=None,
        opacity=100,
    ):
        lines = text.split("\n")
        tw = width or max(40, max(len(line) for line in lines) * font_size * 0.62 + 8)
        th = height or max(font_size * 1.3, len(lines) * font_size * 1.25)
        el = {
            "id": eid,
            "type": "text",
            "x": x,
            "y": y,
            "width": tw,
            "height": th,
            "angle": 0,
            "strokeColor": color,
            "backgroundColor": "transparent",
            "fillStyle": "solid",
            "strokeWidth": 1,
            "strokeStyle": "solid",
            "roughness": 0,
            "opacity": opacity,
            "groupIds": [],
            "frameId": None,
            "roundness": None,
            "seed": self._next(),
            "version": 1,
            "versionNonce": self._next(),
            "isDeleted": False,
            "boundElements": None,
            "updated": 1,
            "link": None,
            "locked": False,
            "text": text,
            "fontSize": font_size,
            "fontFamily": 1,
            "textAlign": align,
            "verticalAlign": "top",
            "containerId": None,
            "originalText": text,
            "lineHeight": 1.25,
            "baseline": int(font_size * 0.8),
        }
        self.elements.append(el)
        return el

    def arrow(
        self,
        eid,
        from_id,
        to_id,
        color="#374151",
        dashed=False,
        label=None,
        stroke_width=2,
        opacity=100,
        label_offset=(0, -14),
        route=None,
    ):
        a = self.shapes[from_id]
        b = self.shapes[to_id]
        acx, acy = a["x"] + a["width"] / 2, a["y"] + a["height"] / 2
        bcx, bcy = b["x"] + b["width"] / 2, b["y"] + b["height"] / 2

        def edge(shape, tx, ty):
            cx, cy = shape["x"] + shape["width"] / 2, shape["y"] + shape["height"] / 2
            dx, dy = tx - cx, ty - cy
            if dx == 0 and dy == 0:
                return cx, cy
            sx = (shape["width"] / 2) / abs(dx) if dx else float("inf")
            sy = (shape["height"] / 2) / abs(dy) if dy else float("inf")
            s = min(sx, sy)
            return cx + dx * s, cy + dy * s

        if route:
            pts = [(float(px), float(py)) for px, py in route]
        else:
            x1, y1 = edge(a, bcx, bcy)
            x2, y2 = edge(b, acx, acy)
            pts = [(x1, y1), (x2, y2)]

        minx = min(p[0] for p in pts)
        miny = min(p[1] for p in pts)
        maxx = max(p[0] for p in pts)
        maxy = max(p[1] for p in pts)
        rel = [[p[0] - minx, p[1] - miny] for p in pts]

        el = {
            "id": eid,
            "type": "arrow",
            "x": minx,
            "y": miny,
            "width": maxx - minx,
            "height": maxy - miny,
            "angle": 0,
            "strokeColor": color,
            "backgroundColor": "transparent",
            "fillStyle": "solid",
            "strokeWidth": stroke_width,
            "strokeStyle": "dashed" if dashed else "solid",
            "roughness": 0,
            "opacity": opacity,
            "groupIds": [],
            "frameId": None,
            "roundness": {"type": 2},
            "seed": self._next(),
            "version": 1,
            "versionNonce": self._next(),
            "isDeleted": False,
            "boundElements": None,
            "updated": 1,
            "link": None,
            "locked": False,
            "points": rel,
            "lastCommittedPoint": None,
            "startBinding": {"elementId": from_id, "focus": 0, "gap": 4},
            "endBinding": {"elementId": to_id, "focus": 0, "gap": 4},
            "startArrowhead": None,
            "endArrowhead": "arrow",
            "elbowed": False,
        }
        self.elements.append(el)
        if isinstance(a.get("boundElements"), list):
            a["boundElements"].append({"id": eid, "type": "arrow"})
        if isinstance(b.get("boundElements"), list):
            b["boundElements"].append({"id": eid, "type": "arrow"})
        if label:
            lengths = [
                math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1])
                for i in range(len(pts) - 1)
            ]
            half = sum(lengths) / 2
            walked = 0.0
            lx, ly = pts[0]
            for i, length in enumerate(lengths):
                if walked + length >= half and length:
                    t = (half - walked) / length
                    lx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t
                    ly = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t
                    break
                walked += length
            self.arrow_labels.append(
                {
                    "x": lx + label_offset[0],
                    "y": ly + label_offset[1],
                    "text": label,
                    "color": color,
                }
            )
        return el

    def finish(self):
        # Add node/lane labels after arrows so text sits on top.
        for item in self.pending_text:
            s = item["shape"]
            lines = item["text"].split("\n")
            fs = item["font_size"]
            tw = max(30, max(len(line) for line in lines) * fs * 0.62 + 6)
            th = max(fs * 1.3, len(lines) * fs * 1.25)
            if item["pos"] == "left":
                tx = s["x"] + 16 + item["dx"]
                ty = s["y"] + 10 + item["dy"]
                align = item["align"] or "left"
            elif item["pos"] == "topleft":
                tx = s["x"] + 10 + item["dx"]
                ty = s["y"] + 8 + item["dy"]
                align = item["align"] or "left"
            else:
                tx = s["x"] + (s["width"] - tw) / 2 + item["dx"]
                ty = s["y"] + (s["height"] - th) / 2 + item["dy"]
                align = item["align"] or "center"
            self.text(
                f"{s['id']}-label",
                tx,
                ty,
                item["text"],
                font_size=fs,
                color=item["color"],
                align=align,
                width=tw + 12,
                height=th,
            )
        for i, lab in enumerate(self.arrow_labels):
            self.text(
                f"arrow-label-{i}",
                lab["x"],
                lab["y"],
                lab["text"],
                font_size=12,
                color=lab["color"],
                align="center",
                width=max(40, len(lab["text"]) * 7.6 + 8),
                height=16,
            )

    def save(self, name):
        self.finish()
        doc = {
            "type": "excalidraw",
            "version": 2,
            "source": "https://excalidraw.com",
            "elements": self.elements,
            "appState": {
                "gridSize": 20,
                "viewBackgroundColor": "#ffffff",
            },
            "files": {},
        }
        path = OUT / name
        path.write_text(json.dumps(doc, indent=2), encoding="utf-8")
        print(f"wrote {path} ({len(self.elements)} elements)")


def lane(d, eid, x, y, w, h, label, color="gray"):
    stroke, fill = LANE.get(color, LANE["gray"])
    el = d.rect(
        eid,
        x,
        y,
        w,
        h,
        color="gray",
        label=None,
        dashed=True,
        stroke_width=1,
        opacity=100,
        rounded=False,
    )
    # override lane colours
    el["strokeColor"] = stroke
    el["backgroundColor"] = fill
    d.text(
        f"{eid}-label",
        x + 20,
        y + 12,
        label,
        font_size=14,
        color=LANE_TEXT.get(color, "#374151"),
        align="left",
        width=max(200, len(label) * 8),
        height=20,
    )
    return el


def route_below(d, from_id, to_id, y):
    a = d.shapes[from_id]
    b = d.shapes[to_id]
    ax = a["x"] + a["width"] / 2
    bx = b["x"] + b["width"] / 2
    return [
        (ax, a["y"] + a["height"]),
        (ax, y),
        (bx, y),
        (bx, b["y"] + b["height"]),
    ]


# ---------------------------------------------------------------------------
# Diagram 1: AI-assisted Kanban flow
# ---------------------------------------------------------------------------
d1 = Diagram(seed=100)

d1.text(
    "d1-title",
    60,
    24,
    "AI-Assisted Kanban Flow: From Run Incident to Hotfix",
    font_size=28,
    color="#0F172A",
)
d1.text(
    "d1-subtitle",
    60,
    68,
    "Bundle work and run incidents share one board, one evidence chain, and explicit human gates.",
    font_size=14,
    color="#475569",
)
d1.text(
    "d1-legend",
    1430,
    34,
    "Blue = human flow   |   Teal = AI assist   |   Amber = human gate   |   Red = incident",
    font_size=12,
    color="#475569",
)

lane(d1, "d1-lane-bundle", 40, 120, 2120, 190, "PLANNED BUNDLE LANE", "blue")
lane(d1, "d1-lane-incident", 40, 340, 2120, 390, "RUN INCIDENT LANE — STABILISE BEFORE ROOT CAUSE", "red")
lane(d1, "d1-lane-ai", 40, 760, 2120, 190, "AI ASSIST — READ-ONLY EVIDENCE, CITE [E#]", "teal")
lane(d1, "d1-lane-gates", 40, 980, 2120, 180, "HUMAN GATES — NO GATE, NO PRODUCTION CHANGE", "amber")

bundle_nodes = [
    ("d1-B1", 120, 190, 180, 70, "Bundle topic\nin progress"),
    ("d1-B2", 380, 190, 180, 70, "Park context\n(10 min)"),
    ("d1-B3", 1500, 190, 200, 70, "Resume bundle\n(15 min re-entry)"),
    ("d1-B4", 1780, 190, 180, 70, "Re-plan\nif needed"),
]
for eid, x, y, w, h, label in bundle_nodes:
    d1.rect(eid, x, y, w, h, color="blue", label=label, font_size=12)

incident_nodes = [
    ("d1-I1", 80, 430, 160, 70, "Incident\ndetected", "red"),
    ("d1-I2", 280, 430, 170, 70, "Triage\nseverity & impact", "amber"),
    ("d1-I3", 490, 430, 190, 70, "Stabilise first\nrollback / flag / pause", "red"),
    ("d1-I4", 720, 430, 180, 70, "Diagnose\nRCA + evidence", "red"),
    ("d1-I5", 940, 430, 170, 70, "Scope\nminimal hotfix", "red"),
    ("d1-I6", 1150, 430, 160, 70, "Implement\n+ tests", "red"),
    ("d1-I7", 1350, 430, 160, 70, "Release gate\ncanary", "red"),
    ("d1-I8", 1550, 430, 170, 70, "Verify &\nreconcile", "green"),
    ("d1-I9", 1760, 430, 180, 70, "Postmortem\n+ actions", "green"),
]
for eid, x, y, w, h, label, color in incident_nodes:
    d1.rect(eid, x, y, w, h, color=color, label=label, font_size=12)

ai_nodes = [
    ("d1-A1", 400, 820, 160, 60, "Context-switch\nbrief"),
    ("d1-A2", 600, 820, 150, 60, "Log / trace\ncompression"),
    ("d1-A3", 840, 820, 150, 60, "Transaction\nreconstruction"),
    ("d1-A4", 1060, 820, 150, 60, "Hypothesis\nmatrix"),
    ("d1-A5", 1240, 820, 150, 60, "Test & fix\nassistant"),
    ("d1-A7", 1480, 820, 150, 60, "Comms / status\ndraft"),
    ("d1-A6", 1890, 820, 150, 60, "Postmortem\ndraft"),
]
for eid, x, y, w, h, label in ai_nodes:
    d1.rect(eid, x, y, w, h, color="teal", label=label, font_size=12)

gate_nodes = [
    ("d1-G1", 280, 1040, 190, 60, "Gate: severity,\nimpact, regulatory"),
    ("d1-G2", 720, 1040, 190, 60, "Gate: root cause\nvalidated"),
    ("d1-G3", 940, 1040, 190, 60, "Gate: hotfix\nscope & risk"),
    ("d1-G4", 1350, 1040, 200, 60, "Gate: QA/security\n+ change approval"),
    ("d1-G5", 1550, 1040, 210, 60, "Gate: data integrity\n/ reconciliation"),
    ("d1-G6", 1760, 1040, 200, 60, "Gate: regulatory\n& customer comms"),
]
for eid, x, y, w, h, label in gate_nodes:
    d1.rect(eid, x, y, w, h, color="amber", label=label, font_size=12, stroke_width=3)

d1.arrow("d1-e-b1-b2", "d1-B1", "d1-B2", color="#1E3A8A", label="park", label_offset=(0, -14))
d1.arrow("d1-e-b2-i1", "d1-B2", "d1-I1", color="#B91C1C", dashed=True, label="page", label_offset=(0, -24))
d1.arrow("d1-e-i1-i2", "d1-I1", "d1-I2", color="#B91C1C", label="triage", label_offset=(0, -52))
d1.arrow("d1-e-i2-i3", "d1-I2", "d1-I3", color="#B91C1C", label="stabilise", label_offset=(0, -52))
d1.arrow("d1-e-i3-i4", "d1-I3", "d1-I4", color="#B91C1C", label="diagnose", label_offset=(0, -52))
d1.arrow("d1-e-i4-i5", "d1-I4", "d1-I5", color="#B91C1C", label="scope", label_offset=(0, -52))
d1.arrow("d1-e-i5-i6", "d1-I5", "d1-I6", color="#B91C1C", label="implement", label_offset=(0, -52))
d1.arrow("d1-e-i6-i7", "d1-I6", "d1-I7", color="#B91C1C", label="release", label_offset=(0, -52))
d1.arrow("d1-e-i7-i8", "d1-I7", "d1-I8", color="#B91C1C", label="verify", label_offset=(0, -52))
d1.arrow("d1-e-i8-i9", "d1-I8", "d1-I9", color="#15803D", label="learn", label_offset=(0, -52))
d1.arrow(
    "d1-e-i7-i3",
    "d1-I7",
    "d1-I3",
    color="#B91C1C",
    dashed=True,
    label="rollback",
    label_offset=(0, -18),
    route=route_below(d1, "d1-I7", "d1-I3", 706),
)
d1.arrow("d1-e-i9-b3", "d1-I9", "d1-B3", color="#15803D", label="return", label_offset=(0, -24))
d1.arrow("d1-e-b3-b4", "d1-B3", "d1-B4", color="#1E3A8A", label="re-plan", label_offset=(0, -14))
d1.arrow("d1-e-b2-a1", "d1-B2", "d1-A1", color="#0F766E", dashed=True, label="brief", label_offset=(0, -14))
d1.arrow("d1-e-a1-i2", "d1-A1", "d1-I2", color="#0F766E", dashed=True)
d1.arrow("d1-e-a2-i4", "d1-A2", "d1-I4", color="#0F766E", dashed=True)
d1.arrow("d1-e-a3-i4", "d1-A3", "d1-I4", color="#0F766E", dashed=True)
d1.arrow("d1-e-a4-i4", "d1-A4", "d1-I4", color="#0F766E", dashed=True)
d1.arrow("d1-e-a5-i6", "d1-A5", "d1-I6", color="#0F766E", dashed=True)
d1.arrow("d1-e-a7-i7", "d1-A7", "d1-I7", color="#0F766E", dashed=True)
d1.arrow("d1-e-a6-i9", "d1-A6", "d1-I9", color="#0F766E", dashed=True)
d1.arrow("d1-e-g1-i2", "d1-G1", "d1-I2", color="#B45309", dashed=True)
d1.arrow("d1-e-g2-i4", "d1-G2", "d1-I4", color="#B45309", dashed=True)
d1.arrow("d1-e-g3-i5", "d1-G3", "d1-I5", color="#B45309", dashed=True)
d1.arrow("d1-e-g4-i7", "d1-G4", "d1-I7", color="#B45309", dashed=True)
d1.arrow("d1-e-g5-i8", "d1-G5", "d1-I8", color="#B45309", dashed=True)
d1.arrow("d1-e-g6-i9", "d1-G6", "d1-I9", color="#B45309", dashed=True)

d1.text(
    "d1-note-1",
    60,
    1180,
    "AI proposes; human gates decide. Stabilise before root cause. Re-entry is part of the flow.",
    font_size=14,
    color="#334155",
)
d1.text(
    "d1-note-2",
    1680,
    1180,
    "No raw PAN/PII. Redact. Cite evidence.",
    font_size=12,
    color="#B91C1C",
)
d1.save("ai-assisted-kanban-flow.excalidraw")


# ---------------------------------------------------------------------------
# Diagram 2: Dev & QA touchpoints
# ---------------------------------------------------------------------------
d2 = Diagram(seed=2000)

d2.text(
    "d2-title",
    60,
    24,
    "Dev & QA GenAI Touchpoints in the Fintech Pipeline",
    font_size=28,
    color="#0F172A",
)
d2.text(
    "d2-subtitle",
    60,
    68,
    "One pipeline, two accountable roles, one evidence chain. AI assists; gates verify.",
    font_size=14,
    color="#475569",
)
d2.text(
    "d2-legend",
    1300,
    34,
    "Blue = Dev   |   Green = QA   |   Teal = AI   |   Amber = gate / evidence",
    font_size=12,
    color="#475569",
)

d2.rect("d2-lane-dev", 40, 170, 2120, 180, color="gray", dashed=True, rounded=False, opacity=100)
d2.shapes["d2-lane-dev"]["backgroundColor"] = "#EFF6FF"
d2.shapes["d2-lane-dev"]["strokeColor"] = "#BFDBFE"
d2.text("d2-lane-dev-label", 52, 182, "DEV", font_size=14, color="#1E3A8A")
d2.rect("d2-lane-ai", 40, 360, 2120, 180, color="gray", dashed=True, rounded=False)
d2.shapes["d2-lane-ai"]["backgroundColor"] = "#ECFEFF"
d2.shapes["d2-lane-ai"]["strokeColor"] = "#99F6E4"
d2.text("d2-lane-ai-label", 52, 372, "AI", font_size=14, color="#0F766E")
d2.rect("d2-lane-qa", 40, 550, 2120, 180, color="gray", dashed=True, rounded=False)
d2.shapes["d2-lane-qa"]["backgroundColor"] = "#F0FDF4"
d2.shapes["d2-lane-qa"]["strokeColor"] = "#BBF7D0"
d2.text("d2-lane-qa-label", 52, 562, "QA", font_size=14, color="#15803D")
d2.rect("d2-lane-gate", 40, 740, 2120, 180, color="gray", dashed=True, rounded=False)
d2.shapes["d2-lane-gate"]["backgroundColor"] = "#FFFBEB"
d2.shapes["d2-lane-gate"]["strokeColor"] = "#FDE68A"
d2.text("d2-lane-gate-label", 52, 752, "GATE", font_size=14, color="#B45309")
d2.rect("d2-lane-controls", 40, 940, 2120, 110, color="gray", dashed=True, rounded=False)
d2.shapes["d2-lane-controls"]["backgroundColor"] = "#F5F3FF"
d2.shapes["d2-lane-controls"]["strokeColor"] = "#DDD6FE"
d2.text("d2-lane-controls-label", 52, 952, "CONTROLS", font_size=14, color="#6D28D9")

stages = ["DISCOVER", "DESIGN", "BUILD", "REVIEW", "VERIFY", "RELEASE", "OPERATE", "LEARN"]
for i, stage in enumerate(stages):
    x = 140 + i * 250
    d2.rect(
        f"d2-stage-{i+1}",
        x,
        100,
        200,
        50,
        color="blue",
        label=f"{i+1}. {stage}",
        font_size=13,
        text_color="#1E3A8A",
    )
    # vertical separator
    sep = d2.rect(
        f"d2-sep-{i}",
        x - 20,
        150,
        2,
        790,
        color="gray",
        dashed=True,
        rounded=False,
        opacity=100,
    )
    sep["backgroundColor"] = "transparent"
    sep["strokeColor"] = "#CBD5E1"
    sep["strokeWidth"] = 1

dev = [
    "Clarify AC,\nrisk, data class",
    "Threat model,\nADR, API shape",
    "Implement +\nunit tests",
    "Self-review,\nsmall PR",
    "Contract +\nintegration tests",
    "Release checklist,\nrollback",
    "Observe, runbook,\nflags",
    "Permanent fix,\nPM actions",
]
qa = [
    "Review AC for\ntestability",
    "Risk-based\ntest plan",
    "Boundary +\nproperty tests",
    "Review test diff,\noracle quality",
    "Regression +\nexploratory",
    "Sign-off,\nresidual risk",
    "Production\nverification",
    "Escape analysis,\nregression test",
]
ai = [
    "AC generator\nprompt",
    "Threat model\nprompt",
    "Test stub\ngenerator",
    "Code review\nagent",
    "Contract diff\nMCP + skill",
    "Release risk\nprompt",
    "RCA / incident\nagent",
    "Postmortem\nskill",
]
gates = [
    "Definition\nof Ready",
    "Design\nreview",
    "Unit + static\n+ secret scan",
    "Peer review\n+ CODEOWNERS",
    "QA + contract\ngates",
    "Change advisory\n+ canary",
    "SLO +\nreconciliation",
    "Actions\nclosed",
]

for i in range(8):
    x = 150 + i * 250
    d2.rect(f"d2-D{i+1}", x, 210, 180, 70, color="blue", label=dev[i], font_size=12)
    d2.rect(f"d2-A{i+1}", x, 390, 180, 70, color="teal", label=ai[i], font_size=12)
    d2.rect(f"d2-Q{i+1}", x, 570, 180, 70, color="green", label=qa[i], font_size=12)
    d2.rect(f"d2-G{i+1}", x, 750, 180, 60, color="amber", label=gates[i], font_size=12, stroke_width=3)

for i in range(7):
    d2.arrow(f"d2-e-dev-{i+1}", f"d2-D{i+1}", f"d2-D{i+2}", color="#1E3A8A")
    d2.arrow(f"d2-e-qa-{i+1}", f"d2-Q{i+1}", f"d2-Q{i+2}", color="#15803D")

for i in range(8):
    d2.arrow(f"d2-e-ai-dev-{i+1}", f"d2-A{i+1}", f"d2-D{i+1}", color="#0F766E", dashed=True, opacity=75)
    d2.arrow(f"d2-e-ai-qa-{i+1}", f"d2-A{i+1}", f"d2-Q{i+1}", color="#0F766E", dashed=True, opacity=75)
    d2.arrow(f"d2-e-gate-{i+1}", f"d2-G{i+1}", f"d2-Q{i+1}", color="#B45309", dashed=True, opacity=75)

d2.text(
    "d2-controls-text",
    60,
    970,
    "Identity & access   |   Data classification   |   Audit & evidence   |   Evaluation   |   Human accountability",
    font_size=16,
    color="#4C1D95",
)
d2.text(
    "d2-note",
    60,
    1075,
    "QA owns the oracle. Dev owns the code. The gate owns the evidence. AI assists, but never signs off.",
    font_size=14,
    color="#334155",
)
d2.save("dev-qa-genai-touchpoints.excalidraw")


# ---------------------------------------------------------------------------
# Diagram 3: Extensibility architecture
# ---------------------------------------------------------------------------
d3 = Diagram(seed=4000)

d3.text(
    "d3-title",
    60,
    24,
    "Extensibility Architecture: Skills, Agents, MCP & Plugins",
    font_size=28,
    color="#0F172A",
)
d3.text(
    "d3-subtitle",
    60,
    68,
    "Copilot surfaces load governed customisations; the MCP gateway enforces identity, policy, redaction, limits, and audit.",
    font_size=14,
    color="#475569",
)
d3.text(
    "d3-legend",
    1390,
    34,
    "Teal = customisation   |   Amber = gateway   |   Gray = system   |   Purple = cross-cutting",
    font_size=12,
    color="#475569",
)

# layer bands
BAND_TEXT = {
    "#CBD5E1": "#334155",
    "#99F6E4": "#0F766E",
    "#FDE68A": "#B45309",
    "#D1D5DB": "#374151",
    "#DDD6FE": "#6D28D9",
}
for eid, x, y, w, h, fill, stroke, label in [
    ("d3-band-surfaces", 40, 110, 2120, 150, "#F8FAFC", "#CBD5E1", "SURFACES"),
    ("d3-band-custom", 40, 330, 2120, 170, "#ECFEFF", "#99F6E4", "CUSTOMISATION LAYER"),
    ("d3-band-gateway", 40, 570, 2120, 230, "#FFFBEB", "#FDE68A", "GATEWAY / TRUST BOUNDARY"),
    ("d3-band-systems", 40, 870, 2120, 160, "#F3F4F6", "#D1D5DB", "INTERNAL SYSTEMS"),
    ("d3-band-controls", 40, 1100, 2120, 100, "#F5F3FF", "#DDD6FE", "CROSS-CUTTING CONTROLS"),
]:
    d3.rect(eid, x, y, w, h, color="gray", dashed=True, rounded=False)
    d3.shapes[eid]["backgroundColor"] = fill
    d3.shapes[eid]["strokeColor"] = stroke
    d3.text(f"{eid}-label", x + 16, y + 10, label, font_size=13, color=BAND_TEXT.get(stroke, "#374151"))

surfaces = [
    ("d3-S1", 100, 140, 400, 90, "IDE\n(VS Code / JetBrains / Visual Studio)"),
    ("d3-S2", 600, 140, 400, 90, "Copilot CLI"),
    ("d3-S3", 1100, 140, 400, 90, "GitHub.com / Cloud Agent"),
    ("d3-S4", 1600, 140, 400, 90, "Copilot Code Review"),
]
for eid, x, y, w, h, label in surfaces:
    d3.rect(eid, x, y, w, h, color="blue", label=label, font_size=12)

customs = [
    ("d3-C1", 100, 380, 300, 90, "Instructions"),
    ("d3-C2", 440, 380, 300, 90, "Prompt files"),
    ("d3-C3", 780, 380, 300, 90, "Skills"),
    ("d3-C4", 1120, 380, 300, 90, "Custom agents"),
    ("d3-C5", 1460, 380, 300, 90, "Hooks"),
    ("d3-C6", 1800, 380, 300, 90, "Plugins"),
]
for eid, x, y, w, h, label in customs:
    d3.rect(eid, x, y, w, h, color="teal", label=label, font_size=13)

# gateway big box
d3.rect(
    "d3-G",
    100,
    620,
    2000,
    160,
    color="amber",
    stroke_width=3,
)
d3.text(
    "d3-g-title",
    130,
    640,
    "MCP GATEWAY / COPILOT CONNECTORS",
    font_size=18,
    color="#92400E",
)
gateway_controls = [
    ("d3-GC1", 290, "AuthN / AuthZ"),
    ("d3-GC2", 620, "Policy"),
    ("d3-GC3", 950, "DLP / redaction"),
    ("d3-GC4", 1280, "Rate limits"),
    ("d3-GC5", 1610, "Audit"),
]
for eid, x, label in gateway_controls:
    d3.rect(
        eid,
        x,
        690,
        300,
        55,
        color="white",
        label=label,
        font_size=13,
        stroke_width=1,
        text_color="#92400E",
    )

systems = [
    ("d3-T1", 100, 900, 300, 90, "Git & API registry"),
    ("d3-T2", 440, 900, 300, 90, "Policy engine"),
    ("d3-T3", 780, 900, 300, 90, "Observability\n(read-only)"),
    ("d3-T4", 1120, 900, 300, 90, "CI/CD"),
    ("d3-T5", 1460, 900, 300, 90, "Ticketing & docs"),
    ("d3-T6", 1800, 900, 300, 90, "Secrets / KMS"),
]
for eid, x, y, w, h, label in systems:
    d3.rect(eid, x, y, w, h, color="gray", label=label, font_size=12)

# trust boundary
tb = d3.rect(
    "d3-trust-boundary",
    80,
    600,
    2000,
    440,
    color="gray",
    dashed=True,
    rounded=False,
    opacity=100,
)
tb["backgroundColor"] = "transparent"
tb["strokeColor"] = "#B45309"
tb["strokeWidth"] = 2

# arrows
for i, sid in enumerate(["d3-S1", "d3-S2", "d3-S3", "d3-S4"]):
    d3.arrow(f"d3-e-load-{i+1}", sid, ["d3-C1", "d3-C2", "d3-C3", "d3-C4"][i], color="#0F766E", dashed=True, label="loads" if i == 0 else None)
for i, cid in enumerate(["d3-C1", "d3-C2", "d3-C3", "d3-C4", "d3-C5", "d3-C6"]):
    d3.arrow(f"d3-e-call-{i+1}", cid, "d3-G", color="#0F766E", label="tools" if i == 0 else None)
for i, tid in enumerate(["d3-T1", "d3-T2", "d3-T3", "d3-T4", "d3-T5", "d3-T6"]):
    d3.arrow(f"d3-e-read-{i+1}", "d3-G", tid, color="#B45309", label="scoped" if i == 0 else None)
for i, tid in enumerate(["d3-T1", "d3-T3", "d3-T4"]):
    d3.arrow(f"d3-e-return-{i+1}", tid, "d3-G", color="#6B7280", dashed=True, label="data" if i == 0 else None, opacity=70)
d3.arrow("d3-e-audit", "d3-G", "d3-band-controls", color="#6D28D9", dashed=True, label="audit", label_offset=(0, -14))

d3.text(
    "d3-controls-items",
    60,
    1134,
    "Identity & access   |   Audit / SIEM   |   Evaluation   |   Cost & capacity   |   Human approval",
    font_size=15,
    color="#4C1D95",
)

d3.text(
    "d3-note-left",
    60,
    1225,
    "Least privilege by default. Read-only unless explicitly approved.",
    font_size=13,
    color="#334155",
)
d3.text(
    "d3-note-right",
    1420,
    1225,
    "If it cannot be audited, it cannot scale.",
    font_size=13,
    color="#6D28D9",
)
d3.save("extensibility-architecture.excalidraw")
