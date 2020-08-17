import React from 'react';
import { Layout, Tag, Alert, PageHeader } from 'antd';
import ReactMarkdown from "react-markdown";
import { useRecoilState } from 'recoil';
import { categoryState, apiState, } from '../state/response-state';
import { 
  getApiJSON
} from '../util/get-definitions';

const { Content } = Layout 


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

function ApiPageTop() {
  const [category] = useRecoilState(categoryState);
  const [api] = useRecoilState(apiState);

  const json = getApiJSON(category);

  return (
    <>
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
    </>
  );
}

export default ApiPageTop;
