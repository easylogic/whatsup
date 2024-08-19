
import React, { useState } from 'react';
import {Row, Col } from 'antd';
import FileInput from './FileInput';
import BooleanInput from './BooleanInput';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import TagsInput from './TagsInput';
import NumberInput from './NumberInput';
import JSONArrayInput from './JSONArrayInput';
import JSONObjectInput from './JSONObjectInput';
import { responseViewState } from '../../state/response-state';
import { useRecoilValue } from 'recoil';
import { clone, getDefinitionsSchema } from '../../util/get-definitions';
import TypeHelpViewer from '../viewer/TypeHelpViewer';
import { APIParameter } from '../../constant/api';

interface ObjectInputProps {
    item: any;
    schema: any;
    inputValues: any;
    onChange: (name: string, value: any) => void;
}

export default function SubObjectInput (props: ObjectInputProps) {
    const { item, schema, inputValues, onChange } = props; 
    const responseObject = useRecoilValue(responseViewState);    
    const [localInputValues, setLocalInputValues] = useState(inputValues);

    // console.log('subobject',localInputValues, inputValues);

    function onChangeField(field: string, value: any) {
        const customValues = {...localInputValues, [field]: value}
        onChange(item.name, JSON.stringify(customValues, null, 4));
        setLocalInputValues(customValues)        
    }

    function getFieldValue (name: string) {
        return inputValues[name]
    }

    function createFormItem (it: APIParameter, index: number) {    

        let schema = null; 
        if (it.schema.type === 'array') {
            if (it.items.$ref) {
                schema = getDefinitionsSchema(it.items, responseObject.definitions)
            }
        } else if (it.$ref) {
            schema = getDefinitionsSchema(it, responseObject.definitions)            
        }

        const localValues = clone(getFieldValue(it.name))

        return (
    
            <Row style={{padding: 10}} key={`row-${index}`}>
                <Col span={3} style={{textAlign: 'right'}}>{it.name} &nbsp;</Col>
                <Col span={21}>
  
                {it.schema.type === 'file' && (
                    <FileInput item={it} inputValues={localValues} onChange={onChangeField} />
                )}
                {it.schema.type === 'boolean' && (
                    <BooleanInput item={it}  inputValues={localValues} onChange={onChangeField} />
                )}
    
                {(it.schema.type === 'object') && ( 
                    <TextInput item={it}  inputValues={localValues} onChange={onChangeField} />
                )}

                {(it.schema.type === 'string' && Boolean(it.enum) === false) && (  // enum 이 없으면 일반 텍스트 
                    <TextInput item={it} inputValues={localValues} onChange={onChangeField} />
                )}                
    
                {(it.schema.type === 'string' && it.enum) && (     // enum 이 있으면 고정된 텍스트 , select 로 표현 
                    <SelectInput item={it} inputValues={localValues} onChange={onChangeField} />
                )}
    
                {(it.schema.type === 'array' && it.enum) && (     // enum 이 있으면 고정된 텍스트 , select 로 표현 
                    <SelectInput item={it} inputValues={localValues} onChange={onChangeField} />                
                )}              
    
                {(it.schema.type === 'array' && it.collectionFormat) && (     
                    <TagsInput item={it} inputValues={localValues} onChange={onChangeField} />
                )}                  

                {(it.schema.type === 'array' && it.items && it.items.type) && (     
                    <TagsInput item={it} inputValues={localValues} onChange={onChangeField} />
                )} 

                {(it.schema.type === 'array' && it.items && it.items.$ref) && (     
                    <JSONArrayInput item={it} schema={schema} inputValues={localValues} onChange={onChangeField} />
                )}

                {(it.$ref) && (
                    <JSONObjectInput item={it} schema={schema} inputValues={localValues} onChange={onChangeField} />
                )}
    
                {['number', 'integer', 'float', 'double', 'int32', 'int64'].includes(it.schema.type) && (
                    <NumberInput item={it} inputValues={localValues} onChange={onChangeField} />
                )}
    
                <TypeHelpViewer item={it} schema={schema} />
                </Col>            
            </Row>
        )
    }

    return (
        <div style={{padding: '0 10px', border: '1px solid #ececec', borderRadius: 4}}>
            {Object.keys(schema?.properties || []).map((key: string, index: number) => {
                return createFormItem({ 
                    name: key, 
                    ...schema.properties[key], 
                }, index)
            })}
        </div>                        
    )
}