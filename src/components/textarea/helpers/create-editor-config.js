export default function createEditorConfig(componentContext) {
  return {
    base_url: '/tinymce',
    selector: `#${componentContext.editorId}`,
    height: 500,
    placeholder: 'Напишите здесь необходимую информацию или вставьте картинку',
    icons_url: '/tinymce/icons/editor-icons/index.js',
    icons: 'editor-icons',
    inline: true,
    contextmenu: false,
    block_unsupported_drop: false,
    menubar: false,
    language: 'ru',
    table_resize_bars: false,
    keep_styles: false,
    quickbars_insert_toolbar: false,
    content_style: 'img {max-width: 100%;}',
    paste_data_images: true,
    fixed_toolbar_container: '.constructor-header-toolbar__tinymce-toolbar',
    quickbars_selection_toolbar: 'bold italic underline',
    plugins: 'code link lists table tiny_mce_wiris image imagetools quickbars paste',
    toolbar: 'undo redo | formatselect | ' +
      ' bold italic backcolor | alignleft aligncenter ' +
      ' alignright alignjustify | bullist numlist outdent indent |' +
      ' removeformat | tiny_mce_wiris_formulaEditor | quickimage',
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
