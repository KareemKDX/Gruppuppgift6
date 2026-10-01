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
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [subsRes, profileRes] = await Promise.all([
          api.get("/api/subscriptions"),
          api.get("/api/profile"),
        ]);
        setSubscriptions(subsRes.data.subscriptions);
        setCurrentSubscriptionId(profileRes.data.user.subscription_id);
      } catch (err) {
        console.log(err);
        setError("Error fetching subscriptions");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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
    <div className="main-bg-faded">
      <div className="profile-page">
        <div className="page-header">
          <h1>Choose your plan</h1>
          <p>Upgrade anytime to unlock early access and more playlists.</p>
        </div>

        <div className="subscriptions-grid">
          {subscriptions.map((subscription) => {
            const isCurrent = subscription.id === currentSubscriptionId;

            return (
              <div
                className={
                  !isCurrent
                    ? "subscription-plan-card"
                    : "subscription-plan-card-current"
                }
                key={subscription.id}
              >
                {isCurrent && <h4 className="current-text">Current plan</h4>}
                <span className="subscription-label">{subscription.name}</span>

                {subscription.name === "Basic" ? (
                  <h3 className="subscription-color-text">Free</h3>
                ) : (
                  <h3 className="subscription-color-text">
                    {subscription.price} kr / month
                  </h3>
                )}

                <div className="subscription-items">
                  <p>
                    Playlist limit: {subscription.playlist_limit ?? "Unlimited"}
                  </p>
                  <p>
                    Early access: {subscription.early_access ? "Yes" : "No"}
                  </p>
                </div>

                {!isCurrent && (
                  <button
                    className="change-subscription-button"
                    onClick={() => handleSelect(subscription.id)}
                  >
                    SELECT PLAN
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
