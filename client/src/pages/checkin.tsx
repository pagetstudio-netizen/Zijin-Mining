import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

import luckyDrawReference from "@assets/IMG-20260916-WA0011(1)_1789562840543.jpg";
import recordsReference from "@assets/IMG-20260916-WA0010_1789562840516.jpg";
import rankingReference from "@assets/IMG-20260916-WA0008(1)_1789562840567.jpg";

type LuckyDrawModal = "ranking" | "records" | null;

export default function CheckinPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [modal, setModal] = useState<LuckyDrawModal>(null);

  const showNoDrawsMessage = () => {
    toast({
      title: "Nombre de tirages restant : 0",
      description: "Invitez un ami à vous inscrire pour recevoir un tour gratuit.",
    });
  };

  return (
    <main className="lucky-draw-page">
      <style>{`
        .lucky-draw-page {
          min-height: 100dvh;
          overflow-x: hidden;
          background: #ff765f;
          font-family: Arial, Helvetica, sans-serif;
        }
        .lucky-draw-page *,
        .lucky-draw-page *::before,
        .lucky-draw-page *::after {
          box-sizing: border-box;
        }
        .lucky-draw-page .lucky-draw-screen,
        .lucky-draw-page .lucky-draw-modal-art {
          position: relative;
          width: min(100%, 500px);
          margin: 0 auto;
          aspect-ratio: 720 / 1600;
          overflow: hidden;
        }
        .lucky-draw-page .lucky-draw-reference {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          pointer-events: none;
          user-select: none;
        }
        .lucky-draw-page .lucky-draw-target {
          position: absolute;
          z-index: 2;
          display: block;
          border: 0;
          border-radius: 18px;
          background: transparent;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .lucky-draw-page .lucky-draw-target:focus-visible,
        .lucky-draw-page .lucky-draw-close:focus-visible {
          outline: 3px solid #fff;
          outline-offset: 2px;
        }
        .lucky-draw-page .lucky-draw-back {
          top: 4.5%;
          left: 1%;
          width: 12%;
          height: 8%;
        }
        .lucky-draw-page .lucky-draw-go {
          top: 39%;
          left: 30%;
          width: 40%;
          height: 19%;
          border-radius: 50%;
        }
        .lucky-draw-page .lucky-draw-ranking {
          top: 75%;
          left: 1%;
          width: 24%;
          height: 15%;
        }
        .lucky-draw-page .lucky-draw-invite {
          top: 75%;
          left: 24%;
          width: 52%;
          height: 15%;
        }
        .lucky-draw-page .lucky-draw-records {
          top: 75%;
          right: 1%;
          width: 24%;
          height: 15%;
        }
        .lucky-draw-page .lucky-draw-modal {
          position: fixed;
          z-index: 60;
          inset: 0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          overflow-y: auto;
          background: rgba(0, 0, 0, .28);
        }
        .lucky-draw-page .lucky-draw-modal-art {
          flex: 0 0 auto;
        }
        .lucky-draw-page .lucky-draw-close {
          position: absolute;
          z-index: 2;
          top: 71%;
          left: 22%;
          width: 56%;
          height: 16%;
          border: 0;
          border-radius: 999px;
          background: transparent;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        @media (min-width: 501px) {
          .lucky-draw-page .lucky-draw-modal {
            padding: 16px 0;
          }
          .lucky-draw-page .lucky-draw-modal-art {
            border-radius: 8px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, .35);
          }
        }
      `}</style>

      <div className="lucky-draw-screen">
        <img
          className="lucky-draw-reference"
          src={luckyDrawReference}
          alt="Route de la fortune, tirage chanceux"
        />

        <button
          type="button"
          className="lucky-draw-target lucky-draw-back"
          aria-label="Retour à l'accueil"
          onClick={() => navigate("/")}
        />
        <button
          type="button"
          className="lucky-draw-target lucky-draw-go"
          aria-label="Lancer le tirage"
          onClick={showNoDrawsMessage}
        />
        <button
          type="button"
          className="lucky-draw-target lucky-draw-ranking"
          aria-label="Afficher le classement"
          onClick={() => setModal("ranking")}
        />
        <button
          type="button"
          className="lucky-draw-target lucky-draw-invite"
          aria-label="Inviter des amis"
          onClick={() => navigate("/team")}
        />
        <button
          type="button"
          className="lucky-draw-target lucky-draw-records"
          aria-label="Afficher les enregistrements"
          onClick={() => setModal("records")}
        />
      </div>

      {modal ? (
        <div className="lucky-draw-modal" role="dialog" aria-modal="true" aria-label={modal === "ranking" ? "Classement fictif" : "Enregistrements"}>
          <div className="lucky-draw-modal-art">
            <img
              className="lucky-draw-reference"
              src={modal === "ranking" ? rankingReference : recordsReference}
              alt={modal === "ranking" ? "Classement fictif des participants" : "Aucun enregistrement"}
            />
            <button
              type="button"
              className="lucky-draw-close"
              aria-label="Fermer"
              onClick={() => setModal(null)}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}