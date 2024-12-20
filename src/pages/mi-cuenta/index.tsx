import React from "react";
import Layout from "@/components/LayoutBars";
import MiCuenta from "@/components/mi-cuenta/MiCuenta";

const MiCuentaPage: React.FC = () => {
  return (
    <Layout>
      <MiCuenta />
    </Layout>
  );
};

export default MiCuentaPage;
