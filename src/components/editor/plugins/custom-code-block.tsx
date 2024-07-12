// eslint-disable-next-line
// @ts-nocheck
import { Node, mergeAttributes } from '@tiptap/core';
import CodeBlock from '@tiptap/extension-code-block';

const CodeBlockWithCopy = Node.create({
  name: 'codeBlockWithCopy',

  addOptions() {
    return {
      languageClassPrefix: 'language-',
      HTMLAttributes: {},
    };
  },

  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      language: {
        default: null,
        parseHTML: (element) => {
          const classList = Array.from(element.classList);
          const languageClassPrefix = this.options.languageClassPrefix;
          const languageClass = classList.find((item) =>
            item.startsWith(languageClassPrefix),
          );
          return languageClass
            ? languageClass.replace(languageClassPrefix, '')
            : null;
        },
        renderHTML: (attributes) => {
          if (!attributes.language) {
            return null;
          }

          return {
            class: this.options.languageClassPrefix + attributes.language,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      [
        'code',
        { class: this.options.languageClassPrefix + node.attrs.language },
        0,
      ],
    ];
  },

  addCommands() {
    return {
      setCustomCodeBlock:
        (attributes) =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes);
        },
      toggleCustomCodeBlock:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', attributes);
        },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('pre');
      const code = document.createElement('code');
      code.className = this.options.languageClassPrefix + node.attrs.language;
      code.textContent = node.textContent;

      const button = document.createElement('span');
      button.textContent = 'Copy';
      button.className = 'copy-button';

      button.addEventListener('click', () => {
        navigator.clipboard.writeText(node.textContent);
      });

      dom.appendChild(button);
      dom.appendChild(code);

      return {
        dom,
        contentDOM: code,
        update: (updatedNode) => {
          if (updatedNode.type !== this.type) {
            return false;
          }

          if (updatedNode.textContent !== code.textContent) {
            code.textContent = updatedNode.textContent;
          }

          return true;
        },
      };
    };
  },
});

export default CodeBlockWithCopy;
