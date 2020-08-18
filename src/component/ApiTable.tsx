import React, { useState, useEffect } from 'react';
import {Button, Row, Col, Tabs, Badge } from 'antd';
import { useRecoilValue } from 'recoil';

import {categoryViewState, apiViewState, responseViewState} from '../state/response-state'
import { APIParameter } from '../constant/api';

import FileInput from './items/FileInput';
import BooleanInput from './items/BooleanInput';
import TextInput from './items/TextInput';
import SelectInput from './items/SelectInput';
import TagsInput from './items/TagsInput';
import NumberInput from './items/NumberInput';
import ObjectInput from './items/ObjectInput';

import {getDefinitions, getApiJSON, clone} from '../util/get-definitions';
import TypeHelpViewer from './viewer/TypeHelpViewer';

interface ApiTableProps {
    handleApiParams: (values: any) => void; 
}

function typeToValue (obj: any)   {
    switch(obj.type) {
    case 'string':

        if (obj.format === 'date-time') {
            return "YYYY-MM-DD HH24:mm:ss"
        }

        if (obj.enum) {
            return obj.enum.join(' or ');
        }

        return '';
    case 'boolean':
        return Boolean(false);
    case 'array':
        return [].map(it => {
            return obj.items.type === 'integer' ? parseInt(it) : 0
        })
    }

    return '';
}

interface JSONInterface {
    [key: string]: any;
}

function schemaToJSON(schema: any, definitions: any) {

    let obj: JSONInterface = {}
    
    if (schema.type) {
        switch(schema.type) {
        case 'object':
            Object.entries(schema?.properties || {}).forEach(([key, value]) => {
                obj[key] = typeToValue(value);
            })
            break;
    
        default: 
            obj = typeToValue(schema);
        }
        
    } else {        // has a ref 
        Object.entries(schema?.properties || {}).forEach(([key, value]) => {
            obj[key] = typeToValue(value);
        })
    
    }

    return JSON.stringify(obj, null, 4);
}

declare global {
    interface Window {
        globalInputValues: any;
    }
}

