import data from '../data';

export interface CategoryInterface {
  [key: string]: {
    tagsKeys: {
      [key: string]: any[];
    };
    tags: any[];
    title: string;
    description: string;
    servers: {
      url: string;
    }[];
    basePath: string;
    definitions: DefinitionInterface;
    menus: any[];
    components?: {
      schemas: {
        [key: string]: {
          properties: {
            [key: string]: any;
          };
          required: string[];
          type: "object" | "array" | "string" | "number" | "boolean" | "integer" | "null" | "file" | "any" | "enum" | string;
        };
      };
      securitySchemes: {
        [key: string]: any;
      };
    };
  };
}

export interface DefinitionInterface {
  [key: string]: any;
}

function convertJSON(json: any) {
  const menus: any[] = [];
  let tagsKeys: any = {};
  Object.keys(json.paths).forEach((path) => {
    Object.keys(json.paths[path]).forEach((method) => {
      const m = json.paths[path][method];
      const result = {
        path,
        method,
        object: m,
      };
      m.tags.forEach((t: any) => {
        if (!tagsKeys[t]) {
          tagsKeys[t] = [];
        }

        tagsKeys[t].push(result);
      });

      menus.push(result);
    });
  });

  return {
    tagsKeys,
    tags: json.tags,
    title: json.info.title,
    description: json.info.description,
    host: json.host,
    basePath: json.basePath,
    definitions: json.definitions,
    servers: json.servers,
    components: json.components,
    menus,
  };
}


let apiData:CategoryInterface = {}
Object.keys(data).forEach((key: string) => {
  apiData[key] = convertJSON(data[key] as any) as any
})

export default apiData;
