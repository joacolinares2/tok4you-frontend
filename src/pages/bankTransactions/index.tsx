import { ListUsdToWusdPendingTransactions } from "./USDtoWUSD/ListUsdToWusdPendingTransactions";
import LayoutBars from "@/components/LayoutBars";

export const PendingTransactions = () => {
  return (
    <LayoutBars>
      <ListUsdToWusdPendingTransactions />
    </LayoutBars>
  );
};
