export interface Group {
  id: string;
  name: string;
  faculty?: Faculty;
}

export interface Faculty {
  id: string;
  name: string;
  groups: Group[];
}
