import { supabase } from "@/integrations/supabase/client";

export async function getMapData() {
  const [nodesRes, edgesRes] = await Promise.all([
    supabase.from("nodes").select("*").order("name_en"),
    supabase.from("edges").select("*"),
  ]);
  if (nodesRes.error) throw new Error(nodesRes.error.message);
  if (edgesRes.error) throw new Error(edgesRes.error.message);

  const nodes = [...(nodesRes.data ?? [])];
  const edges = [...(edgesRes.data ?? [])];

  const syntheticNodes = [
    {
      id: "rickshaw_stand_bottola",
      name_bn: "রিকশা স্ট্যান্ড, বটতলা",
      name_en: "Rickshaw Stand, Bottola",
      type: "rickshaw_stand",
      x: 410,
      y: 960,
      accessible: true,
      notes_bn: null,
      notes_en: null,
    },
    {
      id: "rickshaw_stand_bishmail_gate",
      name_bn: "রিকশা স্ট্যান্ড, বিশমাইল গেট",
      name_en: "Rickshaw Stand, Bishmail Gate",
      type: "rickshaw_stand",
      x: 800,
      y: 90,
      accessible: true,
      notes_bn: null,
      notes_en: null,
    },
    {
      id: "rickshaw_stand_prantik_gate",
      name_bn: "রিকশা স্ট্যান্ড, প্রান্তিক গেট",
      name_en: "Rickshaw Stand, Prantik Gate",
      type: "rickshaw_stand",
      x: 820,
      y: 360,
      accessible: true,
      notes_bn: null,
      notes_en: null,
    },
    {
      id: "rickshaw_stand_dairy_gate",
      name_bn: "রিকশা স্ট্যান্ড, ডেইরি গেট",
      name_en: "Rickshaw Stand, Dairy Gate",
      type: "rickshaw_stand",
      x: 910,
      y: 1080,
      accessible: true,
      notes_bn: null,
      notes_en: null,
    },
    {
      id: "electric_cart_stand_dairy_gate",
      name_bn: "ইলেকট্রিক কার্ট স্ট্যান্ড, ডেইরি গেট",
      name_en: "Electric Cart Stand, Dairy Gate",
      type: "electric_cart_stand",
      x: 860,
      y: 1045,
      accessible: true,
      notes_bn: null,
      notes_en: null,
    },
    {
      id: "electric_cart_stand_rafiq_jabbar",
      name_bn: "ইলেকট্রিক কার্ট স্ট্যান্ড, রফিক-জব্বার হল",
      name_en: "Electric Cart Stand, Rafiq-Jabbar Hall",
      type: "electric_cart_stand",
      x: 190,
      y: 1010,
      accessible: true,
      notes_bn: null,
      notes_en: null,
    },
  ];

  const syntheticEdges = [
    {
      id: "synthetic_rickshaw_stand_bottola_central_library",
      from_node: "rickshaw_stand_bottola",
      to_node: "central_library",
      distance: 70,
      has_stairs: false,
      has_ramp: true,
      has_elevator: false,
      is_accessible: true,
      surface: "paved",
    },
    {
      id: "synthetic_rickshaw_stand_bottola_shahid_minar",
      from_node: "rickshaw_stand_bottola",
      to_node: "shahid_minar",
      distance: 95,
      has_stairs: false,
      has_ramp: true,
      has_elevator: false,
      is_accessible: true,
      surface: "paved",
    },
    {
      id: "synthetic_rickshaw_stand_bishmail_gate",
      from_node: "rickshaw_stand_bishmail_gate",
      to_node: "bishmail_gate",
      distance: 24,
      has_stairs: false,
      has_ramp: true,
      has_elevator: false,
      is_accessible: true,
      surface: "paved",
    },
    {
      id: "synthetic_rickshaw_stand_prantik_gate",
      from_node: "rickshaw_stand_prantik_gate",
      to_node: "prantik_gate",
      distance: 22,
      has_stairs: false,
      has_ramp: true,
      has_elevator: false,
      is_accessible: true,
      surface: "paved",
    },
    {
      id: "synthetic_rickshaw_stand_dairy_gate",
      from_node: "rickshaw_stand_dairy_gate",
      to_node: "dairy_gate",
      distance: 22,
      has_stairs: false,
      has_ramp: true,
      has_elevator: false,
      is_accessible: true,
      surface: "paved",
    },
    {
      id: "synthetic_electric_cart_stand_dairy_gate",
      from_node: "electric_cart_stand_dairy_gate",
      to_node: "dairy_gate",
      distance: 28,
      has_stairs: false,
      has_ramp: true,
      has_elevator: false,
      is_accessible: true,
      surface: "paved",
    },
    {
      id: "synthetic_electric_cart_stand_dairy_gate_main_gate",
      from_node: "electric_cart_stand_dairy_gate",
      to_node: "main_gate",
      distance: 42,
      has_stairs: false,
      has_ramp: true,
      has_elevator: false,
      is_accessible: true,
      surface: "paved",
    },
    {
      id: "synthetic_electric_cart_stand_rafiq_jabbar",
      from_node: "electric_cart_stand_rafiq_jabbar",
      to_node: "shahid_rafiq",
      distance: 34,
      has_stairs: false,
      has_ramp: true,
      has_elevator: false,
      is_accessible: true,
      surface: "paved",
    },
    {
      id: "synthetic_electric_cart_stand_rafiq_jabbar_rabindranath",
      from_node: "electric_cart_stand_rafiq_jabbar",
      to_node: "rabindranath",
      distance: 55,
      has_stairs: false,
      has_ramp: true,
      has_elevator: false,
      is_accessible: true,
      surface: "paved",
    },
  ];

  for (const node of syntheticNodes) {
    if (!nodes.some((existing) => existing.id === node.id)) {
      nodes.push(node);
    }
  }

  for (const edge of syntheticEdges) {
    if (
      !edges.some(
        (existing) => existing.from_node === edge.from_node && existing.to_node === edge.to_node,
      )
    ) {
      edges.push(edge);
    }
  }

  return {
    nodes: nodes.map((n) => ({
      id: n.id,
      name_bn: n.name_bn,
      name_en: n.name_en,
      type: n.type,
      x: Number(n.x),
      y: Number(n.y),
      accessible: !!n.accessible,
      notes_bn: n.notes_bn,
      notes_en: n.notes_en,
    })),
    edges: edges.map((e) => ({
      id: e.id ?? `${e.from_node}-${e.to_node}`,
      from_node: e.from_node,
      to_node: e.to_node,
      distance: Number(e.distance),
      has_stairs: !!e.has_stairs,
      has_ramp: !!e.has_ramp,
      has_elevator: !!e.has_elevator,
      is_accessible: !!e.is_accessible,
    })),
  };
}
