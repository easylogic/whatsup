import React from 'react';
import JSONViewer from './viewer/JSONViewer';
import ListViewer from './viewer/ListViewer';
import { Tabs, Alert } from 'antd';

interface ResponseTableProps {
  responseObject: any;
}

function typeToValue(obj: any) {
  switch (obj.type) {
    case 'string':
      if (obj.enum) {
        return obj.enum.join(' or ');
      }
  }

  return '';
}

interface JSONInterface {
  [key: string]: any;
}

function schemaToJSON(schema: any, definitions: any) {
  let obj: JSONInterface = {};

  schema = schema || { properties: {} };

  Object.entries(schema.properties || {}).forEach(([key, value]) => {
    obj[key] = typeToValue(value);
  });

  return JSON.stringify(obj, null, 4);
}

function getSchemaObject(schema: any, definitions: any) {
  if (!schema) return '';
  if (!schema.$ref) return '';

  const dataObject = schema.$ref
    .split('definitions/')[1]
    .split(/»|«/g)
    .filter(Boolean)
    .pop();

  return schemaToJSON(definitions[dataObject], definitions);
}

export function ResponseTable(props: ResponseTableProps) {
  const { definitions, responseObject, requestObject, api } = props.responseObject;

  const dataSource = Object.keys(api?.object?.responses || {}).map((code) => {
    const res = api?.object?.responses[code];
    let schemaString = getSchemaObject(res.schema, definitions);

    return {
      code,
      schemaString,
      ...res,
    };
  });

  return (          

    <div>
      <Tabs defaultActiveKey="1">
        {Boolean(requestObject) && (
          <Tabs.TabPane tab="Request" key="5">
            <JSONViewer id="request" title="Request" json={requestObject} /> 
          </Tabs.TabPane>
        )}

        {Boolean(responseObject?.config?.curlCommand) && (
          <Tabs.TabPane tab="Curl" key="6">
            <Alert type="info" message={responseObject?.config?.curlCommand} />
          </Tabs.TabPane>
        )}

        {Boolean(responseObject?.config) && (
          <Tabs.TabPane tab="Config" key="7">
            <JSONViewer id="config" title="Config" json={{
              baseURL: responseObject?.config?.baseURL,            
              url: responseObject?.config?.url,
              method: responseObject?.config?.method,
              headers: responseObject?.config?.headers,
              params: responseObject?.config?.params,
              response: responseObject?.request?.response,
              responseHeaders: responseObject?.headers,
            }} /> 
          </Tabs.TabPane>
        )}

        <Tabs.TabPane tab="Responses Code" key="8">
          <ListViewer id="list" json={dataSource} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Swagger Spec" key="9">
          {Object.keys(api).length > 0 && (
                <JSONViewer id="swagger" title="Swagger Spec" json={api} />
          )}
        </Tabs.TabPane>

      </Tabs>

    </div>
  );
}
