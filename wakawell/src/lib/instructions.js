const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "");

// Turns an OSRM step into a sentence
export function describe(step) {
  const { type, modifier } = step.maneuver;
  const name = step.name;
  switch (type) {
    case "depart":
      return `Head ${modifier ?? "out"}${name ? ` on ${name}` : ""}`;
    case "arrive":
      return "Arrive at your destination";
    case "roundabout":
    case "rotary":
      return `Take the roundabout${name ? ` onto ${name}` : ""}`;
    case "continue":
      return `Continue${name ? ` on ${name}` : ""}`;
    default: {
      const verb = type === "turn" || type === "end of road" ? "Turn" : cap(type);
      return `${verb} ${modifier ?? ""}${name ? ` onto ${name}` : ""}`.trim();
    }
  }
}

// Picks a direction glyph for a step
export function arrow(step) {
  const { type, modifier = "" } = step.maneuver;
  if (type === "arrive") return "●";
  if (type === "roundabout" || type === "rotary") return "↻";
  if (modifier.includes("left")) return "↰";
  if (modifier.includes("right")) return "↱";
  if (modifier === "uturn") return "↩";
  return "↑";
}
