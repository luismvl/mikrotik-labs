#!/usr/bin/env node
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const labsRoot = path.join(repoRoot, "labs");

const docs = {
  routes: "https://help.mikrotik.com/docs/spaces/ROS/pages/328084/Routes",
  policy: "https://help.mikrotik.com/docs/spaces/ROS/pages/59965508/Policy+Routing",
  packetFlow: "https://help.mikrotik.com/docs/spaces/ROS/pages/328227/Packet+Flow+in+RouterOS",
  vlan: "https://help.mikrotik.com/docs/spaces/ROS/pages/88014957/VLAN",
  bridge: "https://help.mikrotik.com/docs/spaces/ROS/pages/328068/Bridging+and+Switching",
  ppp: "https://help.mikrotik.com/docs/spaces/ROS/pages/328072/PPP",
  ospf: "https://help.mikrotik.com/docs/spaces/ROS/pages/331612216/routing+ospf",
};

const labs = [
  ["101-static-routing-review", "Static routing review", "containerlab", "medium", ["static-routing"]],
  ["102-more-specific-routes", "More specific routes", "containerlab", "hard", ["more-specific-routes"]],
  ["103-route-distance-administrative-preference", "Route distance and administrative preference", "containerlab", "hard", ["distance"]],
  ["104-ecmp-basics", "ECMP basics", "containerlab", "hard", ["ecmp"]],
  ["105-ecmp-troubleshooting", "ECMP troubleshooting", "containerlab", "hard", ["ecmp", "troubleshooting"]],
  ["106-recursive-static-routes", "Recursive static routes", "containerlab", "hard", ["recursive-routes"]],
  ["107-recursive-failover", "Recursive failover", "containerlab", "hard", ["recursive-routes", "failover"]],
  ["108-gateway-check-failover-behavior", "Gateway check and failover behavior", "containerlab", "hard", ["gateway-check", "failover"]],
  ["109-scope-target-scope", "Scope and target-scope", "containerlab", "hard", ["scope", "target-scope"]],
  ["110-force-gateway-specific-interface", "Force gateway over specific interface", "containerlab", "hard", ["gateway", "interface"]],
  ["111-point-to-point-addressing", "Point-to-point addressing", "containerlab", "medium", ["point-to-point"]],
  ["112-30-vs-31-addressing-practice", "/30 vs /31 addressing practice", "containerlab", "medium", ["point-to-point", "addressing"]],
  ["113-route-policy-introduction", "Route policy introduction", "containerlab", "hard", ["policy-routing"]],
  ["114-policy-routing-routing-tables", "Policy routing with routing tables", "containerlab", "hard", ["policy-routing", "routing-tables"]],
  ["115-routing-rules", "Routing rules", "containerlab", "hard", ["policy-routing", "routing-rules"]],
  ["116-mangle-routing-marks", "Mangle-based routing marks", "containerlab", "hard", ["policy-routing", "mangle"]],
  ["117-vlan-routing-lab", "VLAN routing lab", "containerlab", "hard", ["vlan", "routing"]],
  ["118-vlan-trunk-access-lab", "VLAN trunk/access lab", "containerlab", "hard", ["vlan", "trunk", "access"]],
  ["119-qinq-lab", "QinQ lab", "containerlab", "hard", ["vlan", "qinq"]],
  ["120-tunnel-concepts", "Tunnel concepts", "quiz", "hard", ["tunnels"]],
  ["121-gre-ipip-eoip-comparison-lab", "GRE/IPIP/EoIP comparison lab", "quiz", "hard", ["tunnels", "gre", "ipip", "eoip"]],
  ["122-site-to-site-tunnel-lab", "Site-to-site tunnel lab", "containerlab", "hard", ["tunnels", "site-to-site"]],
  ["123-ospf-single-area", "OSPF single-area", "containerlab", "hard", ["ospf", "single-area"]],
  ["124-ospf-network-types", "OSPF network types", "containerlab", "hard", ["ospf", "network-types"]],
  ["125-ospf-passive-interfaces", "OSPF passive interfaces", "containerlab", "hard", ["ospf", "passive-interface"]],
  ["126-ospf-costs-path-selection", "OSPF costs and path selection", "containerlab", "hard", ["ospf", "cost"]],
  ["127-ospf-dr-bdr-neighbor-states", "OSPF DR/BDR and neighbor states", "containerlab", "hard", ["ospf", "dr-bdr"]],
  ["128-ospf-lsdb-lsa-concepts", "OSPF LSDB and LSA concepts", "quiz", "hard", ["ospf", "lsdb", "lsa"]],
  ["129-ospf-multi-area", "OSPF multi-area", "containerlab", "hard", ["ospf", "multi-area"]],
  ["130-ospf-summarization-area-ranges", "OSPF summarization and area ranges", "quiz", "hard", ["ospf", "summarization"]],
  ["131-ospf-redistribution-basics", "OSPF redistribution basics", "containerlab", "hard", ["ospf", "redistribution"]],
  ["132-ospf-stub-nssa-concepts", "OSPF stub/NSSA concepts", "quiz", "hard", ["ospf", "stub", "nssa"]],
  ["133-ospf-virtual-links-concepts", "OSPF virtual links concepts", "quiz", "hard", ["ospf", "virtual-links"]],
  ["134-ospf-routing-filters", "OSPF routing filters", "containerlab", "hard", ["ospf", "routing-filters"]],
  ["135-ospf-troubleshooting-neighbor-not-forming", "OSPF troubleshooting: neighbor not forming", "containerlab", "hard", ["ospf", "troubleshooting"]],
  ["136-ospf-troubleshooting-missing-routes", "OSPF troubleshooting: missing routes", "containerlab", "hard", ["ospf", "troubleshooting"]],
  ["137-ospf-troubleshooting-wrong-path-selected", "OSPF troubleshooting: wrong path selected", "containerlab", "hard", ["ospf", "troubleshooting"]],
  ["138-integrated-routing-challenge", "Integrated routing challenge", "containerlab", "hard", ["routing", "integrated-challenge"]],
  ["139-final-mtcre-simulation-lab", "Final MTCRE simulation lab", "containerlab", "exam", ["routing", "ospf", "policy-routing", "final"]],
].map(([id, title, mode, difficulty, tags]) => ({
  id,
  title,
  mode,
  difficulty,
  tags,
  minutes: difficulty === "exam" ? 120 : difficulty === "medium" ? 60 : 75,
}));

