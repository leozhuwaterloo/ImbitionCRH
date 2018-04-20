import React from 'react';
import MainPageMobile from './MainPageMobile';
import MainPageDesktop from './MainPageDesktop';
import DistinctViewPage from '../DistinctViewPage';

export default () => (
  <DistinctViewPage
    title="主页"
    mobileRender={() => <MainPageMobile />}
    desktopRender={() => <MainPageDesktop />}
  />
);
