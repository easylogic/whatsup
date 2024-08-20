
import React, { useState } from 'react';
import {Row, Col, Button } from 'antd';

import SubObjectInput from './SubObjectInput';
import { useRecoilValue } from 'recoil';
import { getDefinitions, clone, getApiJSON } from '../../util/get-definitions';
import { apiViewState, categoryViewState, responseViewState } from '../../state/response-state';
import NumberInput from './NumberInput';
import BooleanInput from './BooleanInput';
import SelectInput from './SelectInput';
import TagsInput from './TagsInput';
import TextInput from './TextInput';
import JSONObjectInput from './JSONObjectInput';
import TypeHelpViewer from '../viewer/TypeHelpViewer';
import { APIParameter } from '../../constant/api';

interface JSONInputProps {
    item: any;
    schema: any;
    inputValues: Data[];
    onChange: (name: string, value: any) => void;
}

interface Data {
    [key: string]: any;
}

export default function JSONArrayInput (props: JSONInputProps) {
    const { item, schema, inputValues = [], onChange } = props; 
    const category = useRecoilValue(categoryViewState);
    const json = getApiJSON(category);       
    const responseObject = useRecoilValue(responseViewState);    
    const [localInputValues, setLocalInputValues] = useState(inputValues);

    const itemType = item?.schema?.type || item.type;
    const properties = ( schema?.properties || item.items.properties || {})

    const inputList = Object.keys(properties||{}).map(key => {
         return { key, value: properties[key] } as any 
     })  


    function changeFieldValue (index: number, name: string, value: any) {

        //  데이타 넣는 방식을 바꿔야 할 듯 
        const customValues = localInputValues || [];

        if (customValues[index] && customValues[index][name]) {
            customValues[index][name] = value; 
        } else if (customValues[index]) {
            customValues[index][name] = value
        } else {
            customValues[index] = { [name] : value } 
        }

        onChange(item.name, customValues);
        setLocalInputValues(customValues)
    }

    function addList () {
        const customValues = localInputValues || [];

        let data : {[key: string]: any} = {}
        inputList.forEach(input => {
            data[input.key] = "" 
        })

        customValues.push(data as any);
        onChange(item.name, customValues);  
        setLocalInputValues([...customValues])              
    }

    function deleteItem(index: number) {
        const customValues = localInputValues || [];        
        customValues.splice(index, 1)
        onChange(item.name, customValues);  
        setLocalInputValues([...customValues])
    }

    function onChangeField(index: number, field: string, value: any) {
        changeFieldValue(index, field, value);
    }

    function getFieldValue (index: number, name: string) {
        return inputValues[index] && inputValues[index][name]
    }

    function makeNoSchemaInput (index: number, key: string, it: APIParameter, schema: any) {

        it = {...it, name: key}
        const arrayInputValues = clone(getFieldValue(index, key))
        const itemType = it.schema?.type || it.type;

        if(['number', 'integer', 'float', 'double', 'int32', 'int64'].includes(itemType)) {
            return <NumberInput item={it} inputValues={arrayInputValues} onChange={(_: any, value) => {
                onChangeField(index, key, value)
            }} />
        }

        if (itemType === 'boolean') {
            return <BooleanInput item={it} inputValues={Boolean(arrayInputValues)} onChange={(_: any, value) => {
                onChangeField(index, key, value)
            }} />
        }

        if(itemType === 'string' && Boolean(it.enum) === false) {
            return <TextInput item={it} inputValues={arrayInputValues} onChange={(_: any, value) => {
                onChangeField(index, key, value)
            }} />
        }

        if (itemType === 'string' && it.enum) {
            return <SelectInput item={it} inputValues={arrayInputValues} onChange={(_: any, value) => {
                onChangeField(index, key, value)
            }} />            
        }
    

        if(itemType === 'array' && it.enum) {
            return <SelectInput item={it} inputValues={arrayInputValues} onChange={(_: any, value) => {
                onChangeField(index, key, value)
            }} />
        }

        if(itemType === 'array' && it.collectionFormat) {
            return <TagsInput item={it} inputValues={arrayInputValues} onChange={(_: any, value) => {
                onChangeField(index, key, value)
            }} />
        }

        if (itemType === 'array' && it.items && it.items.type)  {
            return <TagsInput item={it} inputValues={arrayInputValues} onChange={(_: any, value) => {
                onChangeField(index, key, value)
            }} />
        }

        if (!itemType) {
            return <TextInput item={{...it, ...schema}} inputValues={arrayInputValues}  onChange={(_: any, value) => {
                onChangeField(index, key, value)
            }} />
        }

        return undefined;
    }

    function makeSchemaInput (index: number, key: string, it: APIParameter, schema: any) {

        
        it = {...it, name: key}
        const arrayInputValues = clone(getFieldValue(index, key))

        if(schema && itemType === 'array') {
            return <JSONArrayInput item={{...schema, name: key}}  inputValues={arrayInputValues}  schema={schema} onChange={(_, value) => {
                onChangeField(index, key, value)
            }} />
        }

        if (schema && schema.type === 'object' && !schema.properties)  {
            return <JSONObjectInput item={it}  inputValues={arrayInputValues}  schema={schema} onChange={(_, value) => {
                onChangeField(index, key, value)
            }} />
        }

        if (schema && schema.type === 'object' && schema.properties)  {
            return <SubObjectInput  inputValues={arrayInputValues || {}}  item={it} schema={schema} onChange={(name, value) => {
                onChangeField(index, key, value)
            }} />
        }        

        // {(schema && (!it.type?.$ref || it.type !== 'array'|| (schema.type === 'object' && schema.properties) )) && (
        //     <SubObjectInput inputValues={subInputValues} item={it} schema={schema} onChange={(_, value) => {
        //         onChangeField(index, inputItem.key, value)
        //     }} />
        // )}

        return undefined;
    }
    
    return (
        <div style={{
            border: '1px solid #ececec',
            padding: 5, 
            borderRadius: 4
        }}> 
            <div>
                <Button type="primary" size="small" onClick={addList}>Add</Button>         
                &nbsp;{schema?.title}   
            </div>           

            {localInputValues.map( (listItem: any, index: number) => {
                return <div key={`index-${index}`}>
                    <hr style={{border: 'none', borderTop: '1px solid #ececec'}} />                       
                    {inputList.map(inputItem => {
                        const it = inputItem.value as APIParameter; 
                        const itemType = it.schema?.type || it.type;

                        let schema = null; 
                        if (itemType === 'array') {
                            if (it.items.$ref) {
                                schema = getDefinitions(it.items, responseObject.definitions || json.components)
                            }
                        } else if (it.$ref) {
                            schema = getDefinitions(it, responseObject.definitions || json.components)            
                        }

                        const hasSchema = Boolean(schema)
                        const hasNotSchema = !hasSchema;

                        return (
                            <Row key={inputItem.key} style={{marginBottom: 1}}>
                                <Col span={4}> {inputItem.key} </Col>
                                <Col span={20}>

                                    {((hasNotSchema) && makeNoSchemaInput(index, inputItem.key, it, schema))}
                                    {((hasSchema) && makeSchemaInput(index, inputItem.key, it, schema))}
                                    
                                    <TypeHelpViewer item={it} schema={schema} />
                                </Col>
                            </Row>
                        )
                    })}
                    <div style={{textAlign: "right"}}>
                        <Button type="primary" size="small" danger onClick={() => deleteItem(index)}>Delete</Button>
                    </div>
                 
                </div>
            })}
        </div>
    )
}