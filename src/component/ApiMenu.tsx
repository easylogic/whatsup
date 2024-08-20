import React from 'react';
import { Layout, Menu, Tag } from 'antd';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import SubMenu from 'antd/lib/menu/SubMenu';

import { responseState, apiState, menuState, menuItemState, categoryViewState } from '../state/response-state';
import { 
  setSelectedMenuItemForLocalStorage, 
  setApiObjectForLocalStorage, 
  setSelectedOpenMenuForLocalStorage,
  getApiJSON
} from '../util/get-definitions';

const {Sider} = Layout 


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

function ApiMenu() {
  const category = useRecoilValue(categoryViewState);
  const setApi = useSetRecoilState(apiState);
  const setResponseObject = useSetRecoilState(responseState);
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

  return (

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
                        changeMenu(obj, `${obj.path}-${obj.method}`);
                    }} style={{
                        margin: 0
                    }}>
                      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <span>{obj.path}</span>
                        {getTag(obj.method)}
                        </div>
                    </Menu.Item>    
                    ) 
                })}                  
                </SubMenu>
            )
            })}

        </Menu>
    </Sider>

  );
}

export default ApiMenu;
