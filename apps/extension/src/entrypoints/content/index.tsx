import ReactDOM from "react-dom/client";
import { App } from "./app";
import "@/styles/globals.css";

export default defineContentScript({
  matches: ["https://alueducation.instructure.com/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "noteminds-ui",
      position: "inline",
      anchor: "body",
      append: "first",
      onMount: (container) => {
        // Don't mount react app directly on <body>
        const wrapper = document.createElement("div");
        container.append(wrapper);

        const root = ReactDOM.createRoot(wrapper);
        root.render(<App />);
        return { root, wrapper };
      },
      onRemove: (elements) => {
        elements?.root.unmount();
        elements?.wrapper.remove();
      },
    });

    ui.mount();
  },
});