function docsFor(tags) {
  const urls = [{ title: "RouterOS Routes", url: docs.routes }];
  if (tags.some((t) => t.includes("policy") || t === "mangle")) urls.push({ title: "RouterOS Policy Routing", url: docs.policy });
  if (tags.some((t) => t.includes("vlan") || t === "qinq" || t === "trunk")) {
    urls.push({ title: "RouterOS VLAN", url: docs.vlan });
    urls.push({ title: "RouterOS Bridging and Switching", url: docs.bridge });
  }
  if (tags.some((t) => t.includes("tunnel"))) urls.push({ title: "RouterOS PPP and tunnels", url: docs.ppp });
  if (tags.some((t) => t.includes("ospf"))) urls.push({ title: "RouterOS OSPF", url: docs.ospf });
  urls.push({ title: "Packet Flow in RouterOS", url: docs.packetFlow });
  return urls;
}

function routers(mode) {
  if (mode === "quiz") return undefined;
  return [
    { name: "r1", winboxPort: 18001, sshPort: 12001, webfigPort: 8081, username: "admin", password: "admin" },
    { name: "r2", winboxPort: 18002, sshPort: 12002, webfigPort: 8082, username: "admin", password: "admin" },
    { name: "r3", winboxPort: 18003, sshPort: 12003, webfigPort: 8083, username: "admin", password: "admin" },
  ];
}

function manifest(lab) {
  const official = docsFor(lab.tags).slice(0, 3).map((d) => ({ type: "official-docs", title: d.title, url: d.url }));
  const topics = [...new Set(["routing", ...lab.tags])];
  return {
    id: lab.id,
    title: lab.title,
    track: "MTCRE",
    mode: lab.mode,
    difficulty: lab.difficulty,
    estimatedMinutes: lab.minutes,
    topics,
    resources: [
      ...official,
      { type: "search-term", title: `MikroTik RouterOS 7 ${lab.title}` },
      { type: "search-term", title: `MTCRE ${lab.title} lab` },
    ],
    routers: routers(lab.mode),
    objectives: [
      `Analizar el escenario de ${lab.title} sin depender de una receta paso a paso`,
      "Disenar la tabla de rutas o el dominio dinamico requerido",
      "Aplicar configuracion RouterOS consistente entre routers",
      "Validar conectividad, redundancia y seleccion de ruta",
    ],
    validation: { type: lab.mode === "quiz" ? "quiz" : "automatic" },
  };
}

function topology(lab) {
  return `name: ${lab.id}

topology:
  nodes:
    r1:
      kind: mikrotik_ros
      image: vrnetlab/mikrotik_routeros:7.16
      startup-config: startup/r1.rsc
      ports:
        - 18001:8291
        - 12001:22
        - 8081:80
    r2:
      kind: mikrotik_ros
      image: vrnetlab/mikrotik_routeros:7.16
      startup-config: startup/r2.rsc
      ports:
        - 18002:8291
        - 12002:22
        - 8082:80
    r3:
      kind: mikrotik_ros
      image: vrnetlab/mikrotik_routeros:7.16
      startup-config: startup/r3.rsc
      ports:
        - 18003:8291
        - 12003:22
        - 8083:80
  links:
    - endpoints: ["r1:ether2", "r2:ether2"]
    - endpoints: ["r2:ether3", "r3:ether2"]
`;
}

