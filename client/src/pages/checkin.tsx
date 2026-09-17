import { type CSSProperties, useRef, useState } from "react";
import { ArrowLeft, BarChart3, FileText, Gift, HelpCircle, Share2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

type FortuneModal = "ranking" | "records" | null;
type FortuneStatus = { remainingSpins: number };
type FortuneSpinResult = { reward: number; remainingSpins: number; wheelIndex: number };
type FortuneRecord = {
  id: number;
  reward: number | null;
  createdAt: string;
  usedAt: string | null;
};
type FortuneOutcome = {
  won: boolean;
  reward: number | null;
  message: string;
};

const wheelValues = ["5", "10", "30", "100", "300", "1000", "2000", "5000"];

const rankingRows = [
  { rank: "1", phone: "0101007785", bonus: "21170" },
  { rank: "2", phone: "0545853560", bonus: "18480" },
  { rank: "3", phone: "675832091", bonus: "16280" },
  { rank: "4", phone: "0102054604", bonus: "15770" },
  { rank: "5", phone: "0101676111", bonus: "13720" },
];

export default function CheckinPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [modal, setModal] = useState<FortuneModal>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastReward, setLastReward] = useState<number | null>(null);
  const [wheelRotation, setWheelRotation] = useState(1800);
  const [fortuneOutcome, setFortuneOutcome] = useState<FortuneOutcome | null>(null);
  const spinRequestLocked = useRef(false);
  const spinDuration = 3400;

  const {
    data: fortuneStatus,
    isLoading: loadingFortuneStatus,
    isError: fortuneStatusError,
  } = useQuery<FortuneStatus>({
    queryKey: ["/api/fortune/status"],
  });

  const { data: fortuneRecords = [], isLoading: loadingFortuneRecords } = useQuery<FortuneRecord[]>({
    queryKey: ["/api/fortune/records"],
    enabled: modal === "records",
  });

  const remainingSpins = fortuneStatus?.remainingSpins ?? 0;

  const showLossPopup = (message: string) => {
    setFortuneOutcome({ won: false, reward: null, message });
  };

  const spinMutation = useMutation<FortuneSpinResult, Error, void>({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/fortune/spin", {});
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Impossible de lancer la roue");
      }
      return response.json();
    },
    onSuccess: (data) => {
      const safeWheelIndex = Math.max(0, Math.min(wheelValues.length - 1, Math.floor(data.wheelIndex)));
      const targetRotation = (5 * 360) + ((360 - safeWheelIndex * 45) % 360);
      setWheelRotation(targetRotation);
      setLastReward(data.reward);
      queryClient.setQueryData(["/api/fortune/status"], {
        remainingSpins: data.remainingSpins,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/fortune/records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setIsSpinning(true);
      window.setTimeout(() => {
        setIsSpinning(false);
        spinRequestLocked.current = false;
        if (data.reward > 0) {
          setFortuneOutcome({
            won: true,
            reward: data.reward,
            message: "Votre gain a été crédité sur votre solde.",
          });
        } else {
          showLossPopup("Aucun gain n’a été crédité pour ce tirage.");
        }
      }, spinDuration);
    },
    onError: (error) => {
      setIsSpinning(false);
      spinRequestLocked.current = false;
      showLossPopup(error.message || "Le tirage n’a pas pu être effectué.");
    },
  });

  const showNoDrawsMessage = () => {
    showLossPopup(`Nombre de tours restants : ${remainingSpins}. Obtenez un tour pour rejouer.`);
  };

  const handleSpin = () => {
    if (spinRequestLocked.current || isSpinning || spinMutation.isPending) return false;
    if (loadingFortuneStatus) {
      showLossPopup("Le nombre de tours est encore en cours de chargement.");
      return false;
    }
    if (fortuneStatusError) {
      showLossPopup("Actualisez la page puis réessayez.");
      return false;
    }
    if (remainingSpins <= 0) {
      showNoDrawsMessage();
      return false;
    }
    setLastReward(null);
    setFortuneOutcome(null);
    spinRequestLocked.current = true;
    spinMutation.mutate();
    return true;
  };

  return (
    <main className="fortune-page">
      <style>{`
        .fortune-page {
          min-height: 100dvh;
          overflow-x: hidden;
          background:
            radial-gradient(circle at 50% 31%, rgba(255, 246, 190, .9) 0 13%, transparent 31%),
            radial-gradient(circle at 8% 76%, rgba(255, 236, 137, .52), transparent 24%),
            radial-gradient(circle at 95% 67%, rgba(255, 218, 104, .48), transparent 23%),
            linear-gradient(180deg, #ff3d2d 0%, #ff654e 28%, #ff8066 65%, #ff9a7e 100%);
          color: #4a2118;
          font-family: Arial, Helvetica, sans-serif;
        }
        .fortune-page *,
        .fortune-page *::before,
        .fortune-page *::after {
          box-sizing: border-box;
        }
        .fortune-page .fortune-screen {
          position: relative;
          width: min(100%, 500px);
          min-height: 100dvh;
          margin: 0 auto;
          overflow: hidden;
          background:
            linear-gradient(170deg, rgba(255, 255, 255, .06), transparent 25%),
            radial-gradient(ellipse at 50% 62%, rgba(255, 243, 184, .65), transparent 29%);
        }
        .fortune-page .fortune-screen::before,
        .fortune-page .fortune-screen::after {
          position: absolute;
          z-index: 0;
          width: 145px;
          height: 290px;
          border: 2px solid rgba(255, 242, 180, .38);
          border-radius: 50%;
          content: "";
          opacity: .55;
          pointer-events: none;
        }
        .fortune-page .fortune-screen::before {
          top: 172px;
          left: -104px;
          transform: rotate(31deg);
        }
        .fortune-page .fortune-screen::after {
          top: 232px;
          right: -110px;
          transform: rotate(-31deg);
        }
        .fortune-page .fortune-header,
        .fortune-page .fortune-hero,
        .fortune-page .fortune-actions,
        .fortune-page .fortune-copy {
          position: relative;
          z-index: 1;
        }
        .fortune-page .fortune-header {
          display: flex;
          height: 84px;
          align-items: center;
          justify-content: center;
          padding: 13px 48px 0;
          color: white;
          text-align: center;
        }
        .fortune-page .fortune-back {
          position: absolute;
          top: 27px;
          left: 18px;
          display: grid;
          width: 39px;
          height: 39px;
          place-items: center;
          border: 0;
          background: transparent;
          color: white;
        }
        .fortune-page .fortune-back svg {
          width: 30px;
          height: 30px;
          stroke-width: 2.4;
        }
        .fortune-page .fortune-header-title {
          margin: 0;
          font-size: 21px;
          font-weight: 700;
          line-height: 1;
          text-shadow: 0 2px 2px rgba(120, 28, 14, .22);
        }
        .fortune-page .fortune-header-subtitle {
          margin: 13px 0 0;
          color: rgba(255, 255, 255, .96);
          font-size: 16px;
          line-height: 1;
        }
        .fortune-page .fortune-hero {
          padding: 10px 12px 0;
          text-align: center;
        }
        .fortune-page .fortune-title {
          margin: 0;
          color: white;
          font-size: clamp(34px, 9.4vw, 53px);
          font-weight: 800;
          letter-spacing: .3px;
          line-height: 1.1;
          text-shadow: 0 3px 0 rgba(123, 55, 35, .55), 0 5px 7px rgba(155, 46, 23, .25);
        }
        .fortune-page .fortune-counter {
          display: flex;
          min-height: 51px;
          align-items: center;
          justify-content: center;
          margin: 13px 14px 0;
          border: 1px solid rgba(255, 255, 255, .72);
          border-radius: 999px;
          background: linear-gradient(180deg, #fff9d9 0%, #ffe6a3 100%);
          box-shadow: 0 4px 8px rgba(180, 57, 23, .12), inset 0 2px 5px rgba(255, 255, 255, .75);
          color: #bd2c1c;
          font-size: clamp(17px, 4.2vw, 24px);
          font-weight: 700;
          line-height: 1.1;
        }
        .fortune-page .fortune-wheel-area {
          position: relative;
          height: 424px;
          margin-top: 11px;
        }
        .fortune-page .fortune-wheel-glow {
          position: absolute;
          top: 19px;
          left: 50%;
          width: 345px;
          height: 345px;
          border-radius: 50%;
          background: rgba(255, 238, 161, .58);
          filter: blur(17px);
          transform: translateX(-50%);
        }
        .fortune-page .fortune-wheel {
          position: absolute;
          top: 30px;
          left: 50%;
          width: min(78vw, 350px);
          height: min(78vw, 350px);
          border: 12px solid #ef2b16;
          border-radius: 50%;
          background:
            radial-gradient(circle at center, #fff6c9 0 19%, transparent 19.5%),
            conic-gradient(from -22.5deg, #fff2b7 0deg 45deg, #ffe8a0 45deg 90deg, #fff6c9 90deg 135deg, #ffe69b 135deg 180deg, #fff3bd 180deg 225deg, #ffe79b 225deg 270deg, #fff4bd 270deg 315deg, #ffe79b 315deg 360deg);
          box-shadow:
            0 0 0 5px #ff7660,
            0 0 0 9px #ffc46f,
            inset 0 0 0 3px rgba(217, 117, 28, .55),
            0 12px 19px rgba(157, 50, 24, .25);
          transform: translateX(-50%);
        }
        .fortune-page .fortune-wheel.is-spinning {
          animation: fortune-wheel-spin 3.4s cubic-bezier(.12, .72, .18, 1) forwards;
          will-change: transform;
        }
        @keyframes fortune-wheel-spin {
          from { transform: translateX(-50%) rotate(0deg); }
          to { transform: translateX(-50%) rotate(var(--fortune-rotation, 1800deg)); }
        }
        .fortune-page .fortune-wheel::before {
          position: absolute;
          inset: 29px;
          border: 2px solid rgba(212, 128, 31, .4);
          border-radius: 50%;
          content: "";
          pointer-events: none;
        }
        .fortune-page .fortune-wheel::after {
          position: absolute;
          inset: 8px;
          border: 2px dashed rgba(255, 250, 190, .8);
          border-radius: 50%;
          content: "";
          pointer-events: none;
        }
        .fortune-page .wheel-divider {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 2px;
          height: 91%;
          background: rgba(211, 119, 25, .38);
          transform-origin: center;
          pointer-events: none;
        }
        .fortune-page .wheel-divider.one { transform: translate(-50%, -50%) rotate(0deg); }
        .fortune-page .wheel-divider.two { transform: translate(-50%, -50%) rotate(45deg); }
        .fortune-page .wheel-divider.three { transform: translate(-50%, -50%) rotate(90deg); }
        .fortune-page .wheel-divider.four { transform: translate(-50%, -50%) rotate(135deg); }
        .fortune-page .wheel-value {
          position: absolute;
          top: 50%;
          left: 50%;
          display: flex;
          width: 48px;
          height: 48px;
          align-items: center;
          justify-content: center;
          color: #bd3a1e;
          font-size: 16px;
          font-weight: 400;
          text-shadow: 0 1px 0 rgba(255, 255, 255, .8);
          pointer-events: none;
        }
        .fortune-page .wheel-coin {
          position: absolute;
          top: 50%;
          left: 50%;
          display: grid;
          width: 37px;
          height: 37px;
          place-items: center;
          border: 3px solid #ef9c19;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 28%, #fff4a8, #ffc331 70%, #ec9012);
          color: #da8710;
          font-size: 20px;
          font-weight: 800;
          box-shadow: 0 2px 3px rgba(184, 89, 10, .25), inset 0 0 0 2px rgba(255, 247, 154, .7);
          pointer-events: none;
        }
        .fortune-page .fortune-go {
          position: absolute;
          top: 50%;
          left: 50%;
          display: grid;
          width: 78px;
          height: 78px;
          place-items: center;
          border: 7px solid #ffb0a4;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 25%, #fff1ce, #ff6d72 72%);
          box-shadow: 0 4px 7px rgba(160, 40, 21, .28), inset 0 0 0 3px rgba(255, 255, 255, .45);
          color: white;
          font-size: 21px;
          font-weight: 800;
          text-shadow: 0 2px 1px rgba(147, 48, 25, .35);
          transform: translate(-50%, -50%);
          z-index: 2;
          touch-action: manipulation;
        }
        .fortune-page .fortune-go:disabled {
          cursor: wait;
          opacity: .84;
        }
        .fortune-page .fortune-podium {
          position: absolute;
          bottom: 12px;
          left: 50%;
          width: min(78vw, 350px);
          height: 77px;
          border: 3px solid #ffe18e;
          border-radius: 50% 50% 22px 22px / 35% 35% 18px 18px;
          background: linear-gradient(180deg, #ffb74c 0%, #ed4a23 47%, #c72b19 100%);
          box-shadow: 0 8px 13px rgba(138, 44, 17, .32), inset 0 8px 0 rgba(255, 247, 178, .7);
          transform: translateX(-50%);
        }
        .fortune-page .fortune-podium::before {
          position: absolute;
          top: -18px;
          left: 5%;
          width: 90%;
          height: 38px;
          border: 3px solid #ffe49c;
          border-radius: 50%;
          background: linear-gradient(180deg, #fff0b6, #f39432);
          content: "";
        }
        .fortune-page .fortune-actions {
          display: grid;
          grid-template-columns: 76px minmax(0, 1fr) 76px;
          align-items: start;
          gap: 9px;
          padding: 0 18px;
        }
        .fortune-page .fortune-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          min-width: 0;
          border: 0;
          background: transparent;
          color: #4b2019;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.1;
          text-align: center;
        }
        .fortune-page .fortune-action-icon {
          display: grid;
          width: 54px;
          height: 54px;
          place-items: center;
          border: 4px solid #fff7da;
          border-radius: 50%;
          background: linear-gradient(145deg, #fff5bb, #ff5952);
          box-shadow: 0 2px 4px rgba(125, 42, 24, .22);
          color: #ba2722;
        }
        .fortune-page .fortune-action-icon svg {
          width: 27px;
          height: 27px;
          stroke-width: 2.6;
        }
        .fortune-page .fortune-invite {
          display: flex;
          height: 62px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 1px;
          border: 2px solid rgba(255, 255, 255, .78);
          border-radius: 999px;
          background: linear-gradient(180deg, #fff6d4 0%, #ffd689 100%);
          box-shadow: 0 3px 5px rgba(157, 61, 21, .24), inset 0 2px 5px rgba(255, 255, 255, .85);
          color: #542319;
          font-size: clamp(16px, 4.4vw, 22px);
          font-weight: 700;
          white-space: nowrap;
        }
        .fortune-page .fortune-invite svg {
          width: 21px;
          height: 21px;
        }
        .fortune-page .fortune-result {
          margin: 9px 14px 0;
          color: #a92b1d;
          font-size: 15px;
          font-weight: 700;
          text-align: center;
        }
        .fortune-page .fortune-copy {
          padding: 26px 24px 54px;
          color: #532a20;
          font-size: 15px;
          line-height: 1.55;
        }
        .fortune-page .fortune-copy p {
          margin: 0 0 22px;
        }
        .fortune-page .fortune-copy strong {
          color: #ad2017;
        }
        .fortune-page .fortune-floating-help {
          position: fixed;
          right: 13px;
          bottom: 25px;
          z-index: 4;
          display: grid;
          width: 52px;
          height: 52px;
          place-items: center;
          border: 3px solid rgba(255, 255, 255, .85);
          border-radius: 50%;
          background: linear-gradient(145deg, #91ed91, #13a959);
          color: white;
          box-shadow: 0 3px 5px rgba(0, 0, 0, .25);
        }
        .fortune-page .fortune-floating-help svg {
          width: 29px;
          height: 29px;
        }
        .fortune-page .fortune-modal {
          position: fixed;
          z-index: 50;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 28px 17px;
          background: rgba(53, 23, 18, .66);
        }
        .fortune-page .fortune-dialog {
          position: relative;
          width: min(100%, 438px);
          min-height: 395px;
          overflow: visible;
          border: 6px solid #f5d39b;
          border-radius: 26px 26px 34px 34px;
          background:
            radial-gradient(circle at 10% 15%, rgba(255, 233, 221, .8), transparent 23%),
            linear-gradient(180deg, #fff8fa 0%, #fff1f4 100%);
          box-shadow: 0 12px 26px rgba(46, 17, 10, .38);
        }
        .fortune-page .fortune-dialog::before,
        .fortune-page .fortune-dialog::after {
          position: absolute;
          top: -20px;
          width: 30px;
          height: 420px;
          border: 3px solid #dc8c45;
          border-top: 0;
          border-radius: 0 0 18px 18px;
          content: "";
          pointer-events: none;
        }
        .fortune-page .fortune-dialog::before {
          left: -18px;
          background: repeating-linear-gradient(90deg, #e89e4f 0 7px, #fff2bd 7px 14px);
        }
        .fortune-page .fortune-dialog::after {
          right: -18px;
          background: repeating-linear-gradient(90deg, #fff2bd 0 7px, #e89e4f 7px 14px);
        }
        .fortune-page .fortune-dialog-top {
          position: absolute;
          top: -22px;
          left: -7px;
          width: calc(100% + 14px);
          height: 66px;
          border: 4px solid #ffbe76;
          border-radius: 32px 32px 18px 18px;
          background: linear-gradient(180deg, #ff7451 0%, #ed281e 75%);
          box-shadow: inset 0 -8px 0 rgba(202, 35, 25, .35), 0 3px 3px rgba(137, 45, 20, .2);
        }
        .fortune-page .fortune-dialog-top::after {
          position: absolute;
          right: 10%;
          bottom: -1px;
          left: 10%;
          height: 24px;
          border-bottom: 4px solid #ffd49a;
          border-radius: 0 0 50% 50%;
          content: "";
        }
        .fortune-page .fortune-medal {
          position: absolute;
          z-index: 2;
          top: -33px;
          left: -27px;
          display: grid;
          width: 82px;
          height: 82px;
          place-items: center;
          border: 5px solid #ffe8a2;
          border-radius: 50% 50% 44% 44%;
          background: radial-gradient(circle at 35% 25%, #fff49b, #f2a31e 68%, #d36d13);
          color: #fff4aa;
          font-size: 37px;
          box-shadow: 0 4px 5px rgba(124, 50, 17, .28);
          transform: rotate(-18deg);
        }
        .fortune-page .fortune-dialog-body {
          position: relative;
          z-index: 1;
          min-height: 330px;
          padding: 79px 23px 91px;
        }
        .fortune-page .fortune-dialog-grid {
          display: grid;
          grid-template-columns: 78px 1fr 92px;
          align-items: center;
          border-bottom: 1px solid #f1dfe2;
          padding: 0 0 13px;
          color: #74372c;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.15;
        }
        .fortune-page .fortune-dialog-grid > :first-child {
          text-align: center;
        }
        .fortune-page .fortune-dialog-grid > :last-child {
          text-align: right;
        }
        .fortune-page .fortune-ranking-row {
          display: grid;
          grid-template-columns: 78px 1fr 92px;
          min-height: 51px;
          align-items: center;
          border-bottom: 1px solid #f1dfe2;
          color: #271b1a;
          font-size: 16px;
        }
        .fortune-page .fortune-ranking-row > :first-child {
          text-align: center;
        }
        .fortune-page .fortune-ranking-row > :last-child {
          text-align: right;
          font-weight: 700;
        }
        .fortune-page .fortune-medal-rank {
          display: inline-grid;
          width: 30px;
          height: 30px;
          place-items: center;
          border-radius: 50%;
          background: linear-gradient(145deg, #ffe99a, #d8941e);
          color: white;
          font-size: 14px;
          font-weight: 800;
        }
        .fortune-page .fortune-medal-rank.silver {
          background: linear-gradient(145deg, #f6f7f7, #aeb9c2);
        }
        .fortune-page .fortune-medal-rank.bronze {
          background: linear-gradient(145deg, #ffd0a0, #b96742);
        }
        .fortune-page .fortune-empty {
          min-height: 220px;
        }
        .fortune-page .fortune-records {
          min-height: 220px;
        }
        .fortune-page .fortune-record-row {
          display: grid;
          grid-template-columns: 1fr auto;
          min-height: 54px;
          align-items: center;
          border-bottom: 1px solid #f1dfe2;
          color: #271b1a;
          font-size: 15px;
        }
        .fortune-page .fortune-record-date {
          color: #8e6b65;
          font-size: 13px;
        }
        .fortune-page .fortune-record-amount {
          color: #b52b1d;
          font-weight: 800;
          text-align: right;
        }
        .fortune-page .fortune-empty-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid #f1dfe2;
          padding-bottom: 13px;
          color: #74372c;
          font-size: 16px;
          font-weight: 700;
        }
        .fortune-page .fortune-empty-header span:last-child {
          text-align: right;
        }
        .fortune-page .fortune-dialog-close {
          position: absolute;
          z-index: 3;
          bottom: 20px;
          left: 50%;
          width: 61%;
          height: 59px;
          border: 3px solid #ffe5b0;
          border-radius: 999px;
          background: linear-gradient(180deg, #fff9de 0%, #ffd88c 100%);
          box-shadow: 0 4px 5px rgba(167, 66, 27, .2), inset 0 2px 4px white;
          color: #51271e;
          font-size: 21px;
          font-weight: 700;
          transform: translateX(-50%);
        }
        .fortune-page .fortune-result-overlay {
          position: fixed;
          z-index: 70;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(76, 25, 17, .72);
        }
        .fortune-page .fortune-result-card {
          width: min(100%, 360px);
          padding: 34px 24px 24px;
          border: 5px solid #ffd889;
          border-radius: 30px;
          background: linear-gradient(180deg, #fffdf0 0%, #fff0bd 100%);
          box-shadow: 0 16px 34px rgba(55, 20, 9, .42);
          color: #5a241a;
          text-align: center;
          animation: fortune-result-pop .28s ease-out;
        }
        .fortune-page .fortune-result-card.is-loss {
          border-color: #ffb39f;
          background: linear-gradient(180deg, #fff9f5 0%, #ffe1d8 100%);
        }
        @keyframes fortune-result-pop {
          from { opacity: 0; transform: scale(.82) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .fortune-page .fortune-result-badge {
          display: grid;
          width: 76px;
          height: 76px;
          place-items: center;
          margin: -67px auto 13px;
          border: 6px solid #fff3be;
          border-radius: 50%;
          background: linear-gradient(145deg, #ffc943, #e87816);
          color: white;
          font-size: 48px;
          font-weight: 900;
          line-height: 1;
          box-shadow: 0 6px 12px rgba(159, 75, 17, .3);
        }
        .fortune-page .fortune-result-card.is-loss .fortune-result-badge {
          border-color: #ffe4dc;
          background: linear-gradient(145deg, #ff9b83, #d94332);
        }
        .fortune-page .fortune-result-card h2 {
          margin: 0;
          font-size: 27px;
          font-weight: 900;
        }
        .fortune-page .fortune-result-amount {
          margin: 14px 0 4px;
          color: #c22e1d;
          font-size: 32px;
          font-weight: 900;
        }
        .fortune-page .fortune-result-message {
          margin: 12px 0 22px;
          color: #7a4a3e;
          font-size: 15px;
          line-height: 1.45;
        }
        .fortune-page .fortune-result-close {
          width: 78%;
          height: 52px;
          border: 2px solid #ffe2a0;
          border-radius: 999px;
          background: linear-gradient(180deg, #ff7654 0%, #dc2e20 100%);
          color: white;
          font-size: 18px;
          font-weight: 800;
          box-shadow: 0 4px 8px rgba(151, 47, 25, .28);
        }
        @media (max-width: 370px) {
          .fortune-page .fortune-header {
            height: 75px;
          }
          .fortune-page .fortune-header-title {
            font-size: 19px;
          }
          .fortune-page .fortune-header-subtitle {
            font-size: 14px;
          }
          .fortune-page .fortune-wheel-area {
            height: 368px;
          }
          .fortune-page .fortune-wheel {
            top: 16px;
          }
          .fortune-page .fortune-podium {
            bottom: 0;
          }
          .fortune-page .fortune-actions {
            grid-template-columns: 68px minmax(0, 1fr) 68px;
            gap: 5px;
            padding: 0 10px;
          }
          .fortune-page .fortune-action {
            font-size: 12px;
          }
          .fortune-page .fortune-invite {
            height: 54px;
            font-size: 15px;
          }
          .fortune-page .fortune-dialog-body {
            padding-right: 13px;
            padding-left: 13px;
          }
          .fortune-page .fortune-dialog-grid,
          .fortune-page .fortune-ranking-row {
            grid-template-columns: 61px 1fr 75px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="fortune-screen">
        <header className="fortune-header">
          <button type="button" className="fortune-back" onClick={() => navigate("/")} aria-label="Retour à l'accueil">
            <ArrowLeft aria-hidden="true" />
          </button>
          <div>
            <h1 className="fortune-header-title">tirage chanceux</h1>
            <p className="fortune-header-subtitle">Inviter un ami à s'inscrire à</p>
          </div>
        </header>

        <section className="fortune-hero" aria-labelledby="fortune-title">
          <h2 id="fortune-title" className="fortune-title">Sortie chanceuse</h2>
          <div className="fortune-counter">
            {loadingFortuneStatus
              ? "Chargement des tours..."
              : fortuneStatusError
                ? "Impossible de charger les tours"
                : `Nombre de tours restants : ${remainingSpins}`}
          </div>
          {lastReward !== null ? (
            <p className="fortune-result" role="status">
              Dernier gain : {lastReward.toLocaleString("fr-FR")} FCFA
            </p>
          ) : null}

          <div className="fortune-wheel-area" aria-label="Roue de la fortune">
            <div className="fortune-wheel-glow" aria-hidden="true" />
            <div
              className={`fortune-wheel ${isSpinning ? "is-spinning" : ""}`}
              style={{ "--fortune-rotation": `${wheelRotation}deg` } as CSSProperties}
            >
              <span className="wheel-divider one" aria-hidden="true" />
              <span className="wheel-divider two" aria-hidden="true" />
              <span className="wheel-divider three" aria-hidden="true" />
              <span className="wheel-divider four" aria-hidden="true" />
              {wheelValues.map((value, index) => {
                const angle = index * 45;
                return (
                  <span
                    className="wheel-value"
                    key={value}
                    style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-112px) rotate(${-angle}deg)` }}
                  >
                    {value}
                  </span>
                );
              })}
              {wheelValues.map((value, index) => {
                const angle = index * 45 + 22.5;
                return (
                  <span
                    className="wheel-coin"
                    key={`coin-${value}`}
                    aria-hidden="true"
                    style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-83px)` }}
                  >
                    ¥
                  </span>
                );
              })}
              <button
                type="button"
                className="fortune-go"
                onClick={handleSpin}
                disabled={isSpinning || spinMutation.isPending}
                aria-label="Lancer le tirage"
                data-testid="button-fortune-go"
              >
                {spinMutation.isPending ? <Loader2 className="fortune-go-loader animate-spin" aria-hidden="true" /> : "GO"}
              </button>
            </div>
            <div className="fortune-podium" aria-hidden="true" />
          </div>
        </section>

        <section className="fortune-actions" aria-label="Actions de la route de la fortune">
          <button type="button" className="fortune-action" onClick={() => setModal("ranking")}>
            <span className="fortune-action-icon"><BarChart3 aria-hidden="true" /></span>
            <span>Classement</span>
          </button>
          <button type="button" className="fortune-invite" onClick={() => navigate("/team")}>
            <Share2 aria-hidden="true" />
            Inviter des amis
          </button>
          <button type="button" className="fortune-action" onClick={() => setModal("records")}>
            <span className="fortune-action-icon"><FileText aria-hidden="true" /></span>
            <span>Enregistrements</span>
          </button>
        </section>

        <section className="fortune-copy" aria-label="Programme de parrainage">
          <p>
            Notre programme de parrainage est désormais disponible !
          </p>
          <p>
            Pour jouer à la roue, vous devez acheter un produit d&apos;investissement stable et payant.
            Cet achat vous donne un tour de roulette gratuit avec 100 % de chance de gagner.
            Vous pourrez retirer jusqu&apos;à <strong>5 000 francs CFA</strong> immédiatement.
          </p>
          <p>
            Si un utilisateur inscrit via votre lien effectue un dépôt approuvé et achète
            un produit d&apos;investissement stable et payant, vous recevez un tour de roulette gratuit
            supplémentaire.
          </p>
          <p>
            De plus, vous recevez 25 % de leur investissement en commission. Par exemple,
            s&apos;ils investissent <strong>100 000 francs CFA</strong>, vous recevez
            <strong>25 000 francs CFA</strong> de commission. Les commissions sont
            retirables instantanément.
          </p>
          <p>
            Les montants affichés sur la roue restent inchangés, mais le gain réellement
            crédité par tirage ne peut jamais dépasser <strong>500 francs CFA</strong>.
          </p>
        </section>

        <button type="button" className="fortune-floating-help" aria-label="Aide">
          <HelpCircle aria-hidden="true" />
        </button>
      </div>

      {modal ? (
        <div
          className="fortune-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fortune-modal-title"
          onClick={() => setModal(null)}
        >
          <div className="fortune-dialog" onClick={(event) => event.stopPropagation()}>
            <div className="fortune-dialog-top" aria-hidden="true" />
            <div className="fortune-medal" aria-hidden="true"><Gift /></div>
            <div className="fortune-dialog-body">
              <h2 id="fortune-modal-title" className="sr-only">
                {modal === "ranking" ? "Classement" : "Enregistrements"}
              </h2>
              {modal === "ranking" ? (
                <>
                  <div className="fortune-dialog-grid">
                    <span>Classement</span>
                    <span>Numéro de téléphone</span>
                    <span>Tirer un bonus</span>
                  </div>
                  {rankingRows.map((row, index) => (
                    <div className="fortune-ranking-row" key={row.phone}>
                      <span>
                        {index < 3 ? (
                          <span className={`fortune-medal-rank ${index === 1 ? "silver" : index === 2 ? "bronze" : ""}`}>
                            {row.rank}
                          </span>
                        ) : row.rank}
                      </span>
                      <span>{row.phone}</span>
                      <span>{row.bonus}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="fortune-records">
                  <div className="fortune-empty-header">
                    <span>Temps</span>
                    <span>Tirer un bonus</span>
                  </div>
                  {loadingFortuneRecords ? (
                    <div className="flex min-h-[180px] items-center justify-center">
                      <Loader2 className="h-7 w-7 animate-spin text-[#bd3a1e]" aria-label="Chargement" />
                    </div>
                  ) : fortuneRecords.length > 0 ? (
                    fortuneRecords.map((record) => (
                      <div className="fortune-record-row" key={record.id}>
                        <span className="fortune-record-date">
                          {record.usedAt
                            ? new Date(record.usedAt).toLocaleString("fr-FR", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })
                            : "—"}
                        </span>
                        <span className="fortune-record-amount">
                          {record.reward === null
                            ? "—"
                            : `${record.reward.toLocaleString("fr-FR")} FCFA`}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex min-h-[180px] items-center justify-center px-4 text-center text-sm text-[#8e6b65]">
                      Aucun gain reçu pour le moment.
                    </div>
                  )}
                </div>
              )}
            </div>
            <button type="button" className="fortune-dialog-close" onClick={() => setModal(null)}>
              Fermer
            </button>
          </div>
        </div>
      ) : null}

      {fortuneOutcome ? (
        <div
          className="fortune-result-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fortune-result-title"
          onClick={() => setFortuneOutcome(null)}
        >
          <div
            className={`fortune-result-card ${fortuneOutcome.won ? "is-win" : "is-loss"}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="fortune-result-badge" aria-hidden="true">
              {fortuneOutcome.won ? "✓" : "×"}
            </div>
            <h2 id="fortune-result-title">
              {fortuneOutcome.won ? "Vous avez gagné !" : "Dommage, vous avez perdu"}
            </h2>
            {fortuneOutcome.won && fortuneOutcome.reward !== null ? (
              <p className="fortune-result-amount">
                {fortuneOutcome.reward.toLocaleString("fr-FR")} FCFA
              </p>
            ) : null}
            <p className="fortune-result-message">{fortuneOutcome.message}</p>
            <button
              type="button"
              className="fortune-result-close"
              onClick={() => setFortuneOutcome(null)}
            >
              Continuer
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}