import React from 'react';
import MainPageMobile from './MainPageMobile';
import { DashBoardDesktop } from '../DashBoard';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';

export default () => (
  <DistinctViewPage
    title={NAMES.ROOT}
    mobileRender={() => <MainPageMobile />}
    desktopRender={() => <DashBoardDesktop />}
  />
);
