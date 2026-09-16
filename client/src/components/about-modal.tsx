import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import tonLogo from "@assets/images_(25)_1787362424281.png";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AboutModal({ open, onClose }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
              <img src={tonLogo} alt="Zijin Mining" className="w-10 h-10 object-contain" />
            </div>
            À propos de Zijin Mining
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Zijin Mining est une entreprise minière et métallurgique de premier plan à l'échelle mondiale et l'un des plus grands producteurs d'or, de cuivre et de zinc au monde.
          </p>
          <p>
            La société exploite plus de 30 projets et exploitations minières de grande envergure dans 19 pays sur 5 continents. Grâce à ses solides capacités internes de recherche, d'ingénierie et de développement, Zijin maintient une efficacité opérationnelle élevée et des coûts réduits, tant pour ses acquisitions que pour ses opérations.
          </p>
          <p>
            Ceci lui permet d'être un chef de file de l'industrie en matière de création de valeur, une performance qui repose sur sa philosophie de développement inclusif et se traduit par d'excellentes performances environnementales, sociales et de gouvernance.
          </p>
          <p className="text-xs">
            Les actions de Zijin sont cotées à la Bourse de Hong Kong (HKEX: 2899) et à la Bourse de Shanghai (SSE: 601899).
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
