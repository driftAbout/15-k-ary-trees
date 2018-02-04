'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), {suffix: 'Prom'});
const Stack = require('./lib/stack');
const Tree = require('./lib/kary');

//const asset =`${__dirname}/../assets/minimal.html`;
const asset =`${__dirname}/../assets/stretch.html`;

const parentStack = new Stack();
const htmlTree = new Tree();

let tmpArr = [];

fs.readFileProm(asset, 'utf8').then(parseHtml).catch(console.error);

function parseHtml(html) {  
  // let elements = html.replace(/\n/g,'').replace(/</g, '\n<').split('\n').map(elm => elm.trim()).filter(val => val).slice(1);

  let elements = html.replace(/\n/g,'').replace(/</g, '\n<').replace(/(<\/[^>]+>)/g, '$1\n').split('\n').map(elm => elm.trim()).filter(val => val).slice(1);

  console.log(elements);

  elements.forEach((elm ,i, arr) => {
    processElement(elm, i, arr);
  });
 
  console.log('tmpArr', tmpArr);

  function processElement(elm, idx, lines){
    let openTag = elm.match(/<[^</]+>/);
    if (!openTag ) return;
    openTag  = openTag[0]; 
    console.log(openTag);
    let line;
    for ( let i = idx + 1; i < elements.length ; i++){
      line = lines[i]
      let lineMatch = line.match(/<[^</]+>/);
      lineMatch = lineMatch ? lineMatch[0] : null; 

      let closeTag = openTag.replace(/\s[^>]+/, '').replace('<', '</');
      
      if(closeTag === line) {
        let chunk = elements.slice( idx +  1, i - idx).join('');
        tmpArr.push([openTag, chunk ]);
      }
    }
  }

}

  // function processElement(data){
  //   if ( /^<\/[^<]+>$/.test(data) ) return parentStack.pop(); //closing tag 

  //   // let dataArray = data.split('>');
  //   // let el = dataArray[0].substr(1);
  //   // let txt_node = dataArray[1];

  //   //tag name
  //   let eleName = data.match(/<([^\s>]+)/);
  //   eleName = eleName ? eleName[1] : '';

  //   //class name
  //   let className = data.match(/class="([^"]+)/);
  //   className = className ? className[1] : '';

  //   //id name
  //   let idName = data.match(/id="([^"]+)/);
  //   idName = idName ? idName[1] : '';

  //   //text
  //   let text = data.match(/>(.*)$/);
  //   text = text ? text[1] : '';

  //   let data_set = {
  //     eleName: eleName,
  //     textContent: text,
  //     class: className,
  //     id: idName,
  //   };

  //   // let el_name = data.match(/([^<\s]+)/)[1];
    
  //   // let idName = data.match(/id="([^\s]+)"/g);
  //   // idName = idName ? idName[0].replace(/id="([^"]+)"/, '$1') : '';

  //   // let className = data.match(/class="([^\s]+)"/g);
  //   // className = className ? className[0].replace(/class="([^"]+)"/, '$1') : '';
    
  //   // let data_set = {eleName: data.replace(/<([^\s]+).*>/g, '$1'), textContent: null, class: className, id: idName};

  //   let parent = parentStack.top ? parentStack.top.value : '';

  //   if (!eleName) {
  //     parent.value.textContent += data;
  //     return;
  //   }

  //   parentStack.push(data_set);

  //   // if (! /^<[^<]+>$/.test(data)) { //open tag with text
  //   //   let dataArray = data.split('>');
  //   //   data_set.textContent = dataArray[1];
  //   // }

  //   htmlTree.insertData(data_set, parent);
  // }

  // console.log('htmlTree',  JSON.stringify(htmlTree));
//} 