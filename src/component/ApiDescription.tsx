import React from 'react';
import { Alert } from 'antd';
import { useRecoilValue } from 'recoil';

import { apiViewState } from '../state/response-state';

function ApiDescription() {
  const api = useRecoilValue(apiViewState);

  return (
    <div>
        {api.object?.description && (
        <div>
            <Alert message={(
            <div dangerouslySetInnerHTML={{ __html: api.object?.description }} />
            )} type="error" />
            <div>&nbsp;</div>
        </div>
        )}              
    </div>
  );
}

export default ApiDescription;
