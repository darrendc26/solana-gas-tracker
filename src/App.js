import React, { useState } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import TxTable from "./components/txTable";

const connection = new Connection(process.env.REACT_APP_SOLANA_RPC_URL, "confirmed");

function App() {
  const [wallet, setWallet] = useState("");
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const pubkey = new PublicKey(wallet);
      const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 10 });
      console.log("Fetched signatures:", signatures);
      console.log(pubkey.toBase58());
      const detailedTxs = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await connection.getParsedTransaction(sig.signature);
          console.log("Fetched transaction:", tx);
          return {
            sig: sig.signature,
            fee: tx?.meta?.fee || 0,
            date: sig.blockTime ? new Date(sig.blockTime * 1000).toLocaleString() : "Unknown",
          };
        })
      );

      setTxs(detailedTxs);

      const fees = detailedTxs.map((tx) => tx.fee / LAMPORTS_PER_SOL);
      const total = fees.reduce((a, b) => a + b, 0);
      const max = Math.max(...fees);
      const min = Math.min(...fees);

      setStats({ total, max, min });
    } catch (err) {
      alert("Invalid wallet or network error.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Solana Gas Tracker</h1>
      <input
        placeholder="Enter Solana wallet address"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        style={{ width: "400px", padding: "0.5rem", marginRight: "1rem" }}
      />
      <button onClick={fetchFees} disabled={loading}>
        {loading ? "Loading..." : "Fetch Fees"}
      </button>

      {stats && (
        <div style={{ marginTop: "1rem" }}>
          <p> Total Fees: {stats.total.toFixed(6)} SOL</p>
          <p> Max Fee: {stats.max.toFixed(6)} SOL</p>
          <p> Min Fee: {stats.min.toFixed(6)} SOL</p>
        </div>
      )}

      <TxTable txs={txs} />
    </div>
  );
}

export default App;
