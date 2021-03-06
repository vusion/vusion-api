export default interface Block {
    id: string;
    name: string;
    title: string;
    version: string;
    category: string;
    description: string;
    labels?: Array<string>;
    author?: string;
    homepage?: string;
    dependencies?: string;
    created_at: string;
    updated_at: string;
    repository: string;
    registry: string;
    base: string;
    ui: string;
    screenshots: string;
    operatorId: string;
    ownerId: string;
    teamId: string;
    team: string;
    access: string;
}
