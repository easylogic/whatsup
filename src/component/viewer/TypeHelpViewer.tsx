import React from 'react';

interface Props {
    item: any;
    schema?: any; 
}

export default function TypeHelpViewer (props: Props) {
    const { item: it } = props; 
    let help = undefined; 
    if (it.description) {
        help = (
            <div>
                <div><strong>type</strong>: {it.schema?.type || `${it?.type}`}</div>
                <div><strong>description</strong>: {it.description}</div>
            </div>
        );
    } else {
        help = (
            <div>
                <div><strong>type</strong>: {it.schema?.type || it.type || JSON.stringify(it?.properties)} </div> 
                {it.enum ? <div><strong>enum</strong>: {JSON.stringify(it.enum)}</div> : ''}
                {it.items?.enum ? <div><strong>enum</strong>: {JSON.stringify(it.items?.enum)}</div> : ''}                    
                {(it?.type) && (<div><strong>{it?.type}</strong>: {it?.items?.type || it?.xml?.name || JSON.stringify(it?.items?.properties)}</div>)}
            </div>
        )
    }

    return <div style={{color: 'gray', fontSize: 11}}>{help}</div>
}