export function ApiTable(props: ApiTableProps) {
    const { handleApiParams } = props;
    const category = useRecoilValue(categoryViewState);
    const api = useRecoilValue(apiViewState);
    const responseObject = useRecoilValue(responseViewState);    

    const [isLoading, setLoading] = useState(false);
    const [inc, setInc] = useState(0);

    const json = getApiJSON(category);       
    const parameters = api?.object?.parameters;
    const definitions = json.definitions

    const urlKey = `https://${json.host}${json.basePath}${api.path}-${api.method}`
    const SAVE_GLOBAL_INPUT_VALUES_KEY =  `save-${urlKey}`


    function getGlobalInputValues () {

        if (!window.globalInputValues) {
            window.globalInputValues = {} 

            if (localStorage.getItem(SAVE_GLOBAL_INPUT_VALUES_KEY)) {
                window.globalInputValues[urlKey] = JSON.parse(localStorage.getItem(SAVE_GLOBAL_INPUT_VALUES_KEY) || "{}")
            }

        }

        if (!window.globalInputValues[urlKey]) {
            window.globalInputValues[urlKey] = {}
        }

        return window.globalInputValues[urlKey];
    }

    function getFieldValue(name: string) {
        return getGlobalInputValues()[name];
    }

    function setGlobalInputValues( field: string, value: any) {
        const inputValues = getGlobalInputValues()
        inputValues[field] = value; 

        saveGlobalInputValues();

        // for re-rendering 
        setInc(inc+1);
    }

    function saveGlobalInputValues () {
        localStorage.setItem(SAVE_GLOBAL_INPUT_VALUES_KEY, JSON.stringify(getGlobalInputValues()))
    }

    useEffect(() => {
        setLoading(false);
    }, [responseObject])


    const dataSource = parameters?.map((it: APIParameter, index:number) => {
        return {
            key: `parameter-${index}`,
            ...it
        }
    }) || []

    dataSource.sort((a, z) => {
        if (a.in === z.in) return 0; 
        return a.in === 'path'  && z.in === 'query' ? -1 : 1; 
    })
    

    function sendApi () {
        let localValues: {[key:string]: any} = {}
        dataSource.filter(it => it.in === 'body').forEach(it => {
            // let info = {} ; 
            let schema = getDefinitions(it.schema, responseObject.definitions);

            localValues[it.name] = schemaToJSON(schema, responseObject.definitions)
        })

        handleApiParams({...localValues, ...getGlobalInputValues()});
        saveGlobalInputValues()
        setLoading(true);
    }

    function handleChangeValue (name: string, value: any) {
        setGlobalInputValues(name, value);
    }

    function createFormItem (it: any, rowIndex: number) {


        let schema = null; 
        if (it.type === 'array') {
            if (it.items.$ref) {
                schema = getDefinitions(it.items, responseObject.definitions)
            }
        } else if (it.$ref) {
            schema = getDefinitions(it, responseObject.definitions)            
        }


        const inputValues = clone(getFieldValue(it.name))

        return (
            <Row style={{paddingTop: 10}} gutter={10} key={`row-${rowIndex}`}>
                <Col span={4} style={{wordBreak: 'break-all', fontSize: 13}}>
                    <strong>{it.name}</strong> &nbsp;
                    {it.required ? <div style={{color: 'gray', fontSize: 11, fontStyle: 'italic'}}>(required)</div> : ''}
                </Col>
                <Col span={20}>

                {it.type === 'file' && (
                    <FileInput item={it} inputValues={inputValues} onChange={handleChangeValue} />
                )}
                {it.type === 'boolean' && (
                    <BooleanInput item={it} inputValues={Boolean(inputValues)} onChange={handleChangeValue} />
                )}

                {(it.type === 'string' && Boolean(it.enum) === false) && (  // enum 이 없으면 일반 텍스트 
                    <TextInput item={it} inputValues={inputValues} onChange={handleChangeValue} />
                )}

                {(it.type === 'string' && it.enum) && (     // enum 이 있으면 고정된 텍스트 , select 로 표현 
                    <SelectInput item={it}  inputValues={inputValues} onChange={handleChangeValue} />
                )}

                {(it.type === 'array' && it.enum) && (     // enum 이 있으면 고정된 텍스트 , select 로 표현 
                    <SelectInput item={it} inputValues={inputValues} onChange={handleChangeValue} />
                )}              

                {(it.type === 'array' && it.collectionFormat) && (     
                    <TagsInput item={it} inputValues={inputValues} onChange={handleChangeValue} />
                )}                  

                {['number', 'integer', 'float', 'double', 'int32', 'int64'].includes(it.type) && (
                    <NumberInput item={it} inputValues={inputValues} onChange={handleChangeValue} />
                )}

                <TypeHelpViewer item={it} schema={schema} />             
            </Col>  
        </Row>
        )
    }

    function createFormItemBody (it: any) {
        // let info = {} ; 
        let schema: any = null;

        if (it.schema && it.schema?.$ref) {
            schema = getDefinitions(it.schema, definitions)
        } else {
            schema = it.schema;
        }

        const inputValues = {...(getFieldValue(it.name) || {})}

        return (
            <Row style={{paddingTop: 10}} key={`key-${it.name}`}>
                <Col span={4} style={{wordBreak: 'break-all'}}>
                    {it.name}
                    {it.required ? <div style={{color: 'gray', fontSize: 11, fontStyle: 'italic'}}>(required)</div> : ''}
                </Col>
                <Col span={20}>
                    description - {it.description}
                    <ObjectInput inputValues={inputValues} item={it} schema={schema} onChange={handleChangeValue} />
                </Col>
            </Row>
        )

    }

    function createFormType (type: string|string[], func: any) {
        const parameters = dataSource.filter(it => type.includes(it.in))
        const title = (
            <span style={{fontSize: 16, textTransform: 'capitalize',}}>
                {type} 
                &nbsp;
                <Badge count={parameters.length} />
            </span>  
        )

        return (parameters.length) && (
            <Tabs.TabPane tab={title} key={`${type}`}>
                {dataSource.filter(it => type.includes(it.in)).map(func)}
            </Tabs.TabPane>
        )
    }

 return (
     <div>
        <div>

        {dataSource.length > 0 && (
            <div style={{marginBottom: 15}}>
                <Button type="primary" size="large" onClick={() => sendApi()} loading={isLoading} style={{width: '100%'}}>Submit</Button>
            </div>
        )}    

        <div style={{
                padding: 10, 
                backgroundColor: 'rgba(255, 255, 255, 1)', 
                boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 9px 2px',
                borderRadius: 4
            }}>
            <Tabs>
                {createFormType('path', createFormItem)}
                {createFormType('query', createFormItem)}
                {createFormType('formData', createFormItem)}        
                {createFormType('body', createFormItemBody)}
                {createFormType('header', createFormItem)}        
            </Tabs>
        </div>

        <div style={{marginTop: 15}}>
            <Button type="primary" size="large" onClick={() => sendApi()} loading={isLoading} style={{width: '100%'}}>Submit</Button>
        </div>

    </div>
</div>
 )   
}