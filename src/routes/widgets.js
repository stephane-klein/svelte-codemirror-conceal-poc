import { Decoration, WidgetType } from "@codemirror/view";

export const invisibleDecoration = Decoration.replace({});

// Inspiration: https://github.com/silverbulletmd/silverbullet/blob/73a427fe48cdf1638bec86aac7a901d4ccbd6c96/web/cm_plugins/util.ts#L14
export class LinkWidget extends WidgetType {
    constructor(options) {
        super();
        this.options = options;
    }
    toDOM() {
        const element = document.createElement("span");
        element.textContent = this.options.text;
        element.className = "wikilink";

        element.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        element.addEventListener("mouseup", (e) => {
            if (e.button !== 0) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            try {
                this.options.callback(e);
            } catch (e) {
                console.error("Error handling wiki link click", e);
            }
        });

        return element;
    }

    eq(other) {
        return other instanceof LinkWidget &&
            this.options.from === other.options.from &&
            this.options.text === other.options.text
    }
}
