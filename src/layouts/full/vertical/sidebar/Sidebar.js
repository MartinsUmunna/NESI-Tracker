import { useMediaQuery, Box, Drawer, useTheme } from '@mui/material';
import SidebarItems from './SidebarItems';
import Logo from '../../shared/logo/Logo';
import { useSelector, useDispatch } from 'react-redux';
import { hoverSidebar, toggleMobileSidebar } from 'src/store/customizer/CustomizerSlice';
import Scrollbar from 'src/components/custom-scroll/Scrollbar';
import { Profile } from './SidebarProfile/Profile';

const Sidebar = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const customizer = useSelector((state) => state.customizer);
  const dispatch = useDispatch();
  const theme = useTheme();
  const toggleWidth =
    customizer.isCollapse && !customizer.isSidebarHover
      ? customizer.MiniSidebarWidth
      : customizer.SidebarWidth;

  const onHoverEnter = () => {
    if (customizer.isCollapse) {
      dispatch(hoverSidebar(true));
    }
  };

  const onHoverLeave = () => {
    dispatch(hoverSidebar(false));
  };

  if (lgUp) {
    return (
      <Box
        sx={{
          color: '#fff',
          width: toggleWidth,
          flexShrink: 0,
          ...(customizer.isCollapse && {
            position: 'absolute',
          }),
        }}
      >
        <Drawer
          anchor="left"
          open
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          variant="permanent"
          PaperProps={{
            sx: {
              transition: theme.transitions.create('width', {
                duration: theme.transitions.duration.shortest,
              }),
              width: toggleWidth,
              boxSizing: 'border-box',
              backgroundColor: '#002060',
              color: '#fff', // Ensure text color is white
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: '#002060',
              color: 'white', // Confirm text color for consistent application
              height: '100%',
            }}
          >
            <Box px={3}>
              <Logo />
            </Box>
            <Scrollbar sx={{ height: 'calc(100% - 190px)' }}>
              <SidebarItems />
            </Scrollbar>
            <Profile />
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={customizer.isMobileSidebar}
      onClose={() => dispatch(toggleMobileSidebar())}
      variant="temporary"
      PaperProps={{
        sx: {
          width: customizer.SidebarWidth,
          backgroundColor: '#000000',
          color: 'white', 
          border: '0 !important',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <Box px={2}>
        <Logo />
      </Box>
      <SidebarItems />
    </Drawer>
  );
};

export default Sidebar;
