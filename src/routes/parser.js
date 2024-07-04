// Code source inspired by https://github.com/erykwalder/lezer-markdown-obsidian/blob/6223674c535addf0fa60c8a04e3ebf5fd8aa3d7e/src/extensions.ts#L1
import {
    parser as defParser,
} from "@lezer/markdown";

export const InternalLink = {
    defineNodes: [
        "InternalLink",
        "InternalMark",
        "InternalPath",
        "InternalSubpath",
        "InternalDisplay"
    ],
    parseInline: [
        {
            name: "InternalLink",
            parse(cx, _, pos) {
                const el = parseInternalLink(cx, pos);
                if (el) {
                    return cx.addElement(el);
                }
                return -1;
            },
            before: "Link",
        }
    ],
};

function parseInternalLink(cx, pos) {
    if (
        cx.char(pos) != 91 /* [ */ ||
            cx.char(pos + 1) != 91 ||
            !isClosedLink(cx, pos)
    ) {
        return null;
    }
    const contents = [];
    contents.push(cx.elt("InternalMark", pos, pos + 2));
    pos = cx.skipSpace(pos + 2);
    const path = parsePath(cx, pos - cx.offset, cx.offset);
    if (path) {
        contents.push(path);
        pos = cx.skipSpace(path.to);
    }
    const subpath = parseSubpath(cx, pos);
    if (subpath) {
        contents.push(subpath);
        pos = cx.skipSpace(subpath.to);
    }
    if (path == null && subpath == null) {
        return null;
    }
    if (cx.char(pos) == 124 /* | */) {
        contents.push(cx.elt("InternalMark", pos, pos + 1));
        pos += 1;
        const display = parseDisplay(cx, pos);
        if (display) {
            contents.push(display);
            pos = cx.skipSpace(display.to);
        }
    }
    contents.push(cx.elt("InternalMark", pos, pos + 2));
    return cx.elt(
        "InternalLink",
        contents[0].from,
        contents[contents.length - 1].to,
        contents
    );
}

function isClosedLink(cx, start) {
    for (let pos = start + 2; pos < cx.end; pos++) {
        if (cx.char(pos) == 91 /* [ */ && cx.char(pos + 1) == 91) {
            return false;
        } else if (cx.char(pos) == 93 /* ] */ && cx.char(pos + 1) == 93) {
            // return false for empty
            // true otherwise
            return pos > start + 2;
        }
    }
    return false;
}

function parsePath(
    cx,
    start,
    offset
) {
    // anything but: |[]#^\/
    const match = /^[^[\]|#^\\/]+/.exec(cx.text.slice(start));
    if (match) {
        return cx.elt(
            "InternalPath",
            offset + start,
            offset + start + match[0].length
        );
    }
    return null;
}

function parseSubpath(cx, start) {
    if (cx.char(start) != 35 /* # */) {
        return null;
    }
    for (let pos = start + 1; pos < cx.end; pos++) {
        if (
            cx.char(pos) == 124 /* | */ ||
                (cx.char(pos) == 93 /* ] */ && cx.char(pos + 1) == 93)
        ) {
            return cx.elt("InternalSubpath", start, pos);
        }
    }
    return null;
}

function parseDisplay(cx, start) {
    for (let pos = start; pos < cx.end; pos++) {
        if (cx.char(pos) == 93 /* ] */ && cx.char(pos + 1) == 93) {
            if (pos == start) {
                return null;
            }
            return cx.elt("InternalDisplay", start, pos);
        }
    }
    return null;
}

export const Extensions = [
    InternalLink
];

export const parser = defParser.configure(Extensions);
