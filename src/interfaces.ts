export interface Node {
  id: string;
  parentId: string | null;
  childIds: string[];
  content: string;
}
