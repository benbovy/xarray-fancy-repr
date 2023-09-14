export type Dims = string[];
export type DimInfo = {
  [key: string]: { size: number; hasIndex: boolean };
};

export type Attrs = {
  [key: string]: string;
};

export type Index = {
  coordNames: string[];
  inlineRepr: string;
  repr: string;
};

export type Variable = {
  name: string;
  hasIndex: boolean;
  dims: Dims;
  dtype: string;
  inlineRepr: string;
  attrs: Attrs;
  dataRepr: string;
  inMemory: boolean;
};
