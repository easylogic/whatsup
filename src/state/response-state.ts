import { atom, selector } from 'recoil';
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

export const responseViewState = selector({
  key: 'responseViewState',
  get: ({get}) => {
    return get(responseState);
  }
})


export const categoryState = atom({
  key: 'categoryState', 
  default: getCategoryName(), 
});

export const categoryViewState = selector({
  key: 'categoryViewState',
  get: ({get}) => {
    return get(categoryState)
  }
})

export const menuState = atom({
  key: 'menu', 
  default: getSelectedOpenMenu(), 
});

export const menuItemState = atom({
  key: 'menuItem', 
  default: getSelectedMenuItem(), 
});

export const apiState = atom({
  key: 'apiState', 
  default: getApiObject(), 
});

export const apiViewState = selector({
  key: 'apiViewState', 
  get: ({get}) => {
    return get(apiState);
  }
});