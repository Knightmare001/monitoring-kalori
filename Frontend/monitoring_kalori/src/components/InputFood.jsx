import React from "react";

export function InputFood() {
  return (
    <div>
      <input list="daftar-makanan" placeholder="Cari makanan..." style={{ padding: "5px", width: "200px" }} />
      <datalist id="daftar-makanan">
        <option value="Nasi Goreng" />
        <option value="Nasi Uduk" />
        <option value="Ayam Goreng" />
      </datalist>
    </div>
  );
}
