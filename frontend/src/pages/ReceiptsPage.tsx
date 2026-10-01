import { useEffect, useState } from "react";
import api from "../lib/api";
import "../css/ReceiptsPage.css";

type Receipt = {
  id: number;
  amount: string;
  payment_date: string;
  subscription_name: string;
};

function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReceipts() {
      try {
        const res = await api.get("/api/receipts");
        setReceipts(res.data.receipts);
      } catch (err) {
        console.log(err);
        setError("Could not load your receipts");
      } finally {
        setLoading(false);
      }
    }

    fetchReceipts();
  }, []);

  // gör om tidsstämpeln från databasen till ett läsbart datum
  function formatDate(value: string) {
    return new Date(value).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (loading) {
    return <p className="receipts-message">Loading receipts...</p>;
  }

  if (error) {
    return <p className="receipts-message">{error}</p>;
  }

  return (
    <div className="main-bg-faded">
      <div className="receipts-page">
        <div className="page-header">
          <h1>Your receipts</h1>
          <p>See all your receipts here</p>
        </div>

        {receipts.length === 0 ? (
          <p className="receipts-message">You have no receipts yet</p>
        ) : (
          <ul className="receipts-list">
            {receipts.map((receipt) => (
              <li className="receipt-item" key={receipt.id}>
                <div>
                  <span className="receipt-plan">
                    {receipt.subscription_name}
                  </span>
                  <span className="receipt-date">
                    {formatDate(receipt.payment_date)}
                  </span>
                </div>
                <span className="receipt-amount">{receipt.amount} kr</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ReceiptsPage;
