export interface Schema {
    $ref: string;
    type: string;
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
}

export interface APIResponse {

}

export interface APISummary {
    summary: string; 
    description: string;
    parameters: APIParameter[];
    responses: APIResponse[];
    tags: string[];
    requestBody: {
        [key: string]: {
            content: {
                [key: string]: {
                    schema: Schema;
                }
            },
            description: string;
        };
    };
    operationId: string;
}


export interface APIData {
    method: string;
    path: string;
    object?: APISummary;
}