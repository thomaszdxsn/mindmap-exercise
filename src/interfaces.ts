export interface Node {
  id: string;
  parentId: string | null;
  childIds: string[];
  content: string;
}

export interface Result<R, E> {
  ok: boolean;
  data?: R;
  error?: E;
}
