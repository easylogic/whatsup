export interface Schema {
    $ref: string;
}

export interface APIParameter {
    type: string;
    enum: string[],
    in: "header" | "path" | "query" | "body" | "formData";
    name: string;
    required: string;
    schema: Schema;
    description: string;
}

export interface APIResponse {

}

export interface APISummary {
    summary: string; 
    description: string;
    parameters: APIParameter[];
    responses: APIResponse[];
}


export interface APIData {
    method: string;
    path: string;
    object?: APISummary;
}