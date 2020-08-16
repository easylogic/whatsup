import React from 'react';
import { Layout, Menu, Tag, Alert, Row, Col, Modal, PageHeader, Tooltip, message } from 'antd';
import ReactMarkdown from "react-markdown";
import { useRecoilState } from 'recoil';
import SubMenu from 'antd/lib/menu/SubMenu';

import './App.css';
import swaggerJSON from './util/swagger-json';
import {ApiTable} from './component/ApiTable';
import {ResponseTable} from './component/ResponseTable';
import {customizedAxios} from './util/customized-axios';
import { responseState, categoryState, apiState, menuState, menuItemState } from './state/response-state';
import { 
  setSelectedMenuItemForLocalStorage, 
  setApiObjectForLocalStorage, 
  setSelectedOpenMenuForLocalStorage,
  getApiJSON
} from './util/get-definitions';



const { Header, Content, Sider} = Layout 


function getTag(text: string) {
  switch(text) {
  case 'get': return <Tag color="blue">{text.toUpperCase()}</Tag>;
  case 'post': return <Tag color="green">{text.toUpperCase()}</Tag>;
  case 'put': return <Tag color="orange">{text.toUpperCase()}</Tag>;
  case 'delete': return <Tag color="red">{text.toUpperCase()}</Tag>;
  case 'head': return <Tag >{text.toUpperCase()}</Tag>;
  case 'options': return <Tag >{text.toUpperCase()}</Tag>;
  case 'patch': return <Tag >{text.toUpperCase()}</Tag>;
  default: return <Tag>{text}</Tag>;
  }
}

function App() {
  const [category, setCategory] = useRecoilState(categoryState);
  const [api, setApi] = useRecoilState(apiState);
  const [responseObject, setResponseObject] = useRecoilState(responseState);
  const [menu, setSelectedMenu] = useRecoilState(menuState);
  const [menuItem, setSelectedMenuItem] = useRecoilState(menuItemState);  

  const json = getApiJSON(category);

  function changeMenu(apiObject: any, key: string) {
    setApi(apiObject);
    setResponseObject({
      api: apiObject,
      requestObject: {},
      responseObject: {},
      definitions: json.definitions
    })

    setSelectedMenuItem([key]);
    setSelectedMenuItemForLocalStorage(key);
    setApiObjectForLocalStorage(apiObject)
  }

  function changeCategory(category: string) {
    localStorage.setItem('category', category);
    setCategory(category);
  }

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
          params = JSON.parse(values[key] || "{}")
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

      console.log(api.method, url, params, headers);

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
     }  catch (e) {
      console.log(e, e.request, e.response);
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
      <Header className="header" style={{
        position: 'fixed',
        height: 64,
        top: 0,
        width: '100%',
        zIndex: 1000
      }}>
        <Row>
          <Col span={4}><h1 className="logo" style={{color: 'white', fontWeight: 'bold', fontSize: 20}} > WHATS UP</h1></Col>
          <Col span={12}>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[category]}>
              {Object.keys(swaggerJSON).map((key: string) => {
                return (
                  <Menu.Item  key={key} onClick={() => changeCategory(key)} >
                       <Tooltip  title={`${swaggerJSON[key].title} - ${swaggerJSON[key].description}`}>
                        <span style={{textTransform: 'capitalize'}}>{key}</span>
                      </Tooltip>
                  </Menu.Item>
                )
              })}
            </Menu>
          </Col>
          <Col span={8} style={{textAlign: 'right'}}>

          </Col>
        </Row>        
      </Header>
        <Layout>
          <Sider 
              width={350} 
              className="site-layout-background" style={{
              overflow: 'hidden',
              overflowY: 'auto',
              height: '90vh',
              position: 'fixed',
              left: 0,
              backgroundColor: 'white',
      }}>
            <Menu
              mode="inline"
              style={{ borderRight: 0 }}
              defaultOpenKeys={menu}
              defaultSelectedKeys={menuItem}              
              onOpenChange={(it) => {
                setSelectedOpenMenuForLocalStorage(it);
                setSelectedMenu(it as string[])
              }}
            >
              {json.tags.map((tag: any) => {
                return (
                  <SubMenu key={tag.name} title={tag.description}>
                    {json.tagsKeys[tag.name].map((obj: any) => {
                      return (
                        <Menu.Item key={`${obj.path}-${obj.method}`} onClick={() => {
                          console.log(obj);
                          changeMenu(obj, `${obj.path}-${obj.method}`);
                        }} style={{
                          margin: 0
                        }}>
                          {getTag(obj.method)}
                          {obj.path}
                        </Menu.Item>    
                      ) 
                    })}                  
                  </SubMenu>
                )
              })}

            </Menu>
          </Sider>
          <Layout style={{ padding: 0, marginLeft: 350 }}>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
              }}
            >
              <Alert message={<ReactMarkdown source={json.description}/>} type="info" />
              <div>&nbsp;</div>
              <PageHeader
                  className="site-page-header"
                  style={{ marginBottom: 10, backgroundColor: 'white'}}
                  title={(
                    <div>{getTag(api.method)} {json.basePath}{api.path}</div>  
                  )}
                  breadcrumb={{ routes: [
                    {
                      path: 'index',
                      breadcrumbName: `${json.title}`,
                    },
                    {
                      path: 'host',
                      breadcrumbName: `https://${json.host}`,
                    },
                  ]}}
                >
                  <Content>
  
                    <div><Tag color="purple">Summary</Tag> {api.object?.summary}</div>
                  </Content>  
              </PageHeader>
              <div>&nbsp;</div>
              <ApiTable 
                swaggerJSON={json}
                api={api}
                parameters={api.object?.parameters || []} 
                definitions={json.definitions} 
                handleApiParams={handleApiParams}
              />
              <div>&nbsp;</div>              
              {api.object?.description && (
                <div>
                  <Alert message={(
                    <div dangerouslySetInnerHTML={{ __html: api.object?.description }} />
                  )} type="error" />
                  <div>&nbsp;</div>
                </div>
              )}              
              <div>&nbsp;</div>
              <ResponseTable  responseObject={responseObject} />
            </Content>
          </Layout>
        </Layout>
      </Layout>
  );
}

export default App;
