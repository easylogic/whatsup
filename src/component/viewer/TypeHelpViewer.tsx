import React from 'react';

interface Props {
    item: any;
    schema: any; 
}

export default function TypeHelpViewer (props: Props) {
    const { item: it, schema } = props; 
    let help = undefined; 
    if (it.description) {
        help = <div>type: {it.type || `${schema?.type} - ${schema?.title}`}, description: {it.description}</div>;
    } else {
        help = (
            <div>
                <div>type: {it.type || schema.type} </div> 
                {it.enum ? <div>enum: {JSON.stringify(it.enum)}</div> : ''}
                {it.items?.enum ? <div>enum: {JSON.stringify(it.items?.enum)}</div> : ''}                    
                {(schema?.type) && (`${schema?.type}: ${schema?.title || schema?.xml?.name}`)}
            </div>
        )
    }

    return <div style={{color: 'gray', fontSize: 11}}>{help}</div>
}