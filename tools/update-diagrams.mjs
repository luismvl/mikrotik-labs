import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const LABS_DIR = join(ROOT, "labs");

function q(text) {
  return `["${text}"]`;
}

function edgeLabel(a, label, b) {
  return `${a} -->|"${label}"| ${b}`;
}

function edge(a, b) {
  return `${a} --> ${b}`;
}

function classDef(name, styles) {
  return `classDef ${name} ${styles}`;
}

function detectMtcnaTopic(manifest) {
  const topics = (manifest.topics || []).map((t) => t.toLowerCase());
  const id = manifest.id.toLowerCase();
  const title = (manifest.title || "").toLowerCase();
  const mode = (manifest.mode || "").toLowerCase();
  const combined = `${id} ${title} ${topics.join(" ")}`;

  if (combined.includes("troubleshoot") || combined.includes("broken")) {
    return "troubleshooting";
  }
  if (topics.includes("wireless") || topics.includes("physical")) {
    return "wireless-physical";
  }
  if (topics.includes("final") || topics.includes("integrated")) {
    return "final-integrated";
  }
  if (topics.includes("nat") || topics.includes("masquerade")) {
    return "nat";
  }
  if (topics.includes("dhcp")) {
    return "dhcp";
  }
  if (topics.includes("firewall") || topics.includes("fasttrack") || topics.includes("connection")) {
    return "firewall";
  }
  if (topics.includes("bridge")) {
    return "bridge";
  }
  if (topics.includes("vlan")) {
    return "vlan";
  }
  if (topics.includes("static") || topics.includes("routing")) {
    return "routing";
  }
  if (topics.includes("dns") || topics.includes("ntp")) {
    return "services";
  }
  if (topics.includes("arp")) {
    return "arp";
  }
  if (topics.includes("queue") || topics.includes("qos")) {
    return "queues";
  }
  if (topics.includes("ppp") || topics.includes("pppoe")) {
    return "ppp";
  }
  if (topics.includes("tunnel")) {
    return "tunnel";
  }
  if (topics.includes("backup") || topics.includes("export")) {
    return "backup";
  }
  if (topics.includes("tools") || topics.includes("ping")) {
    return "tools";
  }
  if (topics.includes("access") || topics.includes("basic")) {
    return "access";
  }
  if (topics.includes("interface") || topics.includes("ip")) {
    return "interface";
  }
  if (mode === "quiz") {
    return "quiz";
  }
  return "generic";
}

function detectMtcreTopic(manifest) {
  const topics = (manifest.topics || []).map((t) => t.toLowerCase());
  const id = manifest.id.toLowerCase();
  const title = (manifest.title || "").toLowerCase();
  const combined = `${id} ${title} ${topics.join(" ")}`;

  if (topics.includes("final") || topics.includes("integrated-challenge")) {
    return "final-challenge";
  }
  if (topics.includes("ospf") && topics.includes("troubleshooting")) {
    return "ospf-troubleshooting";
  }
  if (topics.includes("ospf")) {
    return "ospf";
  }
  if (topics.includes("ecmp") && topics.includes("troubleshooting")) {
    return "ecmp-troubleshooting";
  }
  if (topics.includes("ecmp")) {
    return "ecmp";
  }
  if (topics.includes("failover") || topics.includes("recursive") || topics.includes("recursive-routes")) {
    return "recursive-failover";
  }
  if (topics.includes("policy-routing") || topics.includes("routing-rules")) {
    return "policy-routing";
  }
  if (topics.includes("qinq")) {
    return "qinq";
  }
  if (topics.includes("vlan")) {
    return "vlan";
  }
  if (topics.includes("tunnel") || topics.includes("tunnels") || topics.includes("gre") || topics.includes("ipip") || topics.includes("eoip")) {
    return "tunnels";
  }
  if (combined.includes("troubleshoot")) {
    return "troubleshooting";
  }
  if (topics.includes("scope") || topics.includes("target-scope")) {
    return "scope";
  }
  if (topics.includes("distance") || topics.includes("preference")) {
    return "distance";
  }
  if (topics.includes("more-specific-routes") || topics.includes("specific") || combined.includes("more specific")) {
    return "specific-routes";
  }
  if (topics.includes("point-to-point") || combined.includes("point-to-point") || combined.includes("/31")) {
    return "point-to-point";
  }
  if (topics.includes("gateway-check") || topics.includes("gateway") || combined.includes("gateway")) {
    return "gateway";
  }
  if (topics.includes("static-routing") || combined.includes("static routing")) {
    return "static-routing";
  }
  return "generic";
}

