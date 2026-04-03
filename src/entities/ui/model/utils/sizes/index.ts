import { ScreenFormats } from '../../../types';


/**
 * Возвращает ширину экрана
 */
export const getScreenSize = (): number => document.documentElement.clientWidth;


export const isMobile  = (size: number) => size > 0 && size < 600;
export const isTablet  = (size: number) => size >= 600 && size < 960;
export const isLaptop  = (size: number) => size >= 960 && size < 1280;
export const isDesktop = (size: number) => size >= 1280;

// breakpoints: {
//   values: {
//     xs: 0,    // mobile
//     sm: 600,  // tablet
//     md: 960,  // laptop
//     lg: 1280, // desktop
//     xl: 1920,
//   },
// },



/**
 * Возвращает все утверждённые форматы
 */
export const getScreenFormats = (size: number): ScreenFormats => ({
  isMobile  : isMobile(size),
  isTablet  : isTablet(size),
  isLaptop  : isLaptop(size),
  isDesktop : isDesktop(size)
});


/**
 * True if display > 960px (not mobile & table)
 */
export const isGreaterMd = (sf: ScreenFormats) => {
  if (sf?.isMobile || sf?.isTablet) return false;
  return true;
};
