export interface SingUp {
  username: string;
  email: string;
  last_name?: string;
  first_name?: string;
  password: string;
  passwordconfirmation: string;
}

export interface loginData {
  username: string;
  password: string;
}

export interface User {
  id:number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  username: string;
  birthdate: null | string;
  is_admin: boolean;
  team: string;
  team_was_created: boolean;
  team_id?:number
}

export interface userList{
  username:string;
}



export interface authUser{
  username:string,
  id:number,
  teamName:string,
  teamId:number

}

