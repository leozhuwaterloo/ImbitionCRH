import React from 'react';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';

class PermissionTreeView extends React.Component {
  constructor(props) {
    super(props);
    this.desktopRender = () => {
      console.log('test');
      return (
        <div>Test</div>
      );
    };
  }

  render() {
    return (
      <DistinctViewPage
        title={NAMES.PERMISSION_TREE_VIEW}
        mobileRender={() => <div>{NAMES.NO_PHONE}</div>}
        desktopRender={() => this.desktopRender()}
      />
    );
  }
}

export default PermissionTreeView;
