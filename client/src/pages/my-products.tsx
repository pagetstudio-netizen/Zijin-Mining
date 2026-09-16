import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { getCountryByCode } from "@/lib/countries";
import { Loader2 } from "lucide-react";
import type { Product } from "@shared/schema";

import emptyIllustration from "@assets/illustration-8_1784762965573.png";
import productsReference from "@assets/images_(96)_1789547089397.jpeg";
import productImage1 from "@assets/images_(96)_1789547089397.jpeg";
import productImage2 from "@assets/images_(95)_1789547089720.jpeg";
import productImage3 from "@assets/images_(94)_1789547089754.jpeg";
import productImage4 from "@assets/images_(93)_1789547089817.jpeg";
import productImage5 from "@assets/images_(92)_1789547089791.jpeg";
import productImage6 from "@assets/images_(91)_1789547089864.jpeg";
import productImage7 from "@assets/images_(90)_1789547089842.jpeg";
import productImage8 from "@assets/images_(89)_1789547089908.jpeg";

const PRODUCT_IMAGES = [
  productImage1,
  productImage2,
  productImage3,
  productImage4,
  productImage5,
  productImage6,
  productImage7,
  productImage8,
];

interface ProductWithOwnership extends Product {
  isOwned: boolean;
  canClaimFree: boolean;
  ownedCount?: number;
}

type ProductCategory = "stable" | "activity";

