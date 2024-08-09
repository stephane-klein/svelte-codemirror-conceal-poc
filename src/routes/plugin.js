import { ViewPlugin, Decoration } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { invisibleDecoration, LinkWidget } from "./widgets.js";

const pageLinkRegex = /^\[\[([^\]\|]+)(\|([^\]]+))?\]\]/;

function checkRangeOverlap(
    range1,
    range2,
) {
    return range1[0] <= range2[1] && range2[0] <= range1[1];
}

function isCursorInRange(state, range) {
    return state.selection.ranges.some((selection) =>
        checkRangeOverlap(range, [selection.from, selection.to])
    );
}

function wikiLinkDecorators(view) {
    let widgets = []
    // Inspiration https://github.com/silverbulletmd/silverbullet/blob/73a427fe48cdf1638bec86aac7a901d4ccbd6c96/web/cm_plugins/wiki_link.ts#L51
    syntaxTree(view.state).iterate({
        enter: ({ name, from, to }) => {
            if (name !== "InternalLink") {
                return;
            }

            const match = pageLinkRegex.exec(
                view.state.sliceDoc(from, to)
            );
            if (!match) return;
            const [_fullMatch, page, _pipePart, alias] = match;

            if (isCursorInRange(view.state, [from, to]) && view.hasFocus) {
                return
            }

            // Hide the whole thing
            widgets.push(
                invisibleDecoration.range(
                    from,
                    to,
                ),
            );

            widgets.push(
                Decoration.widget({
                    widget: new LinkWidget({
                        text: alias || page,
                        callback: () => {
                            return view.dispatch({
                                selection: { anchor: from + 2 },
                            });
                        }
                    })
                }).range(from),
            );
        }
    })
    return Decoration.set(widgets, true);
}

const wikilinkPlugin = ViewPlugin.fromClass(class {
    constructor(view) {
        this.decorations = wikiLinkDecorators(view)
    }

    update(update) {
        this.decorations = wikiLinkDecorators(update.view)
    }
}, {
    decorations: (v) => v.decorations
})

export default wikilinkPlugin;
