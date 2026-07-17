export interface Member{
    role: string;
    name: string;
}

export interface project{
    generation: string;
    subtitle: string;
    title:string;
    description: string;
    logo:File|null;
    banner:File|null;

}