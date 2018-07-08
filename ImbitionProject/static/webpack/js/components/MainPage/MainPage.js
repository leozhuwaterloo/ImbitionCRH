import React from 'react';
import MainPageMobile from './MainPageMobile';
import MainPageDesktop from './MainPageDesktop';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';

export default () => (
  <DistinctViewPage
    title={NAMES.MAIN_PAGE}
    mobileRender={() => <MainPageMobile />}
    desktopRender={() => <MainPageDesktop />}
  />
);
