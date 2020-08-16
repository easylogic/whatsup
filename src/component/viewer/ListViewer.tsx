import React from 'react';
import { List } from 'antd';

const preStyle: any = { whiteSpace: 'pre-wrap', wordBreak: 'break-all', border: '1px solid #ececec', padding: 10 };



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
                renderItem={(item: any) => (
                    <List.Item key={item.code}>
                        <List.Item.Meta
                            avatar={`${item.code}`}
                            title={`${item.description}`}
                            description={(item.schemaString) ? <pre style={preStyle}>{item.schemaString}</pre> : ''}
                        />
                    </List.Item>
                )}
            />


      </div>
    )
}