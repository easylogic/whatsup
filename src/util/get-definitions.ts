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

    if (ref.includes('definitions')) {

    const fullName = ref
            .split('definitions/')[1]


    const className = fullName.split(/»|«/g)
            .filter(Boolean)
            .pop() || ""

    return { fullName, className}

    } 

    if (ref.includes('components')) {
        const fullName = ref.split('#')[1];

        const className = fullName.split('/').pop() || ""

        return { fullName, className}
    }

    return {
        fullName: '',
        className: ''
    }
}

export function getDefinitionsSchema(item: any, definitions: any) : any {
    if (item?.$ref) {
        const refName = getRealReferenceName(item.$ref)
        return definitions[refName!.className]
    }

    return {}
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
        let schema = definitions?.[refName.className] || {}
        let properties = schema?.properties || {}
        let newProperties = {} as {[key: string]: any}
        Object.keys(properties).forEach(key => {
            let prop = properties[key];

            newProperties[key] = clone(prop)

            if (prop.$ref) {
                newProperties[key] = getDefinitions(prop, definitions)
            } else if (prop.items?.$ref) {
                newProperties[key].items = getDefinitions(prop.items, definitions)
            }

            if (prop.type) {

                if (prop.type === 'array') { 
                    newProperties[key] = [
                        newProperties[key].items
                    ]
                } else {
                    newProperties[key] = [
                        prop.type,
                        prop.format ? `(${prop.format})` : ''
                    ].filter(Boolean).join('')
                }


            }
        })

        const objectKey = `${refName.fullName}`;

        let result = {
            [objectKey]: newProperties
        }

        return result; 
    }

    return item; 
}

export function clone (value: any) {
    return JSON.parse(JSON.stringify(value || ""));
}