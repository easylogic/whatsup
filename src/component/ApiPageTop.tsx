import React from 'react';
import { Layout, Tag, Alert, Breadcrumb } from 'antd';
import ReactMarkdown from "react-markdown";
import { useRecoilValue } from 'recoil';
import { apiViewState, categoryViewState, } from '../state/response-state';
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
  const category = useRecoilValue(categoryViewState);
  const api = useRecoilValue(apiViewState);

  const json = getApiJSON(category);

  return (
    <>
        <Alert type="info" message={<ReactMarkdown>{json.description}</ReactMarkdown>} />
        <div>&nbsp;</div>
        <div
            className="site-page-header"
            style={{ marginBottom: 10, backgroundColor: 'white'}}
        >

            <div>
                <div>
                  <Tag color="purple">Controller</Tag> {api.object?.tags.map(tag => {
                    const tagInfo = json.tags.find(it => it.name === tag);
                    return <Tag key={tag} color="purple">{tag} - {tagInfo?.description}</Tag>
                  })}
                </div>
                <div>{getTag(api.method)} {json.basePath}{api.path}</div>  
            </div>

                  <Breadcrumb routes={[
                      {
                          path: 'index',
                          breadcrumbName: `${json.title}`,
                      },
                      {
                          path: 'host',
                          breadcrumbName:  json.host ?  `https://${json.host}` : `${json.servers?.[0]?.url}`,
                      },
                    ]} />


            <Content>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10
            }}>
              <div><Tag color="purple">Summary</Tag> {api.object?.summary}</div>
            </div>

            </Content>  
        </div>
    </>
  );
}

export default ApiPageTop;
