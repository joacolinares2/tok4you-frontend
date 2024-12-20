import React from "react";
import Layout from "@/components/LayoutBars";
import Alert from "@/components/alert/Alert";

const PagoNoExitosoPage: React.FC = () => {
  return (
    <Layout>
      <div className="my-10">
        <Alert message="Pago no exitoso, intenta de nuevo." type="error" />
      </div>
    </Layout>
  );
};

export default PagoNoExitosoPage;
