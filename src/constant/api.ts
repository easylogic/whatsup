export interface Schema {
    $ref: string;
    type: string;
    format: string;
    items: Schema;
    enum: string[];
    properties: {
        [key: string]: Schema;
    };
}

export interface APIParameter {
    type: string;
    enum: string[],
    in: "header" | "path" | "query" | "body" | "formData";
    name: string;
    required: string;
    schema: Schema;
    description: string;
    items: Schema;
    $ref: string;
    collectionFormat: string;
    properties: {
        [key: string]: Schema;
    };
}

export interface APIResponse {
    description: string;
    schema: Schema;
    content: {
        [key: string]: {
            schema: Schema;
        }
    }
}

export interface APISummary {
    summary: string; 
    description: string;
    parameters: APIParameter[];
    responses: APIResponse[];
    tags: string[];
    requestBody: {

        content: {
            [key: string]: {
                schema: Schema;
            }
        },
        description: string;
        required: boolean;
    };
    operationId: string;
}


export interface APIData {
    method: string;
    path: string;
    object?: APISummary;
}