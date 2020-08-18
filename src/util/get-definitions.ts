import { APIData } from "../constant/api"

import swaggerJSON from './swagger-json';

const OPEN_MENU_KEYS = 'selected-open-menu-keys'
const SELECTED_MENU_ITEM_KYES = 'selected-menu-item-keys'
const API_OBJECT = 'api-object'

export const firstCategory = Object.keys(swaggerJSON)[0];

export const getCategoryName = (): string => {
  return localStorage.getItem('category') || firstCategory
}

export  const setCategoryNameForLocalStorage = (category: string) => {
    localStorage.setItem('category', category);
}    

export const getApiJSON = (category?: string) => {
    return swaggerJSON[category || getCategoryName()]
}

export const getSelectedOpenMenu = (): string[] => {
  return JSON.parse(localStorage.getItem(OPEN_MENU_KEYS) || "[]")
}

export const setSelectedOpenMenuForLocalStorage = (it: any) => {
    localStorage.setItem(OPEN_MENU_KEYS, JSON.stringify(it));                    
}

export const getSelectedMenuItem = (): string[] => {
  return JSON.parse(localStorage.getItem(SELECTED_MENU_ITEM_KYES) || "[]")
}

export const setSelectedMenuItemForLocalStorage = (key: string) => {
    localStorage.setItem(SELECTED_MENU_ITEM_KYES, JSON.stringify([key]));
}

export const getApiObject = (): APIData => {


    if (localStorage.getItem(API_OBJECT)) {
        return JSON.parse(localStorage.getItem(API_OBJECT) || "{}")
    } else {

        const json = getApiJSON()

        const selectedOpenMenu = getSelectedOpenMenu()
        const selectedMenuItem = getSelectedMenuItem();

        let apiObject: any = {}
        selectedOpenMenu.forEach(group => {
            json.tagsKeys[group]
                .filter((it: any) => selectedMenuItem.includes(`${it.path}-${it.method}`))
                .forEach((it:any) => {
                    apiObject = it; 
                })
        })
    
        return apiObject;
    }

  
}

export const setApiObjectForLocalStorage = (apiObject: APIData) => {
    localStorage.setItem(API_OBJECT, JSON.stringify(apiObject));    
}

export const getRealReferenceName = (ref: string) => {
    const fullName = ref
            .split('definitions/')[1]


    const className = fullName.split(/»|«/g)
            .filter(Boolean)
            .pop() || ""

    return { fullName, className}
}

export function getDefinitions(item: any, definitions: any): any {

    if (item?.type === 'array') {
        if (item.items?.$ref) {
            return [
                getDefinitions(item.items, definitions)
            ]
        }
    }

    if (item?.$ref) {
        const refName = getRealReferenceName(item.$ref)
        const schema = definitions[refName.className]

        Object.keys(schema?.properties || {}).forEach(key => {
            let prop = schema.properties[key];

            if (prop.$ref) {
                schema.properties[key] = getDefinitions(prop, definitions)
            } else if (prop.items?.$ref) {
                schema.properties[key].items = getDefinitions(prop.items, definitions)
            }

            if (prop.type) {

                if (prop.type === 'array') { 
                    schema.properties[key] = [
                        prop.items
                    ]
                } else {
                    schema.properties[key] = [
                        prop.type,
                        prop.format ? `(${prop.format})` : ''
                    ].join('').trim()
                }


            }
        })

        const key = `${refName.fullName}`;

        let result = {
            [key]: schema.properties
        }

        return result; 
    }

    return item; 
}

export function clone (value: any) {
    return JSON.parse(JSON.stringify(value || ""));
}