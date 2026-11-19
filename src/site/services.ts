// Servicios del taller. Cada grupo tiene su propia página para posicionar
// en buscadores ("alineación y balanceo en ...", "taller mecánico en ...").

export type ServiceItem = {
  id: string;
  name: string;
  description: string;
};

export type ServiceGroup = {
  id: string;
  title: string;
  summary: string;
  items: ServiceItem[];
  /** Señales de que el auto necesita el servicio. */
  signs: string[];
  whatsappText: string;
};

export const ALIGNMENT_SERVICE: ServiceGroup = {
  id: "alineacion-y-balanceo",
  title: "Alineación y balanceo",
  summary:
    "Ajustamos los ángulos de tus ruedas y equilibramos cada llanta para que tu auto vaya derecho, sin vibraciones y con un desgaste parejo.",
  items: [
    {
      id: "alineacion",
      name: "Alineación",
      description:
        "Corregimos convergencia, caída y avance para que el volante quede derecho y el auto no se jale hacia un lado.",
    },
    {
      id: "balanceo",
      name: "Balanceo",
      description:
        "Equilibramos cada llanta con su rin para eliminar la vibración en el volante y en el asiento a velocidad de carretera.",
    },
  ],
  signs: [
    "El volante queda chueco cuando vas en línea recta.",
    "El auto se va hacia un lado si sueltas el volante.",
    "Tus llantas se gastan más de una orilla que de la otra.",
    "Sientes vibración en el volante entre 80 y 110 km/h.",
    "Acabas de cambiar llantas o de arreglar la suspensión.",
  ],
  whatsappText: "Hola, quiero agendar alineación y balanceo para mi auto.",
};

export const MECHANIC_SERVICES: ServiceGroup[] = [
  {
    id: "frenos",
    title: "Frenos",
    summary: "Cambio de balatas para que frenes seguro y sin ruidos.",
    items: [
      {
        id: "balatas",
        name: "Cambio de balatas",
        description:
          "Revisamos el sistema de frenos y cambiamos balatas delanteras y traseras cuando ya llegaron a su límite.",
      },
    ],
    signs: [
      "Rechinido o chillido metálico al frenar.",
      "El pedal se siente más largo o esponjoso.",
      "El auto tarda más en detenerse.",
    ],
    whatsappText: "Hola, quiero cotizar cambio de balatas.",
  },
  {
    id: "mantenimiento",
    title: "Cambio de aceite y afinación",
    summary: "Mantenimiento preventivo para que tu motor rinda y dure más.",
    items: [
      {
        id: "aceite",
        name: "Cambio de aceite",
        description:
          "Cambio de aceite y filtro con el tipo y la viscosidad que pide tu motor.",
      },
      {
        id: "afinacion",
        name: "Afinación",
        description:
          "Revisión y cambio de bujías, filtros y ajustes para recuperar potencia y rendimiento de gasolina.",
      },
    ],
    signs: [
      "Ya pasó el kilometraje recomendado por el fabricante.",
      "El motor tiembla en ralentí o le cuesta arrancar.",
      "Notas que gastas más gasolina que antes.",
    ],
    whatsappText: "Hola, quiero cotizar cambio de aceite y afinación.",
  },
  {
    id: "suspension-y-direccion",
    title: "Suspensión y dirección",
    summary:
      "Ajustamos o cambiamos las piezas de la suspensión y la dirección para que tu auto sea estable y cómodo.",
    items: [
      {
        id: "barra-estabilizadora",
        name: "Barra estabilizadora",
        description: "Revisión y cambio de gomas y tornillos de la barra estabilizadora.",
      },
      {
        id: "bujes-de-horquilla",
        name: "Bujes de horquilla",
        description: "Cambio de bujes para eliminar golpeteos y holguras en la horquilla.",
      },
      {
        id: "rotulas",
        name: "Rótulas",
        description: "Cambio de rótulas superiores e inferiores con juego o desgaste.",
      },
      {
        id: "amortiguadores",
        name: "Amortiguadores",
        description: "Cambio de amortiguadores para recuperar estabilidad y frenado seguro.",
      },
      {
        id: "resortes",
        name: "Resortes",
        description: "Cambio de resortes vencidos o rotos para que el auto recupere su altura.",
      },
    ],
    signs: [
      "Golpeteo o rechinido al pasar topes y baches.",
      "El auto rebota o se inclina mucho en las curvas.",
      "Sientes juego u holgura en el volante.",
      "Un lado del auto se ve más bajo que el otro.",
    ],
    whatsappText: "Hola, quiero cotizar una revisión de suspensión y dirección.",
  },
];

export const TIRES_WHATSAPP_TEXT = "Hola, quiero cotizar llantas para mi auto.";
