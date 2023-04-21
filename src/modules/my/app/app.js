import { LightningElement } from 'lwc';

export default class App extends LightningElement {
    jsonString;
    csvString;
    fileName;

    onFileNameChange(event){
        this.fileName = event.target.value;
    }

    handleJSONStringChange(event){
        this.jsonString = event.target.value;
    }

    convertJSONToCSV(event) {
        let jsonObjectArray = JSON.parse(this.jsonString);
        let maxLength = 0;
        let objectKeys = [];
        jsonObjectArray.forEach(item => {
            if(Object.keys(item).length > maxLength){
                maxLength = Object.keys(item).length;
                objectKeys = Object.keys(item);
            }
        });
        let csvRows = [];
        for(let jsonObj of jsonObjectArray){
            let row = '';
            let rowElements = [];

            
            for(let key of objectKeys){
                let value = jsonObj[key] instanceof Object ? JSON.stringify(jsonObj[key]) : jsonObj[key];
                rowElements.push(value);
            }
            row = rowElements.join(',');
            csvRows.push(row);
        }

        this.csvString = objectKeys.join(',') + '\n' + csvRows.join('\n');
        this.template.querySelector(`[data-id="area2"]`).value = this.csvString;
    }

    beautifyJSON(event){
        const obj = JSON.parse(this.jsonString);
        this.jsonString = JSON.stringify(obj, undefined, 4);

        this.template.querySelector(`[data-id="area1"]`).value = this.jsonString;
    }

    handleRemoveWhitespace(event){
        this.jsonString = JSON.stringify(JSON.parse(this.jsonString));
        this.template.querySelector(`[data-id="area1"]`).value = this.jsonString;
    }

    downloadCSV(){
        let encodedUri = encodeURI(this.csvString);
        let fileName = this.fileName;
        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodedUri;
        hiddenElement.target = '_blank';
        hiddenElement.download = fileName +'.csv'; 
        hiddenElement.click();
    }

    get isDisabledDownload() {
        return !this.csvString ? true : false;
    }

    traverse(event) {
        for (let i in o) {
            func.apply(this,[i,o[i]]);  
            if (o[i] !== null && typeof(o[i])=="object") {
                //going one step down in the object tree!!
                traverse(o[i],func);
            }
        }
    }
    

    handleReset(){
        this.jsonString = "";
        this.csvString = "";
        this.fileName = "";

        this.template.querySelectorAll('textarea').forEach(item => {
            item.value = "";
        })
    }
}
