import React, { Fragment, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import googleDocIcon from "../assets/images/google-doc-icon.png";

function EditorComponent() {
  const [docTitle, setDocTitle] = useState("Untitled document");
  const inputRef = useRef(null);

  const handleEditorChange = (content, editor) => {
    console.log("Content was updated:", content, editor);
  };

  const onSaveDocument = editor => {
    // Get the document saved from localStorage
    const prevDocument = JSON.parse(localStorage.getItem("document"));
    /* 
      Creating ref on input element as state variable 
      docTitle is not available inside init of Editor component
     */
    const input = inputRef.current.value;
    let document = { name: input, content: editor.getContent() };
    if (prevDocument == null) {
      // New document being stored in localStorage
      let documentToSave = [];
      documentToSave.push(document);
      localStorage.setItem("document", JSON.stringify(documentToSave));
    } else if (prevDocument.map(x => x.name).indexOf(document.name) !== -1) {
      // Compare if the document names are the same, If yes, log it
      console.log("file already exists");
    } else {
      // If the document names are different, add the new document to the array
      prevDocument.push(document);
      localStorage.setItem("document", JSON.stringify(prevDocument));
    }
  };

  const onActionBuilder = (content, editor) => () => {
    // clear content if any before showing the content of the clicked document
    editor.setContent("");
    editor.insertContent(content);
  };

  const getRecentItems = (arr, editor) => {
    // To show the recent files already saved and content onClick (onAction)
    return arr.map(val => ({
      type: "menuitem",
      text: val.name,
      onAction: onActionBuilder(val.content, editor)
    }));
  };

  return (
    <Fragment>
      <div className="docTitleWrapper">
        <img className="docIconStyle" src={googleDocIcon} />
        <input
          ref={inputRef}
          className="docTitleStyle"
          type="text"
          value={docTitle}
          onChange={e => setDocTitle(e.target.value)}
        />
        <div className="shareButtonWrapper">
          <button className="shareButtonStyle">Share</button>
        </div>
      </div>
      <Editor
        apiKey="e1ugczo32b0izco1pvblv9x93mhmamx9ipxdmay8mzxa8uei"
        initialValue=""
        init={{
          save_onsavecallback: editor => {
            onSaveDocument(editor);
          },
          height: 500,
          // Add a custom menu to show recent items
          setup: function(editor) {
            editor.ui.registry.addNestedMenuItem("openDocument", {
              text: "Open Recent",
              icon: "document-properties",
              getSubmenuItems: function() {
                const prevDocument = JSON.parse(
                  localStorage.getItem("document")
                );
                return prevDocument && prevDocument.length > 0
                  ? getRecentItems(prevDocument, editor)
                  : [];
              }
            });
          },
          menu: {
            addOns: { title: "Add-ons", items: "undo redo" },
            customFile: {
              title: "File",
              items: "newdocument preview print openDocument"
            }
          },
          menubar: "customFile edit view insert format tools addOns help",
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
            "spellchecker",
            "formatpainter",
            "fullscreen",
            "save"
          ],
          toolbar: `save undo redo print spellchecker spellcheckerlanguage formatpainter | fullscreen | formatselect | fontselect | fontsizeselect | bold italic underline backcolor | \
            align | \
            link image | bullist numlist outdent indent | removeformat |`
        }}
        onEditorChange={handleEditorChange}
      />
    </Fragment>
  );
}

export default React.memo(EditorComponent);
