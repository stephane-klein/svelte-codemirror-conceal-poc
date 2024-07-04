<script>
    import "./editor.css";
    import { onMount } from "svelte";
    import { basicSetup as CodeBasicSetup } from "codemirror";
    import { EditorView } from "@codemirror/view";
    import { EditorState, Compartment } from "@codemirror/state";
    import { markdown } from "@codemirror/lang-markdown";
    import { Extensions } from "./parser.js";
    import wikiPlugin from "./plugin.js";

    let languageConf = new Compartment;
    let codeElement;
    let _codeEditorView;

    onMount(() => {
        _codeEditorView = new EditorView({
            parent: codeElement,
            state: EditorState.create({
                doc: `This is a [[markdown]] text containing several [[WikiLink|Wiki links]].

For example, one [[WikiLink]] without Alias and another [[WikiLink|WikiLink with Alias]].`,
                extensions: [
                    CodeBasicSetup,
                    wikiPlugin,
                    languageConf.of(markdown({
                        extensions: [
                            Extensions
                        ]
                    }))
                ],
            })
        });
    });
</script>
<div bind:this={codeElement} class="editor" style="height: 300px; overflow: scroll"></div>
