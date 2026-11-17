// Modelos Torque que se muestran en el catálogo público. El código coincide con
// el `model` que calcula el backend ("TQ-AT701").
export type TorqueModel = {
  code: string;
  name: string;
  category: string;
};

export const TORQUE_MODELS: TorqueModel[] = [
  { code: "TQ021", name: "TQ021", category: "Auto" },
  { code: "TQ901", name: "TQ901", category: "Auto deportivo" },
  { code: "TQ-HP701", name: "HP701", category: "SUV alto desempeño" },
  { code: "TQ-HT701", name: "HT701", category: "SUV / Pickup carretera" },
  { code: "TQ-AT701", name: "AT701", category: "Todo terreno" },
  { code: "TQ-MT701", name: "MT701", category: "Lodo / Off-road" },
  { code: "TQ-05", name: "TQ-05", category: "Camioneta de carga" },
  { code: "TQ-02", name: "TQ-02", category: "Camioneta de carga" },
];
