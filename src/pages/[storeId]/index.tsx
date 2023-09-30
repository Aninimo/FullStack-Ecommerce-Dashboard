import { withServerSideAuth } from '@clerk/nextjs/ssr';
import { getAuth } from '@clerk/nextjs/server';

import { Navbar } from '../../components/navbar';
import { DashboardPage } from './DashboardPage';
import prismadb from '../../lib/prismadb'
import { getTotalRevenue } from '../../actions/get-total-revenue'
import { getSalesCount } from '../../actions/get-sales-count'
import { getGraphRevenue } from '../../actions/get-graph-revenue'
import { getStockCount } from '../../actions/get-stock-count'
import { StoreProps } from '../../types'

interface DashboardLayoutProps {
  stores: StoreProps[];
  totalRevenue: number;
  salesCount: number;
  stockCount: number;
  graphRevenue: number;
}

export default function DashboardLayout({
  stores, 
  totalRevenue,
  salesCount,
  stockCount,
  graphRevenue
}: DashboardLayoutProps){
 return (
    <div>
      <Navbar stores={stores} />
      <DashboardPage 
        totalRevenue={totalRevenue}
        salesCount={salesCount}
        stockCount={stockCount}
        graphRevenue={graphRevenue}
      />
    </div>
  );
}

export const getServerSideProps = withServerSideAuth(async ({ req, res, params }) => {
  const { userId } = getAuth(req)
  const storeId = params?.context as string;

  const totalRevenue = await getTotalRevenue(storeId);
  const salesCount = await getSalesCount(storeId);
  const graphRevenue = await getGraphRevenue(storeId);
  const stockCount = await getStockCount(storeId);
  
  if (!userId) {
    return {
      redirect: {
       destination: '/sign-in',
        permanent: false,
      },
    };
  }

  const stores = await prismadb.store.findMany({
    where: {
      id: storeId, 
      userId,
    },
  });

  if (!stores || stores.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      stores: JSON.parse(JSON.stringify(stores)),
      totalRevenue: totalRevenue,
      salesCount: salesCount,
      stockCount: stockCount,
      graphRevenue: graphRevenue,
    },
  };
})
