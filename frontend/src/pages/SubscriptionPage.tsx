import { useState, useEffect } from "react";
import api from "../lib/api";
import "../css/ProfilePage.css";
import "../css/SubscriptionPage.css";
import { useNavigate } from "react-router-dom";

type Subscription = {
  id: number;
  name: string;
  playlist_limit: number | null;
  early_access: number | null;
  price: number | null;
};

function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const res = await api.get("/api/subscriptions");
        setSubscriptions(res.data.subscriptions);
      } catch (err) {
        console.log(err);
        setError("Error fetching subscriptions");
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptions();
  }, []);

  function handleSelect(id: number) {
    navigate(`/checkout?subscription_id=${id}`);
  }

  if (loading) {
    return <p className="profile-loading">Loading profile...</p>;
  }

  if (error) {
    return <p className="profile-error">{error}</p>;
  }

  return (
    <div className="profile-wrapper">
      <h1>Choose your plan</h1>

      <div className="subscriptions-grid">
        {subscriptions.map((subscription) => (
          <div
            className="profile-card subscription-plan-card"
            key={subscription.id}
          >
            <span className="profile-label">{subscription.name}</span>
            <h2 className="subscription-color-text">
              {subscription.price} kr / month
            </h2>

            <div className="subscription-items">
              <p>
                Playlist limit: {subscription.playlist_limit ?? "Unlimited"}
              </p>
              <p>Early access: {subscription.early_access ? "Yes" : "No"}</p>
            </div>

            <button
              className="change-subscription-button"
              onClick={() => handleSelect(subscription.id)}
            >
              Select plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubscriptionPage;
