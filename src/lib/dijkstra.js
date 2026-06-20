function edgeAllowed(e, dis) {
  if (dis === "wheelchair") return e.is_accessible && !e.has_stairs;
  if (dis === "visual") return e.is_accessible;
  return true; // hearing / cognitive / none — all edges fine
}

function edgeWeight(e, dis) {
  let w = e.distance;
  // Cognitive: penalize transitions through elevators slightly to prefer simpler routes
  if (dis === "cognitive" && e.has_elevator) w += 30;
  return w;
}

export function findPath(nodes, edges, startId, endId, dis) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  // Build undirected adjacency
  const adj = new Map();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) {
    if (!edgeAllowed(e, dis)) continue;
    adj.get(e.from_node)?.push({ to: e.to_node, edge: e });
    adj.get(e.to_node)?.push({ to: e.from_node, edge: e });
  }

  const dist = new Map();
  const prev = new Map();
  for (const n of nodes) {
    dist.set(n.id, Infinity);
    prev.set(n.id, null);
  }
  dist.set(startId, 0);

  // Simple priority queue
  const pq = [{ id: startId, d: 0 }];
  const visited = new Set();

  while (pq.length) {
    pq.sort((a, b) => a.d - b.d);
    const cur = pq.shift();
    if (visited.has(cur.id)) continue;
    visited.add(cur.id);
    if (cur.id === endId) break;
    for (const { to, edge } of adj.get(cur.id) ?? []) {
      if (visited.has(to)) continue;
      const alt = cur.d + edgeWeight(edge, dis);
      if (alt < (dist.get(to) ?? Infinity)) {
        dist.set(to, alt);
        prev.set(to, { node: cur.id, edge });
        pq.push({ id: to, d: alt });
      }
    }
  }

  if ((dist.get(endId) ?? Infinity) === Infinity) return null;

  // Reconstruct
  const path = [];
  const usedEdges = [];
  let curId = endId;
  while (curId) {
    const n = nodeMap.get(curId);
    if (!n) break;
    path.unshift(n);
    const p = prev.get(curId) ?? null;
    if (!p) break;
    usedEdges.unshift(p.edge);
    curId = p.node;
  }
  return { path, edges: usedEdges, distance: dist.get(endId) ?? 0 };
}
