<script>
    import "./editor.css";
    import { onMount } from "svelte";
    import {basicSetup as CodeBasicSetup} from "codemirror";
    import {EditorView } from "@codemirror/view";
    import {Compartment} from "@codemirror/state";
    import {markdown} from "@codemirror/lang-markdown";

    let languageConf = new Compartment;
    let codeElement;
    let _codeEditorView;

    onMount(() => {
        _codeEditorView = new EditorView({
            parent: codeElement,
            doc: "Hello world",
            extensions: [
                CodeBasicSetup,
                languageConf.of(markdown())
            ]
        });
    });
</script>
<div bind:this={codeElement} class="editor" style="height: 300px; overflow: scroll"></div>
