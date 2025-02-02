import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Industry***** */
const Industry = Loadable(lazy(() => import('../views/overveiw/Industry')));
const Economy = Loadable(lazy(() => import('../views/econometrics/EconomicData')));

const CommercialOverviewLayout = Loadable(lazy(() => import('../views/On-Grid/GenerationData')));


/* ****Distribution***** */
const FinancialOverview = Loadable(lazy(() => import('../views/distribution/Disco')));

/* ****Transmission***** */
const Transmission = Loadable(lazy(() => import('../views/transmission/TransmissionData')));


/* ****Customers***** */
const TechnicalOverview = Loadable(lazy(() => import('../views/customer/CustomerData')));


/* ****Mini Grids***** */
const StaffOverview = Loadable(lazy(() => import('../views/off-grid/MiniGridsData')));

/* ****Energy Report***** */
const EnergyOverview = Loadable(lazy(() => import('../views/off-grid/EnergyReportData')));

/* ****Energy Insights***** */
const EnergyInsights = Loadable(lazy(() => import('../views/off-grid/EnergyInsightsData')));

/* ****World Energy Report***** */
const WorldData = Loadable(lazy(() => import('../views/world/WorldData')));

/* ****Africa Energy Report***** */
const AfricaData = Loadable(lazy(() => import('../views/Africa/AfricaData')));

/* ****West Africa Energy Report***** */
const WestAfricaData = Loadable(lazy(() => import('../views/Africa/WestAfricaData')));

/* ****Datasets***** */
const Dataset = Loadable(lazy(() => import('../views/dataset/Dataset_Data')));


/* ****Global Trends**** */
const Homepage = Loadable(lazy(() => import('../views/homepage/homepage')))

const WorldEnergyMix = Loadable(lazy(() => import('../components/world-components/WorldEnergyMix')));

const YearlyEnergyGenerated = Loadable(lazy(() => import('../components/generation-components/YearlyEnergyGenerated')));

const GencoCapacity = Loadable(lazy(() => import('../components/generation-components/GencoCapacity')));

const AfricaDataTrend = Loadable(lazy(() => import('../views/Africa/AfricaData')));



const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/overview/Industry" /> },
      { path: '/overview/Industry', exact: true, element: <Industry /> },
      { path: '/econometrics/EconomicData', exact: true, element: <Economy /> },

      { path: '/On-Grid/GenerationData', exact: true, element: <CommercialOverviewLayout /> },
      

      { path: '/distribution/Disco', exact: true, element: <FinancialOverview /> },

      { path: '/transmission/TransmissionData', exact: true, element: <Transmission /> },
      

      { path: '/customer/CustomerData', exact: true, element: <TechnicalOverview /> },
      

      { path: '/off-grid/MiniGridsData', exact: true, element: <StaffOverview /> },

      { path: '/off-grid/EnergyReportData', exact: true, element: <EnergyOverview /> },

      { path: '/off-grid/EnergyInsightsData', exact: true, element: <EnergyInsights /> },

      { path: '/world/WorldData', exact: true, element: <WorldData /> },

      { path: '/Africa/AfricaData', exact: true, element: <AfricaData /> },

      { path: '/Africa/WestAfricaData', exact: true, element: <WestAfricaData /> },

      { path: '/dataset/Dataset_Data', exact: true, element: <Dataset /> },
      

      { path: '/home', element: <Homepage /> },

      { path: '/WorldEnergyMix', exact: true, element: <WorldEnergyMix /> },

      { path: '/YearlyEnergyGenerated', exact: true, element: <YearlyEnergyGenerated /> },

      { path: '/GencoCapacity', exact: true, element: <GencoCapacity /> },

      { path: '/AfricaData', exact: true, element: <AfricaDataTrend /> },

      



    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [

    ],
  },
];

export default Router;
