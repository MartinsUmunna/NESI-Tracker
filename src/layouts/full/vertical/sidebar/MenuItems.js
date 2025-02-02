import {
  IconAward,
  IconBoxMultiple,
  IconPoint,
  IconAlertCircle,
  IconNotes,
  IconCalendar,
  IconMail,
  IconTicket,
  IconEdit,
  IconGitMerge,
  IconCurrencyDollar,
  IconApps,
  IconFileDescription,
  IconFileDots,
  IconFiles,
  IconBan,
  IconStar,
  IconMoodSmile,
  IconBorderAll,
  IconBorderHorizontal,
  IconBorderInner,
  IconBorderVertical,
  IconBorderTop,
  IconUserCircle,
  IconPackage,
  IconMessage2,
  IconBasket,
  IconChartLine,
  IconChartArcs,
  IconChartCandle,
  IconChartArea,
  IconChartDots,
  IconChartDonut3,
  IconChartRadar,
  IconLogin,
  IconUserPlus,
  IconRotate,
  IconBox,
  IconAperture,
  IconShoppingCart,
  IconHelp,
  IconBoxAlignBottom,
  IconBoxAlignLeft,
  IconLayout,
  IconZoomCode,
  IconSettings,
  IconBorderStyle2,
  IconAppWindow,
  IconLockAccess,
} from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [


  {
    id: uniqueId(),
    title: 'Industry',
    icon: IconAperture,
    href: '/overview/Industry',
    chip: 'New',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Economy',
    icon: IconAperture,
    href: '/econometrics/EconomicData',
    
  },
  {
    navlabel: true,
    subheader: 'World',
  },
  {
    id: uniqueId(),
    title: 'World Energy Report',
    icon: IconChartDonut3,
    href: '/World/WorldData',
  }, 
  {
    navlabel: true,
    subheader: 'Africa',
  },
  {
    id: uniqueId(),
    title: 'Africa',
    icon: IconChartDonut3,
    href: '/Africa/AfricaData',
  }, 
  {
    id: uniqueId(),
    title: 'West Africa',
    icon: IconChartDonut3,
    href: '/Africa/WestAfricaData',
  }, 
  {
    navlabel: true,
    subheader: 'On-Grid',
  },
  {
    id: uniqueId(),
    title: 'Generation',
    icon: IconChartDonut3,
    href: '/On-Grid/GenerationData',
  }, 
  
  {
    id: uniqueId(),
    title: 'Transmission',
    icon: IconChartDonut3,
    href: '/transmission/TransmissionData',
  }, 

  

  
 
 
  
  {
    id: uniqueId(),
    title: 'Distribution',
    icon: IconChartDonut3,
    href: '/distribution/Disco',
  },

  
  {
    id: uniqueId(),
    title: 'Customer',
    icon: IconChartDonut3,
    href: '/customer/CustomerData',
  }, 
  
      
    
 
  
  {
    navlabel: true,
    subheader: 'Off-Grid',
  },
  {
    id: uniqueId(),
    title: 'Mini Grids',
    icon: IconChartDonut3,
    href: '/off-grid/MiniGridsData',
  }, 
  {
    navlabel: true,
    subheader: 'Energy Insights',
  },
  {
    id: uniqueId(),
    title: 'Reports',
    icon: IconChartDonut3,
    href: '/off-grid/EnergyReportData',
  }, 
  
  {
    navlabel: true,
    subheader: 'Datasets',
  },
  {
    id: uniqueId(),
    title: 'Datasets',
    icon: IconChartDonut3,
    href: '/dataset/Dataset_Data',
  }, 
  
  
];

export default Menuitems;
