import React from 'react';

const Tree = ({ treeData ,handleFileClick }) => {
  const isFile = (key, data) => data[key] === null;


  const renderTree = (data, parentPath = '') => {
    return (
      <ul style={{margin:'1rem 0.5rem '}}>
        {data && Object.keys(data).map((key) => {
          const currentPath = parentPath ? `${parentPath}/${key}` : key;
          if (currentPath.includes('node_modules')) {
            return "node_modules"; // Do not render this item
          }
          return (
            <li
              key={key}
              onClick={() => isFile(key, data) && handleFileClick(currentPath)}
              style={{
                marginLeft: '10px',
                cursor: isFile(key, data) ? 'pointer' : 'default'
              }}
            >
              {isFile(key, data) ? (
                key 
              ) : (
                <>
                  <strong>{key}</strong>
                  {renderTree(data[key], currentPath)}
                </>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return <div>{renderTree(treeData)}</div>;
};

export default Tree;