function buildMtcnaDiagram(manifest) {
  const topic = detectMtcnaTopic(manifest);
  const lines = ["flowchart LR"];
  const id = manifest.id;
  const title = manifest.title || id;
  const mode = (manifest.mode || "containerlab").toLowerCase();

  lines.push(`  user${q("User / Client")}`);
  lines.push(`  r1${q("r1 - MikroTik")}`);

  switch (topic) {
    case "wireless-physical": {
      lines.push(`  chr${q("CHR Limitation")}`);
      lines.push(`  phy${q("Physical MikroTik")}`);
      lines.push(`  wlan${q("Wireless Interface")}`);
      lines.push(`  ssid${q("SSID + WPA2")}`);
      lines.push(`  dhcpSrv${q("DHCP Server")}`);
      lines.push(`  client${q("WiFi Client")}`);
      lines.push(`  validate${q("Manual Validation")}`);
      if (mode === "quiz") {
        lines.push(`  quiz${q("Conceptual Quiz")}`);
        lines.push(`  diagTs${q("Diagram Troubleshooting")}`);
        lines.push(edge("user", "chr"));
        lines.push(edge("chr", "quiz"));
        lines.push(edge("quiz", "diagTs"));
        lines.push(edge("diagTs", "validate"));
      } else {
        lines.push(`  routerboard${q("RouterBOARD")}`);
        lines.push(edge("user", "chr"));
        lines.push(edge("chr", "phy"));
        lines.push(edge("phy", "wlan"));
        lines.push(edge("phy", "routerboard"));
        lines.push(edgeLabel("routerboard", "optional path", "validate"));
      }
      lines.push(edge("wlan", "ssid"));
      lines.push(edge("ssid", "dhcpSrv"));
      lines.push(edge("dhcpSrv", "client"));
      lines.push(edge("client", "validate"));
      lines.push(classDef("chrNode", "fill:#f9a825,stroke:#f57f17,color:#000"));
      lines.push(classDef("phyNode", "fill:#2e7d32,stroke:#1b5e20,color:#fff"));
      lines.push("class chr chrNode");
      lines.push("class phy phyNode");
      break;
    }
    case "final-integrated": {
      lines.push(`  r2${q("r2 - MikroTik")}`);
      lines.push(`  ipCfg${q("IP Addressing")}`);
      lines.push(`  dhcpCfg${q("DHCP Config")}`);
      lines.push(`  natCfg${q("NAT Masquerade")}`);
      lines.push(`  fwCfg${q("Firewall Filter")}`);
      lines.push(`  qCfg${q("Simple Queues")}`);
      lines.push(`  diag${q("Diagnostics")}`);
      lines.push(`  pass${q("Exam Validation")}`);
      lines.push(edge("user", "r1"));
      lines.push(edgeLabel("r1", "ether1", "r2"));
      lines.push(edge("r1", "ipCfg"));
      lines.push(edge("ipCfg", "dhcpCfg"));
      lines.push(edge("dhcpCfg", "natCfg"));
      lines.push(edge("natCfg", "fwCfg"));
      lines.push(edge("fwCfg", "qCfg"));
      lines.push(edge("qCfg", "diag"));
      lines.push(edge("diag", "pass"));
      lines.push(classDef("examNode", "fill:#c62828,stroke:#b71c1c,color:#fff"));
      lines.push("class pass examNode");
      break;
    }
    case "nat": {
      lines.push(`  r2${q("r2 - ISP Sim")}`);
      lines.push(`  ether1${q("ether1 WAN")}`);
      lines.push(`  ether2${q("ether2 LAN")}`);
      lines.push(`  natRule${q("srcnat masquerade")}`);
      lines.push(`  internet${q("Internet Simulated")}`);
      lines.push(`  validate${q("Ping Validation")}`);
      lines.push(edge("user", "r1"));
      lines.push(edge("r1", "ether1"));
      lines.push(edge("r1", "ether2"));
      lines.push(edge("ether1", "natRule"));
      lines.push(edgeLabel("ether1", "WAN link", "r2"));
      lines.push(edge("natRule", "internet"));
      lines.push(edge("internet", "validate"));
      lines.push(classDef("wanNode", "fill:#1565c0,stroke:#0d47a1,color:#fff"));
      lines.push("class ether1 wanNode");
      break;
    }
    case "dhcp": {
      lines.push(`  ether1${q("ether1 WAN")}`);
      lines.push(`  ether2${q("ether2 LAN")}`);
      lines.push(`  dhcpCli${q("DHCP Client")}`);
      lines.push(`  dhcpSrv${q("DHCP Server")}`);
      lines.push(`  pool${q("Address Pool")}`);
      lines.push(`  lease${q("Client Lease")}`);
      lines.push(`  validate${q("Lease Validation")}`);
      lines.push(edge("user", "r1"));
      lines.push(edge("r1", "ether1"));
      lines.push(edge("r1", "ether2"));
      lines.push(edge("ether1", "dhcpCli"));
      lines.push(edge("ether2", "dhcpSrv"));
      lines.push(edge("dhcpSrv", "pool"));
      lines.push(edge("pool", "lease"));
      lines.push(edge("lease", "validate"));
      lines.push(classDef("dhcpNode", "fill:#00838f,stroke:#006064,color:#fff"));
      lines.push("class dhcpSrv dhcpNode");
      break;
    }
    case "firewall": {
      lines.push(`  ether1${q("ether1 WAN")}`);
      lines.push(`  ether2${q("ether2 LAN")}`);
      lines.push(`  inputChain${q("Input Chain")}`);
      lines.push(`  fwdChain${q("Forward Chain")}`);
      lines.push(`  fasttrack${q("FastTrack Rule")}`);
      lines.push(`  dropRule${q("Drop Invalid")}`);
      lines.push(`  validate${q("Connection Test")}`);
      lines.push(edge("user", "r1"));
      lines.push(edge("r1", "ether1"));
      lines.push(edge("r1", "ether2"));
      lines.push(edge("ether1", "inputChain"));
      lines.push(edge("ether2", "fwdChain"));
      lines.push(edge("fwdChain", "fasttrack"));
      lines.push(edge("inputChain", "dropRule"));
      lines.push(edge("dropRule", "validate"));
      lines.push(classDef("fwNode", "fill:#d32f2f,stroke:#b71c1c,color:#fff"));
      lines.push("class inputChain fwNode");
      break;
    }
    case "bridge": {
      lines.push(`  bridge1${q("Bridge1")}`);
      lines.push(`  ether2${q("ether2")}`);
      lines.push(`  ether3${q("ether3")}`);
      lines.push(`  portAdd${q("Add Ports")}`);
      lines.push(`  stp${q("STP / RSTP")}`);
      lines.push(`  validate${q("Bridge Validation")}`);
      lines.push(edge("user", "r1"));
      lines.push(edge("r1", "bridge1"));
      lines.push(edge("bridge1", "ether2"));
      lines.push(edge("bridge1", "ether3"));
      lines.push(edge("bridge1", "portAdd"));
      lines.push(edge("portAdd", "stp"));
      lines.push(edge("stp", "validate"));
      lines.push(classDef("brNode", "fill:#5e35b1,stroke:#4527a0,color:#fff"));
      lines.push("class bridge1 brNode");
      break;
    }
    case "vlan": {
      lines.push(`  bridge1${q("Bridge1")}`);
      lines.push(`  vlanIf${q("VLAN Interface")}`);
      lines.push(`  tagged${q("Tagged Ports")}`);
      lines.push(`  untagged${q("Untagged Ports")}`);
      lines.push(`  validate${q("VLAN Validation")}`);
      lines.push(edge("user", "r1"));
      lines.push(edge("r1", "bridge1"));
      lines.push(edge("bridge1", "vlanIf"));
      lines.push(edge("vlanIf", "tagged"));
      lines.push(edge("vlanIf", "untagged"));
      lines.push(edge("tagged", "validate"));
      lines.push(classDef("vlanNode", "fill:#00695c,stroke:#004d40,color:#fff"));
      lines.push("class vlanIf vlanNode");
      break;
    }
    case "routing": {
      lines.push(`  r2${q("r2 - MikroTik")}`);
      lines.push(`  ether1${q("ether1 WAN")}`);
      lines.push(`  ether2${q("ether2 LAN")}`);
      lines.push(`  staticRt${q("Static Routes")}`);
      lines.push(`  gwCheck${q("Gateway Check")}`);
      lines.push(`  validate${q("Ping Validation")}`);
      lines.push(edge("user", "r1"));
      lines.push(edge("r1", "ether1"));
      lines.push(edge("r1", "ether2"));
      lines.push(edgeLabel("ether1", "/30 link", "r2"));
      lines.push(edge("r1", "staticRt"));
      lines.push(edge("staticRt", "gwCheck"));
      lines.push(edge("gwCheck", "validate"));
      lines.push(classDef("rtNode", "fill:#1565c0,stroke:#0d47a1,color:#fff"));
      lines.push("class staticRt rtNode");
      break;
    }
    case "access": {
      lines.push(`  winbox${q("WinBox")}`);
      lines.push(`  ssh${q("SSH")}`);
      lines.push(`  webfig${q("WebFig")}`);
      lines.push(`  serial${q("Serial Console")}`);
      lines.push(`  validate${q("Service Verification")}`);
      lines.push(edge("user", "winbox"));
      lines.push(edge("user", "ssh"));
      lines.push(edge("user", "webfig"));
      lines.push(edge("winbox", "r1"));
      lines.push(edge("ssh", "r1"));
      lines.push(edge("webfig", "r1"));
      lines.push(edge("r1", "serial"));
      lines.push(edge("serial", "validate"));
      lines.push(classDef("accNode", "fill:#2e7d32,stroke:#1b5e20,color:#fff"));
      lines.push("class winbox accNode");
      break;
    }
    case "interface": {
      lines.push(`  ether1${q("ether1")}`);
      lines.push(`  ether2${q("ether2")}`);
      lines.push(`  ipAddr${q("IP Address")}`);
      lines.push(`  ipPool${q("IP Pool")}`);
      lines.push(`  validate${q("Interface Check")}`);
      lines.push(edge("user", "r1"));
      lines.push(edge("r1", "ether1"));
      lines.push(edge("r1", "ether2"));
      lines.push(edge("ether1", "ipAddr"));
      lines.push(edge("ether2", "ipPool"));
      lines.push(edge("ipAddr", "validate"));
      lines.push(classDef("ifNode", "fill:#37474f,stroke:#263238,color:#fff"));
      lines.push("class ether1 ifNode");
      break;
    }
    case "troubleshooting": {
      const idLower = id.toLowerCase();
      const titleLower = (title || "").toLowerCase();
      const tsText = `${idLower} ${titleLower}`;
      let symptomLabel = "Broken Symptom";
      let suspectLabel = "Suspect Component";
      let toolLabel = "RouterOS Tool / Check";
      let fixLabel = "Fix Applied";
      if (tsText.includes("dhcp") || tsText.includes("nat")) {
        symptomLabel = "No IP / No Internet";
        suspectLabel = "DHCP Server / NAT Rule";
        toolLabel = "DHCP Lease + NAT Check";
        fixLabel = "Fix DHCP Pool / Masquerade";
      } else if (tsText.includes("firewall") || tsText.includes("mistake")) {
        symptomLabel = "Legitimate Traffic Blocked";
        suspectLabel = "Firewall Filter Rules";
        toolLabel = "Connection Track + Log";
        fixLabel = "Reorder / Fix Filter Rules";
      } else if (tsText.includes("bridge") || tsText.includes("vlan")) {
        symptomLabel = "Bridge / VLAN Failure";
        suspectLabel = "Bridge Ports / VLAN Tags";
        toolLabel = "Bridge Host + VLAN Table";
        fixLabel = "Fix Bridge / VLAN Config";
      }
      lines.push(`  symptom${q(symptomLabel)}`);
      lines.push(`  suspect${q(suspectLabel)}`);
      lines.push(`  tool${q(toolLabel)}`);
      lines.push(`  fix${q(fixLabel)}`);
      lines.push(`  validate${q("Validation")}`);
      lines.push(edge("user", "r1"));
      lines.push(edge("r1", "symptom"));
      lines.push(edge("symptom", "suspect"));
      lines.push(edge("suspect", "tool"));
      lines.push(edge("tool", "fix"));
      lines.push(edge("fix", "validate"));
      lines.push(classDef("tsNode", "fill:#e65100,stroke:#bf360c,color:#fff"));
      lines.push("class symptom tsNode");
      break;
    }
    default: {
      lines.push(`  feat${q(title)}`);
      lines.push(`  validate${q("Validation")}`);
      lines.push(edge("user", "r1"));
      lines.push(edge("r1", "feat"));
      lines.push(edge("feat", "validate"));
      lines.push(classDef("featNode", "fill:#455a64,stroke:#37474f,color:#fff"));
      lines.push("class feat featNode");
      break;
    }
  }

  return lines.join("\n") + "\n";
}

