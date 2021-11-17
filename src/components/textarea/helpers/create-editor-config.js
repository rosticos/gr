export default function createEditorConfig(componentContext) {
  console.log('%ccreate-editor-config.js line:2 componentContext', 'color: #007acc;', componentContext);
  return {
    selector: '#kek',
    icons_url: '/tinymce/icons/editor-icons/index.js',
    icons: 'editor-icons',
    inline: true,
    language: 'ru',
    menubar: false,
    contextmenu: false,
    plugins: 'lists table link image quickbars paste',
    quickbars_insert_toolbar: false,
    quickbars_selection_toolbar: 'bold italic underline',
    table_resize_bars: false,
    keep_styles: false,
    invalid_styles: 'background background-color color font-family font-size',
    fixed_toolbar_container: '.constructor-header-toolbar__tinymce-toolbar',
    toolbar: [
      { name: 'history', items: ['undo', 'redo'] },
      { name: 'formatting', items: ['bold', 'italic', 'underline'] },
      { name: 'formats', items: ['button-format-p', 'button-format-h3'] },
      { name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify'] },
      { name: 'lists', items: ['numlist', 'bullist'] },
      { name: 'table', items: ['table'] },
      { name: 'links', items: ['link', 'openlink', 'unlink'] },
      { name: 'images', items: ['image', 'quickimage'] },
      { name: 'indentation', items: ['removeformat', 'outdent', 'indent'] }
    ]
  };
}