function startup(router) {
  const identity = router;
  const addresses = {
    r1: "/ip address add address=10.101.12.1/30 interface=ether2 comment=base-r1-r2\n/ip address add address=192.168.101.1/24 interface=ether3 comment=loopback-lan\n",
    r2: "/ip address add address=10.101.12.2/30 interface=ether2 comment=base-r1-r2\n/ip address add address=10.101.23.1/30 interface=ether3 comment=base-r2-r3\n",
    r3: "/ip address add address=10.101.23.2/30 interface=ether2 comment=base-r2-r3\n/ip address add address=192.168.103.1/24 interface=ether3 comment=loopback-lan\n",
  };
  return `/system identity set name=${identity}
/user set admin password=admin
/ip service set ssh disabled=no
/ip service set www disabled=no
/ip service set winbox disabled=no
/ip service set ftp disabled=yes
/ip service set telnet disabled=yes
/ip service set api disabled=yes
/ip service set api-ssl disabled=yes
/system clock set time-zone-name=UTC
${addresses[router]}`;
}

function checkTs(expectedNodes = 3) {
  return `import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const labDir = path.dirname(fileURLToPath(import.meta.url));
const topologyFile = path.join(labDir, "topology.clab.yml");
const checks = [];
let passed = true;

function add(name, ok, message = "") {
  checks.push({ name, passed: ok, message });
  if (!ok) passed = false;
}

add("topology.clab.yml exists", existsSync(topologyFile), "Smoke check only; objective checks are documented in the lab.");

try {
  execFileSync("containerlab", ["version"], { stdio: "ignore" });
  add("containerlab command exists", true);
} catch {
  add("containerlab command exists", false, "containerlab is not installed or not in PATH");
}

if (passed) {
  try {
    const raw = execFileSync("containerlab", ["inspect", "-t", "topology.clab.yml", "--format", "json"], {
      cwd: labDir,
      encoding: "utf8",
      timeout: 30000,
    });
    const data = JSON.parse(raw);
    const containers = Array.isArray(data?.containers) ? data.containers : [];
    const running = containers.filter((node) => String(node.state || "").toLowerCase().includes("running"));
    add("expected nodes are running", running.length >= ${expectedNodes}, \`Expected at least ${expectedNodes} running nodes, found \${running.length}\`);
  } catch (error) {
    add("containerlab inspect succeeds", false, error instanceof Error ? error.message : String(error));
  }
}

console.log(JSON.stringify({ passed, checks }, null, 2));
process.exit(passed ? 0 : 1);
`;
}

function diagram(lab) {
  if (lab.mode === "quiz") {
    return `flowchart LR
  A[Concepto: ${lab.title}] --> B[Decidir cuando usarlo]
  B --> C[Identificar sintomas]
  C --> D[Explicar verificacion en RouterOS]
`;
  }
  return `flowchart LR
  LAN1[LAN/Sede A] --- R1[r1]
  R1 -- ether2 /30 --- R2[r2 transit]
  R2 -- ether3 /30 --- R3[r3]
  R3 --- LAN3[LAN/Sede B]
`;
}

function instructions(lab) {
  return `# ${lab.title}

## Contexto

Este laboratorio pertenece al track MTCRE. El objetivo no es copiar comandos: debes leer el escenario, decidir la estrategia de routing y verificar el resultado con herramientas de RouterOS.

## Escenario

Una empresa tiene tres routers. r2 actua como punto de transito entre la sede A y la sede B. El tema principal del ejercicio es: **${lab.title}**.

## Requisitos

- Mantener administracion por WinBox, SSH y WebFig.
- Lograr conectividad entre las LAN simuladas de r1 y r3.
- Aplicar el comportamiento esperado para ${lab.title}.
- Documentar que rutas, reglas o parametros cambiaron.

## Restricciones

- No uses rutas por defecto para ocultar errores de diseno.
- No elimines la configuracion base de management.
- En caso de varias soluciones posibles, elige la mas simple y justificable para MTCRE.

## Verificacion esperada

- La tabla de rutas muestra el camino esperado.
- Un traceroute desde r1 hacia la LAN de r3 usa el recorrido previsto.
- Si el lab trata failover o troubleshooting, el resultado cambia de forma controlada al simular una falla.
- Puedes explicar por que RouterOS eligio esa ruta.

## Entrega

- Captura o copia de \`/ip/route/print detail\`.
- Resultado de \`/tool/traceroute\` o \`/ping\`.
- Nota corta con el razonamiento de seleccion de ruta.
`;
}

