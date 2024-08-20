
import React from 'react';
import {Select } from 'antd';

interface TagsInputProps {
    item: any;
    inputValues: any;    
    onChange: (name: string, value: any) => void;
}

export default function TagsInput (props: TagsInputProps) {
    const { item, inputValues, onChange } = props; 
    const items = item.schema.items || item.items || {};

    function changeFieldValue (value: string[]|number[]) {
        onChange(item.name, value);
    }

    return <Select 
                mode="tags" 
                style={{ width: '100%' }} 
                placeholder={item.description} 
                value={inputValues || []}
                onChange={(value) => {
                    value = `${value}`.split(',').filter(Boolean)

                    if (items.type === 'integer') {
                        value = value.map((n: string) => +n)
                    }

                    changeFieldValue(value)
                }}
            >
                {(items.enum || []).map((en:string) => {
                    return <Select.Option key={en} value={en}>{en}</Select.Option>
                })}                
            </Select>

}