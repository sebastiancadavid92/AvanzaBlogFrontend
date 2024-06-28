export interface Post
    {
        id: number;
        author_name: string;
        author_id: number;
        title: string;
        excerpt: string;
        team_name: string;
        team_id: number;
        timestamp: string;
        comments: number;
        content:string;
        html:string
        likes: number;
        permission: {
            PUBLIC: string;
            AUTHOR:string;
            TEAM:string;
            AUTHENTICATED:string;
        },
        edit: boolean;
        liked:boolean;
        
    }


export interface newPost{
    title: string;
    content:string|undefined;
    html?:string;
    permission: {
        PUBLIC: string;
        AUTHOR:string;
        TEAM:string;
        AUTHENTICATED:string;
    }
}
export interface Comment{
    id: number,
    username: string,
    content:string;
    timestamp: string;
}

