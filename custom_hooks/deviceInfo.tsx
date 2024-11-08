import { v4 as uuidv4 } from "uuid";
export function getLocalDeviceIP() {
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent.toLowerCase();
    const determine = () => {
      const isTV =
        /(smart-tv|googletv|appletv|hbbtv|netcast|viera|dunehd|sonydtv|boxee|kylo|roku|vizio|espial|webos|tizen)/.test(
          userAgent
        );
      if (isTV) return "TV";

      // Check for mobile devices
      const isMobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
          userAgent
        );
      if (isMobile) return "Mobile";

      // Check for laptop/desktop devices
      const isDesktop = /windows|macintosh|linux|cros/.test(userAgent);
      if (isDesktop) return "Laptop/Desktop";

      return "Unknown";
    };
    const id = localStorage.getItem("unique_id");
    if (id) {
      return {
        id: id,
        type: determine()
      };
    } else {
      const uid = uuidv4();
      const id = localStorage.setItem("unique_id", uid);
      return {
        id: id,
        type: determine()
      };
    }
  }
}
