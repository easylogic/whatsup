
import React, { useState } from 'react';
import {Tabs, Row, Col } from 'antd';
import FileInput from './FileInput';
import BooleanInput from './BooleanInput';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import SelectInput from './SelectInput';
import TagsInput from './TagsInput';
import NumberInput from './NumberInput';
import JSONArrayInput from './JSONArrayInput';
import { apiViewState, categoryViewState, responseViewState } from '../../state/response-state';
import { useRecoilValue } from 'recoil';
import { getApiJSON, getDefinitionsSchema } from '../../util/get-definitions';
import TypeHelpViewer from '../viewer/TypeHelpViewer';
import SubObjectInput from './SubObjectInput';
import { APIParameter } from '../../constant/api';


const { TabPane } = Tabs;

interface Data {
    [key: string]: any;
}

interface ObjectInputProps {
    item: any;
    schema: any;
    inputValues: Data;       // 해당 객체의 값 
    onChange: (name: string, value: any) => void;
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



export default function ObjectInput (props: ObjectInputProps) {
    const { item, schema, inputValues = {}, onChange } = props; 
    const category = useRecoilValue(categoryViewState);
    const responseObject = useRecoilValue(responseViewState);    
    const json = getApiJSON(category);       
    const [localInputValues, setLocalInputValues] = useState(inputValues);

    function onChangeField(field: string, value: any) {
        const customValues = {...localInputValues, [field]: value}
        onChange(item.name, customValues);
        setLocalInputValues(customValues)      
    }

    function onChangeValues(valueString: string) {
        const customValues = JSON.parse(valueString)
        onChange(item.name, customValues);
        setLocalInputValues(customValues)        
    }

    function createFormItem (it: APIParameter, rowIndex: number) {

        const itemType = it.schema?.type || it.type;

        let schema = null; 
        if (itemType === 'array') {
            if (it.items.$ref) {
                schema = getDefinitionsSchema(it.items, responseObject.definitions || json.components)
            }
        } else if (it.$ref) {
            schema = getDefinitionsSchema(it, responseObject.definitions || json.components)            
        }

        return (
    
            <Row style={{paddingTop: 10}} key={`row-${rowIndex}`}>
                <Col span={4} style={{wordBreak: 'break-all'}}>{it.name} &nbsp;</Col>
                <Col span={20}>
                    {itemType === 'file' && (
                        <FileInput item={it} inputValues={localInputValues[it.name]} onChange={onChangeField} />
                    )}
                    {itemType === 'boolean' && (
                        <BooleanInput item={it} inputValues={localInputValues[it.name]} onChange={onChangeField} />
                    )}
        
                    {(itemType === 'string' && Boolean(it.enum) === false) && (  // enum 이 없으면 일반 텍스트 
                        <TextInput item={it} inputValues={localInputValues[it.name]} onChange={onChangeField} />
                    )}
        
                    {(itemType === 'string' && it.enum) && (     // enum 이 있으면 고정된 텍스트 , select 로 표현 
                        <SelectInput item={it} inputValues={localInputValues[it.name]} onChange={onChangeField} />
                    )}
        
                    {(itemType === 'array' && it.enum) && (     // enum 이 있으면 고정된 텍스트 , select 로 표현 
                        <SelectInput item={it} inputValues={localInputValues[it.name]} onChange={onChangeField} />                
                    )}              
        
                    {(itemType === 'array' && it.collectionFormat) && (     
                        <TagsInput item={it} inputValues={localInputValues[it.name]} onChange={onChangeField} />
                    )}                  

                    {(itemType === 'array' && it.items && it.items.type) && (     
                        <div><TagsInput item={it} inputValues={localInputValues[it.name]} onChange={onChangeField} /></div>
                    )} 

                    {(itemType === 'array' && it.items && (it.items.$ref || it.items.properties)) && (     
                        <JSONArrayInput item={it} schema={it}  inputValues={localInputValues[it.name]} onChange={onChangeField} />
                    )}                                                  

                    {(it.$ref || it.properties) && (
                        <SubObjectInput item={it} schema={it}  inputValues={localInputValues[it.name] || {}} onChange={(name, value) => {
                            onChangeField(name, JSON.parse(value))
                        }} />
                    )}
        
                    {['number', 'integer', 'float', 'double', 'int32', 'int64'].includes(itemType) && (
                        <NumberInput item={it}  inputValues={localInputValues[it.name]} onChange={onChangeField} />
                    )}
        
                    <TypeHelpViewer item={it} schema={schema?.properties || {}} />
                </Col>
            </Row>

        )
    }

    const inputValueJSONString = localInputValues ? JSON.stringify(localInputValues, null, 4) : schemaToJSON(schema.properties || {}, responseObject.definitions || json.components);

    return (
        <Tabs defaultActiveKey="1">
            <TabPane tab="Data" key="1">
                <div style={{padding: '5px 10px', border: '1px solid #ececec', borderRadius: 4}}>
                    {Object.keys(schema?.properties || []).map((key, index) => {
                        return createFormItem({ 
                            name: key, 
                            ...schema.properties[key], 
                        }, index)
                    })}  
                </div>
            </TabPane>
            <TabPane tab="JSON String" key="2">
                <TextAreaInput inputValues={inputValueJSONString} onChange={(value: string) => {
                    try {
                        onChangeValues(value)
                    } catch (error) {
                        console.log((error as any).message)
                    }
                }}/>
            </TabPane>
            <TabPane tab="Parameter Definition" key="3">
                <pre style={{
                        backgroundColor: 'white',
                        fontSize: 11, 
                        whiteSpace: 'pre-wrap', 
                        wordBreak:'break-all',
                        maxHeight: 500,
                        overflow: 'auto',
                        border: '1px solid #ececec',
                    }}>{JSON.stringify(schema, null, 4)}</pre>
            </TabPane>
        </Tabs>
    )
}