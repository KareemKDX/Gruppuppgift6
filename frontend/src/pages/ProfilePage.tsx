import { useState, useEffect } from "react";
import api from "../lib/api";
import "../css/ProfilePage.css";
import { Link } from "react-router-dom";

type Profile = {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  subscription_id: number | null;
  playlist_limit: number | null;
  early_access: number | null;
  subscription_name: string | null;
  price: number | null;
};

function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get("/api/profile");
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
    <div className="profile-wrapper">
      <h1>My Profile</h1>

      <div className="profile-container">
        <div className="profile-card subscription-box">
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

        <div className="profile-right-content">
          <div className="profile-card subscription-box">
            <span className="profile-label">Username: </span>
            <span>{profile.username}</span>
          </div>

          <div className="profile-card subscription-box">
            <span className="profile-label">Email: </span>
            <span>{profile.email}</span>
          </div>

          <div className="profile-card subscription-box">
            <span className="profile-label">Member since: </span>
            <span>{new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
