import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar, Stack } from '@mui/material';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import { MHidden } from '../../components/@material-extend';
//
import sidebarConfig from './SidebarConfig';
import account from '../../_mocks_/account';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme, isopensidebar }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: isopensidebar ? DRAWER_WIDTH : window.width
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200]
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  
  useEffect(() => {
    if (isOpenSidebar) {
      // check if width is large or less to determine auto-close
      if(window.innerWidth < 1200){
        console.log("This is mobile window.innerWidth > ", window.innerWidth)
        onCloseSidebar();
      }
     
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  

  useEffect(()=>{
    /*
    fetchModules = () => {
        let self = this;
        let user_id = localStorage.getItem('uid');
    
        Api.get(BASE_URL+'/roles/modules/?order_by_position=1&user_id='+user_id).then(function(response){
            let json = response.data;
            if(json != null || json.length !==0){
                let modules = json.results;
    
                let navigationItems = []
                modules.map((module, index)=>{
                    let children = []
                    let has_children_menus = false;
                    if(module.menus.length > 1){
                      has_children_menus = true;
                      module.menus.map((menu, index)=>{
                        let child = { name: menu.menu_name, url: menu.url, icon: menu.icon };
                        children.push(child);
                      })
                    }
    
                    let item = { name: module.name, url: module.url, icon: module.icon };
                    if(has_children_menus){
                      item = { name: module.name, url: module.url, icon: module.icon, children };
                    }
                    navigationItems.push(item);
                })
                self.setState({navigation: { items : navigationItems }})
            }else{
                self.setState({ formValidText: 'Error fetching update modules' });
            }
        }).catch(function(error){
            self.setState({ formValidText: error.message !== null ? error.message : "Validation Error"});
        })
    }
    */
  }, []);

  const renderContent = (
    <Scrollbar
      sx={{
        backgroundColor: "#1c243c",
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Box component={RouterLink} to="/" sx={{ display: 'inline-flex' }}>
          <Logo />
        </Box>
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle sx={{backgroundColor: '#2a3c4c'}}>
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: '#fff' }}>
                {account.displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#cdd5dd' }}>
                {account.role}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={sidebarConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{
            p: 2.5,
            pt: 5,
            borderRadius: 2,
            position: 'relative',
            bgcolor: 'grey.200'
          }}
        >
          <Box
            component="img"
            src="/static/illustrations/illustration_avatar.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Need Help?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              (+254)728 506 150
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              support@dexni.co.ke
            </Typography>
          </Box>

          {/* <Button
            fullWidth
            href="https://material-ui.com/store/items/minimal-dashboard/"
            target="_blank"
            variant="contained"
          >
            Upgrade to Pro
          </Button> */}
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle isopensidebar={isOpenSidebar}>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default'
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
