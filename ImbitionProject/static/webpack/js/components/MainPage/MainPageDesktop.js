import React from 'react';
import { Redirect } from 'react-router';
import { URLS } from '../../consts';

export default () => (
  <Redirect to={{ pathname: URLS.EMPLOYEE_EDIT }} />
);
