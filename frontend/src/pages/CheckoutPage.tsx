import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../lib/api";
import "../css/CheckoutPage.css";

type Subscription = {
  id: number;
  name: string;
  price: number | null;
};

function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const subscriptionId = Number(searchParams.get("subscription_id"));

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  // kortuppgifterna sparas aldrig de finns bara för att steget ska kännas riktigt
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await api.get("/api/subscriptions");
        const found = res.data.subscriptions.find(
          (item: Subscription) => item.id === subscriptionId
        );

        if (!found) {
          setError("Could not find that plan");
          return;
        }

        setSubscription(found);
      } catch (err) {
        console.log(err);
        setError("Could not load the plan");
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [subscriptionId]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPaying(true);
    setError("");

    try {
      // bara paketets id skickas, priset bestämmer servern
      await api.post("/api/checkout", { subscription_id: subscriptionId });
      navigate("/receipts");
    } catch (err) {
      console.log(err);
      setError("Could not complete the payment");
      setPaying(false);
    }
  }

  if (loading) {
    return <p className="checkout-message">Loading plan...</p>;
  }

  if (!subscription) {
    return <p className="checkout-message">{error}</p>;
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-summary">
        <span className="checkout-plan">{subscription.name}</span>
        <span className="checkout-price">{subscription.price} kr</span>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <label htmlFor="card-name">Name on card</label>
        <input
          id="card-name"
          value={cardName}
          onChange={(event) => setCardName(event.target.value)}
          placeholder="Anna Andersson"
          required
        />

        <label htmlFor="card-number">Card number</label>
        <input
          id="card-number"
          value={cardNumber}
          onChange={(event) => setCardNumber(event.target.value)}
          placeholder="4242 4242 4242 4242"
          required
        />

        <div className="checkout-row">
          <div>
            <label htmlFor="expiry">Expires</label>
            <input
              id="expiry"
              value={expiry}
              onChange={(event) => setExpiry(event.target.value)}
              placeholder="12/29"
              required
            />
          </div>

          <div>
            <label htmlFor="cvc">CVC</label>
            <input
              id="cvc"
              value={cvc}
              onChange={(event) => setCvc(event.target.value)}
              placeholder="123"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={paying}>
          {paying ? "Paying..." : `Pay ${subscription.price} kr`}
        </button>

        {error && <p className="checkout-error">{error}</p>}
      </form>

      <p className="checkout-note">
        This is a demo payment step. No card details are stored.
      </p>
    </div>
  );
}

export default CheckoutPage;