function hints(lab) {
  return `# Hints

1. Empieza dibujando que prefijos existen detras de cada router.
2. Revisa primero rutas conectadas antes de agregar rutas estaticas o reglas.
3. Si una ruta no aparece activa, mira gateway, distance, scope y target-scope.
4. Para ${lab.title}, valida el sintoma con \`/ip/route/print detail\` antes de cambiar configuracion.
5. Si estas atascado, simplifica: una ruta, un prefijo, un gateway, una prueba.
`;
}

function solution(lab) {
  const base = `# Solution

La solucion esperada es justificar la decision de routing y no solamente lograr ping. En MTCRE debes demostrar que entiendes por que una ruta queda activa, por que otra queda en espera y como RouterOS selecciona el siguiente salto.

Comandos representativos:

\`\`\`routeros
/ip/route/print detail
/routing/table/print
/tool/traceroute address=192.168.103.1
/ping 192.168.103.1 count=5
\`\`\`
`;
  if (lab.tags.some((t) => t.includes("ospf"))) {
    return `${base}

Para OSPF, confirma vecinos, LSDB y rutas instaladas:

\`\`\`routeros
/routing/ospf/neighbor/print detail
/routing/ospf/lsa/print
/ip/route/print where protocol=ospf
\`\`\`
`;
  }
  if (lab.tags.some((t) => t.includes("policy") || t === "mangle")) {
    return `${base}

Para policy routing, separa la tabla, la regla y el trafico que debe entrar a esa tabla:

\`\`\`routeros
/routing/table/add name=to-wan2 fib
/routing/rule/print detail
/ip/firewall/mangle/print detail
\`\`\`
`;
  }
  if (lab.tags.some((t) => t.includes("vlan") || t === "qinq")) {
    return `${base}

Para VLAN/QinQ, confirma bridge VLAN table y puertos tagged/untagged:

\`\`\`routeros
/interface/bridge/port/print detail
/interface/bridge/vlan/print detail
/interface/vlan/print detail
\`\`\`
`;
  }
  return `${base}

Para rutas estaticas avanzadas, revisa distance, prefijo mas especifico, gateway y recursion:

\`\`\`routeros
/ip/route/add dst-address=192.168.103.0/24 gateway=10.101.12.2 distance=1
/ip/route/print detail where dst-address=192.168.103.0/24
\`\`\`
`;
}

function resourcesMd(lab) {
  const official = docsFor(lab.tags)
    .slice(0, 4)
    .map((d) => `- ${d.title}: ${d.url}`)
    .join("\n");
  return `# Resources

Use these references if you get stuck.

## Official MikroTik docs

${official}

## Related RouterOS topics

- Route distance and route selection
- Recursive gateway resolution
- Troubleshooting with ping, traceroute and route detail
- Topic focus: ${lab.title}

## Suggested search terms

- MikroTik RouterOS 7 ${lab.title}
- MikroTik MTCRE ${lab.tags.join(" ")}
- RouterOS route print detail troubleshooting

## Optional videos/articles

- Search for recent RouterOS 7 MTCRE lab walkthroughs only after trying the lab.
`;
}

async function writeLab(lab) {
  const dir = path.join(labsRoot, lab.id);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "manifest.json"), `${JSON.stringify(manifest(lab), null, 2)}\n`);
  await writeFile(path.join(dir, "instructions.md"), instructions(lab));
  await writeFile(path.join(dir, "hints.md"), hints(lab));
  await writeFile(path.join(dir, "solution.md"), solution(lab));
  await writeFile(path.join(dir, "resources.md"), resourcesMd(lab));
  await writeFile(path.join(dir, "diagram.mmd"), diagram(lab));

  if (lab.mode === "containerlab") {
    await writeFile(path.join(dir, "topology.clab.yml"), topology(lab));
    await writeFile(path.join(dir, "check.ts"), checkTs(3));
    const startupDir = path.join(dir, "startup");
    await mkdir(startupDir, { recursive: true });
    await writeFile(path.join(startupDir, "r1.rsc"), startup("r1"));
    await writeFile(path.join(startupDir, "r2.rsc"), startup("r2"));
    await writeFile(path.join(startupDir, "r3.rsc"), startup("r3"));
  } else {
    await rm(path.join(dir, "topology.clab.yml"), { force: true });
    await rm(path.join(dir, "check.ts"), { force: true });
    await rm(path.join(dir, "startup"), { recursive: true, force: true });
  }
}

for (const lab of labs) {
  await writeLab(lab);
}

console.log(`Generated ${labs.length} MTCRE labs.`);
