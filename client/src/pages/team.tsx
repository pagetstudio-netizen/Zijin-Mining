import { useEffect, useState } from "react";
import { Copy, Linkedin, Share2 } from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiTelegram,
  SiTiktok,
  SiWhatsapp,
  SiX,
} from "react-icons/si";
import { toDataURL as generateQrCode } from "qrcode";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { getCountryByCode } from "@/lib/countries";
import teamLogo from "@assets/images_(32)_1789546290870.png";
import inviteBackground from "@assets/generated_images/team-invite-background.png";

type TeamSettings = Record<string, string>;

export default function TeamPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [qrCode, setQrCode] = useState("");

  const { data: settings } = useQuery<TeamSettings>({
    queryKey: ["/api/settings"],
  });

  const referralLink = user?.referralCode
    ? `${window.location.origin}/invitation?invite?code=${encodeURIComponent(user.referralCode)}`
    : "";

  useEffect(() => {
    let cancelled = false;

    if (!referralLink) {
      setQrCode("");
      return;
    }

    generateQrCode(referralLink, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 180,
      color: {
        dark: "#151515",
        light: "#ffffff",
      },
    }).then((dataUrl) => {
      if (!cancelled) setQrCode(dataUrl);
    }).catch(() => {
      if (!cancelled) setQrCode("");
    });

    return () => {
      cancelled = true;
    };
  }, [referralLink]);

  if (!user) return null;

  const countryInfo = getCountryByCode(user.country);
  const phonePrefix = countryInfo?.phonePrefix || "";
  const phoneDigits = user.phone.replace(/\D/g, "");
  const displayPhone = phoneDigits.startsWith(phonePrefix)
    ? `+${phoneDigits}`
    : `+${phonePrefix}${phoneDigits}`;
  const level1Rate = settings?.level1Commission || "25";
  const level2Rate = settings?.level2Commission || "3";
  const level3Rate = settings?.level3Commission || "2";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({ title: "Lien copié !" });
    } catch {
      toast({ title: "Copie impossible", description: "Sélectionnez le lien pour le copier." });
    }
  };

  return (
    <main className="team-reference">
      <style>{`
        .team-reference {
          min-height: 100vh;
          padding-bottom: 70px;
          background: #fff;
          color: #171717;
          font-family: Arial, Helvetica, sans-serif;
        }
        .team-reference .team-screen {
          width: 100%;
          max-width: 512px;
          min-height: 100vh;
          margin: 0 auto;
          overflow: hidden;
          background: #fff;
        }
        .team-reference .team-title {
          display: flex;
          height: 57px;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px 0 45px;
          border-bottom: 1px solid #e9e9e9;
          font-size: 35px;
          font-weight: 400;
          line-height: 1;
        }
        .team-reference .team-title img {
          width: 58px;
          height: 58px;
          object-fit: contain;
        }
        .team-reference .invite-link-panel {
          margin: 7px 10px 0;
          padding: 20px 19px 19px;
          border: 1px solid #ebebeb;
          border-radius: 11px;
          background: #fff;
          box-shadow: 0 1px 5px rgba(0, 0, 0, .04);
        }
        .team-reference .invite-link-title {
          margin: 0 0 17px;
          font-size: 19px;
          font-weight: 400;
          line-height: 1;
        }
        .team-reference .invite-link-box {
          display: flex;
          min-height: 84px;
          align-items: center;
          gap: 10px;
          padding: 12px 9px 12px 11px;
          border: 2px solid #9847d2;
          background: #fff;
        }
        .team-reference .invite-link-box span {
          min-width: 0;
          flex: 1;
          color: #111;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.3;
          overflow-wrap: anywhere;
        }
        .team-reference .invite-link-copy {
          display: grid;
          width: 31px;
          height: 31px;
          flex: 0 0 auto;
          place-items: center;
          color: #36dba2;
        }
        .team-reference .invite-link-copy svg {
          width: 24px;
          height: 24px;
        }
        .team-reference .share-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 9px;
          margin-top: 18px;
          padding: 0 8px;
        }
        .team-reference .share-item {
          display: grid;
          width: 33px;
          height: 33px;
          place-items: center;
          border-radius: 4px;
          color: white;
          box-shadow: 0 1px 2px rgba(0, 0, 0, .18);
        }
        .team-reference .share-item svg {
          width: 22px;
          height: 22px;
        }
        .team-reference .share-item.x { background: #171717; }
        .team-reference .share-item.facebook { background: #25549b; }
        .team-reference .share-item.telegram { background: #2d9bd3; border-radius: 50%; }
        .team-reference .share-item.linkedin { background: #0b78b5; }
        .team-reference .share-item.whatsapp { background: #30b95c; border-radius: 50%; }
        .team-reference .share-item.instagram { background: linear-gradient(135deg, #f7ce57, #e1306c 55%, #5851db); border-radius: 8px; }
        .team-reference .share-item.tiktok { background: #191919; }
        .team-reference .share-item.more { background: #e76a46; }
        .team-reference .share-item.more svg { width: 23px; height: 23px; }
        .team-reference .pink-divider {
          height: 12px;
          margin: 8px 8px 10px;
          background: #fae6f1;
        }
        .team-reference .qr-card {
          position: relative;
          height: 195px;
          margin: 0 26px;
          overflow: hidden;
          background-color: #c8e9f6;
          background-image: url("${inviteBackground}");
          background-position: center;
          background-size: cover;
        }
        .team-reference .qr-card::after {
          position: absolute;
          inset: 43px 17px 17px;
          z-index: 0;
          border-radius: 0;
          background: linear-gradient(102deg, #12eb87 0%, #32d8bd 44%, #87a4ef 100%);
          content: "";
        }
        .team-reference .qr-card-inner {
          position: absolute;
          inset: 61px 28px 27px 40px;
          z-index: 1;
          display: grid;
          grid-template-columns: 78px 1fr 91px;
          align-items: center;
          gap: 7px;
        }
        .team-reference .qr-brand {
          display: grid;
          width: 80px;
          height: 80px;
          place-items: center;
          overflow: hidden;
          background: white;
        }
        .team-reference .qr-brand img {
          width: 74px;
          height: 74px;
          object-fit: contain;
        }
        .team-reference .qr-copy {
          min-width: 0;
          color: #21334c;
        }
        .team-reference .qr-phone {
          margin: 0 0 11px;
          font-size: 19px;
          font-weight: 700;
          line-height: 1;
          white-space: nowrap;
        }
        .team-reference .qr-code-label {
          margin: 0;
          font-size: 14px;
          line-height: 1.2;
          white-space: nowrap;
        }
        .team-reference .qr-code-label strong {
          font-weight: 400;
        }
        .team-reference .qr-code-copy {
          display: inline-grid;
          width: 18px;
          height: 18px;
          margin-left: 3px;
          place-items: center;
          color: #22c79a;
          vertical-align: middle;
        }
        .team-reference .qr-code-copy svg {
          width: 16px;
          height: 16px;
        }
        .team-reference .qr-image {
          display: block;
          width: 91px;
          height: 91px;
          padding: 2px;
          background: white;
          object-fit: contain;
        }
        .team-reference .qr-loading {
          display: grid;
          width: 91px;
          height: 91px;
          place-items: center;
          background: white;
          color: #8d4ac5;
          font-size: 11px;
          text-align: center;
        }
        .team-reference .qr-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 13px 26px 0;
        }
        .team-reference .qr-action {
          display: flex;
          height: 55px;
          align-items: center;
          justify-content: center;
          border: 2px solid #a146c7;
          background: #fff;
          color: #222;
          font-size: 17px;
          font-weight: 400;
          white-space: nowrap;
        }
        .team-reference .qr-action svg {
          width: 21px;
          height: 21px;
          margin-right: 8px;
          color: #a146c7;
        }
        .team-reference .qr-action.primary {
          border-color: #e4b400;
          background: #e5b500;
          color: #fff;
          font-size: 19px;
          font-weight: 700;
          box-shadow: 0 2px 0 #b78000;
        }
        .team-reference .qr-action.primary svg { display: none; }
        .team-reference .team-explainer {
          margin: 33px 26px 22px;
          padding: 22px 18px 28px;
          border: 1px solid #ededed;
          border-radius: 9px;
          background: #fff;
          box-shadow: 0 1px 5px rgba(0, 0, 0, .04);
        }
        .team-reference .team-explainer h2 {
          margin: 0 0 11px;
          color: #262626;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.25;
        }
        .team-reference .team-explainer p {
          margin: 0 0 17px;
          color: #252525;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.42;
        }
        .team-reference .team-explainer p:last-child { margin-bottom: 0; }
        .team-reference .team-explainer strong {
          color: #00b88a;
          font-weight: 700;
        }
        @media (max-width: 390px) {
          .team-reference .team-title {
            padding-left: 28px;
            font-size: 31px;
          }
          .team-reference .invite-link-panel {
            padding-right: 13px;
            padding-left: 13px;
          }
          .team-reference .share-row {
            gap: 5px;
            padding: 0 2px;
          }
          .team-reference .qr-card {
            margin-right: 17px;
            margin-left: 17px;
          }
          .team-reference .qr-actions {
            gap: 8px;
            margin-right: 17px;
            margin-left: 17px;
          }
          .team-reference .qr-action {
            font-size: 14px;
          }
          .team-reference .team-explainer {
            margin-right: 17px;
            margin-left: 17px;
          }
        }
      `}</style>

      <div className="team-screen">
        <header className="team-title">
          <span>Équipe</span>
          <img src={teamLogo} alt="Zijin Mining" />
        </header>

        <section className="invite-link-panel" aria-label="Lien d'invitation">
          <h2 className="invite-link-title">Lien d&apos;invitation</h2>
          <div className="invite-link-box">
            <span data-testid="text-referral-link">{referralLink}</span>
            <button type="button" className="invite-link-copy" onClick={copyLink} aria-label="Copier le lien d'invitation">
              <Copy aria-hidden="true" />
            </button>
          </div>
          <div className="share-row" aria-label="Réseaux sociaux">
            <button type="button" className="share-item x" onClick={copyLink} aria-label="Partager sur X"><SiX aria-hidden="true" /></button>
            <button type="button" className="share-item facebook" onClick={copyLink} aria-label="Partager sur Facebook"><SiFacebook aria-hidden="true" /></button>
            <button type="button" className="share-item telegram" onClick={copyLink} aria-label="Partager sur Telegram"><SiTelegram aria-hidden="true" /></button>
            <button type="button" className="share-item linkedin" onClick={copyLink} aria-label="Partager sur LinkedIn"><Linkedin aria-hidden="true" /></button>
            <button type="button" className="share-item whatsapp" onClick={copyLink} aria-label="Partager sur WhatsApp"><SiWhatsapp aria-hidden="true" /></button>
            <button type="button" className="share-item instagram" onClick={copyLink} aria-label="Partager sur Instagram"><SiInstagram aria-hidden="true" /></button>
            <button type="button" className="share-item tiktok" onClick={copyLink} aria-label="Partager sur TikTok"><SiTiktok aria-hidden="true" /></button>
            <button type="button" className="share-item more" onClick={copyLink} aria-label="Copier le lien"><Share2 aria-hidden="true" /></button>
          </div>
        </section>

        <div className="pink-divider" aria-hidden="true" />

        <section className="qr-card" aria-label="Carte d'invitation">
          <div className="qr-card-inner">
            <div className="qr-brand">
              <img src={teamLogo} alt="Zijin Mining" />
            </div>
            <div className="qr-copy">
              <p className="qr-phone">{displayPhone}</p>
              <p className="qr-code-label">
                code d&apos;invitation: <strong>{user.referralCode}</strong>
                <button type="button" className="qr-code-copy" onClick={copyLink} aria-label="Copier le code d'invitation">
                  <Copy aria-hidden="true" />
                </button>
              </p>
            </div>
            {qrCode ? (
              <img className="qr-image" src={qrCode} alt="QR code d'invitation" />
            ) : (
              <div className="qr-loading">QR code</div>
            )}
          </div>
        </section>

        <div className="qr-actions">
          <button type="button" className="qr-action" onClick={copyLink} data-testid="button-copy-link">
            <Copy aria-hidden="true" />
            Copie Lien d&apos;invitation
          </button>
          <button type="button" className="qr-action primary" onClick={() => navigate("/team-details")} data-testid="button-centre-taches">
            Détails de l&apos;équipe
          </button>
        </div>

        <section className="team-explainer" aria-label="Explication du programme d'équipe">
          <h2>📢 Recrutement de partenaires de promotion</h2>
          <p>
            Chaque fois que les membres de votre équipe de niveau 1 à 3 débloquent le niveau
            T, vous recevez automatiquement du montant débloqué :
            <strong> {level1Rate}%, {level2Rate}%, {level3Rate}%</strong>
          </p>
          <p>
            Chaque fois que les membres de votre équipe de niveau 1 à 3 accomplissent une
            tâche notée, vous recevez automatiquement leur commission de tâche :
            <strong> {level1Rate}%, {level2Rate}%, {level3Rate}%</strong>
          </p>
          <p>
            Invitez vos amis avec votre lien personnel. Lorsqu&apos;ils s&apos;inscrivent,
            effectuent un dépôt approuvé et réalisent leur premier investissement éligible,
            ils deviennent des membres qualifiés de votre équipe.
          </p>
          <p>
            Les commissions sont calculées automatiquement et peuvent être consultées depuis
            l&apos;historique de votre équipe. Plus votre équipe est active, plus vos récompenses
            de parrainage peuvent augmenter.
          </p>
        </section>
      </div>
    </main>
  );
}