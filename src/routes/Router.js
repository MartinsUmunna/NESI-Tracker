import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Industry***** */
const Industry = Loadable(lazy(() => import('../views/overveiw/Industry')));
const CommercialOverviewLayout = Loadable(lazy(() => import('../views/commercial/GenerationData')));


/* ****Distribution***** */
const FinancialOverview = Loadable(lazy(() => import('../views/financial/Disco')));

/* ****Transmission***** */
const Transmission = Loadable(lazy(() => import('../views/transmission/TransmissionData')));


/* ****Customers***** */
const TechnicalOverview = Loadable(lazy(() => import('../views/technical/CustomerData')));


/* ****Mini Grids***** */
const StaffOverview = Loadable(lazy(() => import('../views/staff/MiniGridsData')));

/* ****Energy Report***** */
const EnergyOverview = Loadable(lazy(() => import('../views/staff/EnergyReportData')));

/* ****Energy Insights***** */
const EnergyInsights = Loadable(lazy(() => import('../views/staff/EnergyInsightsData')));

/* ****World Energy Report***** */
const WorldData = Loadable(lazy(() => import('../views/world/WorldData')));



const Homepage = Loadable(lazy(() => import('../views/homepage/homepage')))

const WorldEnergyMix = Loadable(lazy(() => import('../components/world-components/WorldEnergyMix')));




const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/overview/Industry" /> },
      { path: '/overview/Industry', exact: true, element: <Industry /> },
      { path: '/commercial/GenerationData', exact: true, element: <CommercialOverviewLayout /> },
      

      { path: '/financial/Disco', exact: true, element: <FinancialOverview /> },

      { path: '/transmission/TransmissionData', exact: true, element: <Transmission /> },
      

      { path: '/technical/CustomerData', exact: true, element: <TechnicalOverview /> },
      

      { path: '/staff/MiniGridsData', exact: true, element: <StaffOverview /> },

      { path: '/staff/EnergyReportData', exact: true, element: <EnergyOverview /> },

      { path: '/staff/EnergyInsightsData', exact: true, element: <EnergyInsights /> },

      { path: '/world/WorldData', exact: true, element: <WorldData /> },
      

      { path: '/home', element: <Homepage /> },

      { path: '/WorldEnergyMix', exact: true, element: <WorldEnergyMix /> },



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
