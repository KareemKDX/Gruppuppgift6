import { useState, useEffect } from "react";
import api from "../lib/api";
import "../css/ProfilePage.css";
import { Link } from "react-router-dom";
import { type UserProfile } from "../types/UserProfile";

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get<{ user: UserProfile }>("/api/profile");
        setProfile(res.data.user);
        console.log(res.data.user);
      } catch (err) {
        console.log(err);
        setError("Error fetching profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return <p className="profile-loading">Loading profile...</p>;
  }

  if (error || !profile) {
    return <p className="profile-error">{error || "Error"}</p>;
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My profile</h1>
        <p>Manage your account, subscription, and membership details.</p>
      </div>
      <div className="profile-outer-container">
        <div className="profile-container">
          <div className="profile-left-content">
            <div className="subscription-box-content">
              <div>
                <span className="profile-label">Current subscription plan</span>
                <br></br>
                <h2 className="subscription-color-text">
                  {profile.subscription_name ?? "None"}
                </h2>
                <p>Montly cost: {profile.price} kr</p>
                <div className="subscription-items">
                  <h4>Included in my plan:</h4>
                  <p>My playlist limit: {profile.playlist_limit}</p>
                  <p>Early access: {profile.early_access ? "Yes" : "No"}</p>
                </div>
              </div>
              <Link to="/subscription" className="change-subscription-button">
                Change Plan ›
              </Link>
            </div>
          </div>

          <div className="profile-right-content no-pointer">
            <div className="profile-card">
              <span className="profile-label">Username: </span>
              <span>{profile.username}</span>
            </div>

            <div className="profile-card">
              <span className="profile-label">Email: </span>
              <span>{profile.email}</span>
            </div>

            <div className="profile-card">
              <span className="profile-label">Member since: </span>
              <span>{new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <Link to="/receipts" className="profile-card profile-items">
          Order history ›
        </Link>
      </div>
    </div>
  );
}

export default ProfilePage;
