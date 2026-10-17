import { Objective } from '../models/objective.model';

export const DEFAULT_OBJECTIVES: Record<string, Objective> = {
  "masa": {
    id: "masa",
    title: "Aumentar masa muscular",
    problem: "Muchas veces entrenar pesado no alcanza si los músculos no reciben la proteína ni el excedente calórico necesario para repararse y crecer. Si te estancaste o te cuesta ver cambios reales en la balanza, probablemente tu cuerpo requiera un refuerzo.",
    supplements: [
      { name: "Whey Protein (2lbs / 3kg / Tarro)", description: "Aporte rápido de proteínas post-entreno para reconstruir fibras musculares." },
      { name: "Mutant Mass", description: "Ganador de peso hipercalórico, ideal si te cuesta llegar a las calorías del día." },
      { name: "Creatina", description: "Energía celular que te permite mover más peso y retrasar la fatiga." }
    ],
    combo: {
      name: "Combo Volumen Completo",
      desc: "Whey Protein 2 libras + Creatina 300g",
      explanation: "Este combo asegura que tengas tanto el estímulo de fuerza (creatina) como el material de construcción (proteína) para maximizar la hipertrofia cada día."
    }
  },
  "definicion": {
    id: "definicion",
    title: "Definición / Quema de Grasa",
    problem: "El objetivo es perder porcentaje de grasa sin sacrificar todo el músculo que costó construir. Hacer recortes calóricos fuertes a menudo agota tu físico, frenando los resultados a mediano plazo.",
    supplements: [
      { name: "Whey Protein", description: "Fuente de proteína muy saciante, bajísima en grasas y carbohidratos." },
      { name: "BCAA (120 cápsulas)", description: "Aminoácidos esenciales para proteger al músculo durante entrenamientos en déficit o en ayunas." }
    ],
    combo: {
      name: "Combo Definición Extrema",
      desc: "Whey Protein 2 libras + BCAA 120 cápsulas",
      explanation: "Ideal para bajar grasa manteniéndote lleno, mientras proteges tu tejido muscular de la destrucción causada por la dieta restrictiva."
    }
  },
  "energia": {
    id: "energia",
    title: "Energía y Rendimiento",
    problem: "¿Llegás sin pilas al gimnasio después de trabajar? Rendir a medias significa resultados a medias. Cuando tu sistema nervioso central está fatigado, la intensidad cae drásticamente.",
    supplements: [
      { name: "V8 Pump (Pre-entreno)", description: "Estimulación, foco mental y mayor bombeo de sangre al músculo (pump)." },
      { name: "Nitrix Bomb (90 comp)", description: "Potenciador pre-entreno extremo sin estimulantes pesados." },
      { name: "Creatina", description: "Recarga de manera inmediata tu sistema energético para esfuerzos cortos y potentes." }
    ],
    combo: {
      name: "Combo Energía Total",
      desc: "V8 Pump + Creatina 300g",
      explanation: "Diseñado para los que quieren aprovechar cada segundo en el gimnasio: foco supremo para iniciar, y fuerza constante para mantener."
    }
  },
  "recuperacion": {
    id: "recuperacion",
    title: "Recuperación y Descanso",
    problem: "Muchas veces entrenar bien no alcanza si el cuerpo no se recupera. Dormir mal y tener dolores persistentes no te dejarán dar el 100% en tu próxima sesión.",
    supplements: [
      { name: "Magnesio (60 caps / Citrato)", description: "Relaja la tensión muscular y previene calambres nocturnos." },
      { name: "ZMA (90 cápsulas)", description: "Mayor descanso nocturno profundo y mejora del perfil hormonal." },
      { name: "Glutamina", description: "Aminoácido que acelera drásticamente los tiempos de asimilación post-rutina y apoya la salud intestinal." },
      { name: "EEAA (Aminoácidos esenciales)", description: "Asimilación intra o post entreno sin digestión pesada." }
    ],
    combo: {
      name: "Combo PM / Recuperación",
      desc: "Glutamina + ZMA + Magnesio",
      explanation: "Este combo trabaja mientras dormís. Te levantarás listo, como nuevo y libre de fatiga muscular, sumando un profundo bienestar cerebral."
    }
  },
  "salud": {
    id: "salud",
    title: "Salud y Bienestar",
    problem: "No todo es masa muscular y fuerza bruta. A veces, las articulaciones molestas o una deficiencia vitamínica invisible nos impiden disfrutar nuestro día a día al máximo.",
    supplements: [
      { name: "Colágeno (210g)", description: "Nutrición integral para articulaciones, ligamentos y tendones al límite." },
      { name: "Omega 3 (60 cápsulas)", description: "Potente antiinflamatorio sistémico y gran apoyo del sistema cardiovascular." },
      { name: "Resveratrol & Multivitamínico", description: "Lucha contra radicales libres y provee base sólida de bienestar." }
    ],
    combo: {
      name: "Combo Wellness Total",
      desc: "Omega 3 + Multivitamínico + Colágeno",
      explanation: "Tu póliza de seguro. Cubre todos los aspectos desde la movilidad general y las vitaminas esenciales diarias, hasta la salud de tu corazón y cerebro."
    }
  }
};
