import React from "react";

const TxTable = ({ txs }) => {
  if (!txs.length) return null;

  return (
    <table border="1" cellPadding="10" style={{ marginTop: "1rem" }}>
      <thead>
        <tr>
          <th>Tx Signature</th>
          <th>Date</th>
          <th>Fee (SOL)</th>
        </tr>
      </thead>
      <tbody>
        {txs.map((tx) => (
          <tr key={tx.sig}>
            <td>
              <a
                href={`https://solscan.io/tx/${tx.sig}`}
                target="_blank"
                
              >
                {tx.sig}
              </a>
            </td>
            <td>{tx.date}</td>
            <td>{(tx.fee / 1e9).toFixed(6)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TxTable;