export default function MyProductsPage() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("stable");
  const [confirmProduct, setConfirmProduct] = useState<ProductWithOwnership | null>(null);

  const { data: products, isLoading: loadingProducts } = useQuery<ProductWithOwnership[]>({
    queryKey: ["/api/products"],
    staleTime: 0,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiRequest("POST", `/api/products/${productId}/purchase`, {});
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/products"] });
      refreshUser();
      setConfirmProduct(null);
      toast({ title: "Produit acheté !", description: "Vous commencerez à recevoir des gains demain." });
    },
    onError: (error: Error) => {
      setConfirmProduct(null);
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  if (!user) return null;

  const country = getCountryByCode(user.country);
  const currency = country?.currency === "FCFA" ? "XOF" : country?.currency || "XOF";
  const stableProducts = products?.filter((product) => !product.isFree) || [];

  return (
    <main className="products-reference">
      <style>{`
        .products-reference {
          min-height: 100dvh;
          padding-bottom: 60px;
          overflow-x: hidden;
          background: #f3f3f3;
          color: #292929;
          font-family: Arial, Helvetica, sans-serif;
        }
        .products-reference *,
        .products-reference *::before,
        .products-reference *::after {
          box-sizing: border-box;
        }
        .products-reference .products-screen {
          width: 100%;
          max-width: 500px;
          min-height: 100dvh;
          margin: 0 auto;
        }
        .products-reference .products-hero {
          position: relative;
          height: clamp(190px, 44vw, 220px);
          overflow: hidden;
          background: #b68100;
        }
        .products-reference .products-hero::after {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(31, 27, 5, .02), rgba(31, 27, 5, .2));
          content: "";
          pointer-events: none;
        }
        .products-reference .products-hero img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          pointer-events: none;
        }
        .products-reference .category-tabs {
          position: absolute;
          z-index: 2;
          right: 13px;
          bottom: -25px;
          left: 13px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .products-reference .category-tab {
          height: 55px;
          border: 0;
          border-radius: 17px;
          background: #fff;
          color: #999;
          font-size: clamp(16px, 4.4vw, 21px);
          font-weight: 400;
          box-shadow: 0 1px 2px rgba(0, 0, 0, .04);
        }
        .products-reference .category-tab.active {
          background: linear-gradient(110deg, #0c61b9 0%, #03478d 100%);
          color: white;
          font-weight: 700;
          box-shadow: 0 3px 5px rgba(0, 54, 119, .25);
        }
        .products-reference .product-list {
          min-height: calc(100dvh - 190px);
          padding: 57px 20px 25px;
        }
        .products-reference .product-card {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 136px;
          grid-template-rows: auto auto;
          column-gap: 14px;
          min-height: 0;
          margin-bottom: 25px;
          padding: 20px 19px 19px 20px;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, .035);
        }
        .products-reference .vip-mark {
          position: absolute;
          z-index: 2;
          top: 0;
          right: 0;
          color: #d49a08;
          font-size: 27px;
          font-weight: 800;
          line-height: 1;
          text-shadow: 0 1px 0 rgba(255, 255, 255, .7);
        }
        .products-reference .product-picture {
          grid-column: 2;
          grid-row: 1;
          align-self: start;
          width: 136px;
          height: 136px;
          overflow: hidden;
          border-radius: 10px;
          background: #eee;
        }
        .products-reference .product-picture img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .products-reference .product-details {
          grid-column: 1;
          grid-row: 1;
          min-width: 0;
          min-height: 136px;
          padding: 10px 0 0;
        }
        .products-reference .product-name {
          margin: 0 0 17px;
          color: #303030;
          font-size: clamp(18px, 4.8vw, 23px);
          font-weight: 700;
          line-height: 1.15;
          overflow-wrap: anywhere;
        }
        .products-reference .product-line {
          display: flex;
          min-width: 0;
          align-items: baseline;
          gap: 8px;
          margin: 0 0 11px;
          color: #333;
          font-size: clamp(14px, 3.7vw, 17px);
          line-height: 1.1;
          overflow-wrap: anywhere;
        }
        .products-reference .product-line strong {
          min-width: 0;
          color: #175488;
          font-weight: 400;
          overflow-wrap: anywhere;
        }
        .products-reference .purchase-row {
          grid-column: 1 / -1;
          grid-row: 2;
          display: flex;
          width: 100%;
          height: 66px;
          min-width: 0;
          align-items: center;
          justify-content: space-between;
          margin-top: 18px;
          border: 2px solid #303030;
          border-radius: 9px;
          padding-left: 9px;
          overflow: hidden;
        }
        .products-reference .product-price {
          min-width: 0;
          color: #14548e;
          font-size: clamp(18px, 5vw, 24px);
          font-weight: 700;
          letter-spacing: -.3px;
          overflow-wrap: anywhere;
          white-space: nowrap;
        }
        .products-reference .buy-button {
          display: flex;
          flex: 0 0 153px;
          height: 100%;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 9px;
          background: linear-gradient(105deg, #e02b29 0%, #b82b38 45%, #1a478d 100%);
          color: white;
          font-size: clamp(19px, 5vw, 25px);
          font-weight: 700;
          line-height: 1;
        }
        .products-reference .activity-empty {
          display: flex;
          min-height: 310px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #fff;
          color: #777;
          text-align: center;
        }
        .products-reference .activity-empty img {
          width: 125px;
          height: 125px;
          object-fit: contain;
          opacity: .75;
        }
        .products-reference .activity-empty p {
          margin: 10px 22px 0;
          font-size: 15px;
        }
        .products-reference .products-loading {
          display: grid;
          min-height: 300px;
          place-items: center;
        }
        .products-reference .purchase-modal {
          position: fixed;
          z-index: 60;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, .55);
        }
        .products-reference .purchase-dialog {
          width: min(100%, 340px);
          overflow: hidden;
          border-radius: 18px;
          background: white;
          box-shadow: 0 12px 30px rgba(0, 0, 0, .25);
        }
        .products-reference .purchase-dialog-copy {
          padding: 24px 22px 20px;
          text-align: center;
        }
        .products-reference .purchase-dialog-copy p {
          margin: 0;
        }
        .products-reference .purchase-dialog-title {
          margin-bottom: 9px !important;
          color: #242424;
          font-size: 18px;
          font-weight: 700;
        }
        .products-reference .purchase-dialog-name {
          color: #777;
          font-size: 14px;
        }
        .products-reference .purchase-dialog-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-top: 1px solid #eee;
        }
        .products-reference .purchase-dialog-actions button {
          height: 54px;
          border: 0;
          font-size: 16px;
          font-weight: 700;
        }
        .products-reference .purchase-dialog-actions button:first-child {
          border-right: 1px solid #eee;
          background: white;
          color: #777;
        }
        .products-reference .purchase-dialog-actions button:last-child {
          background: #d9a600;
          color: white;
        }
        @media (max-width: 360px) {
          .products-reference .products-hero {
            height: 178px;
          }
          .products-reference .category-tabs {
            right: 11px;
            bottom: -23px;
            left: 11px;
            gap: 6px;
          }
          .products-reference .category-tab {
            height: 50px;
            font-size: 15px;
          }
          .products-reference .product-list {
            padding-right: 14px;
            padding-left: 14px;
          }
          .products-reference .product-card {
            grid-template-columns: minmax(0, 1fr) 116px;
            column-gap: 10px;
            padding: 16px 14px 14px 15px;
          }
          .products-reference .product-picture {
            width: 116px;
            height: 116px;
          }
          .products-reference .product-details {
            min-height: 116px;
            padding-top: 8px;
          }
          .products-reference .product-line {
            font-size: 12px;
            gap: 5px;
          }
          .products-reference .purchase-row {
            height: 56px;
            margin-top: 14px;
          }
          .products-reference .buy-button {
            flex-basis: 125px;
            font-size: 18px;
          }
        }
      `}</style>

      <div className="products-screen">
        <section className="products-hero" aria-label="Produits Zijin Mining">
          <img src={productsReference} alt="Zijin Mining" />
          <div className="category-tabs" role="tablist" aria-label="Catégories de produits">
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === "stable"}
              className={`category-tab ${activeCategory === "stable" ? "active" : ""}`}
              onClick={() => setActiveCategory("stable")}
            >
              Stabilisé
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === "activity"}
              className={`category-tab ${activeCategory === "activity" ? "active" : ""}`}
              onClick={() => setActiveCategory("activity")}
            >
              Activités
            </button>
          </div>
        </section>

        <section className="product-list" aria-label={activeCategory === "stable" ? "Produits stabilisés" : "Produits d'activité"}>
          {activeCategory === "activity" ? (
            <div className="activity-empty">
              <img src={emptyIllustration} alt="" />
              <p>Les produits d&apos;activité seront bientôt disponibles.</p>
            </div>
          ) : loadingProducts ? (
            <div className="products-loading">
              <Loader2 className="h-8 w-8 animate-spin text-[#175488]" />
            </div>
          ) : stableProducts.length === 0 ? (
            <div className="activity-empty">
              <img src={emptyIllustration} alt="Aucun produit disponible" />
              <p>Aucun produit stabilisé disponible.</p>
            </div>
          ) : (
            stableProducts.map((product, index) => {
              const daily = Number(product.dailyEarnings || 0);
              const total = Number(product.totalReturn || 0);
              const price = Number(product.price || 0);
              const image = PRODUCT_IMAGES[index % PRODUCT_IMAGES.length];

              return (
                <article className="product-card" key={product.id} data-testid={`product-card-${product.id}`}>
                  <span className="vip-mark">VIP.{index + 1}</span>
                  <div className="product-picture">
                    <img src={image} alt="" />
                  </div>
                  <div className="product-details">
                    <h2 className="product-name">Récompenses VIP {index + 1}</h2>
                    <p className="product-line">Revenu quotidien :<strong>{currency}{daily.toLocaleString("fr-FR")}</strong></p>
                    <p className="product-line">Jours de revenu :<strong>{product.cycleDays} Jours</strong></p>
                    <p className="product-line">Revenu total :<strong>{currency}{total.toLocaleString("fr-FR")}</strong></p>
                  </div>
                  <div className="purchase-row">
                    <span className="product-price">{currency}{price.toFixed(2)}</span>
                    <button type="button" className="buy-button" onClick={() => setConfirmProduct(product)} data-testid={`button-purchase-${product.id}`}>
                      Acheter
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>

      {confirmProduct ? (
        <div className="purchase-modal" onClick={() => setConfirmProduct(null)}>
          <div className="purchase-dialog" onClick={(event) => event.stopPropagation()}>
            <div className="purchase-dialog-copy">
              <p className="purchase-dialog-title">Êtes-vous sûr de vouloir acheter ce produit ?</p>
              <p className="purchase-dialog-name">{confirmProduct.name}</p>
            </div>
            <div className="purchase-dialog-actions">
              <button type="button" onClick={() => setConfirmProduct(null)} data-testid="button-cancel-purchase">Non</button>
              <button
                type="button"
                onClick={() => purchaseMutation.mutate(confirmProduct.id)}
                disabled={purchaseMutation.isPending}
                data-testid="button-confirm-purchase"
              >
                {purchaseMutation.isPending ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Oui"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}