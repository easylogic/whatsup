import React from 'react';
import { Button, Tabs, Tag } from 'antd';
import JsonView from '@uiw/react-json-view'


function copyStringToClipboard(target: string) {
    const dummyTextarea = document.createElement('textarea');
    dummyTextarea.value = target;
    dummyTextarea.setAttribute('readonly', '');
    document.body.appendChild(dummyTextarea);
    dummyTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(dummyTextarea);
}

const tableColor = '#ececec'

const preStyle: any = { whiteSpace: 'pre-wrap', wordBreak: 'break-all', border: '1px solid #ececec', padding: 10 };


function DataView(data: any) {
    return (
      <pre
        style={{
          maxHeight: 500,
          overflow: 'auto',
          ...preStyle
        }}
      >
        {JSON.stringify(data, null, 4)}
      </pre>
    );
  }


const cellStyle = {padding: 5, borderBottom: `1px solid ${tableColor}`, borderRight: `1px solid ${tableColor}`}
 

function StringArrayTableView(stringArray: any) {

    return (
        <div>        
            {stringArray?.map((it: any, index: number) => {
                return <Tag key={`tag-${index}`}>{it}</Tag>
            })}
        </div>
        
    );
}   

function ArrayTableView(data: any) {

    if (typeof data?.[0] === 'string') {
        return StringArrayTableView(data); 
    }

    const fields = Object.keys(data?.[0] || []) || [];

    return (
        <table style={{borderTop: `1px solid ${tableColor}`, borderLeft: `1px solid ${tableColor}`}}>
            <thead>
                <tr>
                    {fields.map((field: string, index: number) => <th  key={`t-${index}`} style={cellStyle}>{field}</th>)}
                </tr>
            </thead>
            <tbody>
                {(typeof data?.map === 'function') && data?.map((it: any, trIndex: number) => {
                    return <tr key={`tr-index-${trIndex}`}>
                        {fields.map((field: string, index: number) => {
                            if (['number', 'string', 'boolean'].includes(typeof it[field])) {
                                return <td style={cellStyle} key={`index-${index}`}>{it[field]}</td>
                            } else {
                                return <td style={cellStyle} key={`index-${index}`}>{TableView(it[field])}</td>
                            }
                        })}
                    </tr>
                })}
            </tbody>
        </table>
    );
}   

function ObjectTableView (obj: any) {
    const data = Object.keys(obj || {}).map((key) => {
        return {key, value: obj[key]}
    });

    return ArrayTableView(data);
}


function TableView(data: any) {
    if (typeof data === 'object' && typeof data?.length === 'undefined') {
        return ObjectTableView(data);
    } else if (typeof data === 'string') {
        return data;
    } else {
        return ArrayTableView(data);
    }
}  


interface JSONViewerProps {
    title: string;
    id: string;
    json: any;
}

export default function JSONViewer (props: JSONViewerProps) {
    const { title, json, id } = props; 
    return (
        <div  id={id} style={{marginBottom: 20, backgroundColor: 'white', padding: 20, boxShadow: 'rgb(0 0 0 / 8%) 0px 4px 9px 2px'}}>
            <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
            >
            <h2>{title}</h2>
            <Button
                onClick={() => {
                    copyStringToClipboard(
                        JSON.stringify(json, null, 4)
                    );
                }}
            >
                Copy to clipoboard
            </Button>
            </div>

            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="JSON" key="1">
                    <div style={{maxHeight: 500, overflow: 'auto', border: '1px solid #ececec', padding: 10}}>
                        <JsonView value={json} />
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Table" key="2">
                    <div style={{maxHeight: 500, overflow: 'auto', border: '1px solid #ececec', padding: 10}}>
                        {TableView(json)}
                    </div>
                </Tabs.TabPane>                
                <Tabs.TabPane tab="Text" key="3">
                    <div>{DataView(json)}</div>
                </Tabs.TabPane>
            </Tabs>            


      </div>
    )
}