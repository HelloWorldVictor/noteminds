// This file provides a hook to detect if the user is on a mobile device.
// It checks the screen width and updates when the window is resized.

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
   // Track changes to the screen size using a media query
   const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
   const onChange = () => {
     setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
   }
   mql.addEventListener("change", onChange)
   setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
   return () => mql.removeEventListener("change", onChange)
 }, [])

  return !!isMobile
}
