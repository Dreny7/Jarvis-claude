import React from "react";
import { AbsoluteFill } from "remotion";
import { U, USER } from "../theme";
import { FacetMark } from "../../v4/components/FacetMark";

/* minimal stroke icon set */
const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({ name, size = 22, color = U.text2 }) => {
  const p: Record<string, React.ReactNode> = {
    grid: (<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>),
    bag: (<><rect x="3" y="7" width="18" height="14" rx="2.5" /><path d="M8 7V5a4 4 0 0 1 8 0v2" /></>),
    chat: (<path d="M4 5h16v11H9l-5 4V5z" />),
    list: (<><path d="M4 6h16M4 12h16M4 18h10" /></>),
    msg: (<path d="M5 5h14v10H10l-4 3v-3H5z" />),
    sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></>),
    search: (<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>),
    bell: (<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6zM10 20a2 2 0 0 0 4 0" />),
    plus: (<path d="M12 5v14M5 12h14" />),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {p[name]}
    </svg>
  );
};

const RailBtn: React.FC<{ name: string; active?: boolean }> = ({ name, active }) => (
  <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: active ? U.pureWhite : "transparent" }}>
    <Icon name={name} color={active ? U.ink : U.text2} />
  </div>
);

export const NavRail: React.FC<{ active: "dashboard" | "agents" | "chat" | "feed" | "settings" }> = ({ active }) => (
  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 72, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22, paddingBottom: 22, gap: 18, borderRight: `1px solid ${U.hairlineSoft}`, backgroundColor: U.bg }}>
    <div style={{ marginBottom: 6 }}><FacetMark width={38} facetProgress={[1, 1, 1, 1, 1]} color={U.orange} /></div>
    <RailBtn name="grid" active={active === "dashboard"} />
    <RailBtn name="bag" active={active === "agents"} />
    <RailBtn name="chat" active={active === "chat"} />
    <RailBtn name="list" active={active === "feed"} />
    <RailBtn name="msg" />
    <RailBtn name="sun" />
    <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: U.orangeCta, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 4 }}>
      <Icon name="plus" color="#fff" />
    </div>
    <div style={{ marginTop: "auto", position: "relative" }}>
      <div style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: U.surface, border: `1px solid ${U.hairline}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: U.font, fontWeight: 800, fontSize: 14, color: U.white }}>{USER.initials}</div>
      <div style={{ position: "absolute", right: 0, bottom: 0, width: 10, height: 10, borderRadius: 999, backgroundColor: U.orange, border: `2px solid ${U.bg}` }} />
    </div>
  </div>
);

export const TopBar: React.FC<{ page: string }> = ({ page }) => (
  <div style={{ position: "absolute", left: 72, right: 0, top: 0, height: 72, display: "flex", alignItems: "center", paddingLeft: 32, paddingRight: 32, gap: 16 }}>
    <div style={{ fontFamily: U.font, fontWeight: 700, fontSize: 20, color: U.ink, backgroundColor: U.pureWhite, padding: "8px 22px", borderRadius: 999 }}>{page}</div>
    <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
      {["search", "sun", "bell"].map((n) => (
        <div key={n} style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: U.surface, border: `1px solid ${U.hairline}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={n} size={20} />
        </div>
      ))}
    </div>
  </div>
);

/** Full chrome frame: rail + top bar + a content area inset. */
export const Frame: React.FC<{ active: "dashboard" | "agents" | "chat" | "feed" | "settings"; page: string; children: React.ReactNode }> = ({ active, page, children }) => (
  <AbsoluteFill style={{ backgroundColor: U.bg }}>
    <NavRail active={active} />
    <TopBar page={page} />
    <div style={{ position: "absolute", left: 72, right: 0, top: 72, bottom: 0, overflow: "hidden" }}>{children}</div>
  </AbsoluteFill>
);

export { Icon };
