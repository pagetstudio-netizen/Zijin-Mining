import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-full" style={{ background: "#111" }}>

      {/* Header */}
      <header className="flex items-center px-4 py-3" style={{ background: "#111", borderBottom: "1px solid #222" }}>
        <Link href="/account">
          <button className="p-1" data-testid="button-back">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </Link>
        <h1 className="flex-1 text-center text-base font-semibold text-white pr-6">À propos de nous</h1>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5" style={{ color: "#d4d4d4", fontSize: 13.5, lineHeight: "1.75" }}>

        <p>
          Zijin Mining est une entreprise minière et métallurgique de premier plan à l'échelle mondiale et l'un des plus grands producteurs d'or, de cuivre et de zinc au monde. La société exploite plus de 30 projets et exploitations minières de grande envergure dans 19 pays sur 5 continents.
        </p>

        <p>
          Grâce à ses solides capacités internes de recherche, d'ingénierie et de développement, Zijin maintient une efficacité opérationnelle élevée et des coûts réduits, tant pour ses acquisitions que pour ses opérations.
        </p>

        <p>
          Ceci lui permet d'être un chef de file de l'industrie en matière de création de valeur, une performance qui repose sur sa philosophie de développement inclusif.
        </p>

        <p>
          Cette philosophie se traduit par d'excellentes performances environnementales, sociales et de gouvernance. Les actions de Zijin sont cotées à la Bourse de Hong Kong (HKEX: 2899) et à la Bourse de Shanghai (SSE: 601899).
        </p>

      </div>
    </div>
  );
}
