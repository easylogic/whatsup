import React from 'react';
import { Layout, Modal, message } from 'antd';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import './App.css';
import {ApiTable} from './component/ApiTable';
import {ResponseTable} from './component/ResponseTable';
import {customizedAxios} from './util/customized-axios';
import { responseState, categoryViewState, apiViewState, responseViewState } from './state/response-state';
import { 
  getApiJSON
} from './util/get-definitions';
import ApiHeader from './component/ApiHeader';
import ApiMenu from './component/ApiMenu';
import ApiPageTop from './component/ApiPageTop';
import ApiDescription from './component/ApiDescription';

const { Content } = Layout 

function App() {
  const category = useRecoilValue(categoryViewState);
  const api = useRecoilValue(apiViewState);
  const responseObject = useRecoilValue(responseViewState);
  const setResponseObject = useSetRecoilState(responseState);

  const json = getApiJSON(category);

  async function handleApiParams(values: any) {

    let url = `https://${json.host}${json.basePath}${api.path}`
    let params: {[key: string]: any} = {}  
    let headers: {[key: string]: any} = {}  

    const bodyParam = api.object?.parameters?.filter(it=>it.in === 'body')
    const formData = api.object?.parameters?.filter(it=> it.in === 'formData') || []
    const headerData = api.object?.parameters?.filter(it=> it.in === 'header') || []    

    const bodyParamNames = bodyParam?.map(it => it.name);    
    const formDataNames = formData?.map(it => it.name);
    const headerDataNames = headerData?.map(it => it.name);

    Object.keys(values).filter(key => Boolean(values[key])).forEach(key => {
      if (url.includes(`{${key}}`)) {
        url = url.replace(`{${key}}`, encodeURIComponent(values[key]))
      } else {
        if (headerDataNames?.includes(key)) {
          headers[key] = values[key]; 
        } else if (formDataNames?.includes(key)) {
          params[key] = values[key];           
        } else if (bodyParamNames?.includes(key)) {
          params = values[key] || {}
        } else {
          params[key] = values[key]
        }

      }
    })

    // formData 가 1개 이상 일 때 FormData 로 데이타 전송을 한다. 
    if (formData.length > 0) {
      const formDataList = new FormData();
      Object.keys(params).forEach(key => {
        formDataList.append(key, params[key]);
      })

      params = formDataList
    }

    let response: any = null; 

     try {

      switch(api.method) {
        case 'get': response = await customizedAxios.get(url, { params, headers });  break; 
        case 'post': response = await customizedAxios.post(url, params, { headers } );  break; 
        case 'delete': response = await customizedAxios.delete(url, { params, headers });  break; 
        case 'put': response = await customizedAxios.put(url, params, { headers });  break; 
      }

      if (response?.data?.result?.status !== 200) {
        Modal.error({
          title: response?.data?.result?.code,
          content: response?.data?.result?.message,
        })
      }

      setResponseObject({
        requestObject: response.request,
        responseObject: response,
        definitions: json.definitions,
        api
      });
     }  catch (e: any) {
      setResponseObject({
        api,
        requestObject: e.request, 
        responseObject: e.response,
        definitions: json.definitions
      });       
     } finally {
      message.success('Request is done.');
     }

  }

  return (
    <Layout style={{ height: '100%'}}>
      <ApiHeader />
      <Layout>
          <ApiMenu />
          <Layout style={{ padding: 0, marginLeft: 350 }}>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
              }}
            >
              <ApiPageTop />
              <div>&nbsp;</div>
              <ApiTable handleApiParams={handleApiParams}/>
              <div>&nbsp;</div>              
              <ApiDescription />
                <div>&nbsp;</div>
              <ResponseTable  responseObject={responseObject} />
            </Content>
          </Layout>
        </Layout>
      </Layout>
  );
}

export default App;
