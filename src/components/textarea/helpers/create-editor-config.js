
export default function createEditorConfig(componentContext) {
  return {
    base_url: '/tinymce',
    selector: `#${componentContext.editorId}`,
    height: 500,
    placeholder: componentContext.placeholder,
    icons_url: '/tinymce/icons/editor-icons/index.js',
    icons: 'editor-icons',
    inline: true,
    contextmenu: false,
    block_unsupported_drop: false,
    menubar: false,
    table_resize_bars: false,
    keep_styles: false,
    htmlAllowedTags: ['.*'],
    htmlAllowedAttrs: ['.*'],
    external_plugins: {
      'tiny_mce_wiris': 'node_modules/@wiris/mathtype-tinymce5/plugin.min.js'
    },
    quickbars_insert_toolbar: false,
    content_style: 'img {max-width: 100%;}',
    paste_data_images: true,
    fixed_toolbar_container: '.constructor-header-toolbar__tinymce-toolbar',
    quickbars_selection_toolbar: 'bold italic underline forecolor backcolor',
    plugins: 'code link lists advlist table tiny_mce_wiris image imagetools quickbars paste',
    toolbar: 'undo redo | formatselect | fontsizeselect | ' +
      ' bold italic underline forecolor backcolor tiny_mce_wiris_formulaEditor  | alignleft aligncenter ' +
      ' alignright alignjustify | bullist numlist outdent indent |' +
      ' quickimage link table | removeformat',
    init_instance_callback: (editor) => {
      editor.setContent(componentContext.syncValue);
    },
    setup: (editor) => {
      editor.on('NodeChange', () => {
        componentContext.updateTemplate();
      });

      editor.on('input', () => {
        componentContext.onEditorInput();
        componentContext.updateTemplate();

        // editorScrollIntoView(editor);
      });
    }
  };
}
