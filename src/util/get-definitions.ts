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


export function getDefinitions(item: any, definitions: any) {
        
    if (item.$ref && definitions) {
        return definitions[item.$ref.split('definitions/')[1]]
    }

    return {} 
}

export function clone (value: any) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch (e) {
        return "";
    }

}