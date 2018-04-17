import React from 'react';
import DistinctViewPage from './DistinctViewPage';
import { RECORD_EDIT_NAME } from '../consts';

class RecordEdit extends React.Component {
  constructor(props) {
    super(props);
    this.mobileRender = () => (
      <div>Record </div>
    );
  }

  render() {
    return (
      <DistinctViewPage
        title={RECORD_EDIT_NAME}
        mobileRender={() => this.mobileRender()}
      />
    );
  }
}

export default RecordEdit;
