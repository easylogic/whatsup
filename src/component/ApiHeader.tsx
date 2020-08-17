import React from 'react';
import { Layout, Menu, Row, Col, Tooltip } from 'antd';
import { useRecoilState } from 'recoil';
import swaggerJSON from '../util/swagger-json';
import { categoryState} from '../state/response-state';
import { setCategoryNameForLocalStorage } from '../util/get-definitions';

const { Header } = Layout 

function ApiHeader() {
  const [category, setCategory] = useRecoilState(categoryState);

  function changeCategory(category: string) {
    setCategoryNameForLocalStorage(category);
    setCategory(category);
  }

  return (
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
                const api = swaggerJSON[key];
                return (
                  <Menu.Item  key={key} onClick={() => changeCategory(key)} >
                       <Tooltip  title={`${api.title} - ${api.description}`}>
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
  );
}

export default ApiHeader;
