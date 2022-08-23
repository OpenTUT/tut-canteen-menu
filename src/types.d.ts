export type MenuItem = {
  name: string;
  nutrients: [string, string][];
  allergens: [string, boolean][];
};

export type Menu = {
  [key: string]: {
    [key: string]: {
      [key: string]: MenuItem;
    };
  };
};
