import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

declare global {
  declare module '*.scss' {
    interface IClassNames {
      [className: string]: string
    }
    const classNames: IClassNames
    export = classNames
  }


  declare const __IS_DEV__: boolean
  declare const __API_URL__: string
  declare const __PROJECT__: BuildProject


  type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>
  } : T

  type OptionalRecord<K extends keyof any, T> = {
    [P in K]?: T
  }

  // type OptionalRecord<K extends keyof any, T> = {
  //   [P in K]: T
  // }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  type MuiIcon = OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string; }

  declare module '*.png' {
    const value: string;
    export default value;
  }

  declare module '*.jpg' {
    const value: string;
    export default value;
  }

  declare module '*.jpeg' {
    const value: string;
    export default value;
  }

  declare module '*.gif' {
    const value: string;
    export default value;
  }

  declare module '*.png'
  declare module '*.jpg'
  declare module '*.jpeg'
  declare module '*.gif'

  declare module '*.svg' {
    import React from 'react'

    const SVG: React.VFC<React.SVGProps<SVGSVGElement>>
    export default SVG
  }
}
