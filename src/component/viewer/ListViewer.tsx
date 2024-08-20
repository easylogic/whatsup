import React from 'react';
import { List } from 'antd';
import JsonView from '@uiw/react-json-view'

interface ListViewerProps {
    title?: string;
    id: string;
    json: any;
}

export default function ListViewer (props: ListViewerProps) {
    const { json, id } = props; 
    return (
        <div id={id} style={{marginBottom: 20, marginTop: 20, backgroundColor: 'white', padding: 10}}>
            <List
                itemLayout="horizontal"
                dataSource={json}
                renderItem={(item: any) => {

                    let name = Object.keys(item.schema || {})[0] || ""

                    return (
                        <List.Item key={item.code}>
                            <List.Item.Meta
                                avatar={`${item.code}`}
                                title={`${item.description}`}
                                description={(Array.isArray(item.schema)) ? <JsonView value={item.schema} /> : <JsonView value={item.schema?.[name] || item.schema} />}
                            />
                        </List.Item>
                    )
                }}
            />


      </div>
    )
}