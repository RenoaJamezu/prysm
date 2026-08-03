import { useAnalytics } from "../hooks/useAnalytics";

import DateFilter from "../components/DateFilter";
import OverviewCards from "../components/OverviewCards";
import OrdersTable from "../components/OrdersTable";
import SalesTrendChart from "../components/SalesTrendChart";

export default function AnalyticsPage() {
  const {
    loading,

    filter,
    setFilter,

    overview,

    orders,

    trend,
  } = useAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>

        <p className="text-muted-foreground">
          Monitor your business performance.
        </p>
      </div>

      <DateFilter value={filter} onChange={setFilter} />

      <OverviewCards loading={loading} overview={overview} />

      <SalesTrendChart loading={loading} data={trend} />

      <OrdersTable loading={loading} orders={orders} />
    </div>
  );
}
