import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import zijinLogo from "@assets/ac25e2a8581a41008a0930d734236922_1789546290888.png";
import companyTeam from "@assets/images_(86)_1789546290607.jpeg";
import companyTraining from "@assets/images_(82)_1789546290792.jpeg";
import companyCelebration from "@assets/images_(85)_1789546290756.jpeg";
import companyGroup from "@assets/images_(84)_1789546290771.jpeg";
import companyDeepDive from "@assets/0fcb4ec257b549faba087ffc9d08a051_1789546290830.jpg";
import companyLogoStory from "@assets/Zijin_2353899579-430x241_1789546290812.jpg";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-full bg-[#fbf7eb] text-[#181818]">

      {/* Header */}
      <header className="flex items-center gap-3 border-b border-[#eadfbf] bg-white px-4 py-3">
        <Link href="/account">
          <button className="p-1" data-testid="button-back">
            <ChevronLeft className="w-6 h-6 text-[#181818]" />
          </button>
        </Link>
        <img src={zijinLogo} alt="Zijin Mining" className="h-8 w-auto object-contain" />
        <h1 className="flex-1 text-center pr-6 text-base font-semibold text-[#181818]">À propos de nous</h1>
      </header>

      {/* Body */}
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5" style={{ fontSize: 13.5, lineHeight: "1.75" }}>
        <img src={companyDeepDive} alt="Programme international Zijin Mining" className="h-48 w-full rounded-2xl object-cover shadow-sm" />

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

        <div className="grid grid-cols-2 gap-3" aria-label="Zijin Mining en images">
          <img src={companyTeam} alt="Équipe Zijin Mining" className="h-32 w-full rounded-xl object-cover" />
          <img src={companyTraining} alt="Formation des talents Zijin Mining" className="h-32 w-full rounded-xl object-cover" />
          <img src={companyCelebration} alt="Célébration d'équipe Zijin Mining" className="h-32 w-full rounded-xl object-cover" />
          <img src={companyGroup} alt="Équipe Zijin Mining en formation" className="h-32 w-full rounded-xl object-cover" />
          <img src={companyLogoStory} alt="Logo Zijin Mining" className="h-32 w-full rounded-xl object-cover" />
        </div>

      </div>
    </div>
  );
}
