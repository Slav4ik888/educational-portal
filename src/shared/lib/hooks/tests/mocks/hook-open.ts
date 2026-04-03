export const mockHookOpen = {
  open: true,
  close: false,
  setOpen() {
    this.open  = true;
    this.close = false;
  },
  setClose() {
    this.close = true;
    this.open  = false;
  },

  isChange: false,
  setIsChange(bool: boolean) {
    this.isChange = bool;
  },
  confirm: false,
  setConfirm(bool: boolean) {
    this.confirm = bool;
  }
};

// export class mockHookOpen {
//   private open: boolean;
//   close: boolean;
//   isChange = false;
//   confirm  = false;

//   constructor(initOpen?: boolean, initIsChange?: boolean) {
//     this.open     = initOpen     || false;
//     this.close    = !initOpen    || true;
//     this.isChange = initIsChange || false;
//   }

//   setOpen(bool: boolean) {
//     this.open  = bool;
//     this.close = !bool;
//   }

//   setClose(bool: boolean) {
//     this.open  = bool;
//     this.close = !bool;
//   }
//   setIsChange
//   , setConfirm
// }
