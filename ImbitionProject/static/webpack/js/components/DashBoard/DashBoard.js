import React from 'react';
import DashBoardMobile from './DashBoardMobile';
import DashBoardDesktop from './DashBoardDesktop';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';

export default () => (
  <DistinctViewPage
    title={NAMES.DASHBOARD}
    mobileRender={() => <DashBoardMobile />}
    desktopRender={() => <DashBoardDesktop />}
  />
);