function buildMtcreDiagram(manifest) {
  const topic = detectMtcreTopic(manifest);
  const lines = ["flowchart TB"];
  const id = manifest.id;
  const title = manifest.title || id;
  const routerNames = (manifest.routers || []).map((r) => r.name);
  const hasR2 = routerNames.includes("r2");
  const hasR3 = routerNames.includes("r3");
  const mode = (manifest.mode || "containerlab").toLowerCase();

  lines.push(`  siteA${q("Site A")}`);
  lines.push(`  r1${q("r1")}`);

  if (mode === "quiz") {
    lines.push(`  chr${q("CHR Limitation")}`);
    lines.push(`  quiz${q("Conceptual Quiz")}`);
    lines.push(`  topicNode${q(title)}`);
    lines.push(`  validate${q("Quiz Validation")}`);
    lines.push(edge("siteA", "chr"));
    lines.push(edge("chr", "quiz"));
    lines.push(edge("quiz", "topicNode"));
    lines.push(edge("topicNode", "validate"));
    lines.push(classDef("chrNode", "fill:#f9a825,stroke:#f57f17,color:#000"));
    lines.push("class chr chrNode");
    return lines.join("\n") + "\n";
  }

  lines.push(`  transit${q("Transit / WAN")}`);
  if (hasR2) lines.push(`  r2${q("r2")}`);
  if (hasR3) lines.push(`  r3${q("r3")}`);
  lines.push(`  siteB${q("Site B")}`);

  switch (topic) {
    case "ecmp": {
      lines.push(`  pathA${q("ECMP Path A")}`);
      lines.push(`  pathB${q("ECMP Path B")}`);
      lines.push(`  hash${q("Per-flow Hash")}`);
      lines.push(`  validate${q("Load Balance Check")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "pathA"));
      lines.push(edge("r1", "pathB"));
      lines.push(edgeLabel("pathA", "via r2", "r2"));
      lines.push(edgeLabel("pathB", "via r3", "r3"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("r3", "transit"));
      lines.push(edge("transit", "siteB"));
      lines.push(edge("r1", "hash"));
      lines.push(edge("hash", "validate"));
      lines.push(classDef("ecmpNode", "fill:#1565c0,stroke:#0d47a1,color:#fff"));
      lines.push("class pathA,pathB ecmpNode");
      break;
    }
    case "ecmp-troubleshooting": {
      lines.push(`  pathA${q("ECMP Path A")}`);
      lines.push(`  pathB${q("ECMP Path B")}`);
      lines.push(`  issue${q("Asymmetric Issue")}`);
      lines.push(`  diag${q("Diagnose + Fix")}`);
      lines.push(`  validate${q("Re-validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "pathA"));
      lines.push(edge("r1", "pathB"));
      lines.push(edgeLabel("pathA", "via r2", "r2"));
      lines.push(edgeLabel("pathB", "via r3", "r3"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("r3", "transit"));
      lines.push(edge("transit", "siteB"));
      lines.push(edge("pathA", "issue"));
      lines.push(edge("issue", "diag"));
      lines.push(edge("diag", "validate"));
      lines.push(classDef("tsNode", "fill:#e65100,stroke:#bf360c,color:#fff"));
      lines.push("class issue tsNode");
      break;
    }
    case "recursive-failover": {
      lines.push(`  primary${q("Primary GW")}`);
      lines.push(`  backup${q("Backup GW")}`);
      lines.push(`  recursive${q("Recursive Route")}`);
      lines.push(`  scope${q("Scope / Target Scope")}`);
      lines.push(`  monitor${q("GW Monitor")}`);
      lines.push(`  failover${q("Failover Trigger")}`);
      lines.push(`  validate${q("Failover Validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "primary"));
      lines.push(edge("r1", "backup"));
      lines.push(edge("primary", "recursive"));
      lines.push(edge("recursive", "scope"));
      lines.push(edge("scope", "monitor"));
      lines.push(edgeLabel("primary", "via r2", "r2"));
      lines.push(edgeLabel("backup", "via r3", "r3"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("r3", "transit"));
      lines.push(edge("transit", "siteB"));
      lines.push(edge("monitor", "failover"));
      lines.push(edge("failover", "validate"));
      lines.push(classDef("foNode", "fill:#c62828,stroke:#b71c1c,color:#fff"));
      lines.push("class failover foNode");
      break;
    }
    case "policy-routing": {
      lines.push(`  mangle${q("Mangle Mark")}`);
      lines.push(`  rtTable${q("Routing Table")}`);
      lines.push(`  rtRule${q("Routing Rule")}`);
      lines.push(`  prefSrc${q("Preferred Source")}`);
      lines.push(`  validate${q("Policy Validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "mangle"));
      lines.push(edge("mangle", "rtTable"));
      lines.push(edge("rtTable", "rtRule"));
      lines.push(edge("rtRule", "prefSrc"));
      lines.push(edgeLabel("r1", "via r2", "r2"));
      lines.push(edgeLabel("r1", "via r3", "r3"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("r3", "transit"));
      lines.push(edge("transit", "siteB"));
      lines.push(edge("prefSrc", "validate"));
      lines.push(classDef("prNode", "fill:#6a1b9a,stroke:#4a148c,color:#fff"));
      lines.push("class mangle prNode");
      break;
    }
    case "vlan": {
      lines.push(`  trunk${q("Trunk Port")}`);
      lines.push(`  accessVlan${q("Access VLAN")}`);
      lines.push(`  vlanIf${q("VLAN Interface")}`);
      lines.push(`  bridgeVlan${q("Bridge VLAN Table")}`);
      lines.push(`  validate${q("VLAN Validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "trunk"));
      lines.push(edge("trunk", "accessVlan"));
      lines.push(edge("accessVlan", "vlanIf"));
      lines.push(edge("vlanIf", "bridgeVlan"));
      lines.push(edgeLabel("r1", "via r2", "r2"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("transit", "r3"));
      lines.push(edge("r3", "siteB"));
      lines.push(edge("bridgeVlan", "validate"));
      lines.push(classDef("vlanNode", "fill:#00695c,stroke:#004d40,color:#fff"));
      lines.push("class trunk vlanNode");
      break;
    }
    case "qinq": {
      lines.push(`  sVlan${q("Service VLAN")}`);
      lines.push(`  cVlan${q("Customer VLAN")}`);
      lines.push(`  outerTag${q("Outer Tag")}`);
      lines.push(`  innerTag${q("Inner Tag")}`);
      lines.push(`  validate${q("QinQ Validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "sVlan"));
      lines.push(edge("sVlan", "cVlan"));
      lines.push(edge("cVlan", "outerTag"));
      lines.push(edge("outerTag", "innerTag"));
      lines.push(edgeLabel("r1", "via r2", "r2"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("transit", "r3"));
      lines.push(edge("r3", "siteB"));
      lines.push(edge("innerTag", "validate"));
      lines.push(classDef("qinqNode", "fill:#004d40,stroke:#00251a,color:#fff"));
      lines.push("class sVlan qinqNode");
      break;
    }
    case "tunnels": {
      lines.push(`  gre${q("GRE Tunnel")}`);
      lines.push(`  ipip${q("IPIP Tunnel")}`);
      lines.push(`  eoip${q("EoIP Tunnel")}`);
      lines.push(`  tunIf${q("Tunnel Interface")}`);
      lines.push(`  validate${q("Tunnel Validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "gre"));
      lines.push(edge("r1", "ipip"));
      lines.push(edge("r1", "eoip"));
      lines.push(edge("gre", "tunIf"));
      lines.push(edge("ipip", "tunIf"));
      lines.push(edge("eoip", "tunIf"));
      lines.push(edgeLabel("r1", "via r2", "r2"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("transit", "r3"));
      lines.push(edge("r3", "siteB"));
      lines.push(edge("tunIf", "validate"));
      lines.push(classDef("tunNode", "fill:#283593,stroke:#1a237e,color:#fff"));
      lines.push("class gre tunNode");
      break;
    }
    case "ospf": {
      lines.push(`  ospfArea${q("OSPF Area")}`);
      lines.push(`  ospfIf${q("OSPF Interfaces")}`);
      lines.push(`  adjacency${q("Adjacency")}`);
      lines.push(`  lsdb${q("LSDB")}`);
      lines.push(`  spCalc${q("SPF Calculation")}`);
      lines.push(`  validate${q("OSPF Validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "ospfArea"));
      lines.push(edge("ospfArea", "ospfIf"));
      lines.push(edge("ospfIf", "adjacency"));
      lines.push(edge("adjacency", "lsdb"));
      lines.push(edge("lsdb", "spCalc"));
      lines.push(edgeLabel("r1", "OSPF neighbor", "r2"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("transit", "r3"));
      lines.push(edge("r3", "siteB"));
      lines.push(edge("spCalc", "validate"));
      lines.push(classDef("ospfNode", "fill:#1b5e20,stroke:#0a3d0a,color:#fff"));
      lines.push("class ospfArea ospfNode");
      break;
    }
    case "ospf-troubleshooting": {
      lines.push(`  ospfArea${q("OSPF Area")}`);
      lines.push(`  neighbor${q("Neighbor Check")}`);
      lines.push(`  lsdb${q("LSDB Inspect")}`);
      lines.push(`  missingRt${q("Missing Routes")}`);
      lines.push(`  fixCfg${q("Fix Config")}`);
      lines.push(`  validate${q("Re-validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "ospfArea"));
      lines.push(edge("ospfArea", "neighbor"));
      lines.push(edge("neighbor", "lsdb"));
      lines.push(edge("lsdb", "missingRt"));
      lines.push(edge("missingRt", "fixCfg"));
      lines.push(edgeLabel("r1", "OSPF neighbor", "r2"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("transit", "r3"));
      lines.push(edge("r3", "siteB"));
      lines.push(edge("fixCfg", "validate"));
      lines.push(classDef("tsNode", "fill:#e65100,stroke:#bf360c,color:#fff"));
      lines.push("class missingRt tsNode");
      break;
    }
    case "troubleshooting": {
      lines.push(`  symptom${q("Symptom")}`);
      lines.push(`  diag${q("Diagnose")}`);
      lines.push(`  rootCause${q("Root Cause")}`);
      lines.push(`  fixCfg${q("Fix Config")}`);
      lines.push(`  validate${q("Re-validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "symptom"));
      lines.push(edge("symptom", "diag"));
      lines.push(edge("diag", "rootCause"));
      lines.push(edge("rootCause", "fixCfg"));
      lines.push(edgeLabel("r1", "via r2", "r2"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("transit", "r3"));
      lines.push(edge("r3", "siteB"));
      lines.push(edge("fixCfg", "validate"));
      lines.push(classDef("tsNode", "fill:#e65100,stroke:#bf360c,color:#fff"));
      lines.push("class rootCause tsNode");
      break;
    }
    case "final-challenge": {
      lines.push(`  staticRt${q("Static Routes")}`);
      lines.push(`  ospfCfg${q("OSPF Config")}`);
      lines.push(`  polRt${q("Policy Routing")}`);
      lines.push(`  failover${q("Failover Setup")}`);
      lines.push(`  integrated${q("Integrated Test")}`);
      lines.push(`  validate${q("Exam Validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "staticRt"));
      lines.push(edge("staticRt", "ospfCfg"));
      lines.push(edge("ospfCfg", "polRt"));
      lines.push(edge("polRt", "failover"));
      lines.push(edge("failover", "integrated"));
      lines.push(edgeLabel("r1", "via r2", "r2"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("transit", "r3"));
      lines.push(edge("r3", "siteB"));
      lines.push(edge("integrated", "validate"));
      lines.push(classDef("examNode", "fill:#c62828,stroke:#b71c1c,color:#fff"));
      lines.push("class validate examNode");
      break;
    }
    case "scope": {
      lines.push(`  primary${q("Primary Route")}`);
      lines.push(`  scopeVal${q("Scope Value")}`);
      lines.push(`  targetScope${q("Target Scope")}`);
      lines.push(`  resolve${q("Route Resolution")}`);
      lines.push(`  validate${q("Scope Validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "primary"));
      lines.push(edge("primary", "scopeVal"));
      lines.push(edge("scopeVal", "targetScope"));
      lines.push(edge("targetScope", "resolve"));
      lines.push(edgeLabel("r1", "via r2", "r2"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("transit", "siteB"));
      lines.push(edge("resolve", "validate"));
      lines.push(classDef("scNode", "fill:#4527a0,stroke:#311b92,color:#fff"));
      lines.push("class scopeVal scNode");
      break;
    }
    case "point-to-point": {
      lines.push(`  p2pLink${q("Point-to-Point Link")}`);
      lines.push(`  addr31${q("/31 Addressing")}`);
      lines.push(`  unnumbered${q("Unnumbered IF")}`);
      lines.push(`  validate${q("P2P Validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "p2pLink"));
      lines.push(edge("p2pLink", "addr31"));
      lines.push(edge("addr31", "unnumbered"));
      lines.push(edgeLabel("r1", "P2P link", "r2"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("transit", "siteB"));
      lines.push(edge("unnumbered", "validate"));
      lines.push(classDef("p2pNode", "fill:#00695c,stroke:#004d40,color:#fff"));
      lines.push("class p2pLink p2pNode");
      break;
    }
    case "gateway": {
      lines.push(`  gwCheck${q("Gateway Check")}`);
      lines.push(`  reachable${q("Reachable GW")}`);
      lines.push(`  forceIf${q("Force Interface")}`);
      lines.push(`  monitor${q("GW Monitoring")}`);
      lines.push(`  validate${q("Gateway Validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "gwCheck"));
      lines.push(edge("gwCheck", "reachable"));
      lines.push(edge("reachable", "forceIf"));
      lines.push(edge("forceIf", "monitor"));
      lines.push(edgeLabel("r1", "via r2", "r2"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("transit", "siteB"));
      lines.push(edge("monitor", "validate"));
      lines.push(classDef("gwNode", "fill:#1565c0,stroke:#0d47a1,color:#fff"));
      lines.push("class gwCheck gwNode");
      break;
    }
    case "static-routing": {
      lines.push(`  staticRt${q("Static Route Review")}`);
      lines.push(`  dstAddr${q("Destination Address")}`);
      lines.push(`  gwNext${q("Next-Hop Gateway")}`);
      lines.push(`  rtTable${q("Routing Table")}`);
      lines.push(`  validate${q("Route Validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "staticRt"));
      lines.push(edge("staticRt", "dstAddr"));
      lines.push(edge("dstAddr", "gwNext"));
      lines.push(edge("gwNext", "rtTable"));
      lines.push(edgeLabel("r1", "via r2", "r2"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("transit", "siteB"));
      lines.push(edge("rtTable", "validate"));
      lines.push(classDef("srNode", "fill:#1565c0,stroke:#0d47a1,color:#fff"));
      lines.push("class staticRt srNode");
      break;
    }
    case "specific-routes": {
      lines.push(`  specificRt${q("More Specific Route")}`);
      lines.push(`  longestMatch${q("Longest Prefix Match")}`);
      lines.push(`  overlap${q("Overlapping Prefixes")}`);
      lines.push(`  selection${q("Route Selection")}`);
      lines.push(`  validate${q("Specific Route Validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "specificRt"));
      lines.push(edge("specificRt", "longestMatch"));
      lines.push(edge("longestMatch", "overlap"));
      lines.push(edge("overlap", "selection"));
      lines.push(edgeLabel("r1", "via r2", "r2"));
      lines.push(edgeLabel("r1", "via r3", "r3"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("r3", "transit"));
      lines.push(edge("transit", "siteB"));
      lines.push(edge("selection", "validate"));
      lines.push(classDef("spNode", "fill:#1565c0,stroke:#0d47a1,color:#fff"));
      lines.push("class specificRt spNode");
      break;
    }
    case "distance": {
      lines.push(`  routeA${q("Route A")}`);
      lines.push(`  routeB${q("Route B")}`);
      lines.push(`  distVal${q("Distance / Preference")}`);
      lines.push(`  selected${q("Selected Route")}`);
      lines.push(`  validate${q("Distance Validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edge("r1", "routeA"));
      lines.push(edge("r1", "routeB"));
      lines.push(edge("routeA", "distVal"));
      lines.push(edge("routeB", "distVal"));
      lines.push(edge("distVal", "selected"));
      lines.push(edgeLabel("routeA", "via r2", "r2"));
      lines.push(edgeLabel("routeB", "via r3", "r3"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("r3", "transit"));
      lines.push(edge("transit", "siteB"));
      lines.push(edge("selected", "validate"));
      lines.push(classDef("distNode", "fill:#6a1b9a,stroke:#4a148c,color:#fff"));
      lines.push("class distVal distNode");
      break;
    }
    default: {
      lines.push(`  topicNode${q(title)}`);
      lines.push(`  validate${q("Validation")}`);
      lines.push(edge("siteA", "r1"));
      lines.push(edgeLabel("r1", "via r2", "r2"));
      lines.push(edge("r2", "transit"));
      lines.push(edge("transit", "r3"));
      lines.push(edge("r3", "siteB"));
      lines.push(edge("r1", "topicNode"));
      lines.push(edge("topicNode", "validate"));
      lines.push(classDef("genNode", "fill:#455a64,stroke:#37474f,color:#fff"));
      lines.push("class topicNode genNode");
      break;
    }
  }

  return lines.join("\n") + "\n";
}

function generateDiagram(manifest) {
  const track = (manifest.track || "").toUpperCase();
  if (track === "MTCRE") {
    return buildMtcreDiagram(manifest);
  }
  return buildMtcnaDiagram(manifest);
}

function selfCheck(id, content) {
  const errors = [];
  const firstLine = content.split("\n")[0].trim();
  if (!firstLine.startsWith("flowchart")) {
    errors.push(`${id}: diagram does not start with flowchart (got: "${firstLine}")`);
  }
  if (content.includes("graph LR")) {
    errors.push(`${id}: contains forbidden "graph LR"`);
  }
  if (content.includes("R1 -- ether2 /30 --- R2")) {
    errors.push(`${id}: contains old generic body line`);
  }
  return errors;
}

async function main() {
  const entries = await readdir(LABS_DIR, { withFileTypes: true });
  const labDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  let written = 0;
  const allErrors = [];

  for (const dir of labDirs) {
    const manifestPath = join(LABS_DIR, dir, "manifest.json");
    let manifest;
    try {
      const raw = await readFile(manifestPath, "utf-8");
      manifest = JSON.parse(raw);
    } catch {
      continue;
    }

    const diagram = generateDiagram(manifest);
    const diagramPath = join(LABS_DIR, dir, "diagram.mmd");
    await writeFile(diagramPath, diagram, "utf-8");
    written++;

    const errors = selfCheck(manifest.id, diagram);
    allErrors.push(...errors);
  }

  console.log(`Wrote ${written} diagram(s).`);

  if (allErrors.length > 0) {
    console.error("Self-check FAILED:");
    for (const err of allErrors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log("Self-check passed.");
}

main();
