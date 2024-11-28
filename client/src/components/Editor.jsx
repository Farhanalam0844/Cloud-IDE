import React from 'react'

export default function Editor(props) {
    var path =props.path;
   path= path.replaceAll("/",">");
  return (
    <div> {path}</div>
  )
}
