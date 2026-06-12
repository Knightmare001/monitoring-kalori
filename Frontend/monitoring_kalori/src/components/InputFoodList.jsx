import React, { useState } from "react";
import { InputFood } from "./InputFood";

export function InputFoodList() {
  // Kita mulai dengan satu input (id: 1)
  const [inputs, setInputs] = useState([1]);

  const tambahInput = () => {
    // Membuat ID unik menggunakan timestamp agar tidak bentrok saat dihapus
    setInputs([...inputs, Date.now()]);
  };

  const hapusInput = (idHapus) => {
    // Sisakan hanya input yang ID-nya TIDAK sama dengan idHapus
    const sisaInput = inputs.filter((id) => id !== idHapus);
    setInputs(sisaInput);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Daftar Konsumsi Makanan</h3>

      {inputs.map((id) => (
        <div key={id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          <InputFood />
          {/* Tombol hapus hanya muncul jika baris lebih dari satu (opsional) */}
          {inputs.length > 1 && (
            <button onClick={() => hapusInput(id)} style={{ marginLeft: "10px", color: "red" }}>
              Hapus
            </button>
          )}
        </div>
      ))}

      <button onClick={tambahInput} style={{ marginTop: "10px" }}>
        + Tambah Baris
      </button>
    </div>
  );
}
