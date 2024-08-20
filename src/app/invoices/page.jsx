"use client"

import { InvoicesComponent } from "../components/invoicesComponent";
import { Navbar } from "../components/navbar";

export default function InvoicesPage({ userName }) {
  return (
    <>
      <Navbar />
      <InvoicesComponent />
    </>
  );
}