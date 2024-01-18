import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Warning from '@editorjs/warning'
import LinkTool from '@editorjs/link'
import Image from '@editorjs/image'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'
import Paragraph from '@editorjs/paragraph'
import NestedList from '@editorjs/nested-list'
import editorjsNestedChecklist from '@calumk/editorjs-nested-checklist'
import AttachesTool from '@editorjs/attaches'
import editorjsCodecup from '@calumk/editorjs-codecup'
import Underline from '@editorjs/underline'
import Strikethrough from '@sotaproject/strikethrough'
import Tooltip from 'editorjs-tooltip'

//inject to global env
window.Image = Image

// success-uploading status. 1 for success,0 for failed
type UploadByFile = (
  file: File
) => Promise<{ success: number; file?: { url: string } }>

export enum ImageUploaderStatus {
  ERROR,
  SUCCESS,
}

export const wrapEditorJSTools = (uploadByFile: UploadByFile) => ({
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  header: {
    class: Header,
    inlineToolbar: true,
    shortcut: 'CMD+SHIFT+H',
    config: {
      placeholder: 'Enter a header',
      levels: [1, 2, 3, 4, 5],
      defaultLevel: 1,
    },
  },
  embed: Embed,
  table: Table,
  list: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered',
    },
  },
  checklist: {
    class: CheckList,
    inlineToolbar: true,
  },
  nestedchecklist: editorjsNestedChecklist,
  warning: Warning,
  code: editorjsCodecup,
  // linkTool: {
  //   class: LinkTool,
  //   config: {
  //     endpoint: 'https://api.linkpreview.net',
  //     headers: { 'X-Linkpreview-Api-Key': '87dea344cfa5e0db79bf05a84d5c9858' }, //direct text temp
  //   },
  // },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile,
      },
    },
  },
  quote: Quote,
  delimiter: Delimiter,
  simpleImage: SimpleImage,
  attaches: {
    class: AttachesTool,
    config: {
      uploader: {
        uploadByFile,
      },
    },
  },
  inlineCode: InlineCode,
  underline: Underline,
  strikethrough: Strikethrough,
  marker: Marker,
  tooltip: {
    class: Tooltip,
    config: {
      location: 'left',
      highlightColor: '#FFEFD5',
      underline: true,
      backgroundColor: '#154360',
      textColor: '#FDFEFE',
    },
  },
  // TODO: to support column
  // columns: {
  //   class: editorjsColumns,
  //   config: {
  //     EditorJsLibrary: editorInstance,
  //     tools: {
  //       header: Header,
  //       paragraph: Paragraph,
  //       delimiter: Delimiter,
  //       checklist: {
  //         class: CheckList,
  //         inlineToolbar: true,
  //       },
  //     },
  //   },
  // },
})
