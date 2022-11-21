const removeChildScript = `document.body.removeChild(scriptInjectedElement)`;

var deleteScript = document.createElement('script');
deleteScript.id = 'deletionScript';
deleteScript.appendChild(document.createTextNode(removeChildScript));

(document.body || document.head || document.documentElement).appendChild(deleteScript);