import React from "react";
import Layout from "@/components/LayoutBars";
import Alert from "@/components/alert/Alert";

const PagoExitosoPage: React.FC = () => {
  return (
    <Layout>
      <div className="my-10">
        <Alert
          message="Pago exitoso, en breve recibiras los tokens que compraste."
          type="success"
        />
      </div>
    </Layout>
  );
};

export default PagoExitosoPage;
