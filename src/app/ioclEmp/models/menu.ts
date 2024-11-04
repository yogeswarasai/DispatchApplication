// export interface Menu {
//     menuId: string;
//     menuName: string;
//     parentMenuId?: string;
//     route: string;
//     icons:string;
//   }

// export interface MstMenu {
//   menuId: string;          // Corresponds to menuId in the backend
//   menuName: string;        // Corresponds to menuName in the backend
//   parentMenuId: string;    // Corresponds to parentMenuId in the backend
//   route: string;           // Corresponds to route in the backend
//   icons: string;           // Corresponds to material_icon in the backend
//   menuOrder: number;       // Corresponds to menuOrder in the backend
//   childMenus?: MstMenu[] | undefined; // Transient field for holding child menus
// }

export class MstMenu {
  menuId: string = ''; // Provide a default empty string
  menuName: string = '';
  parentMenuId: string = ''; // Default to "#" if undefined
  route: string = '';
  icons: string = '';
  menuOrder: number = 0;
  childMenus: MstMenu[] = [];
}
