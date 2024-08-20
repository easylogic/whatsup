
import React from 'react';
import {Select } from 'antd';

interface TagsInputProps {
    item: any;
    inputValues: any;    
    onChange: (name: string, value: any) => void;
}

export default function TagsInput (props: TagsInputProps) {
    const { item, inputValues, onChange } = props; 
    const items = item.schema?.items || item.items || {};

    function changeFieldValue (value: string[]|number[]) {
        onChange(item.name, value);
    }

    return <div><Select 
                mode="multiple" 
                style={{ width: '100%' }} 
                placeholder={item.description} 
                value={inputValues || []}
                allowClear
                options={(items.enum || []).map((en:string) => {
                    return { value: en, label: en}
                }) || []}
                onChange={(value) => {
                    value = `${value}`.split(',').filter(Boolean)

                    if (items.type === 'integer') {
                        value = value.map((n: string) => +n)
                    }

                    changeFieldValue(value)
                }}
            />      
            </div>

}