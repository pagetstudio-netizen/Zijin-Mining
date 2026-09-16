import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

import zijinLogo from "@assets/ac25e2a8581a41008a0930d734236922_1789546290888.png";

export default function InvestmentInfoPage() {
  return (
    <main className="investment-info-page">
      <style>{`
        .investment-info-page {
          min-height: 100dvh;
          background: #f4f4f4;
          color: #181818;
          font-family: Arial, Helvetica, sans-serif;
        }
        .investment-info-page *,
        .investment-info-page *::before,
        .investment-info-page *::after {
          box-sizing: border-box;
        }
        .investment-info-page .investment-info-screen {
          width: 100%;
          max-width: 700px;
          min-height: 100dvh;
          margin: 0 auto;
          background: #f4f4f4;
        }
        .investment-info-page .investment-info-header {
          display: flex;
          min-height: 74px;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #e5e5e5;
          padding: 10px 18px;
          background: #fff;
        }
        .investment-info-page .investment-info-back {
          display: grid;
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          place-items: center;
          border: 0;
          background: transparent;
          color: #181818;
        }
        .investment-info-page .investment-info-back svg {
          width: 28px;
          height: 28px;
        }
        .investment-info-page .investment-info-logo {
          width: 54px;
          height: 42px;
          object-fit: contain;
        }
        .investment-info-page .investment-info-title {
          flex: 1;
          margin: 0;
          color: #c90018;
          font-size: clamp(20px, 5vw, 29px);
          font-weight: 700;
          line-height: 1.15;
        }
        .investment-info-page .investment-info-content {
          padding: 20px 18px 34px;
        }
        .investment-info-page .investment-info-intro {
          margin: 0 0 18px;
          color: #343434;
          font-size: clamp(16px, 3.8vw, 21px);
          font-weight: 700;
          line-height: 1.45;
        }
        .investment-info-page .investment-info-card {
          margin-bottom: 18px;
          border-radius: 18px;
          padding: 20px clamp(17px, 4.2vw, 28px);
          background: #fff;
          box-shadow: 0 2px 7px rgba(0, 0, 0, .08);
        }
        .investment-info-page .investment-info-card.stable {
          border-left: 7px solid #3ba7c2;
        }
        .investment-info-page .investment-info-card.activity {
          border-left: 7px solid #d9a600;
        }
        .investment-info-page .investment-info-card h2 {
          margin: 0 0 12px;
          color: #277e9b;
          font-size: clamp(21px, 5vw, 29px);
          line-height: 1.2;
        }
        .investment-info-page .investment-info-card.activity h2 {
          color: #b68100;
        }
        .investment-info-page .investment-info-card p {
          margin: 0 0 12px;
          color: #333;
          font-size: clamp(15px, 3.65vw, 20px);
          font-weight: 400;
          line-height: 1.55;
        }
        .investment-info-page .investment-info-card p:last-child {
          margin-bottom: 0;
        }
        .investment-info-page .investment-info-example {
          margin-top: 15px !important;
          border-radius: 10px;
          padding: 12px 14px;
          background: #fff8df;
          color: #5e4b19 !important;
          font-weight: 700 !important;
        }
        @media (max-width: 360px) {
          .investment-info-page .investment-info-header {
            padding-right: 12px;
            padding-left: 12px;
          }
          .investment-info-page .investment-info-content {
            padding-right: 14px;
            padding-left: 14px;
          }
          .investment-info-page .investment-info-card {
            padding-right: 15px;
            padding-left: 15px;
          }
        }
      `}</style>

      <div className="investment-info-screen">
        <header className="investment-info-header">
          <Link href="/">
            <button type="button" className="investment-info-back" aria-label="Retour à l'accueil">
              <ChevronLeft aria-hidden="true" />
            </button>
          </Link>
          <img className="investment-info-logo" src={zijinLogo} alt="Zijin Mining" />
          <h1 className="investment-info-title">Nos produits d'investissement</h1>
        </header>

        <div className="investment-info-content">
          <p className="investment-info-intro">
            Notre entreprise propose deux catégories de produits d'investissement.
            Découvrez le fonctionnement de chacune d'elles avant de choisir un produit.
          </p>

          <section className="investment-info-card stable" aria-labelledby="stable-products-title">
            <h2 id="stable-products-title">Produits stables</h2>
            <p>
              Les produits stables sont des produits que notre entreprise propose à ses
              employés et à ses utilisateurs. Vous pouvez acheter ces produits pour
              investir sur le long terme.
            </p>
            <p>
              Pour un produit stable, les gains sont crédités à la fin de la période
              prévue. Les gains ne sont donc pas crédités toutes les 24 heures.
            </p>
            <p>
              Cette catégorie permet de viser des gains sur le long terme et de
              renforcer la stabilité et la fiabilité de notre entreprise.
            </p>
          </section>

          <section className="investment-info-card activity" aria-labelledby="activity-products-title">
            <h2 id="activity-products-title">Produits d'activité</h2>
            <p>
              Les produits d'activité sont des produits promotionnels que notre
              entreprise publie ponctuellement. Leur disponibilité, leur pourcentage
              de bénéfice et leur durée peuvent varier selon chaque promotion.
            </p>
            <p>
              Par exemple, si un produit d'activité est proposé pour une durée de
              3 jours, le gain est bloqué pendant cette période. À la fin des 3 jours,
              le montant et le bénéfice sont débloqués conformément aux conditions
              annoncées pour ce produit.
            </p>
            <p className="investment-info-example">
              La durée et le pourcentage de bénéfice dépendent toujours du produit
              d'activité publié.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}