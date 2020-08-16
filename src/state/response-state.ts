import { atom } from 'recoil';
import { getApiJSON, getApiObject, getCategoryName, getSelectedOpenMenu, getSelectedMenuItem } from '../util/get-definitions';

const json = getApiJSON()

export const responseState = atom({
    key: 'response',
    default: {
      api: getApiObject(),
      requestObject: {},
      responseObject: {},
      definitions: json?.definitions as {[key:string]: any}
    }
})


export const categoryState = atom({
  key: 'category', 
  default: getCategoryName(), 
});

export const menuState = atom({
  key: 'menu', 
  default: getSelectedOpenMenu(), 
});

export const menuItemState = atom({
  key: 'menuItem', 
  default: getSelectedMenuItem(), 
});

export const apiState = atom({
  key: 'api', 
  default: getApiObject(), 
});