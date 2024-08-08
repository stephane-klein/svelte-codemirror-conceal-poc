# Svelte, CodeMirror conceal POC

My note in french about this POC: https://notes.sklein.xyz/Projets/Projet-8

Proof Of Concept of a conceal feature for [CodeMirror](https://codemirror.net/) applied on a WikiLink Markdown syntax: `[[Page|alias]]`.

```sh
$ mise install
$ pnpm install
$ pnpm run dev
$ firefox http://localhost:5173/
```

Features:

- WikiLink alias support;
- Click on 'Conceal Widget', move the cursor to Wikilink, and switch to edit mode.

To create this project, I drew heavily on the source code of the following projects:

- [`lezer-markdown-obsidian`](https://github.com/erykwalder/lezer-markdown-obsidian/), this file https://github.com/erykwalder/lezer-markdown-obsidian/blob/6223674c535addf0fa60c8a04e3ebf5fd8aa3d7e/src/extensions.ts#L1
- [`silverbullet`](https://github.com/silverbulletmd/silverbullet/), this file https://github.com/silverbulletmd/silverbullet/blob/73a427fe48cdf1638bec86aac7a901d4ccbd6c96/web/cm_plugins/wiki_link.ts#L51

Screencast:

![](screencast.gif)
