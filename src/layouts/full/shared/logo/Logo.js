import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material';
import { ReactComponent as LogoDarkSVG } from 'src/assets/images/logos/ELEC-T LOGO.svg';
import { ReactComponent as LogoDarkRTLSVG } from 'src/assets/images/logos/ELEC-T LOGO.svg';
import { ReactComponent as LogoLightSVG } from 'src/assets/images/logos/ELEC-T LOGO.svg';
import { ReactComponent as LogoLightRTLSVG } from 'src/assets/images/logos/ELEC-T LOGO.svg';

const LogoDark = props => <LogoDarkSVG {...props} width="100%" height="100%" />;
const LogoDarkRTL = props => <LogoDarkRTLSVG {...props} width="100%" height="100%" />;
const LogoLight = props => <LogoLightSVG {...props} width="100%" height="100%" />;
const LogoLightRTL = props => <LogoLightRTLSVG {...props} width="100%" height="100%" />;

const LinkStyled = styled(Link)(({ theme, iscollapse }) => ({
  height: '50px',
  width: iscollapse === 'true' ? '55px' : '180px',
  overflow: 'hidden',
  display: 'block',
}));

const LogoWrapper = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);

  if (customizer.activeDir === 'ltr') {
    return (
      <LinkStyled to="/" iscollapse={customizer.isCollapse.toString()}>
        <LogoWrapper>
          {customizer.activeMode === 'dark' ? (
            <LogoDark />
          ) : (
            <LogoLight />
          )}
        </LogoWrapper>
      </LinkStyled>
    );
  }

  return (
    <LinkStyled to="/" iscollapse={customizer.isCollapse.toString()}>
      <LogoWrapper>
        {customizer.activeMode === 'dark' ? (
          <LogoDarkRTL />
        ) : (
          <LogoLightRTL />
        )}
      </LogoWrapper>
    </LinkStyled>
  );
};

export default Logo;