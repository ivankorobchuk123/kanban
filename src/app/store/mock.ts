export interface AssigneeOption {
    id: string | number;
    name: string;
    src: string;
  }


export const mockUsers = [
    {
        id: '1',
      src: '/images/avatar-1.jpg',
      name: 'John Doe',
    },
    {
        id: '2',
      src: '/images/avatar-2.jpg',
      name: 'Anna Doe',
    },
    {
        id: '3',
      src: '/images/avatar-3.jpg',
      name: 'Mike Doe',
    },
  ] as AssigneeOption[];